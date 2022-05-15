import React from 'react'
import { useLocation } from 'react-router-dom'
import { matchPath } from "react-router"
import { userStore, modules } from './stores'

const listModules = () => {
  const todosModulos = [...Object.entries(modules.modulos)]
  const moduloBase = todosModulos.find(modulo => modulo[0] === 'Base')
  const customModulos = todosModulos.filter(modulo => modulo[0] !== 'Base')
  return [...customModulos, moduloBase]
}

const getPageConfig = path => {

  let config
  listModules().find(modulo => {
    return modulo[1].routes
      .find(pagina => {
        if (matchPath(path, pagina) !== null) {
          config = pagina
          return true
        }
        return false
      })
  })
  return config
}

const useRestrito = () => {
  const location = useLocation()
  const config = getPageConfig(location.pathname)

  // Se não foi encontrada página, prossiga para 404
  if (!config) return false

  // Se a página for pública ou o usuário estiver logado, prossiga para a página
  if (config.public || userStore.logged) return false

  // De outra forma, redirecione para a página de login
  return true
}

/*
 * Extrai o erro pronto para ser mostrado por um componente como Form.Input.
 */
const fieldError = (error, ...fields) => {
  if (error === null) return null;
  let _error = error
  fields.forEach(field => {
    if (_error && _error.hasOwnProperty(field) && _error[field]) {
      _error = _error[field]
    } else {
      _error = null;
    }
  });
  if (_error === null) return null;
  let content = _error
  if (!Array.isArray(content) && typeof content === 'object') {
    content = []
    for (let key in _error) content.push(_error.get(key))
  }
  content = Array.isArray(content) && content.length > 1 ?
    content.map((text, i) => <span key={i + 1}>{text}<br /></span>) :
    String(content)
  return { content, pointing: 'above' };
}

function deepClone(source) {
  return JSON.parse(JSON.stringify(source))
}

async function stall(time = 500) {
  await new Promise(res => setTimeout(res, time))
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const to_option = (list) => {
  return list.map(item => ({
    key: item.id,
    text: item.name,
    value: item.id
  }))
}

const CPF_Mask = cpf => {
  cpf = cpf.replace(/[^0-9]/g, '');
  if (String(cpf).length > 11) cpf = cpf.slice(0, 11);
  while (String(cpf).length < 11) cpf = "_" + cpf;
  return String(cpf).replace(/([\d_]{3})([\d_]{3})([\d_]{3})([\d_]{2})/g, '$1.$2.$3‑$4')
}

const date_format = (date) => {
  return new Date(date)
}

export {
  deepClone,
  fieldError,
  getPageConfig,
  useRestrito,
  stall,
  uuidv4,
  to_option,
  CPF_Mask,
  date_format
}
