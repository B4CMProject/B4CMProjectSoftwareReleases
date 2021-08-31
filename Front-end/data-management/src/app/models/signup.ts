export interface signupResponse {
  success?: boolean
  message?: string
  secret?: string
  errors?: {
    message?: string,
    path?: string
  }
}
