declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COGNITO_APP_CLIENT_ID: string
      COGNITO_USER_POOL_ID: string
      JOKE_API_BASE_URL: string
      JOKE_API_FETCH_COUNT: number
    }
  }
}

export {}
