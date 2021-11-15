import type { AxiosRequestConfig } from 'axios';

import type { Role } from '@/api/User';
import i18n from '@/i18n';

import type { ApiResponse } from './Base';
import Base from './Base';

export interface SettingsSchema {
  title1?: string;
  title2?: string;
  about?: string;
}

export default class Settings extends Base {
  public static readonly router: string = '/settings';

  public static canEdit(role: Role) {
    return role === 'admin';
  }

  public static async get() {
    const response = await Settings._get('', {});

    const result: ApiResponse<SettingsSchema> = Settings._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async edit(data: SettingsSchema, auth: AxiosRequestConfig) {
    const response = await Settings._put('', data, auth);
    const result: ApiResponse<SettingsSchema> = Settings._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }
}
