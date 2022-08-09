export const WALLET_ACTIONS = {
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

export const ENV = {
  dev: 'dev',
  sandbox: 'sandbox',
  staging: 'staging',
  production: 'production'
}

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

export const ACCOUNT_STATUS = {
  NOT_ACTIVATED: 'NOT_ACTIVATED',
  NOT_KYC: 'NOT_KYC',
  KYC_APPROVED: 'KYC_APPROVED',
  KYC_REVIEW: 'KYC_REVIEW',
  KYC_REJECTED: 'KYC_REJECTED'
}
