import type { AxiosRequestConfig, AxiosResponse } from "axios"
import axios from "axios"

import type { TokenResponse } from "@/api/Auth"
import i18n from "@/i18n"

const errorResponse: AxiosResponse = {
  config: {},
  data: null,
  headers: null,
  status: 0,
  statusText: "UnknownError",
}

export interface Pagination<T> {
  offset: number
  limit: number
  total: number
  results: T[]
}

interface ApiResponseSuccess<T> {
  data: T
  error: null
  status: number
}

interface ApiResponseFail {
  data: null
  error: string
  status: number
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseFail

type Handler<T> = ((result: ApiResponse<T>, response: AxiosResponse) => Promise<void>) | string

export type Handlers<T> = Record<number, Handler<T>>

export default class Base {
  public static readonly basePath: string = process.env.VUE_APP_API_PATH

  public static readonly router: string = ""

  public static _delay() {
    return new Promise((resolve) => {
      setTimeout(() => resolve("done!"), 300)
    })
  }

  public static async _request(config: AxiosRequestConfig, delay = false): Promise<AxiosResponse> {
    const newConfig = {
      ...config,
      validateStatus: () => true,
    }

    try {
      const response = await axios.request(newConfig)
      return response
    } catch (error: unknown) {
      return errorResponse
    }
  }

  public static async _get(
    url: string,
    config: AxiosRequestConfig,
    delay = false,
  ): Promise<AxiosResponse> {
    return this._request(
      {
        method: "get",
        url: this.basePath + this.router + url,
        ...config,
      },
      delay,
    )
  }

  public static async _delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._request({
      method: "delete",
      url: this.basePath + this.router + url,
      ...config,
    })
  }

  public static async _post(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = "application/json",
  ): Promise<AxiosResponse> {
    const newConfig = { headers: {}, ...config }
    newConfig.headers["Content-Type"] = contentType

    return this._request({
      data,
      method: "post",
      url: this.basePath + this.router + url,
      ...newConfig,
    })
  }

  public static async _put(
    url: string,
    data: any,
    config: AxiosRequestConfig,
    contentType = "application/json",
  ): Promise<AxiosResponse> {
    const newConfig = { headers: {}, ...config }
    newConfig.headers["Content-Type"] = contentType

    return this._request({
      data,
      method: "put",
      url: this.basePath + this.router + url,
      ...newConfig,
    })
  }

  public static _apiResponse<T>(status: number): ApiResponse<T> {
    return {
      data: null,
      error: "",
      status,
    }
  }

  public static async _handleResponse<T>(response: AxiosResponse, handlers?: Handlers<T>) {
    const defaultHandlers: Handlers<T> = {
      401: async (result: ApiResponse<T>, response: AxiosResponse) => {
        result.error = i18n.tc("api.401")
        await this._handle_401(response.config, result, handlers)
      },
      404: i18n.tc("api.404"),
      422: i18n.tc("api.422"),
    }

    handlers ??= {}

    handlers = {
      ...defaultHandlers,
      ...handlers,
    }

    const result = Base._apiResponse<T>(response.status)

    if (response.status in handlers) {
      const handler = handlers[response.status]
      if (handler instanceof Function) {
        await handler(result, response)
      } else {
        result.error = handler
      }
    } else {
      if (response.status < 300 && response.status >= 200) {
        result.data = response.data
        result.error = null
      } else {
        result.error = response.data?.detail ?? response.data?.message ?? response.statusText
      }
    }

    return result
  }

  public static async refresh(token: string) {
    const response = await Base._post("/auth/refresh", { token }, {})

    const handlers = {
      401: i18n.tc("api.auth.refresh_401"),
    }

    return Base._handleResponse<TokenResponse>(response, handlers)
  }

  public static async _handle_401<T>(
    config: AxiosRequestConfig,
    result: ApiResponse<T>,
    handlers?: Handlers<T>,
  ): Promise<ApiResponse<T>> {
    const store = require("@/store/index").default

    handlers ??= {}

    const tokenResponse = await Base.refresh(store.getters.refreshToken)
    if (tokenResponse.data === null) {
      store.commit("logout")
      return result
    }
    store.commit("setToken", tokenResponse.data)

    config.headers ??= {}
    config.headers.Authorization = "Bearer ".concat(tokenResponse.data.access_token)

    const response = await this._request(config)

    handlers = {
      ...handlers,
      401: async () => {
        store.commit("logout")
      },
    }

    Object.assign(result, await this._handleResponse<T>(response, handlers))

    return result
  }
}
