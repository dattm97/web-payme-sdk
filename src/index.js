/* eslint-disable no-undef */
import React, { Component } from 'react'

export const ERROR_CODE = {
  EXPIRED: 401,
  NETWORK: -1,
  SYSTEM: -2,
  LITMIT: -3,
  NOT_ACTIVED: -4,
  NOT_KYC: -5,
  PAYMENT_ERROR: -6,
  ERROR_KEY_ENCODE: -7,
  USER_CANCELLED: -8,
  NOT_LOGIN: -9,
  CLOSE_IFRAME: -10,
  BALANCE_ERROR: -11
}

const ACCOUNT_STATUS = {
  NOT_ACTIVED: 'NOT_ACTIVED',
  NOT_KYC: 'NOT_KYC',
  KYC_OK: 'KYC_OK'
}

export const LANGUAGES = {
  VN: 'VN',
  EN: 'EN'
}

const WALLET_ACTIONS = {
  LOGIN: 'LOGIN',
  RELOGIN: 'RELOGIN',
  GET_WALLET_INFO: 'GET_WALLET_INFO',
  GET_ACCOUNT_INFO: 'GET_ACCOUNT_INFO',
  OPEN_WALLET: 'OPEN_WALLET',
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT',
  TRANSFER: 'TRANSFER',
  GET_LIST_SERVICE: 'GET_LIST_SERVICE',
  OPEN_SERVICE: 'OPEN_SERVICE',
  UTILITY: 'UTILITY',
  GET_LIST_PAYMENT_METHOD: 'GET_LIST_PAYMENT_METHOD',
  PAY: 'PAY'
}

const METHOD_TYPE = {
  PAYME: 'PAYME',
  PAYME_CREDIT: 'PAYME_CREDIT',
  WALLET: 'WALLET',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
  BANK_CARD: 'BANK_CARD',
  BANK_CARD_PG: 'BANK_CARD_PG',
  BANK_TRANSFER: 'BANK_TRANSFER',
  ATM_CARD: 'ATM_CARD',
  GATEWAY: 'GATEWAY',
  CREDIT_CARD: 'CREDIT_CARD',
  LINKED: 'LINKED',
  BANK_QR_CODE: 'BANK_QR_CODE',
  LINKED_BANK: 'LINKED_BANK',
  LINKED_BANK_PVCBANK: 'LINKED_BANK_PVCBANK',
  LINKED_BANK_OCBBANK: 'LINKED_BANK_OCBBANK',
  LINKED_GATEWAY: 'LINKED_GATEWAY'
}

export default class WebPaymeSDK extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iframeVisible: { state: false, hidden: false } // Biến dùng để bật tắt iFreame
    }
    this.id = 'paymeId'
    this.configs = {}
    this.propStyle = props.propStyle
    this.overlayBackground = props?.overlayBackground ?? false

    this.isLogin = false
    this._webPaymeSDK = null
    this._iframe = null

    window.onmessage = (e) => {
      if (e.data.type === WALLET_ACTIONS.LOGIN) {
        this.onCloseIframe()
        if (e.data?.data) {
          const newConfigs = {
            ...this.configs,
            ...e.data.data
          }
          this.configs = newConfigs
          /* eslint-disable no-undef */
          this._webPaymeSDK = new PaymeWebSdk(newConfigs)
          this.isLogin = true
        }
        const res = {
          ...e.data,
          data: { accountStatus: e.data?.data?.accountStatus }
        }

        this.sendRespone(res)
      }
      if (e.data.type === WALLET_ACTIONS.RELOGIN) {
        if (e.data?.data) {
          const newConfigs = {
            ...this.configs,
            ...e.data.data
          }
          this.configs = newConfigs
          /* eslint-disable no-undef */
          this._webPaymeSDK = new PaymeWebSdk(newConfigs)
          this.isLogin = true
        }
      }
      if (e.data?.type === WALLET_ACTIONS.GET_WALLET_INFO) {
        this.onCloseIframe()
        this.sendRespone(e.data)
      }
      if (e.data?.type === 'onClose') {
        document.getElementById(this.id).innerHTML = ''
        this.onCloseIframe()
        this.sendRespone({
          error: { code: ERROR_CODE.CLOSE_IFRAME, message: 'Đóng iframe' }
        })
      }
      if (e.data?.type === 'error') {
        if (e.data?.code === 401) {
          this.onCloseIframe()
          this.isLogin = false
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
      if (e.data?.type === 'onDeposit' || e.data?.type === 'onWithDraw') {
        this.onCloseIframe()
        const res = { ...e.data }
        if (e.data?.data?.status === 'FAILED') {
          res.error = e.data?.data
        }
        this.sendRespone(res)
      }
    }
  }

  onCloseIframe = () => {
    this.setState(
      {
        iframeVisible: { state: false, hidden: false }
      },
      () => this._iframe?.remove()
    )
  }

  sendRespone = (data) => {
    if (data?.error) {
      if (this._onError) this._onError(data?.error)
    } else if (data?.code === 401) {
      if (this._onError) this._onError(data)
    } else {
      if (this._onSuccess) this._onSuccess(data)
    }
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
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts', true)
    xhr.send()
  }

  _checkActiveAndKyc = () => {
    if (this.configs?.accountStatus !== 'KYC_OK') {
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
        ifrm.style.width = '100%'
        ifrm.style.height = '100%'
        ifrm.style.position = 'relative'
        ifrm.style.top = 0
        ifrm.style.left = 0
        ifrm.style.right = 0
        ifrm.style.bottom = 0
        ifrm.style.border = 0
        ifrm.allow = 'camera *;microphone *'
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

  login = async (configs, onSuccess, onError) => {
    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this.configs = configs
    // eslint-disable-next-line no-undef
    this._webPaymeSDK = new PaymeWebSdk(configs)
    const iframe = await this._webPaymeSDK.createLoginURL()
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  openWallet = async (onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })
    const iframe = await this._webPaymeSDK.createOpenWalletURL()
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  deposit = async (param, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    const iframe = await this._webPaymeSDK.createDepositURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  withdraw = async (param, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    const iframe = await this._webPaymeSDK.createWithdrawURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  transfer = async (param, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    const iframe = await this._webPaymeSDK.createTransferURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  pay = async (param, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    // if (!this._checkActiveAndKyc()) {
    //   onError({
    //     code: ERROR_CODE[this.configs.accountStatus],
    //     message: this.configs.accountStatus
    //   })
    //   return
    // }

    // switch (param?.method?.type) {
    //   case METHOD_TYPE.WALLET: {
    //     if (this.configs.accountStatus === ACCOUNT_STATUS.NOT_ACTIVED) {
    //       onError({
    //         code: ERROR_CODE.NOT_ACTIVED,
    //         message: 'Tài khoản chưa được active!'
    //       })
    //     } else if (this.configs.accountStatus === ACCOUNT_STATUS.NOT_KYC) {
    //       onError({
    //         code: ERROR_CODE.NOT_KYC,
    //         message: 'Tài khoản chưa được định danh!'
    //       })
    //     } else {
    //       this.getBalance(
    //         (res) => {
    //           if (res?.data?.balance < param.amount) {
    //             onError({
    //               code: ERROR_CODE.BALANCE_ERROR,
    //               message: 'Số dư ví PayME không đủ!'
    //             })
    //           }
    //         },
    //         (err) => {
    //           onError({
    //             code: ERROR_CODE.SYSTEM,
    //             message: err?.message ?? 'Có lỗi xảy ra'
    //           })
    //         }
    //       )
    //     }
    //     break
    //   }
    //   default:
    //     break
    // }

    if (param?.method?.type === METHOD_TYPE.WALLET) {
      if (this.configs.accountStatus === ACCOUNT_STATUS.NOT_ACTIVED) {
        onError({
          code: ERROR_CODE.NOT_ACTIVED,
          message: 'Tài khoản chưa được active!'
        })
      } else if (this.configs.accountStatus === ACCOUNT_STATUS.NOT_KYC) {
        onError({
          code: ERROR_CODE.NOT_KYC,
          message: 'Tài khoản chưa được định danh!'
        })
      } else {
        this.getBalance(
          (res) => {
            if (res?.data?.balance < param.amount) {
              onError({
                code: ERROR_CODE.BALANCE_ERROR,
                message: 'Số dư ví PayME không đủ!'
              })
            }
          },
          (err) => {
            onError({
              code: ERROR_CODE.SYSTEM,
              message: err?.message ?? 'Có lỗi xảy ra'
            })
          }
        )
      }
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    const iframe = await this._webPaymeSDK.createPayURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  getBalance = async (onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }
    this.setState({
      iframeVisible: { state: true, hidden: true }
    })
    const iframe = await this._webPaymeSDK.createGetBalanceURL()
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  getListService = async (onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })
    const iframe = await this._webPaymeSDK.createGetListServiceURL()
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  getAccountInfo = async (onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })
    const iframe = await this._webPaymeSDK.createGetAccountInfoURL()
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  openService = async (serviceCode, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError({
        code: ERROR_CODE[this.configs.accountStatus],
        message: this.configs.accountStatus
      })
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    const iframe = await this._webPaymeSDK.createOpenServiceURL(serviceCode)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  getListPaymentMethod = async (param, onSuccess, onError) => {
    if (!this.isLogin) {
      onError({ code: ERROR_CODE.NOT_LOGIN, message: 'NOT LOGIN' })
      return
    }

    // if (!this._checkActiveAndKyc()) {
    //   onError({
    //     code: ERROR_CODE[this.configs.accountStatus],
    //     message: this.configs.accountStatus
    //   })
    //   return
    // }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })
    const iframe = await this._webPaymeSDK.createGetListPaymentMethodURL(param)
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  render() {
    const { iframeVisible } = this.state
    const { hidden } = iframeVisible
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

    const styleHidden = {
      display: 'none'
    }

    const containerStyleHidden = {
      ...containerStyleVisible,
      display: 'none'
    }

    const style = hidden ? styleHidden : styleVisible
    const containerStyle = hidden ? containerStyleHidden : containerStyleVisible

    if (!iframeVisible.state) return null

    return this.overlayBackground ? (
      <div style={{ ...containerStyle }}>
        <div style={{ ...style }} id={this.id} />
      </div>
    ) : (
      <div style={{ ...style }} id={this.id} />
    )
  }
}
class PaymeWebSdk {
  WALLET_ACTIONS = {
    LOGIN: 'LOGIN',
    GET_WALLET_INFO: 'GET_WALLET_INFO',
    GET_ACCOUNT_INFO: 'GET_ACCOUNT_INFO',
    OPEN_WALLET: 'OPEN_WALLET',
    WITHDRAW: 'WITHDRAW',
    DEPOSIT: 'DEPOSIT',
    TRANSFER: 'TRANSFER',
    GET_LIST_SERVICE: 'GET_LIST_SERVICE',
    UTILITY: 'UTILITY',
    GET_LIST_PAYMENT_METHOD: 'GET_LIST_PAYMENT_METHOD',
    PAY: 'PAY'
  }

  ENV = {
    dev: 'dev',
    sandbox: 'sandbox',
    production: 'production'
  }

  constructor(configs, settings) {
    this.configs = configs
    this.domain = this.getDomain(configs.env)
  }

  getDomain(env) {
    switch (env) {
      case this.ENV.dev:
        return 'https://dev-sdk.payme.com.vn'
      case this.ENV.sandbox:
        return 'https://sbx-sdk.payme.com.vn'
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

  async createGetBalanceURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.GET_WALLET_INFO
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

  async createPayURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.PAY,
        amount: param.amount,
        orderId: param.orderId,
        storeId: param.storeId,
        note: param.note,
        method: param.method,
        isShowResultUI: param.isShowResultUI
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

  async createGetAccountInfoURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.GET_ACCOUNT_INFO
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

  async createGetListPaymentMethodURL(param) {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.GET_LIST_PAYMENT_METHOD,
        storeId: param.storeId
      }
    }
    const encrypt = await this.encrypt(configs)

    return this.domain + '/getDataWithAction/' + encodeURIComponent(encrypt)
  }

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
