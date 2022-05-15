import InterceptorFetch from './interceptor'
import axios from "axios";

const BACKEND_HOST = `${process.env.REACT_APP_REST_API}`;
const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

class Rest {
  constructor(resource) {
    this.resource = resource
    this.api = 'base'
    this._headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  }

  getPath = () => {
    if (this.detail !== undefined) {
      if (this.method !== undefined) {
        return `${this.api}/${this.resource}/${this.detail}/${this.method}/`
      } else {
        return `${this.api}/${this.resource}/${this.detail}/`
      }
    } else {
      if (this.method !== undefined) {
        return `${this.api}/${this.resource}/${this.method}/`
      } else {
        return `${this.api}/${this.resource}/`
      }
    }
  }

  get api() {
    return `${BACKEND_HOST}/${this._api}`
  }

  set api(value) {
    this._api = value
  }

  get token() {
    return window.localStorage.getItem(accessTokenKey)
  }

  set token(newAccessToken) {
    return window.localStorage.setItem(accessTokenKey, newAccessToken)
  }

  get refreshToken() {
    return window.localStorage.getItem(refreshTokenKey)
  }

  get authorization() {
    return `Bearer ${this.token}`
  }

  set method(value) {
    this._method = value
  }

  get method() {
    return this._method
  }

  set query(value) {
    this._query = value
  }

  get query() {
    return this._query
  }

  set detail(value) {
    this._detail = value
  }

  get detail() {
    return this._detail
  }

  get headers() {
    return this._headers
  }

  set headers(value) {
    Object.keys(value).forEach(i => {
      this._headers.append(i, value[i])
    })
  }

  list = InterceptorFetch(() => {
    let url = new URL(this.getPath()),
      params = this.query
    if (params !== undefined) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    }
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(url, {
      method: 'GET',
      headers: this.headers
    }).catch(function (error) {
      console.log(error.message)
    })
    return { response: result, obj: this }
  })

  post = InterceptorFetch(body => {
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(this.getPath(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    }).catch(function (error) {
      console.log(error.message)
    })
    return { response: result, obj: this }
  })

  put = InterceptorFetch(body => {
    let url = new URL(this.getPath()),
      params = this.query
    if (params !== undefined) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    }
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(url, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body)
    }).catch(function (error) {
      console.log(error.message)
    })
    return { response: result, obj: this }
  })

  delete = InterceptorFetch(body => {
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(this.getPath(), {
      method: 'DELETE',
      headers: this.headers,
      body: JSON.stringify(body)
    }).catch(function (error) {
      console.log(error.message)
    })
    return { response: result, obj: this }
  })

  get = InterceptorFetch(id => {
    this.detail = id
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(this.getPath(), {
      method: 'GET',
      headers: this.headers
    })
    return {
      response: result, obj: this
    }
  })

  getWithBody = InterceptorFetch(data => {
    this.headers = {
      'Authorization': this.authorization
    }
    const result = fetch(this.getPath(), {
      method: 'GET',
      headers: this.headers,
      body: data
    })
    return {
      response: result, obj: this
    }
  })

  getWithCookie = async () => {
    const path = this.getPath();
    const response = await axios(path, {
      method: "GET",
      withCredentials: true,
      headers: {
        'Authorization': this.authorization
      }
    })

    return response
  }

  login = InterceptorFetch(body => {
    const result = fetch(this.getPath(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    return {
      response: result, obj: this
    }
  })

  refresh = async () => {
    const result = await fetch(this.getPath(), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        refresh: this.refreshToken
      })
    })
    return { response: result, obj: this }
  }

  onResetPassword = InterceptorFetch(body => {
    const result = fetch(this.getPath(), {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    return {
      response: result, obj: this
    }
  })

  onNewPassword = InterceptorFetch(body => {
    const result = fetch(this.getPath(), {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body)
    })
    return {
      response: result, obj: this
    }
  })

  onRequestSMSToken = async (body) => {
    const path = this.getPath();
    const response = await axios(path, {
      method: "POST",
      data: body,
      withCredentials: true,
      headers: {
        'Authorization': this.authorization
      }
    })

    return response
  }

  loginSMS = (body) => {
    const path = this.getPath();
    const response = axios(path, {
      method: "POST",
      data: body,
      withCredentials: true
    })

    return response
  }

  validationSMS = (body) => {
    const path = this.getPath();
    const response = axios(path, {
      method: "POST",
      data: body,
      withCredentials: true
    })

    return response
  }

  logout = async () => {
    const path = this.getPath();
    const response = await axios(path, {
      method: "POST",
      withCredentials: true,
      headers: {
        'Authorization': this.authorization
      }
    })

    return response
  }
}
export default Rest
