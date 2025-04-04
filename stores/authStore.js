import { defineStore } from "pinia"

export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "{}"),
    }
  },
  getters: {
    isLoggedIn() {
      return this.user?.id ? true : false 
      // return true // for develop
    },
  },
  actions: {
    async login(credentials) {
      const { email, password } = credentials
      // const response = await fetchWrapper.post(LOGIN_URL, { email, password })
      var response = await fetchWrapper.post(LOGIN_URL, { email, password })

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
      //router.push("/login")
    },
    /*
    async sendRecoveryPass(email) {
      return await fetchWrapper.post(RECOVERY_MAIL_URL, { email })
    },
    async resetPassword(password, passwordc, token) {
      return await fetchWrapper.post(RESET_PASSWORD_URL, { new: password, new_confirm: passwordc, token })
    },*/
  },
})
