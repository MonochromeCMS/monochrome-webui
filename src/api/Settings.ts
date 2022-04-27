import type { AxiosRequestConfig } from "axios"

import type { Role } from "@/api/User"

import Base from "./Base"

export interface SettingsSchema {
  title1?: string
  title2?: string
  about?: string
}

export default class Settings extends Base {
  public static readonly router: string = "/settings"

  public static canEdit(role: Role) {
    return role === "admin"
  }

  public static async get() {
    const response = await Settings._get("", {})

    return Settings._handleResponse<SettingsSchema>(response)
  }

  public static async edit(data: SettingsSchema, auth: AxiosRequestConfig) {
    const response = await Settings._put("", data, auth)

    return Settings._handleResponse<SettingsSchema>(response)
  }
}
