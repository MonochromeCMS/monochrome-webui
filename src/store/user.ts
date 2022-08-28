import type { AxiosRequestConfig } from "axios"
import type { ActionContext } from "vuex"

import type { TokenResponse } from "@/api/Auth"
import Auth from "@/api/Auth"
import type { ApiResponse } from "@/api/Base"
import type { Role, UserResponse } from "@/api/User"
import User from "@/api/User"
import i18n from "@/i18n"

interface UserState {
  token: string
  refresh: string
  username?: string
  email?: string
  id?: string
  role?: Role
  version?: number
}

export interface UserLogin {
  username: string
  password: string
}

const state = (): UserState => ({
  email: undefined,
  id: undefined,
  refresh: "",
  role: undefined,
  token: "",
  username: undefined,
  version: undefined,
})

const mutations = {
  logout(state: UserState): void {
    state.token = ""
    state.username = undefined
    state.role = undefined
    state.email = undefined
    state.id = undefined
    state.version = undefined
  },
  setToken(state: UserState, payload: TokenResponse): void {
    state.token = payload.access_token
    state.refresh = payload.refresh_token || state.refresh
  },
  updateUser(state: UserState, payload: UserResponse): void {
    state.username = payload.username
    state.role = payload.role
    state.email = payload.email
    state.id = payload.id
    state.version = payload.version
  },
}

const getters = {
  authConfig(state: UserState): AxiosRequestConfig {
    return {
      headers: {
        Accept: "*/*",
        Authorization: "Bearer ".concat(state.token),
      },
      withCredentials: true,
    }
  },
  displayUserRole(state: UserState): string | null {
    return state.role ? i18n.tc(`roles.${state.role}`) : null
  },
  isConnected(state: UserState): boolean {
    const result = state.token && state.id
    return !!result
  },
  refreshToken(state: UserState): string {
    return state.refresh
  },
  userId(state: UserState): string | null {
    return state.id ?? null
  },
  userRole(state: UserState): string | null {
    return state.role ?? null
  },
}

const actions = {
  async getUserData({
    getters,
    commit,
  }: ActionContext<UserState, any>): Promise<ApiResponse<UserResponse>> {
    const response = await User.me(getters.authConfig)

    if (response.data) {
      commit("updateUser", response.data)
    } else if (response.status === 401) {
      commit("logout")
    }
    return response
  },
  async login(
    { commit, dispatch }: ActionContext<UserState, any>,
    { username, password }: UserLogin,
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await Auth.login(username, password)

    if (response.data) {
      commit("setToken", response.data)
      await dispatch("getUserData")
    }
    return response
  },
}

export default {
  actions,
  getters,
  mutations,
  state,
}
