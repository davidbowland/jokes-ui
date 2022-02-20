declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GATSBY_COGNITO_APP_CLIENT_ID: string
      GATSBY_COGNITO_USER_POOL_ID: string
      GATSBY_IDENTITY_POOL_ID: string
      GATSBY_JOKE_API_BASE_URL: string
      GATSBY_JOKE_API_FETCH_COUNT: number
      GATSBY_PINPOINT_ID: string
    }
  }
}

export {}
