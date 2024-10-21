import { defineStore } from "pinia"

type User = {
  id: string;
  token: string;
};
export type LoginResponse = {
  result: true;
  user: User; 
  message: string;
};

export type AuthState = {
  user: User | null;
};

export type PasswordRecoveryResponse = {
  result: true;
  message?: string;
  
};

export const useAuthStore = defineStore("AuthStore", {
  state: (): AuthState => {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "null"),
    }
  },
  getters: {
    isLoggedIn(): boolean{
      return this.user?.id ? true : false 
      // return true // for develop
    },
  },
  actions: {
    async login(credentials: { email: string; password: string }): Promise<LoginResponse | APIResponseError>  {
      const { email, password } = credentials
      // const response = await fetchWrapper.post(LOGIN_URL, { email, password })
      var response = await fetchWrapper.post(LOGIN_URL, { email, password }) as LoginResponse | APIResponseError

      if (response.result == true) {
        // update pinia state
        this.user = response.user
        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(response.user))
        // redirect to previous url or default to home page
        await navigateTo("/dashboard") 
      }

      return response
    },
    async logout() {
      this.user = null
      localStorage.removeItem("user")
      location.reload()
    },
    async sendRecoveryPass(email: string): Promise<PasswordRecoveryResponse | APIResponseError> {
      return await fetchWrapper.post(FORGOT_PASSWORD_URL, { email }) as PasswordRecoveryResponse | APIResponseError;
    },    
    async resetPassword(new_password: string, new_password_confirm: string, token: string) {
      return await fetchWrapper.post(RESET_PASSWORD_URL, { new_password, new_password_confirm, token })
    },
  },
})
