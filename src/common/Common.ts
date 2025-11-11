// Microservice Security Url's API Restful Users
export const BASE_API_SECURITY_URL = 'http://localhost:3000/api'
export const USER_API_SECURITY_URL = `${BASE_API_SECURITY_URL}/users`

// Microservice Security Url's API Restful Login
export const LOGIN_API_SECURITY_URL = `${USER_API_SECURITY_URL}/login`

// Microservice Security Url's API Restful Reset
export const RESET_API_SECURITY_URL = `${BASE_API_SECURITY_URL}/recoverPassword`
export const VALIDATE_API_SECURITY_URL = `${RESET_API_SECURITY_URL}/validate`

// Microservice Data-Aplicaction
export const BASE_API_DATA_APLICATION_URL = 'http://localhost:8000'
export const USER_PROJECT_API_DATA_APLICATION_URL = `${BASE_API_DATA_APLICATION_URL}/user-projects/`
export const PROJECT_API_DATA_APLICATION_URL = `${BASE_API_DATA_APLICATION_URL}/projects/`
export const SPRINT_API_DATA_APLICATION_URL = `${BASE_API_DATA_APLICATION_URL}/sprints/`
export const ISSUES_API_DATA_APLICATION_URL = `${BASE_API_DATA_APLICATION_URL}/issues/`
export const ISSUES_TYPE_API_DATA_APLICATION_URL = `${BASE_API_DATA_APLICATION_URL}/issue-types/`

// Token key name in localStorage
export const TOKEN_KEY_NAME = 'authToken'
export const PAYMENT_INFO_KEY_NAME = 'paymentInfo'

// Microservice Import-Export Url's API Restful
export const BASE_API_IMPORT_EXPORT_URL = 'http://localhost:5184/api'
export const CSV_API_IMPORT_EXPORT_URL = `${BASE_API_IMPORT_EXPORT_URL}/csv`

// Microservice Performance-AI
export const BASE_API_PERFORMANCE_AI = 'http://localhost:4000'
export const ANALYZE_PROJECT_BY_AI_URL = `${BASE_API_PERFORMANCE_AI}/analyze`
export const QUERY_PROJECT_BY_AI_URL = `${BASE_API_PERFORMANCE_AI}/query`

// Microservice SSE
export const BASE_API_SSE = 'http://localhost:4001'
export const NOTIFICATIONS_API_SSE_URL = `${BASE_API_SSE}/events`
