/* eslint-disable no-undef */
import React, { Component } from 'react'
// import { PaymeWebSdk } from './PaymeSDK'

export default class WebPaymeSDK extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iframeVisible: { state: false, hidden: false } // Biến dùng để bật tắt iFreame
    }
    this.configs = {}
    this.isLogin = false
    this._webPaymeSDK = null
  }

  _checkActiveAndKyc = () => {
    if (this.configs?.accountStatus !== 'KYC_OK') {
      alert(this.configs?.accountStatus)
      return false
    }
    return true
  }

  login = (configs, callback) => {
    this.configs = configs
    // eslint-disable-next-line no-undef
    this._webPaymeSDK = new PaymeWebSdk(configs, { id: 'paymeId' })

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this._webPaymeSDK
      .login()
      .then((res) => {
        if (res) {
          const newConfigs = {
            ...this.configs,
            ...res
          }
          this.configs = newConfigs
          // eslint-disable-next-line no-undef
          this._webPaymeSDK = new PaymeWebSdk(newConfigs, { id: 'paymeId' })
          this.isLogin = true
        }
        console.log('ressss', res)
        callback(res)
      })
      .catch((err) => console.log(err))
  }

  openWallet = () => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    this._webPaymeSDK
      .openWallet()
      .then((res) => {
        console.log('ressss', res)
        if (res.type === 'onClose') {
          this.setState({
            iframeVisible: { state: false, hidden: false }
          })
        }
      })
      .catch((err) => console.log(err))
  }

  deposit = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    this._webPaymeSDK
      .deposit(param)
      .then((res) => {
        if (res.type === 'onClose') {
          this.setState({
            iframeVisible: { state: false, hidden: false }
          })
        }
      })
      .catch((err) => console.log(err))
  }

  withdraw = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    this._webPaymeSDK
      .withdraw(param)
      .then((res) => {
        if (res.type === 'onClose') {
          this.setState({
            iframeVisible: { state: false, hidden: false }
          })
        }
      })
      .catch((err) => console.log(err))
  }

  pay = (param) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    this._webPaymeSDK
      .pay(param)
      .then((res) => {
        if (res.type === 'onClose') {
          this.setState({
            iframeVisible: { state: false, hidden: false }
          })
        }
      })
      .catch((err) => console.log(err))
  }

  getBalance = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this._webPaymeSDK
      .getBalance()
      .then((res) => callback(res))
      .catch((err) => console.log(err))
  }

  getListService = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this._webPaymeSDK
      .getListService()
      .then((res) => callback(res))
      .catch((err) => console.log(err))
  }

  getAccountInfo = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this._webPaymeSDK
      .getAccountInfo()
      .then((res) => callback(res))
      .catch((err) => console.log(err))
  }

  openService = () => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })

    this._webPaymeSDK
      .openService('HOCPHI')
      .then((res) => {
        if (res.type === 'onClose') {
          this.setState({
            iframeVisible: { state: false, hidden: false }
          })
        }
      })
      .catch((err) => console.log(err))
  }

  getListPaymentMethod = (callback) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })

    this._webPaymeSDK
      .getListPaymentMethod()
      .then((res) => callback(res))
      .catch((err) => console.log(err))
  }

  render() {
    const { iframeVisible } = this.state
    const { hidden } = iframeVisible
    const styleVisible = {
      display: 'block',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      with: '100%',
      height: '100%'
    }

    const styleHidden = {
      display: 'none'
    }

    if (!iframeVisible.state) return null
    return <div style={hidden ? styleHidden : styleVisible} id='paymeId' />
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
    this.id = settings.id
    this.dimension = {
      width: settings.width || `${window.innerWidth}px`,
      height: settings.height || `${window.innerHeight}px`
    }
    this.domain = this.getDomain(configs.env)
  }

  getDomain(env) {
    switch (env) {
      case this.ENV.dev:
        return 'https://sbx-sdk2.payme.com.vn'
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
        description: param.description,
        extraData: param.extraData
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
        description: param.description,
        extraData: param.extraData
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
        note: param.note
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

  async createGetListPaymentMethodURL() {
    const configs = {
      ...this.configs,
      actions: {
        type: this.WALLET_ACTIONS.GET_LIST_PAYMENT_METHOD
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

  openIframe(link) {
    const ifrm = document.createElement('iframe')

    ifrm.setAttribute(`src`, link)
    ifrm.style.width = this.dimension.width
    ifrm.style.height = this.dimension.height
    ifrm.frameBorder = '0'
    ifrm.allow = 'camera *'
    ifrm.allowFullscreen = true
    const element = document.getElementById(this.id)
    element && element.appendChild(ifrm)
  }

  hideIframe(link) {
    const div = document.createElement('div')
    const ifrm = document.createElement('iframe')

    div.style.visibility = 'hidden'
    div.style.display = 'block'
    div.style.width = '0px'
    div.style.height = '0px'

    ifrm.setAttribute(`src`, link)
    ifrm.style.width = '0px'
    ifrm.style.height = '0px'
    ifrm.frameBorder = '0'
    const element = document.getElementById(this.id)
    div.appendChild(ifrm)
    element && element.appendChild(div)
  }

  login() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createLoginURL()
      this.hideIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'LOGIN') {
          const data = e.data.data
          resolve(data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  openWallet() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createOpenWalletURL()
      console.log('iframe===', iframe)
      this.openIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'onClose') {
          resolve(e.data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  withdraw(configs) {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createWithdrawURL(configs)
      this.openIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'onClose') {
          resolve(e.data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  deposit(configs) {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createDepositURL(configs)
      this.openIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'onClose') {
          resolve(e.data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  pay(configs) {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createPayURL(configs)
      this.openIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'onClose') {
          resolve(e.data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  getBalance() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createGetBalanceURL()
      this.hideIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'GET_WALLET_INFO') {
          const data = e.data.data
          resolve(data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  getListService() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createGetListServiceURL()
      this.hideIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'GET_LIST_SERVICE') {
          const data = e.data.data
          resolve(data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  getListPaymentMethod() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createGetListPaymentMethodURL()
      this.hideIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'GET_LIST_PAYMENT_METHOD') {
          const data = e.data.data
          resolve(data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  getAccountInfo() {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createGetAccountInfoURL()
      this.hideIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'GET_ACCOUNT_INFO') {
          const data = e.data.data
          resolve(data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  openService(configs) {
    return new Promise(async (resolve, reject) => {
      const id = this.id
      const iframe = await this.createOpenServiceURL(configs)
      this.openIframe(iframe)

      window.onmessage = function (e) {
        if (e.data.type === 'onClose') {
          resolve(e.data)
          document.getElementById(id).innerHTML = ''
        }
      }
    })
  }

  onMessage(onEvent) {
    window.onmessage = function (e) {
      onEvent(e.data)
    }
  }
}
