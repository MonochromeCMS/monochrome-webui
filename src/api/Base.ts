import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import type { TokenResponse } from '@/api/Auth';
import i18n from '@/i18n';

const errorResponse: AxiosResponse = {
  config: {},
  data: null,
  headers: null,
  status: 0,
  statusText: 'UnknownError',
};

export interface Pagination<T> {
  offset: number;
  limit: number;
  total: number;
  results: T[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export default class Base {
  public static readonly prefix: string = process.env.VUE_APP_API_PATH;

  public static readonly router: string = '';

  public static _delay() {
    return new Promise((resolve) => {
      setTimeout(() => resolve('done!'), 300);
    });
  }

  public static async _request(config: AxiosRequestConfig, delay = false): Promise<AxiosResponse> {
    try {
      const response = await axios.request(config);
      if (delay) {
        await Base._delay();
      }
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      } else {
        return errorResponse;
      }
    }
  }

  public static async _get(
    url: string,
    config: AxiosRequestConfig,
    delay = false,
  ): Promise<AxiosResponse> {
    return this._request(
      {
        method: 'get',
        url: this.prefix + this.router + url,
        ...config,
      },
      delay,
    );
  }

  public static async _delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._request({
      method: 'delete',
      url: this.prefix + this.router + url,
      ...config,
    });
  }

  public static async _post(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = '',
  ): Promise<AxiosResponse> {
    const settings = { headers: {}, ...config };
    settings.headers['Content-Type'] = contentType || 'application/json';

    return this._request({
      data,
      method: 'post',
      url: this.prefix + this.router + url,
      ...settings,
    });
  }

  public static async _put(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = '',
  ): Promise<AxiosResponse> {
    const settings = { ...config };
    settings.headers['Content-Type'] = contentType || 'application/json';

    return this._request({
      data,
      method: 'put',
      url: this.prefix + this.router + url,
      ...settings,
    });
  }

  public static _apiResponse(status: number): ApiResponse<any> {
    return {
      data: null,
      error: null,
      status,
    };
  }

  public static _logout(): void {
    require('@/store/index').default.commit('logout');
  }

  public static async refresh(token: string) {
    const response = await this._post('/refresh', { token }, {});

    const result: ApiResponse<TokenResponse> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.auth.refresh_401');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async _handle_401<T>(
    config: AxiosRequestConfig,
    oldResult: ApiResponse<T>,
  ): Promise<ApiResponse<T>> {
    const store = require('@/store/index').default;
    console.log(store);

    const tokenResponse = await store.dispatch('refresh');
    if (!tokenResponse?.data?.access_token) {
      this._logout();
      return oldResult;
    }
    config.headers.Authorization = 'Bearer '.concat(tokenResponse.data.access_token);
    const response = await this._request(config);

    const newResult: ApiResponse<T> = this._apiResponse(response.status);

    if (response.status === 201 || response.status === 200) {
      newResult.data = response.data;
      return newResult;
    } else if (response.status === 401) {
      this._logout();
      return oldResult;
    } else {
      newResult.error = response.data?.detail ?? response.statusText;
      return newResult;
    }
  }
}
