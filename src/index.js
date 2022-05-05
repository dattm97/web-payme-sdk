/* eslint-disable no-undef */
import React, { Component } from 'react'

export const ERROR_CODE = {
  EXPIRED: 401,
  ACCOUNT_LOCK: 405,
  NETWORK: -1,
  SYSTEM: -2,
  LIMIT: -3,
  NOT_ACTIVATED: -4,
  KYC_NOT_APPROVED: -5,
  PAYMENT_ERROR: -6,
  ERROR_KEY_ENCODE: -7,
  USER_CANCELLED: -8,
  NOT_LOGIN: -9,
  BALANCE_ERROR: -11,
  UNKNOWN_PAYCODE: -12
}

export const PAY_CODE = {
  PAYME: 'PAYME',
  ATM: 'ATM',
  CREDIT: 'CREDIT',
  MANUAL_BANK: 'MANUAL_BANK',
  MOMO: 'MOMO',
  ZALO_PAY: 'ZALO_PAY',
  VIET_QR: 'VIET_QR'
}

const ACCOUNT_STATUS = {
  NOT_ACTIVATED: 'NOT_ACTIVATED',
  NOT_KYC: 'NOT_KYC',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REVIEW: 'KYC_REVIEW',
  KYC_REJECTED: 'KYC_REJECTED'
}

export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
}

const WALLET_ACTIONS = {
  LOGIN: 'LOGIN',
  RELOGIN: 'RELOGIN',
  GET_WALLET_INFO: 'GET_WALLET_INFO',
  GET_ACCOUNT_INFO: 'GET_ACCOUNT_INFO',
  OPEN_WALLET: 'OPEN_WALLET',
  OPEN_HISTORY: 'OPEN_HISTORY',
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT',
  TRANSFER: 'TRANSFER',
  GET_LIST_SERVICE: 'GET_LIST_SERVICE',
  OPEN_SERVICE: 'OPEN_SERVICE',
  UTILITY: 'UTILITY',
  GET_LIST_PAYMENT_METHOD: 'GET_LIST_PAYMENT_METHOD',
  PAY: 'PAY',
  SCAN_QR_CODE: 'SCAN_QR_CODE'
}

// const METHOD_TYPE = {
//   PAYME: 'PAYME',
//   PAYME_CREDIT: 'PAYME_CREDIT',
//   WALLET: 'WALLET',
//   BANK_ACCOUNT: 'BANK_ACCOUNT',
//   BANK_CARD: 'BANK_CARD',
//   BANK_CARD_PG: 'BANK_CARD_PG',
//   BANK_TRANSFER: 'BANK_TRANSFER',
//   ATM_CARD: 'ATM_CARD',
//   GATEWAY: 'GATEWAY',
//   CREDIT_CARD: 'CREDIT_CARD',
//   LINKED: 'LINKED',
//   BANK_QR_CODE: 'BANK_QR_CODE',
//   LINKED_BANK: 'LINKED_BANK',
//   LINKED_BANK_PVCBANK: 'LINKED_BANK_PVCBANK',
//   LINKED_BANK_OCBBANK: 'LINKED_BANK_OCBBANK',
//   LINKED_GATEWAY: 'LINKED_GATEWAY'
// }

/**
 * Config API
 */
const API_GENERAL = 'fe.payme.vn'

const GRAPHQL_DEV = 'https://dev-fe.payme.net.vn'
const GRAPHQL_SANBOX = `https://sbx-${API_GENERAL}`
const GRAPHQL_STAGING = `https://s${API_GENERAL}`
const GRAPHQL_PRODUCTION = `https://${API_GENERAL}`

/**
 * query graphql
 *
 */
const SQL_CLIENT_REGISTER = `mutation ClientRegister ($clientRegisterInput: ClientRegisterInput!){
     Client {
     Register(input: $clientRegisterInput) {
       succeeded
       message
       clientId
     }
   }
 }`

const SQL_INIT_ACCOUNT = `mutation AccountInitMutation($initInput: CheckInitInput) {
   OpenEWallet {
     Init(input: $initInput) {
       succeeded
       message
       handShake
       accessToken
       updateToken
       kyc {
         kycId
         state
         reason
       }
       phone
       appEnv
       storeName
       storeImage
       fullnameKyc
     }
   }
 }`

const SQL_GET_BALANCE = `query Query {
   Wallet {
     balance
     cash
     lockCash
   }
 }`

const SQL_FIND_ACCOUNT = `query Query($accountPhone: String) {
   Account(phone: $accountPhone) {
     accountId
     fullname
     alias
     phone
     avatar
     email
     gender
     isVerifiedEmail
     isWaitingEmailVerification
     birthday
     address {
       street
       city {
         title
         identifyCode
       }
       district {
         title
         identifyCode
       }
       ward {
         title
         identifyCode
       }
     }
     kyc {
       kycId
       state
       reason
       identifyNumber
       details {
         identifyNumber
         issuedAt
       }
     }
   }
 }`

const SQL_SETTING = `query Query ($configsTags: String, $configsAppId: String, $configsKeys: [String]){
   Setting {
     configs (tags: $configsTags, appId: $configsAppId, keys: $configsKeys){
       key
       value
       tags
     }
   }
 }`

const SQL_PAYMENT_MEHTOD = `mutation Mutation($PaymentMethodInput: PaymentMethodInput) {
   Utility {
     GetPaymentMethod(input: $PaymentMethodInput) {
       succeeded
       message
       methods {
         methodId
         title
         label
         type
         fee
         feeDescription
         minFee
         data {
           ... on LinkedMethodInfo {
             linkedId
             issuer
             swiftCode
           }
           ... on WalletMethodInfo {
             accountId
           }
         }
       }
     }
   }
 }`

const SQL_GET_MERCHANT_INFO = `mutation Mutation($getInfoMerchantInput: OpenEWalletGetInfoMerchantInput!) {
  OpenEWallet {
    GetInfoMerchant(input: $getInfoMerchantInput) {
      succeeded
      message
      merchantName
      brandName
      backgroundColor
      storeImage
      storeName
      isVisibleHeader
    }
  }
}`

const SQL_DETECT_QR_CODE = `mutation DetectDataQRCode($input: OpenEWalletPaymentDetectInput!) {
  OpenEWallet {
    Payment {
      Detect (input: $input) {
        succeeded
        message
        type
        storeId
        action
        amount
        note
        orderId
        userName
      }
    }
  }
}`

class MeAPI extends Component {
  constructor(
    config = {
      url: '',
      publicKey: '',
      privateKey: '',
      isSecurity: false,
      'x-api-client': ''
    }
  ) {
    super()
    this.config = config
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = reject
      script.src = src
      document.head.append(script)
    })
  }

  merge(object, source) {
    return this.loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
    )
      .then(() => {
        return _.merge(object, source)
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  values(object) {
    return this.loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
    )
      .then(() => {
        return _.values(object)
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  decryptKey(
    xAPIAction,
    xAPIKey,
    xAPIMessage,
    xAPIValidate,
    method,
    accessToken
  ) {
    return this.loadScript(
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
        const objValidateValue = await this.values(objValidate)
        md.update(objValidateValue.join('') + decryptKey)
        const validate = md.digest().toHex()

        if (validate !== xAPIValidate) {
          throw new Error('Thông tin "x-api-validate" không chính xác')
        }

        return decryptKey
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  parseDecryptKey(xAPIMessage, decryptKey) {
    return this.loadScript(
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

  createShortId() {
    return this.loadScript(
      'https://unpkg.com/shortid-dist@1.0.5/dist/shortid-2.2.13.js'
    )
      .then(() => {
        return shortid()
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  AESEncrypt(url, payload, encryptKey) {
    return this.loadScript(
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

  createXApiValidate(objValidate, encryptKey) {
    return this.loadScript(
      'https://cdn.jsdelivr.net/npm/node-forge@0.7.0/dist/forge.min.js'
    )
      .then(async () => {
        const md = forge.md.md5.create()
        const objValidateValue = await this.values(objValidate)
        md.update(objValidateValue.join('') + encryptKey)
        const xAPIValidate = md.digest().toHex()
        return xAPIValidate
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  createXApiKey(encryptKey) {
    return this.loadScript(
      'https://cdn.jsdelivr.net/npm/node-forge@0.7.0/dist/forge.min.js'
    )
      .then(() => {
        const key = forge.pki.publicKeyFromPem(this.config.publicKey)
        const { util } = forge
        const encrypt = key.encrypt(encryptKey, 'RSA-OAEP')
        const xAPIKey = util.encode64(encrypt)
        return xAPIKey
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  async postRequest(url, body, header) {
    return this.loadScript(
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

  async ResponseDecrypt(
    xAPIAction,
    method,
    xAPIClient,
    xAPIKey,
    xAPIMessage,
    xAPIValidate,
    accessToken
  ) {
    const decryptKey = await this.decryptKey(
      xAPIAction,
      xAPIKey,
      xAPIMessage,
      xAPIValidate,
      method,
      accessToken
    )

    const result = await this.parseDecryptKey(xAPIMessage, decryptKey)
    return result
  }

  async RequestEncrypt(url, method, payload, accessToken) {
    const encryptKey = await this.createShortId()
    const xAPIKey = await this.createXApiKey(encryptKey)
    let body = ''

    const { xApiAction, xApiMessage } = await this.AESEncrypt(
      url,
      payload,
      encryptKey
    )

    const objValidate = {
      xApiAction,
      method,
      accessToken,
      'x-api-message': xApiMessage
    }
    const xAPIValidate = await this.createXApiValidate(objValidate, encryptKey)

    body = {
      'x-api-message': xApiMessage
    }
    const meAPIHeader = {
      'x-api-client': this.config['x-api-client'],
      'x-api-key': xAPIKey,
      'x-api-action': xApiAction,
      'x-api-validate': xAPIValidate
    }
    if (accessToken !== '') {
      meAPIHeader.Authorization = accessToken
    }
    return {
      body,
      headers: meAPIHeader
    }
  }

  async Post(pathUrl, payload, accessToken = '', headers = {}) {
    try {
      if (!accessToken) {
        accessToken = ''
      }
      let meAPIHeader = {}
      if (accessToken !== '') {
        meAPIHeader.Authorization = accessToken
      }
      let body = payload
      let url = this.config.url + pathUrl

      if (this.config.isSecurity === true) {
        url = this.config.url
        const encrypt = await this.RequestEncrypt(
          pathUrl,
          'POST',
          payload,
          accessToken
        )
        meAPIHeader = encrypt.headers
        body = encrypt.body
      }

      const response = await this.postRequest(url, body, {
        headers: await this.merge(meAPIHeader, headers),
        timeout: 60000
      })

      if (response.status === 200) {
        if (this.config.isSecurity === true) {
          try {
            const responseHeaders = response.headers
            const data = await this.ResponseDecrypt(
              responseHeaders['x-api-action'],
              'POST',
              responseHeaders['x-api-client'],
              responseHeaders['x-api-key'],
              response.data['x-api-message'],
              responseHeaders['x-api-validate'],
              accessToken
            )
            return {
              code: 1,
              data: data || {},
              original: response.data
            }
          } catch (error) {
            return {
              code: -3,
              data: { message: error.message },
              original: response.data
            }
          }
        } else {
          return {
            code: 1,
            data: response.data || {}
          }
        }
      } else {
        return {
          code: response.status,
          data: response.data || {}
        }
      }
    } catch (error) {
      return {
        code: -2,
        data: {
          errors: [{ message: error.message }]
        }
      }
    }
  }
}

export default class WebPaymeSDK extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iframeVisible: { state: false } // Biến dùng để bật tắt iFreame
    }
    this.id = 'paymeId'
    this.configs = props?.config
    this.propStyle = props.propStyle
    this.overlayBackground = props?.overlayBackground ?? false

    this._webPaymeSDK = null
    this._iframe = null
  }

  handlerMessage = (e) => {
    if (e.data.type === WALLET_ACTIONS.RELOGIN) {
      if (e.data?.data) {
        const newConfigs = {
          ...this.configs,
          ...e.data.data
        }
        this.configs = newConfigs
        /* eslint-disable no-undef */
        this._webPaymeSDK = new PaymeWebSdk(newConfigs)
      }
    }
    if (e.data?.type === WALLET_ACTIONS.GET_WALLET_INFO) {
      this.onCloseIframe()
      this.sendRespone(e.data)
    }
    if (e.data?.type === 'onClose') {
      document.getElementById(this.id).innerHTML = ''
      this.onCloseIframe()
    }
    if (e.data?.type === 'error') {
      if (e.data?.code === ERROR_CODE.EXPIRED) {
        this.onCloseIframe()
        window.removeEventListener('message', this.handlerMessage) // khi bị 401 thì ngừng nghe message
        localStorage.removeItem('PAYME')
      }
      if (e.data?.code === ERROR_CODE.ACCOUNT_LOCK) {
        this.onCloseIframe()
        window.removeEventListener('message', this.handlerMessage) // khi bị 405 thì ngừng nghe message
        localStorage.removeItem('PAYME')
      }
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.GET_ACCOUNT_INFO) {
      this.onCloseIframe()
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.GET_LIST_SERVICE) {
      this.onCloseIframe()
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.PAY) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.SCAN_QR_CODE) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.DEPOSIT) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.WITHDRAW) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.TRANSFER) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.OPEN_SERVICE) {
      this.sendRespone(e.data)
    }
    if (e.data?.type === WALLET_ACTIONS.GET_LIST_PAYMENT_METHOD) {
      this.onCloseIframe()
      this.sendRespone(e.data)
    }
    if (
      e.data?.type === 'onDeposit' ||
      e.data?.type === 'onWithDraw' ||
      e.data?.type === 'onTransfer'
    ) {
      this.onCloseIframe()
      const res = { ...e.data }
      if (e.data?.data?.status === 'FAILED') {
        res.error = e.data?.data
      }
      this.sendRespone(res)
    }
  }

  componentDidMount = async () => {
    window.addEventListener('message', this.handlerMessage)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlerMessage)
    localStorage.removeItem('PAYME')
  }

  async getLocalStorage() {
    const localStoragePayME = localStorage.getItem('PAYME')

    if (localStoragePayME) {
      const configsDecrypt = await this.decrypt(localStoragePayME)
      try {
        const parsed = JSON.parse(configsDecrypt)
        return parsed
      } catch (error) {
        return {}
      }
    }
  }

  onCloseIframe = () => {
    this.setState(
      {
        iframeVisible: { state: false }
      },
      () => this._iframe?.remove()
    )
  }

  sendRespone = (data) => {
    if (data?.error) {
      if (this._onError) this._onError(data?.error)
    } else if (data?.code === ERROR_CODE.EXPIRED) {
      if (this._onError) this._onError(data)
    } else {
      if (this._onSuccess) this._onSuccess(data)
    }
  }

  decrypt(text) {
    const secretKey = 'CMo359Lqx16QYi3x'
    return this.loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js'
    )
      .then(() => {
        // eslint-disable-next-line no-undef
        const decrypted = CryptoJS.AES.decrypt(text, secretKey).toString(
          CryptoJS.enc.Utf8
        )
        return decrypted
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = reject
      script.src = src
      document.head.append(script)
    })
  }

  getDomainAPI(env) {
    switch (env) {
      case 'dev':
        return GRAPHQL_DEV
      case 'sandbox':
        return GRAPHQL_SANBOX
      case 'staging':
        return GRAPHQL_STAGING
      default:
        return GRAPHQL_PRODUCTION
    }
  }

  randomString(length) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  size(value) {
    return this.loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js'
    )
      .then(() => {
        return _.size(value)
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  randomDayjs() {
    return this.loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.5/dayjs.min.js'
    )
      .then(() => {
        return dayjs().unix()
      })
      .catch((err) => console.error('Something went wrong.', err))
  }

  getSecure(env) {
    switch (env) {
      case 'dev':
        return false
      case 'sandbox':
        return true
      case 'staging':
        return true
      case 'production':
        return true
      default:
        return true
    }
  }

  async callGraphql(
    sql,
    variables,
    keys = {
      env: '',
      publicKey: '',
      privateKey: '',
      accessToken: '',
      appId: ''
    }
  ) {
    const response = await this.callApiRSA({
      env: keys.env?.toLowerCase(),
      domain: this.getDomainAPI(keys.env?.toLowerCase()),
      method: 'POST',
      pathUrl: '/graphql',
      accessToken: keys.accessToken ?? '',
      body: {
        query: `${sql}`,
        variables: variables || null
      },
      isSecurity: this.getSecure(keys.env?.toLowerCase()),
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      xApi: keys?.appId ?? keys?.xApi
    })
    return response
  }

  handleResponse = (response) => {
    if (!response.data?.errors) {
      return { status: true, response: response?.data?.data ?? {} }
    } else {
      return { status: false, response: response?.data?.errors ?? {} }
    }
  }

  async clientRegister(params, keys) {
    const clientRegisterInput = {
      platform: 'web',
      deviceId: params.deviceId,
      channel: 'channel',
      version: '1.0.0',
      isRoot: false
    }
    const res = await this.callGraphql(
      SQL_CLIENT_REGISTER,
      {
        clientRegisterInput
      },
      keys
    )
    return this.handleResponse(res)
  }

  async accountInit(params, keys) {
    const initInput = {
      appToken: params.appToken,
      connectToken: params.connectToken,
      clientId: params.clientId
    }
    const res = await this.callGraphql(
      SQL_INIT_ACCOUNT,
      {
        initInput
      },
      keys
    )
    return this.handleResponse(res)
  }

  async getWalletInfoAPI(params, keys) {
    const res = await this.callGraphql(SQL_GET_BALANCE, {}, keys)
    return this.handleResponse(res)
  }

  async findAccount(params, keys) {
    const res = await this.callGraphql(
      SQL_FIND_ACCOUNT,
      params.phone ? { accountPhone: params.phone } : {},
      keys
    )
    return this.handleResponse(res)
  }

  async getSettingServiceMain(params, keys) {
    const res = await this.callGraphql(
      SQL_SETTING,
      { configsAppId: params?.appId },
      keys
    )
    return this.handleResponse(res)
  }

  async getMerchantInfo(params, keys) {
    const res = await this.callGraphql(
      SQL_GET_MERCHANT_INFO,
      {
        getInfoMerchantInput: params?.storeId ? {
          storeId: params?.storeId,
          appId: params?.appId
        } : {
          appId: params?.appId
        }
      },
      keys
    )
    return this.handleResponse(res)
  }

  async getPaymentMethod(params, keys) {
    const PaymentMethodInput = {
      serviceType: 'OPEN_EWALLET_PAYMENT',
      extraData: {
        storeId: params?.storeId
      },
      payCode: params?.payCode
    }
    const res = await this.callGraphql(
      SQL_PAYMENT_MEHTOD,
      { PaymentMethodInput },
      keys
    )
    return this.handleResponse(res)
  }

  async detectQRString(params, keys) {
    const res = await this.callGraphql(
      SQL_DETECT_QR_CODE,
      {
        input: {
          clientId: params?.clientId,
          qrContent: params?.qrContent
        }
      },
      keys
    )
    return this.handleResponse(res)
  }

  async callApiRSA({
    env,
    domain,
    method,
    pathUrl,
    accessToken,
    body,
    isSecurity,
    xApi,
    publicKey,
    privateKey
  }) {
    if (env !== 'production') {
      console.log('[PAYLOAD]', method.toUpperCase(), domain + pathUrl, body)
    }

    const meAPI = new MeAPI({
      url: domain,
      publicKey,
      privateKey,
      isSecurity,
      'x-api-client': xApi
    })
    const headers = {
      'x-request-id': `${await this.randomDayjs()}-${this.randomString(32)}`
    }
    let response
    if (method.toUpperCase() === 'POST') {
      response = await meAPI.Post(pathUrl, body, accessToken || '', headers)
    }

    if (env !== 'production') {
      console.log(
        '[REQUEST]',
        method.toUpperCase(),
        domain + pathUrl,
        body,
        response
      )
    }

    return this.handleGraphQLResponse(response)
  }

  handleGraphQLResponse(response) {
    if (response?.code === -3) {
      // Không decrypt được data từ SERVER
      console.log('Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0001')
    } else if (response?.code === 400) {
      // Error khi thông số truyền lên ko chính xác
      console.log('Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0002')
    } else if (response?.code === -2) {
      // Error chưa tới SERVER
      /* -- */
      const { errors } = response.data
      if (errors && this.size(errors) > 0) {
        const error = errors[0]
        if (error.message === 'Network Error') {
          console.log(
            'Kết nối mạng bị sự cố, vui lòng kiểm tra và thử lại. Xin cảm ơn !'
          )
        } else if (
          error.message === 'timeout of 30000ms exceeded' ||
          error.message === 'timeout of 60000ms exceeded'
        ) {
          console.log(
            'Kết nối đến máy chủ quá lâu, vui lòng kiểm tra lại đường truyền và thử lại. Xin cảm ơn !'
          )
        } else {
          console.log('Có lỗi từ hệ thống. Mã lỗi: SDK-C0003')
        }
      }
      /* -- */
    } else if (response?.code === 1) {
      const { errors } = response.data
      if (errors && this.size(errors) > 0) {
        const error = errors[0]
        if (error.extensions?.code === ERROR_CODE.EXPIRED) {
          console.log(error.message ?? 'Thông tin xác thực không hợp lệ')
        } else if (error.extensions?.code === 400) {
          console.log('Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0002')
        } else {
          console.log(
            error.message ?? 'Có lỗi từ máy chủ hệ thống. Mã lỗi: SDK-C0004'
          )
        }
      }
    }

    return response
  }

  isOnline = (onOnline, onDisconnect) => {
    var xhr = XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHttp')
    xhr.onload = function () {
      if (onOnline instanceof Function) {
        onOnline()
      }
    }
    xhr.onerror = function () {
      if (onDisconnect instanceof Function) {
        onDisconnect()
      }
    }
    xhr.open('GET', 'https://httpbin.org/get', true)
    xhr.send()
  }

  _checkActiveAndKyc = () => {
    if (this.configs?.accountStatus !== ACCOUNT_STATUS.KYC_APPROVED) {
      return false
    }
    return true
  }

  openIframe = (link) => {
    this.isOnline(
      () => {
        const ifrm = document.createElement('iframe')
        this._iframe = ifrm

        ifrm.setAttribute(`src`, link)
        ifrm.setAttribute(
          `sandbox`,
          'allow-same-origin allow-scripts allow-popups allow-forms'
        )
        ifrm.style.width = '100%'
        ifrm.style.height = '100%'
        ifrm.style.position = 'relative'
        ifrm.style.top = 0
        ifrm.style.left = 0
        ifrm.style.right = 0
        ifrm.style.bottom = 0
        ifrm.style.border = 0
        ifrm.allow = 'clipboard-read;clipboard-write;camera *;microphone *'
        ifrm.referrerPolicy = 'origin-when-cross-origin'
        ifrm.allowpaymentrequest = true
        ifrm.allowFullscreen = true
        const element = document.getElementById(this.id)
        element && element.appendChild(ifrm)
      },
      () => {
        this.sendRespone({
          error: { code: ERROR_CODE.NETWORK, message: 'Network Error!' }
        })
      }
    )
  }

  openHiddenIframe = (link) => {
    this.isOnline(
      () => {
        const div = document.createElement('div')
        const ifrm = document.createElement('iframe')
        this._iframe = ifrm

        div.style.visibility = 'hidden'
        div.style.display = 'block'
        div.style.width = 0
        div.style.height = 0

        ifrm.setAttribute(`src`, link)
        ifrm.style.width = 0
        ifrm.style.height = 0
        ifrm.style.border = 0
        const element = document.getElementById(this.id)

        div.appendChild(ifrm)
        element && element.appendChild(div)
      },
      () => {
        this.sendRespone({
          error: { code: ERROR_CODE.NETWORK, message: 'Network Error!' }
        })
      }
    )
  }

  checkIsLogin = async () => {
    if (this.configs?.phone && this.configs?.connectToken) {
      if (this.configs?.accessToken) {
        return true
      } else if (!this.configs?.accessToken && this.configs?.updateToken) {
        return true
      }
      return false
    }
    return false
  }

  checkPaycode = async (
    params = {
      payCode: '',
      storeId: ''
    },
    onError = () => null
  ) => {
    if (!params?.payCode) {
      onError({
        code: ERROR_CODE.UNKNOWN_PAYCODE,
        message: 'Thiếu thông tin payCode!'
      })
      return false
    } else if (
      params?.payCode &&
      !Object.values(PAY_CODE).includes(params?.payCode)
    ) {
      onError({
        code: ERROR_CODE.UNKNOWN_PAYCODE,
        message: 'Giá trị payCode không hợp lệ!'
      })
      return false
    } else if (
      params?.payCode === PAY_CODE.MOMO ||
      params?.payCode === PAY_CODE.ZALO_PAY
    ) {
      onError({
        code: ERROR_CODE.UNKNOWN_PAYCODE,
        message:
          'Phương thức thanh toán không được hỗ trợ. Vui lòng kiểm tra lại!'
      })
      return false
    }
    return true
  }

  logout = (onSucces, onError) => {
    try {
      localStorage.removeItem('PAYME')
      this.configs = null
      onSucces({ message: 'SUCCEEDED' })
    } catch (error) {
      onError({
        code: ERROR_CODE.SYSTEM,
        message: error.message ?? 'Có lỗi xảy ra!'
      })
    }
  }

  login = async (configs, onSuccess, onError) => {
    this.configs = configs
    const dataLocalStorage = await this.getLocalStorage()
    if (
      dataLocalStorage?.phone === configs?.phone &&
      dataLocalStorage?.userId === configs?.userId &&
      dataLocalStorage?.env.toLowerCase() === configs?.env.toLowerCase()
    ) {
      this.configs = {
        ...this.configs,
        ...dataLocalStorage
      }
      this._webPaymeSDK = new PaymeWebSdk(this.configs)
      onSuccess({ accountStatus: this.configs?.accountStatus })
    } else if (configs?.connectToken) {
      // Check trường hợp account đang login hay không? (Có connectToken có nghĩa là đang login)
      try {
        const keys = {
          env: configs.env,
          publicKey: configs.publicKey,
          privateKey: configs.privateKey,
          accessToken: '',
          appId: configs.appId ?? configs.xApi
        }
        const responseClientRegister = await this.clientRegister(
          {
            deviceId: configs?.clientId ?? configs?.deviceId
          },
          keys
        )
        if (responseClientRegister.status) {
          if (responseClientRegister.response?.Client?.Register?.succeeded) {
            const responseAccountInit = await this.accountInit(
              {
                appToken: configs.appToken,
                connectToken: configs.connectToken,
                clientId:
                  responseClientRegister.response?.Client?.Register?.clientId
              },
              keys
            )
            if (responseAccountInit.status) {
              const accessToken =
                responseAccountInit.response?.OpenEWallet?.Init?.accessToken ??
                ''
              const updateToken =
                responseAccountInit.response?.OpenEWallet?.Init?.updateToken
              let accountStatus = ACCOUNT_STATUS.NOT_ACTIVATED

              if (responseAccountInit.response?.OpenEWallet?.Init?.succeeded) {
                if (
                  responseAccountInit.response?.OpenEWallet?.Init?.kyc &&
                  responseAccountInit.response?.OpenEWallet?.Init?.kyc?.kycId
                ) {
                  if (
                    responseAccountInit.response?.OpenEWallet?.Init?.kyc
                      ?.state === 'APPROVED'
                  ) {
                    accountStatus = ACCOUNT_STATUS.KYC_APPROVED
                  } else if (
                    responseAccountInit.response?.OpenEWallet?.Init?.kyc
                      ?.state === 'PENDING'
                  ) {
                    accountStatus = ACCOUNT_STATUS.KYC_REVIEW
                  } else {
                    accountStatus = ACCOUNT_STATUS.KYC_REJECTED
                  }
                } else {
                  accountStatus = ACCOUNT_STATUS.NOT_KYC
                }
                const newConfigs = {
                  ...this.configs,
                  ...responseAccountInit.response?.OpenEWallet?.Init,
                  accountStatus,
                  phone: configs.phone
                    ? configs.phone
                    : responseAccountInit.response?.OpenEWallet?.Init?.phone ??
                    '',
                  clientId:
                    responseClientRegister.response?.Client?.Register?.clientId
                }
                this.configs = newConfigs
                this._webPaymeSDK = new PaymeWebSdk(newConfigs)
                onSuccess({ accountStatus })
              } else if (!accessToken && updateToken) {
                const newConfigs = {
                  ...this.configs,
                  ...responseAccountInit.response?.OpenEWallet?.Init,
                  accountStatus,
                  phone: configs.phone
                    ? configs.phone
                    : responseAccountInit.response?.OpenEWallet?.Init?.phone ??
                    '',
                  clientId:
                    responseClientRegister.response?.Client?.Register?.clientId
                }
                this.configs = newConfigs
                this._webPaymeSDK = new PaymeWebSdk(newConfigs)
                onSuccess({ accountStatus })
              } else {
                onError({
                  code: ERROR_CODE.SYSTEM,
                  message:
                    responseAccountInit.response?.OpenEWallet?.Init?.message ??
                    'Có lỗi từ máy chủ hệ thống'
                })
              }
            } else {
              if (responseAccountInit.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
                onError({
                  code: ERROR_CODE.EXPIRED,
                  message:
                    responseAccountInit.response[0]?.extensions?.message ??
                    'Thông tin xác thực không hợp lệ'
                })
              } else {
                onError({
                  code: ERROR_CODE.SYSTEM,
                  message:
                    responseAccountInit?.response?.message ??
                    'Có lỗi từ máy chủ hệ thống'
                })
              }
            }
          } else {
            onError({
              code: ERROR_CODE.SYSTEM,
              message:
                responseClientRegister.response?.Client?.Register?.message ??
                'Có lỗi từ máy chủ hệ thống'
            })
          }
        } else {
          if (responseClientRegister.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
            onError({
              code: ERROR_CODE.EXPIRED,
              message:
                responseClientRegister.response[0]?.extensions?.message ??
                'Thông tin xác thực không hợp lệ'
            })
          } else {
            onError({
              code: ERROR_CODE.SYSTEM,
              message:
                responseClientRegister?.response?.message ??
                'Có lỗi từ máy chủ hệ thống'
            })
          }
        }
      } catch (error) {
        onError({
          code: ERROR_CODE.SYSTEM,
          message: error.message ?? 'Có lỗi xảy ra'
        })
      }
    } else {
      onError({
        code: ERROR_CODE.SYSTEM,
        message: 'Thiếu thông tin connectToken'
      })
      localStorage.removeItem('PAYME')
    }
  }

  openWallet = async (onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })
    const iframe = await this._webPaymeSDK?.createOpenWalletURL()
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  openHistory = async (onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })
    const iframe = await this._webPaymeSDK?.createOpenHistoryURL()
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  deposit = async (param, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })

    const iframe = await this._webPaymeSDK?.createDepositURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  withdraw = async (param, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })

    const iframe = await this._webPaymeSDK?.createWithdrawURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  transfer = async (param, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })

    const iframe = await this._webPaymeSDK?.createTransferURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  pay = async (param, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    // check payCode
    const checkPaycode = await this.checkPaycode(
      {
        payCode: param?.payCode
      },
      onError
    )

    if (!checkPaycode) {
      return
    }

    const keys = {
      env: this.configs?.env,
      publicKey: this.configs?.publicKey,
      privateKey: this.configs?.privateKey,
      accessToken: this.configs?.accessToken,
      appId: this.configs?.xApi ?? this.configs?.appId
    }

    const responseGetMerchantInfo = await this.getMerchantInfo(
      {
        storeId: param?.storeId,
        appId: this.configs?.xApi ?? this.configs?.appId
      },
      keys
    )

    if (responseGetMerchantInfo.status) {
      if (
        responseGetMerchantInfo?.response?.OpenEWallet?.GetInfoMerchant
          ?.succeeded
      ) {
        const newConfigs = {
          ...this.configs,
          storeName:
            responseGetMerchantInfo?.response?.OpenEWallet?.GetInfoMerchant
              ?.storeName,
          storeImage:
            responseGetMerchantInfo?.response?.OpenEWallet?.GetInfoMerchant
              ?.storeImage,
          isVisibleHeader:
            responseGetMerchantInfo?.response?.OpenEWallet?.GetInfoMerchant
              ?.isVisibleHeader
        }
        this._webPaymeSDK = new PaymeWebSdk(newConfigs)
      } else {
        onError({
          code: ERROR_CODE.SYSTEM,
          message:
            responseGetMerchantInfo?.response?.OpenEWallet?.GetInfoMerchant
              ?.message ?? 'Có lỗi từ máy chủ hệ thống'
        })
        return
      }
    } else {
      if (responseGetMerchantInfo.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
        onError({
          code: ERROR_CODE.EXPIRED,
          message:
            responseGetMerchantInfo.response[0]?.extensions?.message ??
            'Thông tin xác thực không hợp lệ'
        })
      } else {
        onError({
          code: ERROR_CODE.SYSTEM,
          message:
            responseGetMerchantInfo?.response?.message ??
            'Có lỗi từ máy chủ hệ thống'
        })
      }
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })
    const iframe = await this._webPaymeSDK?.createPayURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  scanQR = async (param, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    // check payCode
    const checkPaycode = await this.checkPaycode(
      {
        payCode: param?.payCode
      },
      onError
    )

    if (!checkPaycode) {
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })

    const iframe = await this._webPaymeSDK?.createScanQR(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  payQRCode = async (param, onSuccess, onError) => {
    // check payCode
    const checkPaycode = await this.checkPaycode(
      {
        payCode: param?.payCode
      },
      onError
    )

    if (!checkPaycode) {
      return
    }

    const keys = {
      env: this.configs?.env,
      publicKey: this.configs?.publicKey,
      privateKey: this.configs?.privateKey,
      accessToken: this.configs?.accessToken,
      appId: this.configs?.xApi ?? this.configs?.appId
    }
    const responseClientRegister = await this.clientRegister(
      {
        deviceId: this.configs?.clientId ?? this.configs?.deviceId
      },
      keys
    )
    if (responseClientRegister.status) {
      if (responseClientRegister.response?.Client?.Register?.succeeded) {
        const response = {
          data: {
            clientId:
              responseClientRegister.response?.Client?.Register?.clientId
          }
        }
        const newConfigs = {
          ...this.configs,
          ...response.data
        }
        this.configs = newConfigs
        this._webPaymeSDK = new PaymeWebSdk(newConfigs)

        const responseQRString = await this.detectQRString(
          {
            clientId:
              responseClientRegister.response?.Client?.Register?.clientId,
            qrContent: param?.qrContent
          },
          keys
        )

        if (responseQRString?.status) {
          if (
            responseQRString?.response?.OpenEWallet?.Payment?.Detect?.succeeded
          ) {
            const payParam = {
              amount:
                responseQRString?.response?.OpenEWallet?.Payment?.Detect
                  ?.amount,
              storeId:
                responseQRString?.response?.OpenEWallet?.Payment?.Detect
                  ?.storeId,
              orderId:
                responseQRString?.response?.OpenEWallet?.Payment?.Detect
                  ?.orderId,
              note:
                responseQRString?.response?.OpenEWallet?.Payment?.Detect?.note,
              userName:
                responseQRString?.response?.OpenEWallet?.Payment?.Detect
                  ?.userName,
              isShowResultUI: param?.isShowResultUI,
              payCode: param?.payCode
            }
            this.pay(payParam, onSuccess, onError)
          } else {
            onError({
              code: ERROR_CODE.SYSTEM,
              message:
                responseQRString.response?.OpenEWallet?.Payment?.Detect
                  ?.message ?? 'Có lỗi từ máy chủ hệ thống'
            })
          }
        } else {
          if (responseQRString.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
            onError({
              code: ERROR_CODE.EXPIRED,
              message:
                responseQRString.response[0]?.extensions?.message ??
                'Thông tin xác thực không hợp lệ'
            })
          } else {
            onError({
              code: ERROR_CODE.SYSTEM,
              message:
                responseQRString?.response?.message ??
                'Có lỗi từ máy chủ hệ thống'
            })
          }
        }
      } else {
        onError({
          code: ERROR_CODE.SYSTEM,
          message:
            responseClientRegister.response?.Client?.Register?.message ??
            'Có lỗi từ máy chủ hệ thống'
        })
      }
    } else {
      if (responseClientRegister.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
        onError({
          code: ERROR_CODE.EXPIRED,
          message:
            responseClientRegister.response[0]?.extensions?.message ??
            'Thông tin xác thực không hợp lệ'
        })
      } else {
        onError({
          code: ERROR_CODE.SYSTEM,
          message:
            responseClientRegister?.response?.message ??
            'Có lỗi từ máy chủ hệ thống'
        })
      }
    }
  }

  getWalletInfo = async (onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }
    try {
      const keys = {
        env: this.configs.env,
        publicKey: this.configs.publicKey,
        privateKey: this.configs.privateKey,
        accessToken: this.configs.accessToken,
        appId: this.configs?.xApi ?? this.configs?.appId
      }
      const responseGetWalletInfo = await this.getWalletInfoAPI({}, keys)
      if (responseGetWalletInfo.status) {
        onSuccess(responseGetWalletInfo.response?.Wallet ?? {})
      } else {
        if (responseGetWalletInfo.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
          onError({
            code: ERROR_CODE.EXPIRED,
            message:
              responseGetWalletInfo.response[0]?.extensions?.message ??
              'Thông tin xác thực không hợp lệ'
          })
        } else {
          onError({
            code: ERROR_CODE.SYSTEM,
            message:
              responseGetWalletInfo?.response?.message ??
              'Có lỗi từ máy chủ hệ thống'
          })
        }
      }
    } catch (error) {
      onError({
        code: ERROR_CODE.SYSTEM,
        message: error.message ?? 'Có lỗi xảy ra'
      })
    }
  }

  getListService = async (onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }
    try {
      const params = {
        appId: this.configs?.xApi ?? this.configs?.appId
      }
      const keys = {
        env: this.configs.env,
        publicKey: this.configs.publicKey,
        privateKey: this.configs.privateKey,
        accessToken: this.configs.accessToken,
        appId: this.configs?.xApi ?? this.configs?.appId
      }
      const responseGetSettingServiceMain = await this.getSettingServiceMain(
        params,
        keys
      )
      if (responseGetSettingServiceMain.status) {
        const service = responseGetSettingServiceMain.response?.Setting?.configs?.filter(
          (itemSetting) => itemSetting?.key === 'service.main.visible'
        )
        const valueStr = service[0]?.value ?? ''
        const list = valueStr ? JSON.parse(valueStr)?.listService : []
        onSuccess(list)
      } else {
        if (
          responseGetSettingServiceMain.response[0]?.extensions?.code === ERROR_CODE.EXPIRED
        ) {
          onError({
            code: ERROR_CODE.EXPIRED,
            message:
              responseGetSettingServiceMain.response[0]?.extensions?.message ??
              'Thông tin xác thực không hợp lệ'
          })
        } else {
          onError({
            code: ERROR_CODE.SYSTEM,
            message:
              responseGetSettingServiceMain?.response?.message ??
              'Có lỗi từ máy chủ hệ thống'
          })
        }
      }
    } catch (error) {
      onError({
        code: ERROR_CODE.SYSTEM,
        message: error.message ?? 'Có lỗi xảy ra'
      })
    }
  }

  getAccountInfo = async (onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }
    try {
      const params = {
        phone: this.configs.phone
      }
      const keys = {
        env: this.configs.env,
        publicKey: this.configs.publicKey,
        privateKey: this.configs.privateKey,
        accessToken: this.configs.accessToken,
        appId: this.configs?.xApi ?? this.configs?.appId
      }
      const responseFindAccount = await this.findAccount(params, keys)
      if (responseFindAccount.status) {
        onSuccess(responseFindAccount.response?.Account ?? {})
      } else {
        if (responseFindAccount.response[0]?.extensions?.code === ERROR_CODE.EXPIRED) {
          onError({
            code: ERROR_CODE.EXPIRED,
            message:
              responseFindAccount.response[0]?.extensions?.message ??
              'Thông tin xác thực không hợp lệ'
          })
        } else {
          onError({
            code: ERROR_CODE.SYSTEM,
            message:
              responseFindAccount?.response?.message ??
              'Có lỗi từ máy chủ hệ thống'
          })
        }
      }
    } catch (error) {
      onError({
        code: ERROR_CODE.SYSTEM,
        message: error.message ?? 'Có lỗi xảy ra'
      })
    }
  }

  openService = async (serviceCode, onSuccess, onError) => {
    const checkLogin = await this.checkIsLogin()
    if (!checkLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE.KYC_NOT_APPROVED,
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true }
    })

    const iframe = await this._webPaymeSDK?.createOpenServiceURL(serviceCode)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  // getListPaymentMethod = async (param, onSuccess, onError) => {
  //   const checkLogin = await this.checkIsLogin()
  // if(!checkLogin) {
  //     onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
  //     return
  //   }

  //   // if (!this._checkActiveAndKyc()) {
  //   //   onError({
  //   //     code: ERROR_CODE.KYC_NOT_APPROVED,
  //   //     message: this.configs.accountStatus
  //   //   })
  //   //   return
  //   // }

  //   try {
  //     const params = {
  //       storeId: param?.storeId
  //     }
  //     const keys = {
  //       env: this.configs.env,
  //       publicKey: this.configs.publicKey,
  //       privateKey: this.configs.privateKey,
  //       accessToken: this.configs.accessToken,
  //       appId: this.configs?.xApi ?? this.configs?.appId
  //     }
  //     const responseGetPaymentMethod = await this.getPaymentMethod(params, keys)
  //     if (responseGetPaymentMethod.status) {
  //       if (
  //         responseGetPaymentMethod.response?.Utility?.GetPaymentMethod
  //           ?.succeeded
  //       ) {
  //         onSuccess(
  //           responseGetPaymentMethod.response?.Utility?.GetPaymentMethod
  //             ?.methods ?? []
  //         )
  //       } else {
  //         onError({
  //           code: ERROR_CODE.EXPIRED,
  //           message:
  //             responseGetPaymentMethod.response?.Utility?.GetPaymentMethod
  //               ?.message ?? 'Có lỗi từ máy chủ hệ thống'
  //         })
  //       }
  //     } else {
  //       if (responseGetPaymentMethod.response[0]?.extensions?.code === 401) {
  //         onError({
  //           code: ERROR_CODE.EXPIRED,
  //           message:
  //             responseGetPaymentMethod.response[0]?.extensions?.message ??
  //             'Thông tin xác thực không hợp lệ'
  //         })
  //       } else {
  //         onError({
  //           code: ERROR_CODE.SYSTEM,
  //           message: 'Có lỗi từ máy chủ hệ thống'
  //         })
  //       }
  //     }
  //   } catch (error) {
  //     onError({
  //       code: ERROR_CODE.SYSTEM,
  //       message: error.message ?? 'Có lỗi xảy ra'
  //     })
  //   }
  // }

  render() {
    const { iframeVisible } = this.state
    const styleVisible = this.propStyle
      ? this.propStyle
      : {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }

    const containerStyleVisible = {
      display: 'block',
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)'
    }

    if (!iframeVisible.state) return null

    return this.overlayBackground ? (
      <div style={{ ...containerStyleVisible }}>
        <div style={{ ...styleVisible }} id={this.id} />
      </div>
    ) : (
      <div style={{ ...styleVisible }} id={this.id} />
    )
  }
}
class PaymeWebSdk {
  WALLET_ACTIONS = {
    LOGIN: 'LOGIN',
    GET_WALLET_INFO: 'GET_WALLET_INFO',
    GET_ACCOUNT_INFO: 'GET_ACCOUNT_INFO',
    OPEN_WALLET: 'OPEN_WALLET',
    OPEN_HISTORY: 'OPEN_HISTORY',
    WITHDRAW: 'WITHDRAW',
    DEPOSIT: 'DEPOSIT',
    TRANSFER: 'TRANSFER',
    GET_LIST_SERVICE: 'GET_LIST_SERVICE',
    UTILITY: 'UTILITY',
    GET_LIST_PAYMENT_METHOD: 'GET_LIST_PAYMENT_METHOD',
    PAY: 'PAY',
    SCAN_QR_CODE: 'SCAN_QR_CODE'
  }

  ENV = {
    dev: 'dev',
    sandbox: 'sandbox',
    staging: 'staging',
    production: 'production'
  }

  constructor(configs, settings) {
    this.saveLocalStorage(configs)
    this.configs = configs
    this.domain = this.getDomain(configs.env.toLowerCase())
  }

  async saveLocalStorage(configs) {
    const encrypted = await this.encrypt(configs)
    localStorage.setItem('PAYME', encrypted)
  }

  getDomain(env) {
    switch (env) {
      case this.ENV.dev:
        return 'https://dev-sdk.payme.com.vn'
      case this.ENV.sandbox:
        return 'https://sbx-sdk.payme.com.vn'
      case this.ENV.staging:
        return 'https://staging-sdk.payme.com.vn'
      case this.ENV.production:
        return 'https://sdk.payme.com.vn'
      default:
        return 'https://sbx-sdk.payme.com.vn'
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = reject
      script.src = src
      document.head.append(script)
    })
  }

  encrypt(text) {
    const secretKey = 'CMo359Lqx16QYi3x'
    return this.loadScript(
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

  async createLoginURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.LOGIN
      }
    }

    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createOpenWalletURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.OPEN_WALLET
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createOpenHistoryURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.OPEN_HISTORY
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createDepositURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.DEPOSIT,
        amount: param.amount,
        closeWhenDone: param?.closeWhenDone
      }
    }

    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createWithdrawURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.WITHDRAW,
        amount: param.amount,
        closeWhenDone: param?.closeWhenDone
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createTransferURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.TRANSFER,
        amount: param.amount,
        description: param.description,
        closeWhenDone: param?.closeWhenDone
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createScanQR(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.SCAN_QR_CODE,
        payCode: param?.payCode
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createPayURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.PAY,
        amount: param.amount,
        orderId: param.orderId,
        storeId: param.storeId,
        note: param.note,
        userName: param.userName,
        isShowResultUI: param.isShowResultUI,
        payCode: param.payCode
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createGetListServiceURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.GET_LIST_SERVICE
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  // async createGetListPaymentMethodURL(param) {
  //   const configs = {
  //     ...this.configs,
  //     actions: {
  //       type: this.WALLET_ACTIONS.GET_LIST_PAYMENT_METHOD,
  //       storeId: param.storeId
  //     }
  //   }
  //   const encrypt = await this.encrypt(configs)

  //   return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  // }

  async createOpenServiceURL(serviceCode) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.UTILITY,
        serviceCode
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }
}
