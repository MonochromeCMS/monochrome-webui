import type { AxiosRequestConfig } from "axios"

import type { Role } from "@/api/User"
import i18n from "@/i18n"

import type { ApiResponse, Pagination } from "./Base"
import Base from "./Base"
import type { ChapterResponse } from "./Chapter"

export type Status = "ongoing" | "completed" | "hiatus" | "cancelled"

export interface MangaSchema {
  title: string
  description: string
  author: string
  artist: string
  year?: number
  status: Status
}

export interface MangaResponse extends MangaSchema {
  id: string
  version: number
  createTime: Date
  ownerId: string
}

type MangaSearchResponse = Pagination<MangaResponse>

export default class Manga extends Base {
  public static readonly router: string = "/manga"

  public static canCreate(role: Role) {
    return ["uploader", "admin"].includes(role)
  }

  public static canEdit(manga: MangaResponse, userId: string, role: Role) {
    return role === "admin" || (role === "uploader" && manga.ownerId === userId)
  }

  public static async search(title: string | null = null, limit = 10, offset = 0, delay = false) {
    let url = `?limit=${limit}&offset=${offset}`

    if (title) {
      url += `&title=${title}`
    }

    const response = await Manga._get(url, {}, delay)

    const result: ApiResponse<MangaSearchResponse> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async create(data: MangaSchema, auth: AxiosRequestConfig) {
    const response = await Manga._post("", data, auth)

    const result: ApiResponse<MangaResponse> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 201:
        result.data = response.data
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async get(mangaId: string, delay = false) {
    const response = await Manga._get(`/${mangaId}`, {}, delay)

    const result: ApiResponse<MangaResponse> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 404:
        result.error = i18n.tc("api.manga.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async edit(mangaId: string, data: MangaSchema, auth: AxiosRequestConfig) {
    const response = await Manga._put(`/${mangaId}`, data, auth)

    const result: ApiResponse<MangaResponse> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 404:
        result.error = i18n.tc("api.manga.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async delete(mangaId: string, auth: AxiosRequestConfig) {
    const response = await Manga._delete(`/${mangaId}`, auth)

    const result: ApiResponse<string> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = "OK"
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 404:
        result.error = i18n.tc("api.manga.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async chapters(mangaId: string, delay = false) {
    const url = `/${mangaId}/chapters`
    const response = await Manga._get(url, {}, delay)

    const result: ApiResponse<ChapterResponse[]> = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 404:
        result.error = i18n.tc("api.manga.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async setCover(mangaId: string, cover: File, auth: AxiosRequestConfig) {
    const url = `/${mangaId}/cover`
    const form = new FormData()
    form.append("payload", cover)

    const response = await Manga._put(url, form, auth, "multipart/form-data")

    const result = Manga._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 400:
        result.error = i18n.tc("api.manga.cover_400")
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 404:
        result.error = i18n.tc("api.manga.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }
}
