import type { ApiResponse } from './Base';
import Base from './Base';
import i18n from '@/i18n';

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}

export default class Auth extends Base {
  public static readonly router: string = '/auth';

  public static async login(username: string, password: string) {
    const form = new FormData();
    form.append('grant_type', 'password');
    form.append('username', username);
    form.append('password', password);
    form.append('scope', '');
    form.append('client_id', '');
    form.append('client_secret', '');

    const response = await Auth._post('/token', form, {}, 'application/x-www-form-urlencoded');

    const result: ApiResponse<TokenResponse> = Auth._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.auth.401');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }
}
