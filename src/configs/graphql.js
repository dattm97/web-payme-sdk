
/**
 * query graphql
 *
 */
export const SQL_CLIENT_REGISTER = `mutation ClientRegister ($clientRegisterInput: ClientRegisterInput!){
    Client {
    Register(input: $clientRegisterInput) {
      succeeded
      message
      clientId
    }
  }
}`

export const SQL_INIT_ACCOUNT = `mutation AccountInitMutation($initInput: CheckInitInput) {
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

export const SQL_GET_BALANCE = `query Query {
  Wallet {
    balance
    cash
    lockCash
  }
}`

export const SQL_FIND_ACCOUNT = `query Query($accountPhone: String) {
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

export const SQL_SETTING = `query Query ($configsTags: String, $configsAppId: String, $configsKeys: [String]){
  Setting {
    configs (tags: $configsTags, appId: $configsAppId, keys: $configsKeys){
      key
      value
      tags
    }
  }
}`

export const SQL_PAYMENT_MEHTOD = `mutation Mutation($PaymentMethodInput: PaymentMethodInput) {
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

export const SQL_GET_MERCHANT_INFO = `mutation Mutation($getInfoMerchantInput: OpenEWalletGetInfoMerchantInput!) {
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

export const SQL_DETECT_QR_CODE = `mutation DetectDataQRCode($input: OpenEWalletPaymentDetectInput!) {
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
