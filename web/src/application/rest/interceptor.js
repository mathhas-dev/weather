import { userStore, get_401_or_403 } from '../../stores';
import i18n from "i18next";
import Rest from './rest';


const callRequest = async (fn, args) => {
  try {
    const value = fn(...args);
    const response = await value.response;
    // Clona a resposta para evitar chamar o método json da response,
    // que só pode ser chamado uma única vez
    const responseCopy = response.clone();
    const json = await responseCopy.json();
    return { response, json, rest: value.obj };
  } catch (e) {
    console.log('Falha no recurso remoto, tente novamente.')
    throw e
  }
};

const refreshToken = async () => {
  const rest = new Rest('token');
  rest.api = 'security/api';
  rest.method = 'refresh';

  const { response } = await rest.refresh();
  if (response.ok) {
    const json = await response.json();
    rest.token = json.access;
  }
  return response.ok;
}

const InterceptorFetch = f => async (...args) => {
  let { response, json, rest } = await callRequest(f, args)
  // Trata o caso do token de acesso ter expirado
  // Pega um noto token de acesso através do token refresh
  // Refaz a requisição
  if (!response.ok && response.status === 401) {
    const { code = null } = json
    if (code === 'token_not_valid') {
      const successRefresh = await refreshToken();
      if (successRefresh) {
        // remove antiga authorization
        rest.headers.delete('Authorization');
        ({ response, json } = await callRequest(f, args));
      }
    }
  }

  if (response.ok) {
    // Remove erro 401 ou 403 do local storage
    if (window.location.pathname !== '/') {
      userStore.remove_401_or_403();
    }

    if (json.hasOwnProperty('detail')) {
      console.log(json.detail)
    }
    return response
  } else {
    if (response.status === 401 || response.status === 403) {
      const local_storage_401_or_403 = get_401_or_403();

      if (local_storage_401_or_403 === null) {
        // Seta mensagem de não permitido para o usuário, na tela inicial
        const message = i18n.t("You don't have permission to perform this action!")
        userStore.set_401_or_403(message);
        window.location.href = '/';
      }else{
        userStore.doLogout();
      }
    } else {
      // Remove erro 401 ou 403 do local storage
      userStore.remove_401_or_403();

      if (json.hasOwnProperty('detail')) {
        console.log(json.detail)
      }
    }
    throw json
  }
  // return response
}

export default InterceptorFetch
