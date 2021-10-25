import Base from './Base';
import type { ApiResponse, Pagination } from './Base';
import type { AxiosRequestConfig } from 'axios';

export type Role = 'admin' | 'uploader' | 'user';

export interface IUser {
  username: string;
  email?: string;
}

export interface UserRegisterSchema extends IUser {
  password: string;
}

export interface UserSchema extends UserRegisterSchema {
  role: Role;
}

export interface UserResponse extends IUser {
  id: string;
  version: number;
  role: Role;
}

export interface UserFilters {
  username?: string;
  role?: Role;
  email?: string;
  id?: string;
}

export type UsersResponse = Pagination<UserResponse>;

export default class User extends Base {
  public static readonly router: string = '/user';

  public static canEdit(role: Role) {
    return role === 'admin';
  }

  public static async search(
    auth: AxiosRequestConfig,
    filters: UserFilters,
    limit = 10,
    offset = 0,
    delay = false,
  ) {
    const url = [...Object.entries(filters), ['limit', limit], ['offset', offset]].reduce(
      (acc, el) => acc + (el[1] !== null ? `&${el[0]}=${el[1]}` : ''),
      '?',
    );
    const response = await User._get(url, auth, delay);

    const result: ApiResponse<UsersResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async me(auth: AxiosRequestConfig) {
    const response = await User._get('/me', auth);

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async get(userId: string, auth: AxiosRequestConfig) {
    const response = await User._get(`/${userId}`, auth);

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'User not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async edit(userId: string, data: UserSchema, auth: AxiosRequestConfig) {
    const response = await User._put(`/${userId}`, data, auth);

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 400:
        result.error = 'Username/email already in use';
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'User not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async delete(userId: string, auth: AxiosRequestConfig) {
    const response = await User._delete(`/${userId}`, auth);

    const result: ApiResponse<string> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 400:
        result.error = "You can't delete your own user";
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'User not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async create(data: UserSchema, auth: AxiosRequestConfig) {
    const response = await User._post('', data, auth);

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = 'Username/email already in use';
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async register(data: UserRegisterSchema) {
    const response = await User._post('/register', data, {});

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = 'Username/email already in use';
        break;
      case 405:
        result.error = 'Registering is not available on this server';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async uploadAvatar(userId: string, file: File, auth: AxiosRequestConfig) {
    const form = new FormData();
    form.append('payload', file);

    const response = await User._put(`/${userId}/avatar`, form, auth, 'multipart/form-data');

    const result: ApiResponse<UserResponse> = User._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 400:
        result.error = "The file provided isn't valid";
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'User not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }
}
