// Microservice Security Url's API Restful Users
export const BASE_API_SECURITY_URL = 'http://localhost:3000/api'
export const USER_API_SECURITY_URL = `${BASE_API_SECURITY_URL}/users`

// Microservice Security Url's API Restful Login
export const LOGIN_API_SECURITY_URL = `${USER_API_SECURITY_URL}/login`

// Microservice Security Url's API Restful Reset
export const RESET_API_SECURITY_URL = `${BASE_API_SECURITY_URL}/recoverPassword`
export const VALIDATE_API_SECURITY_URL = `${RESET_API_SECURITY_URL}/validate`

// Token key name in localStorage
export const TOKEN_KEY_NAME = 'authToken'
