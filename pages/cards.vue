<template>
    <form @submit.prevent="onSubmit" data-encryptedfields="encrypted-form">
      <input v-model="cc" ref="ccInput" type="text" data-encryptedfields="cc" placeholder="Credit Card Number" />
      <input v-model="ccName" type="text" placeholder="JOHN DOE">
      <input v-model="ccExpiry" type="text" placeholder="0119">
      <input v-model="cvv" ref="cvvInput" type="text" data-encryptedfields="cvv" placeholder="CVV" />
      <button type="submit">Submit</button>
    </form>
    <label>{{ ccEnc }}</label>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import JSEncrypt from 'jsencrypt';
  
  const creditCardsStore = useCreditCardsStore()
  const cc = ref('');
  const ccName = ref('');
  const ccExpiry = ref('');
  const cvv = ref('');
  const ccEnc = ref('');
  const isSavingCard = ref(false); 
  
  const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2X6b6wh6G4BNCGlttyku7ijteqkEdLUd+kcx7+6NZTXgFj43Z5bC/vX3GnfH5C1B7v16oNYTWFBhWi8w5rDRjN2tFGBn4sbPbDqcDP0VCiXGKRHIblKMz7+WfDmWuTiQJpgKiHJhPmKJ+j2YjzHsfXZyVjjKSHK/MVj0ER8/9TvKVKs6pJ8bAtOZyF7zmQ+YX5QL9wSDqDUo5TP7r60VS6ZJ8MLqDAKGT7QvkszrH3ategvUK/3sFSmvzi9mVQNdTCJes2I5Xb4oxQtmpNT/wgRoB1d1NzWOpLY7BfI/eZYveNVq13tdrcOcs74nwCPXNZO9JitaZv4P3luV0fx3sQIDAQAB`;
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  
  const formatCardNumber = (number) => {
    return number.charAt(0) + '0'.repeat(number.length - 5) + number.slice(-4);
  };
  
  const splitMessage = (msg, size) => {
    const chunks = [];
    for (let i = 0; i < msg.length; i += size) {
      chunks.push(msg.slice(i, i + size));
    }
    return chunks;
  };
  
  const encryptData = (data) => {
    const chunks = splitMessage(data, 245);
    const encryptedChunks = chunks.map(chunk => encryptor.encrypt(chunk));
    return encryptedChunks.join('');
  };
  
  const prepareAndEncryptData = (cc, cvv) => {
    const encryptedCC = formatCardNumber(cc) + ';;01' + encryptData(`xCardNum=${cc}&xCVV=${cvv}`) + '?';
    return encryptedCC;
  };
  
  const onSubmit = () => {
    const ccInput = cc.value;
    const cvvInput = cvv.value;
  
    const encryptedData = prepareAndEncryptData(ccInput, cvvInput);
    ccEnc.value = encryptedData;
    
  
    // Logic to handle the form submission can go here.
    console.log('Encrypted data:', encryptedData);
    confirm_add_card()
  };
  
  // SwipeParserObj functionality
  function SwipeParserObj(a) {
    function i(a) {
      return null == a ? "" : a.replace(/[^0-9]/g, "");
    }
    if (
      (this.input_trackdata_str = a),
      (this.account_name = null),
      (this.surname = null),
      (this.firstname = null),
      (this.account = null),
      (this.exp_month = null),
      (this.exp_year = null),
      (this.track1 = null),
      (this.track2 = null),
      (this.hasTrack1 = !1),
      (this.hasTrack2 = !1),
      (sTrackData = this.input_trackdata_str),
      "" != a
    ) {
      if (
        ((nHasTrack1 = a.indexOf("^")),
        (nHasTrack2 = a.indexOf("=")),
        (this.hasTrack1 = bHasTrack1 = !1),
        (this.hasTrack2 = bHasTrack2 = !1),
        nHasTrack1 > 0 && (this.hasTrack1 = bHasTrack1 = !0),
        nHasTrack2 > 0 && (this.hasTrack2 = bHasTrack2 = !0),
        (bTrack1_2 = !1),
        (bTrack1 = !1),
        (bTrack2 = !1),
        bHasTrack1 && bHasTrack2 && (bTrack1_2 = !0),
        bHasTrack1 && !bHasTrack2 && (bTrack1 = !0),
        !bHasTrack1 && bHasTrack2 && (bTrack2 = !0),
        (bShowAlert = !1),
        bTrack1_2)
      ) {
        (strCutUpSwipe = "" + a + " "),
        (arrayStrSwipe = new Array(4)),
        (arrayStrSwipe = strCutUpSwipe.split("^"));
        var b, c, e, f;
        if (arrayStrSwipe.length > 2) {
          (this.account = i(arrayStrSwipe[0].substring(1, arrayStrSwipe[0].length))),
          (this.account_name = arrayStrSwipe[1]),
          (this.exp_month = arrayStrSwipe[2].substring(2, 4)),
          (this.exp_year = "20" + arrayStrSwipe[2].substring(0, 2)),
          "%" == sTrackData.substring(0, 1) &&
            (sTrackData = sTrackData.substring(1, sTrackData.length));
          var g = sTrackData.indexOf(";");
          -1 != g && ((this.track1 = sTrackData.substring(0, g)), (this.track2 = sTrackData.substring(g)));
          var h = this.account_name.indexOf("/");
          -1 != h &&
            ((this.surname = this.account_name.substring(0, h)),
            (this.firstname = this.account_name.substring(h + 1)));
        } else bShowAlert = !0;
      }
      if (bTrack1) {
        (strCutUpSwipe = "" + a + " "),
        (arrayStrSwipe = new Array(4)),
        (arrayStrSwipe = strCutUpSwipe.split("^"));
        var b, c, e, f;
        if (arrayStrSwipe.length > 2) {
          (this.account = b = i(arrayStrSwipe[0].substring(1, arrayStrSwipe[0].length))),
          (this.account_name = c = arrayStrSwipe[1]),
          (this.exp_month = e = arrayStrSwipe[2].substring(2, 4)),
          (this.exp_year = f = "20" + arrayStrSwipe[2].substring(0, 2)),
          "%" == sTrackData.substring(0, 1) &&
            (this.track1 = sTrackData = sTrackData.substring(1, sTrackData.length)),
          (this.track2 = ";" + b + "=" + f.substring(2, 4) + e + "111111111111?"),
          (sTrackData += this.track2);
          var h = this.account_name.indexOf("/");
          -1 != h &&
            ((this.surname = this.account_name.substring(0, h)),
            (this.firstname = this.account_name.substring(h + 1)));
        } else bShowAlert = !0;
      }
      bTrack2 &&
        ((nSeperator = a.indexOf("=")),
        (sCardNumber = a.substring(1, nSeperator)),
        (f = a.substr(nSeperator + 1, 2)),
        (e = a.substr(nSeperator + 3, 2)),
        (this.account = b = i(sCardNumber)),
        (this.exp_month = e = e),
        (this.exp_year = f = "20" + f),
        "%" == sTrackData.substring(0, 1) &&
          (sTrackData = sTrackData.substring(1, sTrackData.length))),
      (!bTrack1_2 && !bTrack1 && !bTrack2) || bShowAlert;
    }
    this.dump = function () {
      var a = "",
        b = "\n\r";
      return (
        (a += "Name: " + this.account_name + b),
        (a += "Surname: " + this.surname + b),
        (a += "first name: " + this.firstname + b),
        (a += "account: " + this.account + b),
        (a += "exp_month: " + this.exp_month + b),
        (a += "exp_year: " + this.exp_year + b),
        (a += "has track1: " + this.hasTrack1 + b),
        (a += "has track2: " + this.hasTrack2 + b),
        (a += "TRACK 1: " + this.track1 + b),
        (a += "TRACK 2: " + this.track2 + b),
        (a += "Raw Input Str: " + this.input_trackdata_str + b)
      );
    };
  }
  
  const handleSwipeData = (swipeData) => {
    const swipeParser = new SwipeParserObj(swipeData);
    // Aquí puedes hacer lo que necesites con los datos parseados.
    console.log(swipeParser.dump());
  };
  
  // Ejemplo de uso de la función handleSwipeData
  // handleSwipeData('tu_string_de_swipe_data');


  const confirm_add_card = async () => {
        isSavingCard.value = true
       
        // acá se manda la data a la API y vuelve encriptada
      
        const dataToSend = {
            cc_number: '',
            cc_name: ccName.value,
            expiry: ccExpiry.value,
            enc_card_number: ccEnc.value,
            cvv: cvv.value,
        }

        const res = await creditCardsStore.addUserCreditCard(dataToSend)
        console.log(res)
        isSavingCard.value = false

    }
  </script>
  