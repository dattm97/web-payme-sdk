/* eslint-disable no-undef */
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.head.append(script)
  })
}

export const merge = (object, source) => {
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
  )
    .then(() => {
      return _.merge(object, source)
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const values = (object) => {
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
  )
    .then(() => {
      return _.values(object)
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const decryptKey = (
  xAPIAction,
  xAPIKey,
  xAPIMessage,
  xAPIValidate,
  method,
  accessToken
) => {
  return loadScript(
    'https://cdn.jsdelivr.net/npm/node-forge@0.7.0/dist/forge.min.js'
  )
    .then(async () => {
      let decryptKey
      try {
        const key = forge.pki.privateKeyFromPem(this.config.privateKey)
        const { util } = forge

        const encrypted = util.decode64(xAPIKey)

        decryptKey = key.decrypt(encrypted, 'RSA-OAEP')
      } catch (error) {
        throw new Error('Thông tin "x-api-key" không chính xác')
      }
      const objValidate = {
        'x-api-action': xAPIAction,
        method,
        accessToken,
        'x-api-message': xAPIMessage
      }

      const md = forge.md.md5.create()
      const objValidateValue = await values(objValidate)
      md.update(objValidateValue.join('') + decryptKey)
      const validate = md.digest().toHex()

      if (validate !== xAPIValidate) {
        throw new Error('Thông tin "x-api-validate" không chính xác')
      }

      return decryptKey
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const parseDecryptKey = (xAPIMessage, decryptKey) => {
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js'
  )
    .then(() => {
      // eslint-disable-next-line no-undef
      try {
        let result = null
        result = JSON.parse(
          CryptoJS.AES.decrypt(xAPIMessage, decryptKey).toString(
            CryptoJS.enc.Utf8
          )
        )
        if (typeof result === 'string') {
          result = JSON.parse(result)
        }

        return result
      } catch (error) {
        throw new Error('Thông tin "x-api-message" không chính xác')
      }
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const createShortId = () => {
  return loadScript(
    'https://unpkg.com/shortid-dist@1.0.5/dist/shortid-2.2.13.js'
  )
    .then(() => {
      return shortid()
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const AESEncrypt = (url, payload, encryptKey) => {
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js'
  )
    .then(() => {
      const xApiAction = CryptoJS.AES.encrypt(url, encryptKey).toString()
      let xApiMessage = ''
      if (payload) {
        xApiMessage = CryptoJS.AES.encrypt(
          JSON.stringify(payload),
          encryptKey
        ).toString()
      }

      return {
        xApiAction,
        xApiMessage
      }
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const createXApiValidate = (objValidate, encryptKey) => {
  return loadScript(
    'https://cdn.jsdelivr.net/npm/node-forge@0.7.0/dist/forge.min.js'
  )
    .then(async () => {
      const md = forge.md.md5.create()
      const objValidateValue = await values(objValidate)
      md.update(objValidateValue.join('') + encryptKey)
      const xAPIValidate = md.digest().toHex()
      return xAPIValidate
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const createXApiKey = (encryptKey, publicKey) => {
  return loadScript(
    'https://cdn.jsdelivr.net/npm/node-forge@0.7.0/dist/forge.min.js'
  )
    .then(() => {
      const key = forge.pki.publicKeyFromPem(publicKey)
      const { util } = forge
      const encrypt = key.encrypt(encryptKey, 'RSA-OAEP')
      const xAPIKey = util.encode64(encrypt)
      return xAPIKey
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const postRequest = async (url, body, header) => {
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js'
  )
    .then(async () => {
      try {
        const request = await axios.post(url, body, header)
        return request
      } catch (error) {
        console.log(error)
      }
    })
    .catch((err) => console.error('Something went wrong.', err))
}

export const encrypt = (text) => {
  const secretKey = 'CMo359Lqx16QYi3x'
  return loadScript(
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js'
  )
    .then(() => {
      // eslint-disable-next-line no-undef
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        secretKey
      ).toString()

      return encrypted
    })
    .catch((err) => console.error('Something went wrong.', err))
}
