import {
  GRAPHQL_DEV,
  GRAPHQL_PRODUCTION,
  GRAPHQL_SANBOX,
  GRAPHQL_STAGING
} from '../configs/api'
import { ENV } from '../constant'

export const getDomain = (env) => {
  switch (env) {
    case ENV.dev:
      return 'https://dev-sdk.payme.com.vn'
    case ENV.sandbox:
      return 'https://sbx-sdk.payme.com.vn'
    case ENV.staging:
      return 'https://staging-sdk.payme.com.vn'
    case ENV.production:
      return 'https://sdk.payme.com.vn'
    default:
      return 'https://sbx-sdk.payme.com.vn'
  }
}

export const getDomainAPI = (env) => {
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
