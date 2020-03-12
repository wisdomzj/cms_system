import axios from 'axios'
import users from '@/api/uuser'
import article from '@/api/article'
import focus from '@/api/focus'
import nav from '@/api/nav'
import link from '@/api/link'
import upload from '@/api/upload'
import setting from '@/api/setting'
import play from '@/api/play'
import blog from '@/api/blog'
import swiper from '@/api/swiper'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
})

const http = {}

const service = {
  ...users,
  ...article,
  ...focus,
  ...nav,
  ...link,
  ...upload,
  ...setting,
  ...play,
  ...blog,
  ...swiper
}

for (const key in service) {
  const api = service[key]
  http[key] = async function(
    { url, ...params },
    isFormData = false,
    config = {}
  ) {
    let newParams = {}
    if (params && isFormData) {
      newParams = new FormData()
      for (const i in params) {
        newParams.append(i, params[i])
      }
    } else {
      newParams = params
    }
    let response = {}
    if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
      try {
        if (api.isDycRouter) {
          response = await instance[api.method](url, newParams, config)
        } else {
          response = await instance[api.method](api.url, newParams, config)
        }
      } catch (err) {
        response = err
      }
    } else if (api.method === 'delete' || api.method === 'get') {
      config.params = newParams
      try {
        if (api.isDycRouter) {
          response = await instance[api.method](url, config)
        } else {
          response = await instance[api.method](api.url, config)
        }
      } catch (err) {
        response = err
      }
    }
    return response
  }
}

instance.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(error)
})

export default http
