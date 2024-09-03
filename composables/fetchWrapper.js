import { useAuthStore } from "~/stores";

const setAuthHeader = () => {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  if (isLoggedIn) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const request = (method) => {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: setAuthHeader(),
      body: null,
    };

    if (body instanceof FormData) {
      requestOptions.body = body;
    } else if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await $fetch(`${BASE_API_URL()}${url}`, requestOptions);
      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }
      return response;
    } catch (error) {
      const { logout } = useAuthStore();
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized access - 401');
        logout()
      } else {
        console.error('An error occurred:', error);
        throw error; // Re-throw the error to handle it in the calling code
      }
    }
  };
};

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};
