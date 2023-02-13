import axios from 'axios'
import CryptoJS from 'crypto-js'

import router from '@/router'
import { CRYPTO_KEY } from '@/fixtures/hash'
import { KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_ME } from '@/fixtures/constants'

const encryptedTokenKey = btoa(KEY_TOKEN)
const encryptedRefreshTokenKey = btoa(KEY_REFRESH_TOKEN)
const encryptedMeKey = btoa(KEY_ME)

const instance = axios.create({
  baseURL: `${process.env.VUE_APP_BACKEND_URL}/api`,
  timeout: 50000
})

const refreshInstance = axios.create({
  baseURL: `${process.env.VUE_APP_BACKEND_URL}/api`,
  timeout: 10000
})

instance.interceptors.request.use(req => {
  if (req.url !== '/auth/login' && req.url !== '/auth/login-pin' &&
    req.url !== '/auth/request-pin' && req.url !== '/auth/send-email' ) {
    req.headers.Authorization = ''
  }
  return req
})

const refresh = async (originalRequest) => {
  try {
    const { data } = await refreshInstance.post('/auth/refresh', null, {
      params: {
        token: store.getters['Auth/token'],
        refreshToken: store.getters['Auth/refreshToken']
      }
    })
    store.commit('Auth/SET_TOKEN', CryptoJS.AES.encrypt(data.token, CRYPTO_KEY).toString())
    return instance({
      ...originalRequest,
      headers: {
        Authorization: `Bearer ${store.getters['Auth/token']}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    localStorage.removeItem(encryptedTokenKey)
    localStorage.removeItem(encryptedRefreshTokenKey)
    localStorage.removeItem(encryptedMeKey)

    router.push({ path: '/login', replace: true })

    return Promise.reject(error)
  }
}

instance.interceptors.response.use(
  response => response,
  error => {
    // Safari can't get the OK response and shows 'Network Error' instead
    const safariUnrealError = error.code === undefined && error.message === 'Network Error'
    const nonSafariUnauthorized = error.response && error.response.status === 401
    // Safari don't have response on error 4xx
    const safariUnauthorized = !error.response
    const refreshRequest = error.config.url.endsWith('/auth/refresh')
    const loginRequest = error.config.url.endsWith('/auth/login')
    const loginByPinRequest = error.config.url.endsWith('/auth/login-pin')
    const internalServerError = error.response.status === 500
    const badRequestError = error.response.status === 400

    if (loginRequest || loginByPinRequest) {
      return Promise.reject(error.response || error)
    } else if (safariUnrealError) {
      return Promise.resolve()
    } else if ((nonSafariUnauthorized || safariUnauthorized) && !refreshRequest) {
      return refresh(error.config)
    } else if (internalServerError) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: error.response.statusText })
    } else if (badRequestError) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: error.response.data })
    }

    return Promise.reject(error.response || error)
  }
)

export default instance
