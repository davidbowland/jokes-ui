// Environment variables
process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID = 'somereallylongvalue1111'
process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID = 'us-east_clientId'
process.env.NEXT_PUBLIC_IDENTITY_POOL_ID = 'us-east-2:654rertyujkjhgfr678ijkhgf6y'
process.env.NEXT_PUBLIC_JOKE_API_BASE_URL = 'http://localhost'
process.env.NEXT_PUBLIC_JOKE_API_FETCH_COUNT = 3

window.URL.createObjectURL = jest.fn()
