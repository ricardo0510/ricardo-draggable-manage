export interface LoginParams {
  email: string
  password: string
}

export interface LoginResult {
  access_token: string
  user: {
    id: string
    email: string
    role: string
  }
}
