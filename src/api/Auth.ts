import { Base } from './Base'

export interface LoginForm {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

export class Auth extends Base {
  public static readonly router: string = '/auth'

  public static async login(params: LoginForm) {
    const form = new FormData()
    form.append('grant_type', 'password')
    form.append('username', params.username)
    form.append('password', params.password)
    form.append('scope', '')
    form.append('client_id', '')
    form.append('client_secret', '')

    const response = await Auth._post(
      '/token',
      form,
      {},
      'application/x-www-form-urlencoded',
    )

    const handlers = {
      401: 'api.auth.401',
    }

    return Auth._handleResponse<TokenResponse>(response, handlers)
  }

  public static async refresh(token: string) {
    const config = {
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer '.concat(token),
      },
      withCredentials: true,
    }

    const response = await Base._post('/auth/refresh', null, config)

    const handlers = {
      401: 'api.auth.refresh_401',
    }

    return Base._handleResponse<TokenResponse>(response, handlers)
  }
}
