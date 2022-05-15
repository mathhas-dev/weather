import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';
import { fieldError } from 'utils';
import { i18n } from 'locales/i18n'

const tokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';
const SMSToken = 'token_sms';
const phoneNumber = 'phone_number'
const inserted_sms_token = 'inserted_sms_token'
const error_401_or_403 = '401_or_403'

const getDefaultKey = (key) =>
  key ? key : tokenKey

const getToken = (key = null) =>
  window.localStorage.getItem(getDefaultKey(key))

const setToken = (value, key = null) =>
  window.localStorage.setItem(getDefaultKey(key), value)

const removeToken = (key = null) =>
  window.localStorage.removeItem(getDefaultKey(key))

const getSMSToken = () => {
  if (window.localStorage.getItem(getDefaultKey(SMSToken)) !== null) {
    return true
  }
  return false
}

const getInsertedToken = () =>
  window.localStorage.getItem(getDefaultKey(inserted_sms_token))

const setSMSToken = (value, key = null) =>
  window.localStorage.setItem(getDefaultKey(key), value)

const getPhoneNumber = () =>
  window.localStorage.getItem(getDefaultKey(phoneNumber))

const setPhoneNumber = (value, key = null) =>
  window.localStorage.setItem(getDefaultKey(key), value)

const setInsertedToken = (value) =>
  window.localStorage.setItem(getDefaultKey(inserted_sms_token), value)

const get_401_or_403 = () =>
  window.localStorage.getItem(error_401_or_403)

const set_401_or_403 = (value) =>
  window.localStorage.setItem(error_401_or_403, value)

const remove_401_or_403 = () =>
  window.localStorage.removeItem(error_401_or_403)

const doLogin = async (data) => {
  const rest = new Rest('token')
  rest.api = 'security/api'
  const response = await rest.login(data)
  return await response.json()
}

const doLogout = async () => {
  try {
    await doBackendLogout()
  } finally {
    removeToken(tokenKey)
    removeToken(refreshTokenKey)
    removeToken(SMSToken)
    removeToken(phoneNumber)
    window.location.href = '/user/login';
  }
}

const doNewPassword = async (email) => {
  const rest = new Rest('reset-password');
  rest.api = 'security/api';
  const response = await rest.onResetPassword({ email });
  return await response.json();
};

const doChangePassword = async (data) => {
  const rest = new Rest('new-password')
  rest.api = 'security/api'
  const response = await rest.onNewPassword(data)
  return await response.json()
}

const doGetProfile = async () => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'profile';
  const response = await rest.list();
  return await response.json();
};

const doUpdateActiveProfile = async (id, data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.detail = id;
  rest.method = 'change_active_profile'
  const response = await rest.put(data);
  return await response.json();
}

const doUpdatePreferredLanguage = async (data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'preferred_language'
  const response = await rest.put(data);
  return await response.json();
}

// Usado para login
const doSendSMSToken = async (data) => {
  const rest = new Rest('send_sms_token')
  rest.api = 'security/api'
  const response = await rest.onRequestSMSToken(data)
  return response
}

const doLoginSMS = async (data) => {
  const rest = new Rest('token')
  rest.api = 'security/api'
  const response = await rest.loginSMS(data)
  return await response
}

const doSmsTokenValidation = async (data) => {
  const rest = new Rest('check_sms_token')
  rest.api = 'security/api'
  const response = await rest.validationSMS(data)
  return await response
}

// Usado para 2FA
const doSendSMSToken2FA = async (data) => {
  const rest = new Rest('send_sms_token_2FA')
  rest.api = 'security/api'
  const response = await rest.onRequestSMSToken(data)
  return response
}

const doBackendLogout = async () => {
  const rest = new Rest('logout')
  rest.api = 'security/api'
  const response = await rest.logout()
  return response
}

const userStore = observable({
  token: getToken(),
  refreshToken: getToken(refreshTokenKey),
  error: null,
  message: null,
  redirect_after_login: null,
  sms_token_sent: getSMSToken(),
  phone_number: getPhoneNumber(),
  profile: {
    nome: '',
    profile: '',
    profile_id: null,
    profiles: [],
    uuid: '',
    preferred_language: ''
  },
  get logged() {
    const logged = this.token !== null && this.token !== undefined;
    if (logged && this.profile.nome === '') this.getProfile();
    return logged;
  },
  get authToken() {
    return this.token
  },
  getError: function (field) {
    return this.error !== null && this.error.hasOwnProperty(field) ?
      this.error[field] : null
  },
  logout: action(function () {
    window.location.href = "/user/logout";
  }),
  doLogout: action(function () {
    doLogout();
    this.reset();
  }),
  login: action(async function (p) {
    this.message = null;
    this.error = null;
    try {
      const json = await doLogin(p)
      // Seta no localStorage
      setToken(json.access, tokenKey)
      setToken(json.refresh, refreshTokenKey)
      // Seta no objeto local
      this.token = getToken()
      this.refreshToken = getToken(refreshTokenKey)
      this.getProfile();
      if (this.redirect_after_login !== null) {
        window.location.href = this.redirect_after_login;
      }
    } catch (error) {
      this.message = {
        content: 'Login e senha não conferem!',
        error: true
      }
      this.error = error
    }
  }),
  reset: action(function () {
    this.redirect_after_login = null;
    this.sms_token_sent = false;
    this.profile = {
      nome: '',
      profile: '',
      profile_id: null,
      profiles: [],
      uuid: '',
      preferred_language: '',
    }
    this.token = getToken();
    this.refreshToken = getToken(refreshTokenKey);
    this.message = null;
    this.error = null;
  }),
  getProfile: action(async function () {
    try {
      const that = this;
      const response = await doGetProfile();
      this.profile = response;
      this.__set_preferred_language(that.profile.preferred_language);
    } catch (error) { }
  }),
  setPreferredLanguage: action(async function (data) {
    try {
      this.saving = true;
      this.__set_preferred_language(data.language);
      await doUpdatePreferredLanguage(data);
    } catch (error) {
      this.error = error;
      this.message = {
        content: 'Error updating user preferred language.',
        error: true
      };
    } finally {
      this.saving = false;
    }
  }),
  updateActiveProfile: action(async function () {
    try {
      this.saving = true;
      const response = await doUpdateActiveProfile(this.id, this.profile);
      this.profile.profile = response.profile
    } catch (error) {
      this.error = error;
      this.message = {
        content: i18n.t("Error updating user active profile."),
        error: true
      };
    } finally {
      this.saving = false;
    }
  }),
  sendSmsToken: action(async function (phone_number) {
    try {
      const data = { 'phone': phone_number }
      const response = await doSendSMSToken(data);
      setSMSToken(response.data.token, SMSToken)
      setPhoneNumber(data.phone, phoneNumber)
      this.sms_token_sent = true
      this.message = {
        content: i18n.t("Token successfully sent, wait a second to receive."),
        success: true
      };
    } catch (error) {
      this.error = error;
      this.message = {
        content: i18n.t("Something went wrong while sending SMS token..."),
        error: true
      };
    } finally {
      this.saving = false;
    }
  }),
  loginSMS: action(async function (p) {
    this.message = null;
    this.error = null;
    try {
      const response = await doLoginSMS(p)
      // Seta no localStorage
      setToken(response.data.access, tokenKey)
      setToken(response.data.refresh, refreshTokenKey)
      setInsertedToken(p.token_sms)
      // Seta no objeto local
      this.token = getToken()
      this.refreshToken = getToken(refreshTokenKey)
      this.getProfile();
      if (this.redirect_after_login !== null) {
        window.location.href = this.redirect_after_login;
      }
    } catch (error) {
      this.message = {
        content: "Credentials not found!",
        error: true
      }
      this.error = error
    }
  }),
  checkAuthenticaticationMethod: action(async function (uuid) {
    try {
      const token = getInsertedToken();
      if (token) {
        const data = { 'token': token }
        const response = await doSmsTokenValidation(data)
        if (response.detail === false) {
          removeToken(tokenKey)
          removeToken(refreshTokenKey)
          window.location.href = "/user/login/sms"
        }
      } else {
        removeToken(tokenKey)
        removeToken(refreshTokenKey)
      }
    } catch (error) {
      this.message = {
        content: "Credentials not found!",
        error: true
      }
      this.error = error
    }
  }),
  __set_preferred_language: function (language) {
    let default_language = '';

    switch (language) {
      case 'PORTUGUES':
        default_language = 'pt_br';
        break;
      case 'ESPANOL':
        default_language = 'es';
        break;
      default:
        default_language = 'en';
    }

    i18n.changeLanguage(default_language);
  },
  set_401_or_403: action(function (message) {
    // Seta 401 ou 403 no localStorage, afim de apresentar erro após redirecionamento
    set_401_or_403(message);
    
    this.message = {
      content: message,
      error: true
    }
  }),
  remove_401_or_403: action(function () {
    // Remove 401 ou 403 do localStorage
    remove_401_or_403();
  }),
  get_401_or_403: action(function () {
    // Pega o erro 401 ou 403 no localStorage, para apresentar mensagem
    const error = get_401_or_403();

    if (error) {
      this.message = {
        content: error,
        error: true
      }
    }
  }),
})

export const passwordStore = observable({
  token: null,
  error: null,
  loading: false,
  message: null,
  reset: action(function () {
    this.error = null;
    this.loading = false;
    this.message = null;
    this.token = null;
  }),
  newPassword: action(async function (email) {
    this.loading = true;
    this.error = null;
    this.message = null;
    try {
      await doNewPassword(email);
      this.error = null;
      this.message = {
        content: i18n.t("An email will be sent with password change instructions."),
        success: true
      };
    } catch (error) {
      this.message = {
        content: i18n.t("Error trying to request password change."),
        error: true
      };
      this.error = error;
    } finally {
      this.loading = false;
    }
  }),
  changePassword: action(async function (p1, p2) {
    this.loading = true;
    try {
      await doChangePassword({ new: p1, new_fix: p2, token: this.token });
      this.error = null;
      this.message = {
        content: (<>
          Password successfully changed. Click <strong><a href="/user/login">here</a></strong> to login.
        </>),
        success: true
      };
    } catch (error) {
      let content = error.hasOwnProperty('detail') ?
        fieldError(error, 'detail')?.content :
        fieldError(error)?.content
      this.message = {
        content,
        error: true
      }
      this.error = error;
    } finally {
      this.loading = false;
    }
  })
});

export const twoFactorAuthenticationStore = observable({
  token: '',
  error: null,
  loading: false,
  message: null,
  authenticated: false,
  reset: action(function () {
    this.token = '';
    this.error = null;
    this.loading = false;
    this.message = null;
  }),
  requestNewToken: action(async function () {
    this.loading = true;
    this.error = null;
    this.message = null;
    try {
      await doSendSMSToken2FA();
      this.error = null;
      this.message = {
        content: i18n.t("An sms token will be sent to your phone."),
        success: true
      };
    } catch (error) {
      this.message = {
        content: i18n.t("Error trying to request new token."),
        error: true
      };
      this.error = error;
    } finally {
      this.loading = false;
    }
  }),
  send: action(async function () {
    this.loading = true;
    this.error = null;
    this.message = null;
    try {
      const data = { 'token': this.token }
      const response = await doSmsTokenValidation(data);
      this.authenticated = response.data.detail;
      this.error = null;
      this.message = {
        content: i18n.t("Success!"),
        success: true
      };
    } catch (error) {
      this.message = {
        content: i18n.t("Error trying to validate token."),
        error: true
      };
      this.error = error;
    } finally {
      this.loading = false;
    }
  }),
});

export default userStore
export { get_401_or_403 }
