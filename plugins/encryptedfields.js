export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('initCardknox', () => {
      if (process.client) {
        if (typeof window.Cardknox === 'undefined') {
          const script = document.createElement('script')
          script.src = "https://cdn.cardknox.com/js/v1/encryptedfields.js"
          script.onload = () => {
            console.log('Cardknox script loaded successfully')
            if (typeof window.Cardknox === 'function') {
              window.cardknox = new window.Cardknox({
                apiKey: 'TU_API_KEY', // Reemplaza con tu clave API
                fields: {
                  cc: {
                    selector: '[data-encryptedfields="cc"]',
                    placeholder: 'Card Number'
                  },
                  cvv: {
                    selector: '[data-encryptedfields="cvv"]',
                    placeholder: 'CVV'
                  }
                }
              })
            } else {
              console.error('Cardknox is not a constructor')
            }
          }
          script.onerror = () => {
            console.error('Error loading Cardknox script')
          }
          document.body.appendChild(script)
        } else if (typeof window.Cardknox === 'function') {
          console.log('Cardknox already loaded, initializing...')
          window.cardknox = new window.Cardknox({
            apiKey: 'TU_API_KEY', // Reemplaza con tu clave API
            fields: {
              cc: {
                selector: '[data-encryptedfields="cc"]',
                placeholder: 'Card Number'
              },
              cvv: {
                selector: '[data-encryptedfields="cvv"]',
                placeholder: 'CVV'
              }
            }
          })
        } else {
          console.error('Cardknox is not a constructor')
        }
      }
    })
  })