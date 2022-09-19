import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'
import type { Pagination } from './Base'

export type Role = 'admin' | 'uploader' | 'user' | 'guest'

export interface IUser {
  username: string
  email?: string | null
}

export interface UserRegisterSchema extends IUser {
  password: string
}

export interface UserSchema extends UserRegisterSchema {
  role: Role
}

export interface UserResponse extends IUser {
  id: string
  version: number
  role: Role
}

export interface UserFilters {
  username?: string
  role?: Role
  email?: string
  id?: string
}

export type UsersResponse = Pagination<UserResponse>

export class User extends Base {
  public static readonly router: string = '/user'

  public static canEdit(role: Role) {
    return role === 'admin'
  }

  public static async search(
    auth: AxiosRequestConfig,
    filters: UserFilters,
    limit = 10,
    offset = 0,
    delay = false,
  ) {
    const url = [
      ...Object.entries(filters),
      ['limit', limit],
      ['offset', offset],
    ].reduce(
      (acc, el) => acc + (el[1] !== null ? `&${el[0]}=${el[1]}` : ''),
      '?',
    )
    const response = await User._get(url, auth, delay)

    return User._handleResponse<UsersResponse>(response)
  }

  public static async me(auth: AxiosRequestConfig) {
    const response = await User._get('/me', auth)

    return User._handleResponse<UserResponse>(response)
  }

  public static async get(userId: string, auth: AxiosRequestConfig) {
    const response = await User._get(`/${userId}`, auth)

    const handlers = {
      404: 'api.user.404',
    }

    return User._handleResponse<UserResponse>(response, handlers)
  }

  public static async edit(
    userId: string,
    data: UserSchema,
    auth: AxiosRequestConfig,
  ) {
    const response = await User._put(`/${userId}`, data, auth)

    const handlers = {
      400: 'api.user.username_email_400',
      404: 'api.user.404',
    }

    return User._handleResponse<UserResponse>(response, handlers)
  }

  public static async delete(userId: string, auth: AxiosRequestConfig) {
    const response = await User._delete(`/${userId}`, auth)

    const handlers = {
      404: 'api.user.404',
    }

    return User._handleResponse<string>(response, handlers)
  }

  public static async create(data: UserSchema, auth: AxiosRequestConfig) {
    const response = await User._post('', data, auth)

    const handlers = {
      400: 'api.user.username_email_400',
      404: 'api.user.404',
    }

    return User._handleResponse<UserResponse>(response, handlers)
  }

  public static async register(data: UserRegisterSchema) {
    const response = await User._post('/register', data, {})

    const handlers = {
      400: 'api.user.username_email_400',
      405: 'api.user.405',
    }

    return User._handleResponse<UserResponse>(response, handlers)
  }

  public static async uploadAvatar(
    userId: string,
    file: File,
    auth: AxiosRequestConfig,
  ) {
    const form = new FormData()
    form.append('payload', file)

    const response = await User._put(
      `/${userId}/avatar`,
      form,
      auth,
      'multipart/form-data',
    )

    const handlers = {
      400: 'api.user.avatar_400',
      404: 'api.user.404',
    }

    return User._handleResponse<UserResponse>(response, handlers)
  }
}
