// Gatsby loader shim
global.___loader = {
  enqueue: jest.fn(),
}

// Environment variables
process.env.GATSBY_COGNITO_APP_CLIENT_ID = 'somereallylongvalue1111'
process.env.GATSBY_COGNITO_USER_POOL_ID = 'us-east_clientId'
process.env.GATSBY_IDENTITY_POOL_ID = 'us-east-2:654rertyujkjhgfr678ijkhgf6y'
process.env.GATSBY_JOKE_API_BASE_URL = 'http://localhost'
process.env.GATSBY_JOKE_API_FETCH_COUNT = 3

window.URL.createObjectURL = jest.fn()
