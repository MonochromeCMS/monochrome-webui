import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

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

  public static async _get(
    url: string,
    config: AxiosRequestConfig,
    delay = false,
  ): Promise<AxiosResponse> {
    try {
      const response = await axios.get(this.prefix + this.router + url, config);
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

  public static async _delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      return await axios.delete(this.prefix + this.router + url, config);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      } else {
        return errorResponse;
      }
    }
  }

  public static async _post(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = '',
  ): Promise<AxiosResponse> {
    const settings = { headers: {}, ...config };
    settings.headers['Content-Type'] = contentType || 'application/json';

    try {
      return await axios.post(this.prefix + this.router + url, data, settings);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      } else {
        return errorResponse;
      }
    }
  }

  public static async _put(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = '',
  ): Promise<AxiosResponse> {
    const settings = { ...config };
    settings.headers['Content-Type'] = contentType || 'application/json';

    try {
      return await axios.put(this.prefix + this.router + url, data, settings);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response;
      } else {
        return errorResponse;
      }
    }
  }

  public static _apiResponse(status: number): ApiResponse<any> {
    return {
      data: null,
      error: null,
      status,
    };
  }
}
