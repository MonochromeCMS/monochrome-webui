import Base from "./Base"

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: "bearer"
}

export default class Auth extends Base {
  public static readonly router: string = "/auth"

  public static async login(username: string, password: string) {
    const form = new FormData()
    form.append("grant_type", "password")
    form.append("username", username)
    form.append("password", password)
    form.append("scope", "")
    form.append("client_id", "")
    form.append("client_secret", "")

    const response = await Auth._post("/token", form, {}, "application/x-www-form-urlencoded")

    return Auth._handleResponse<TokenResponse>(response)
  }
}
