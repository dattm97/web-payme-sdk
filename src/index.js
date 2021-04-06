/* eslint-disable no-undef */
import React, { Component } from 'react'

export const ERROR_CODE = {
  EXPIRED: 401,
  NETWORK: -1,
  SYSTEM: -2,
  LITMIT: -3,
  ACCOUNT_NOT_ACTIVITIES: -4,
  ACCOUNT_NOT_KYC: -5,
  PAYMENT_ERROR: -6,
  ERROR_KEY_ENCODE: -7,
  USER_CANCELLED: -8
}

export const AccountStatus = {
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

export default class WebPaymeSDK extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iframeVisible: { state: false, hidden: false }, // Biến dùng để bật tắt iFreame
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }
    this.id = 'paymeId'
    this.configs = {}
    this.isLogin = false
    this._webPaymeSDK = null

    window.onmessage = (e) => {
      if (e.data.type === WALLET_ACTIONS.LOGIN) {
        if (e.data?.data) {
          const newConfigs = {
            ...this.configs,
            ...e.data.data
          }
          this.configs = newConfigs
          /* eslint-disable no-undef */
          this._webPaymeSDK = new PaymeWebSdk(newConfigs)
          this.isLogin = true
          this.sendRespone(e.data)
        }
      }
      if (e.data?.type === WALLET_ACTIONS.GET_WALLET_INFO) {
        this.sendRespone(e.data)
      }
      if (e.data?.type === 'onClose') {
        document.getElementById(this.id).innerHTML = ''
        this.setState({
          iframeVisible: { state: false, hidden: false }
        })
      }
      if (e.data?.type === 'error') {
        this.sendRespone(e.data)
      }
      if (e.data?.type === WALLET_ACTIONS.GET_ACCOUNT_INFO) {
        this.sendRespone(e.data)
      }
      if (e.data?.type === WALLET_ACTIONS.GET_LIST_SERVICE) {
        this.sendRespone(e.data)
      }
      if (e.data?.type === WALLET_ACTIONS.PAY) {
        this.sendRespone(e.data)
      }
      if (e.data?.type === WALLET_ACTIONS.GET_LIST_PAYMENT_METHOD) {
        this.sendRespone(e.data)
      }
    }
  }

  sendRespone = (data) => {
    if (data?.error) {
      if (this._onError) this._onError(data?.error)
      this._onError = null
    } else {
      if (this._onSuccess) this._onSuccess(data)
      this._onSuccess = null
    }
  }

  handleResize = (e) => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.handleResize)
  }

  _checkActiveAndKyc = () => {
    if (this.configs?.accountStatus !== 'KYC_OK') {
      alert(this.configs?.accountStatus)
      return false
    }
    return true
  }

  openIframe = (link) => {
    const ifrm = document.createElement('iframe')

    ifrm.setAttribute(`src`, link)
    ifrm.style.width = '100%'
    ifrm.style.height = '100%'
    ifrm.style.position = 'absolute'
    ifrm.style.top = 0
    ifrm.style.left = 0
    ifrm.style.right = 0
    ifrm.style.bottom = 0
    ifrm.style.border = 0
    ifrm.allow = 'camera *'
    ifrm.allowFullscreen = true
    const element = document.getElementById(this.id)
    element && element.appendChild(ifrm)
  }

  openHiddenIframe = (link) => {
    const div = document.createElement('div')
    const ifrm = document.createElement('iframe')

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

  openWallet = async () => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: false }
    })
    const iframe = await this._webPaymeSDK.createOpenWalletURL()
    this.openIframe(iframe)
  }

  deposit = async (param) => {
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

    const iframe = await this._webPaymeSDK.createDepositURL(param)
    this.openIframe(iframe)
  }

  withdraw = async (param) => {
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

    const iframe = await this._webPaymeSDK.createWithdrawURL(param)
    this.openIframe(iframe)
  }

  pay = async (param, onSuccess, onError) => {
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

    const iframe = await this._webPaymeSDK.createPayURL(param)
    this.openIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  getBalance = async (onSuccess, onError) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError(this.configs.accountStatus)
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
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError(this.configs.accountStatus)
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
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError(this.configs.accountStatus)
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

  openService = async () => {
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

    const iframe = await this._webPaymeSDK.createOpenServiceURL('HOCPHI')
    this.openIframe(iframe)
  }

  getListPaymentMethod = async (onSuccess, onError) => {
    if (!this.isLogin) {
      alert('NOT LOGIN')
      return
    }

    if (!this._checkActiveAndKyc()) {
      onError(this.configs.accountStatus)
      return
    }

    this.setState({
      iframeVisible: { state: true, hidden: true }
    })
    const iframe = await this._webPaymeSDK.createGetListPaymentMethodURL()
    this.openHiddenIframe(iframe)

    this._onSuccess = onSuccess
    this._onError = onError
  }

  render() {
    const { iframeVisible, windowWidth, windowHeight } = this.state
    const { hidden } = iframeVisible
    const styleVisible = {
      position: 'absolute',
      width: '100%',
      left: 0,
      overflow: 'hidden'
    }

    const styleHidden = {
      display: 'none'
    }

    const style = hidden ? styleHidden : styleVisible

    if (!iframeVisible.state) return null
    return (
      <div
        style={{
          ...style,
          paddingTop: `${(windowHeight / windowWidth) * 100}%`
        }}
        id={this.id}
      />
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
    this.dimension = {
      width: settings?.width || `${window.innerWidth}px`,
      height: settings?.height || `${window.innerHeight}px`
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
}
