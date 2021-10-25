import type { ActionContext } from 'vuex';
import type { AxiosRequestConfig } from 'axios';

import Auth from '@/api/Auth';
import type { TokenResponse } from '@/api/Auth';
import User from '@/api/User';
import type { UserResponse, Role } from '@/api/User';
import type { ApiResponse } from '@/api/Base';

interface UserState {
  token: string;
  username?: string;
  email?: string;
  id?: string;
  role?: Role;
  version?: number;
}

export interface UserLogin {
  username: string;
  password: string;
}

const state = (): UserState => ({
  token: '',
  username: undefined,
  role: undefined,
  email: undefined,
  id: undefined,
  version: undefined,
});

const mutations = {
  setToken(state: UserState, payload: TokenResponse): void {
    state.token = payload.access_token;
  },
  logout(state: UserState): void {
    state.token = '';
    state.username = undefined;
    state.role = undefined;
    state.email = undefined;
    state.id = undefined;
    state.version = undefined;
  },
  updateUser(state: UserState, payload: UserResponse): void {
    state.username = payload.username;
    state.role = payload.role;
    state.email = payload.email;
    state.id = payload.id;
    state.version = payload.version;
  },
};

const getters = {
  userId(state: UserState): string | null {
    return state.id ?? null;
  },
  userRole(state: UserState): string | null {
    return state.role ?? null;
  },
  isConnected(state: UserState): boolean {
    const result = state.token && state.id;
    return !!result;
  },
  authConfig(state: UserState): AxiosRequestConfig {
    return {
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer '.concat(state.token),
      },
      withCredentials: true,
    };
  },
};

const actions = {
  async login(
    { commit, dispatch }: ActionContext<UserState, any>,
    { username, password }: UserLogin,
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await Auth.login(username, password);

    if (response.data) {
      commit('setToken', response.data);
      await dispatch('getUserData');
    }
    return response;
  },
  async getUserData({
    getters,
    commit,
  }: ActionContext<UserState, any>): Promise<ApiResponse<UserResponse>> {
    const response = await User.me(getters.authConfig);

    if (response.data) {
      commit('updateUser', response.data);
    } else if (response.status === 401) {
      commit('logout');
    }
    return response;
  },
};

export default {
  state,
  actions,
  getters,
  mutations,
};
