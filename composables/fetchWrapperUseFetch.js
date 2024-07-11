import { useAuthStore } from "~/stores"
import { hash } from "ohash"
// TODO: analize if will be usefull for loading data (before render) or delete it


const setAuthHeader = () => {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore()
  const isLoggedIn = !!user?.token
  if (isLoggedIn) {
    return { Authorization: `Bearer ${user.token}` }
   
  } 
}

const request = (method) => {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: setAuthHeader(),
      body: null,
    }
    if (body) {
      requestOptions.body = body
    }
    const { data, pending, error, refresh } = await useFetch(url, {
      key: hash(["api-fetch", url, body]),
      onRequest({ request, options }) {
        // Set the request headers
        options.method = requestOptions.method
        options.headers = requestOptions.headers
        options.body = requestOptions.body
      },
      onRequestError({ request, options, error }) {
        // Handle the request errors
        console.log("error", error)
      },
      onResponse({ request, response, options }) {
        // Process the response data
        const { user, logout } = useAuthStore()
        if ([401, 403].includes(response.status) && user) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          logout()
        }
      },
      onResponseError({ request, response, options, status }) {
        // Handle the response errors
        console.log("response error", response.status)
      },
    })
    return { data, pending, error, refresh }
  }
}

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
}