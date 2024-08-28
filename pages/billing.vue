<template>
    <div>
        <p class="text-title">Billing page</p>
        <button type="button" @click="load_data" style="display: block;">Load Data</button>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error: {{ error.message }}</span>
        <ul>
            <li v-for="invoice in data?.invoices" :key="invoice.id" style="margin: 1rem 0;">
                {{ invoice.id }}
                <button type="button">
                    <NuxtLink :to="{ name: 'print_invoice-id', params: { id: invoice.id } }" target=”_blank”>View Invoice</NuxtLink>
                </button>
            </li>
        </ul>
    </div>

    <form class='js-card-form' data-encryptedfields="encrypted-form">
      <div>
          <label class="has-text-primary is-size-4 has-text-weight-semibold" for="number">Number</label>
          <input class="form-control" id="number" type="text" placeholder="**** **** **** ****">
          <input class="form-control" id="enc-number" type="text" data-encryptedfields="cc" placeholder="**** **** **** ****">
      </div>
  
      <div>
          <label class="has-text-primary is-size-4 has-text-weight-semibold" for="cc-name">Full Name</label>
          <input class="form-control" id="cc-name" name="checkout-cc-name" type="text" placeholder="JOHN DOE">
      </div>
  
      <div>
          <label class="has-text-primary is-size-4 has-text-weight-semibold" for="expiry">MMYY</label>
          <input class="form-control" id="expiry" name="checkout-cc-expiry" type="text" placeholder="0119">
      </div>
  
      <div>
          <label class="has-text-primary is-size-4 has-text-weight-semibold" for="cvv">CVC</label>
          <input class="form-control" id="cvv" data-encryptedfields="cvv" type="text" placeholder="***">
      </div>
  
      <div>
          <button type="button" class="button is-primary" @click="addCard">Add Card</button>
      </div>
    </form>
</template>

<script setup>
    const { data, error, isLoading, isError, refetch } = useFetchInvoices()

    const load_data = () => {
        refetch()
    }

    // onMounted(() => {
    //     setTimeout(() => {
    //         if (!document.querySelector('script[src="https://cdn.cardknox.com/js/v1/encryptedfields.js"]')) {
    //             const script = document.createElement('script');
    //             script.src = 'https://cdn.cardknox.com/js/v1/encryptedfields.js';
    //             script.onload = () => {
    //             console.log('Script loaded successfully');
    //                 // Aquí podrías incluir lógica adicional si es necesario
    //             };
    //             script.onerror = () => {
    //                 console.error('Script failed to load');
    //             };
    //             document.head.appendChild(script);
    //         }
            
    //     }, 2000); // Ajusta el tiempo según sea necesario
    // });

    const addCard = () => {
        const dataToSave = {
            cc_number: document.querySelector('#number').value,
            cc_name: document.querySelector('#cc-name').value,
            expiry: document.querySelector('#expiry').value,
            cvv: document.querySelector('#cvv').value,
            enc_card_number: document.querySelector('input[name="xCardNum"]')?.value
        }
        console.log(dataToSave)
        return
    }
</script>

<style scoped>
    .text-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }
</style>