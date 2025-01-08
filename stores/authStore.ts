import { defineStore } from "pinia"

type AuthState = {
  user: User | null;
  ivr_bind: boolean;
  root_id: string | null;
};

type PasswordRecoveryResponse = {
  result: true;
  message?: string;
};

type phoneLaunchAccount = {
  user: number;
  password: string;
}

type RegisterResponseSuccess = APIResponseSuccess & { message: string }

type BindPhonelaunchAccountResponseSuccess = APIResponseSuccess & {
  ivr_user: string;
  root_id: string 
}

type ValidateConfirmationCodeResponseSuccess = APIResponseSuccess & {
  ivr_bind: true;
  root_id: string
}

export const useAuthStore = defineStore("AuthStore", {
  state: (): AuthState => {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "null"),
      ivr_bind: false,
      root_id: null
    }
  },
  getters: {
    isLoggedIn(): boolean{
      return this.user?.id ? true : false 
      // return true // for develop
    },
  },
  actions: {
    async login(credentials: { email: string; password: string }): Promise<LoginResponseSuccess | APIResponseError>  {
      const { email, password } = credentials
      // const response = await fetchWrapper.post(LOGIN_URL, { email, password })
      var response = await fetchWrapper.post(LOGIN_URL, { email, password }) as LoginResponseSuccess | APIResponseError

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
    async registerUser(dataToSend:UserRegister): Promise<RegisterResponseSuccess | APIResponseError> {
        return await fetchWrapper.post(CREATE_USER_URL, dataToSend) as RegisterResponseSuccess | APIResponseError;        
    },
    async bindPhonelaunchAccount(dataToSend:phoneLaunchAccount): Promise<BindPhonelaunchAccountResponseSuccess | APIResponseError> {
        return await fetchWrapper.post(BIND_PHONE_LAUNCH_ACCOUNT_URL, dataToSend) as BindPhonelaunchAccountResponseSuccess | APIResponseError;        
    },
    async validateConfirmationCode(dataToSend:validateConfirmationCode): Promise<ValidateConfirmationCodeResponseSuccess | APIResponseError> {
        const response = await fetchWrapper.post(VALIDATE_CONFIRMATION_CODE_URL, dataToSend) as ValidateConfirmationCodeResponseSuccess | APIResponseError;
        if(response.result) {
          this.ivr_bind = response.ivr_bind
          this.root_id = response.root_id
        }
        return response
    },
    async resendIVRCode(dataToSend: { ivr_user: string }): Promise<APIResponseSuccess | APIResponseError> {
      return await fetchWrapper.post(RESEND_IVR_CODE_URL, dataToSend) as APIResponseSuccess | APIResponseError;        
  },
  },
})
