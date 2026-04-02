declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_COGNITO_APP_CLIENT_ID: string
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: string
      NEXT_PUBLIC_IDENTITY_POOL_ID: string
      NEXT_PUBLIC_JOKE_API_BASE_URL: string
      NEXT_PUBLIC_JOKE_API_FETCH_COUNT: number
    }
  }
}

export {}
