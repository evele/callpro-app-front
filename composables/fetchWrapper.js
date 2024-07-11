import { useAuthStore } from "~/stores";

const setAuthHeader = () => {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  if (isLoggedIn) {
    return { Authorization: `Bearer ${user.token}` };
  }
};

const request = (method) => {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: setAuthHeader(),
      body: null,
    };
    if (body) {
      requestOptions.body = JSON.stringify(body); // Asegúrate de que el body esté en formato JSON TODO: check this que lo mandó GPT porque sí
    }
    
    try {
      const response = await $fetch(url, {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body,
      });

      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      return { data: response.data }
    } catch (error) {
      // Handle the request and response errors
      console.log("error", error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  };
};

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};
