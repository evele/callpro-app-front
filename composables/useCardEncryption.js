// composables/useCardEncryption.js
import { ref } from 'vue'
import { JSEncrypt } from 'jsencrypt'


export function useCardEncryption() {
  // Constantes basadas en el código original
  const PUBLIC_KEY =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2X6b6wh6G4BNCGlttyku7ijteqkEdLUd+kcx7+6NZTXgFj43Z5bC/vX3GnfH5C1B7v16oNYTWFBhWi8w5rDRjN2tFGBn4sbPbDqcDP0VCiXGKRHIblKMz7+WfDmWuTiQJpgKiHJhPmKJ+j2YjzHsfXZyVjjKSHK/MVj0ER8/9TvKVKs6pJ8bAtOZyF7zmQ+YX5QL9wSDqDUo5TP7r60VS6ZJ8MLqDAKGT7QvkszrH3ategvUK/3sFSmvzi9mVQNdTCJes2I5Xb4oxQtmpNT/wgRoB1d1NzWOpLY7BfI/eZYveNVq13tdrcOcs74nwCPXNZO9JitaZv4P3luV0fx3sQIDAQAB'
  // Valor compuesto en el original: c + b + d
  const CONST_E = '01010000'

  // --- Helpers básicos ---
  // Función para “ofuscar” el número de cuenta (mantiene primer dígito y últimos 4, rellena con ceros en medio)
  function obfuscateAccount(acc) {
    if (!acc) return ''
    const len = acc.length
    return acc.charAt(0) + '0'.repeat(Math.max(len - 4, 0)) + acc.slice(-4)
  }

  // Función para dividir una cadena en trozos (similar a la función p del original)
  function chunkString(str, size) {
    const chunks = []
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.substring(i, i + size))
    }
    return chunks
  }

  // Función para encriptar un texto (se divide en trozos y se encripta cada uno)
  function encryptWithPublicKey(text) {
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(PUBLIC_KEY)
    const chunks = chunkString(text, 245)
    const encryptedChunks = chunks.map(chunk => jsEncrypt.encrypt(chunk))
    return encryptedChunks.join('')
  }

  // --- Clase para parsear el swipe (adaptación de SwipeParserObj) ---
  class SwipeParser {
    constructor(input) {
      this.input = input
      this.account_name = null
      this.surname = null
      this.firstname = null
      this.account = null
      this.exp_month = null
      this.exp_year = null
      this.track1 = null
      this.track2 = null
      this.hasTrack1 = false
      this.hasTrack2 = false

      if (input && input !== '') {
        const nHasTrack1 = input.indexOf('^')
        const nHasTrack2 = input.indexOf('=')
        let bHasTrack1 = false,
          bHasTrack2 = false
        if (nHasTrack1 > 0) {
          bHasTrack1 = true
          this.hasTrack1 = true
        }
        if (nHasTrack2 > 0) {
          bHasTrack2 = true
          this.hasTrack2 = true
        }
        let bTrack1_2 = false,
          bTrack1 = false,
          bTrack2 = false
        if (bHasTrack1 && bHasTrack2) bTrack1_2 = true
        if (bHasTrack1 && !bHasTrack2) bTrack1 = true
        if (!bHasTrack1 && bHasTrack2) bTrack2 = true
        let bShowAlert = false
        if (bTrack1_2) {
          const parts = input.split('^')
          if (parts.length > 2) {
            this.account = parts[0].substring(1).replace(/[^0-9]/g, '')
            this.account_name = parts[1]
            this.exp_month = parts[2].substring(2, 4)
            this.exp_year = '20' + parts[2].substring(0, 2)
            // Si empieza con "%" se elimina
            if (input.startsWith('%')) {
              input = input.substring(1)
            }
            const gIndex = input.indexOf(';')
            if (gIndex !== -1) {
              this.track1 = input.substring(0, gIndex)
              this.track2 = input.substring(gIndex)
            }
            const hIndex = this.account_name.indexOf('/')
            if (hIndex !== -1) {
              this.surname = this.account_name.substring(0, hIndex)
              this.firstname = this.account_name.substring(hIndex + 1)
            }
          } else {
            bShowAlert = true
          }
        }
        if (bTrack1) {
          const parts = input.split('^')
          if (parts.length > 2) {
            this.account = parts[0].substring(1).replace(/[^0-9]/g, '')
            this.account_name = parts[1]
            this.exp_month = parts[2].substring(2, 4)
            this.exp_year = '20' + parts[2].substring(0, 2)
            if (input.startsWith('%')) {
              this.track1 = input.substring(1)
            }
            // Se construye una cadena track2 “falsa”
            this.track2 =
              ';' + this.account + '=' + this.exp_year.substring(2, 4) + this.exp_month + '111111111111?'
            input += this.track2
            const hIndex = this.account_name.indexOf('/')
            if (hIndex !== -1) {
              this.surname = this.account_name.substring(0, hIndex)
              this.firstname = this.account_name.substring(hIndex + 1)
            }
          } else {
            bShowAlert = true
          }
        }
        if (bTrack2) {
          const nSeperator = input.indexOf('=')
          const sCardNumber = input.substring(1, nSeperator)
          const fVal = input.substr(nSeperator + 1, 2)
          const eVal = input.substr(nSeperator + 3, 2)
          this.account = sCardNumber.replace(/[^0-9]/g, '')
          this.exp_month = eVal
          this.exp_year = '20' + fVal
          if (input.startsWith('%')) {
            input = input.substring(1)
          }
        }
      }
    }
    dump() {
      const newline = '\n'
      let result = ''
      result += 'Name: ' + this.account_name + newline
      result += 'Surname: ' + this.surname + newline
      result += 'First name: ' + this.firstname + newline
      result += 'Account: ' + this.account + newline
      result += 'Exp Month: ' + this.exp_month + newline
      result += 'Exp Year: ' + this.exp_year + newline
      result += 'Has track1: ' + this.hasTrack1 + newline
      result += 'Has track2: ' + this.hasTrack2 + newline
      result += 'TRACK 1: ' + this.track1 + newline
      result += 'TRACK 2: ' + this.track2 + newline
      result += 'Raw Input: ' + this.input + newline
      return result
    }
  }

  // --- Funciones auxiliares para el formato de datos ---
  // Convierte de hexadecimal a ASCII (similar a función s original)
  function hexToAscii(hex) {
    let str = ''
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    }
    return str
  }

  // Quita el caracter 'F' final, si existe
  function trimF(str) {
    if (!str) return str
    return str.endsWith('F') || str.endsWith('f') ? str.slice(0, -1) : str
  }

  // Función para mapear tags a valores (versión simplificada)
  function mapTagsToValues(str) {
    const map = new Map()
    let pos = 0
    while (pos < str.length) {
      const tag = str.substr(pos, 2)
      pos += 2
      const lenHex = str.substr(pos, 2)
      pos += 2
      const len = parseInt(lenHex, 16)
      const value = str.substr(pos, 2 * len)
      pos += 2 * len
      map.set(tag, value)
    }
    return map
  }

  // Genera la cadena formateada a partir de datos parseados (similar a función o)
  function formatSwipeData(parsed) {
    const b = '999'
    const c = '000000000000'
    const d = '%'
    let result = d
    if (parsed.hasTrack1) {
      result += 'B' + obfuscateAccount(parsed.account) + '^' + parsed.account_name + '^' + parsed.exp_year.slice(2) + parsed.exp_month + b + c
    } else {
      result += 'E'
    }
    result += '?;'
    if (parsed.hasTrack2) {
      result += obfuscateAccount(parsed.account) + '=' + parsed.exp_year.slice(2) + parsed.exp_month + b + c
    } else {
      result += 'E?+E'
    }
    result += '?'
    return result
  }

  // --- Función principal de encriptación ---
  // Esta función decide el camino a seguir según el contenido de cc:
  // - Si es numérico: asume que es CC y CVV separados.
  // - Si empieza por "%" o ";": se asume que es swipe.
  // - Sino, se asume que es un formato tag basado.
  function encryptCardData(cc, cvv = '') {
    let encryptedValue = ''
    if (!cc) return ''
    // Si es numérico (solo dígitos)
    if (!isNaN(cc)) {
      encryptedValue =
        obfuscateAccount(cc) +
        ';;' +
        CONST_E +
        encryptWithPublicKey('xCardNum=' + cc + '&xCVV=' + cvv) +
        '?'
    } else if (cc.startsWith('%') || cc.startsWith(';')) {
      // Se trata de datos swipe
      const parsed = new SwipeParser(cc)
      encryptedValue =
        formatSwipeData(parsed) +
        ';' +
        CONST_E +
        encryptWithPublicKey(cc) +
        '?'
    } else {
      // Se asume formato tag (por ejemplo, se espera que vengan tags como "5F20" o "5A")
      const tags = mapTagsToValues(cc)
      const parsed = new SwipeParser('')
      if (cc === 'DFEE25025025') {
        parsed.hasTrack1 = false
        parsed.hasTrack2 = false
      } else {
        parsed.account_name = hexToAscii(tags.get('5F20') || '')
        parsed.account = trimF(tags.get('5A') || '')
        const expData = tags.get('5F24') || ''
        parsed.exp_year = '20' + expData.substr(0, 2)
        parsed.exp_month = expData.substr(2, 2)
        parsed.hasTrack1 = true
        parsed.hasTrack2 = true
      }
      encryptedValue =
        formatSwipeData(parsed) +
        ';' +
        CONST_E +
        encryptWithPublicKey(cc) +
        '?'
    }
    return encryptedValue
  }

  // Se pueden exponer otros helpers o datos reactivos según se necesite.
  return {
    encryptCardData,
  }
}
