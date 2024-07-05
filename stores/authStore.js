import { defineStore } from "pinia"

export const useAuthStore = defineStore("AuthStore", {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "{}"),
    }
  },
  getters: {
    // computed prop of state
    isLoggedIn() {
      return this.user?.id ? true : false // TODO: check if will use this or what..
      // return true // for develop
    },
  },
  actions: {
    async login(credentials) {
      const { email, password } = credentials
      // const response = await fetchWrapper.post(LOGIN_URL, { email, password })
      var response = await fetchWrapper.post(LOGIN_URL, { email, password })

      response = toRaw(response.data.value) // TODO: check if will use this or what

      if (response.result == true) {
        // update pinia state
        this.user = response.user
        // store user details and jwt in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(response.user))
        // redirect to previous url or default to home page
        // this.$nuxt.$router.push({ name: "Dashboard" })
        await navigateTo("/dashboard") // TODO: change this route
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
