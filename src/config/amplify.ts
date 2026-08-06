import { Amplify } from 'aws-amplify'

const appClientId = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
const identityPoolId = process.env.NEXT_PUBLIC_IDENTITY_POOL_ID
export const baseUrl = process.env.NEXT_PUBLIC_JOKE_API_BASE_URL

// Authorization

export const apiName = 'JokesAPIGateway'
export const apiNameUnauthenticated = 'JokesAPIGatewayUnauthenticated'

Amplify.configure({
  API: {
    REST: {
      [apiName]: {
        endpoint: baseUrl,
        region: userPoolId.split('_')[0],
      },
      [apiNameUnauthenticated]: {
        endpoint: baseUrl,
        region: userPoolId.split('_')[0],
      },
    },
  },
  Auth: {
    Cognito: {
      // v5's `mandatorySignIn: false` is spelled `allowGuestAccess: true` in v6 (see
      // parseAWSExports' `allowGuestAccess: aws_mandatory_sign_in !== 'enable'`). Omitting it
      // would silently switch guest access off and stop issuing identity-pool credentials to
      // signed-out visitors.
      allowGuestAccess: true,
      identityPoolId,
      userPoolClientId: appClientId,
      userPoolId,
    },
  },
})
