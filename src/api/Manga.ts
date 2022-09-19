import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'
import type { Pagination } from './Base'
import type { ChapterResponse } from './Chapter'
import type { Role } from '@/api/User'

export type Status = 'ongoing' | 'completed' | 'hiatus' | 'cancelled'

export interface MangaSchema {
  title: string
  description: string
  author: string
  artist: string
  year?: number | null
  status: Status
}

export interface MangaResponse extends MangaSchema {
  id: string
  version: number
  createTime: Date
  ownerId: string
}

type MangaSearchResponse = Pagination<MangaResponse>

export class Manga extends Base {
  public static readonly router: string = '/manga'

  public static canCreate(role: Role) {
    return ['uploader', 'admin'].includes(role)
  }

  public static canEdit(manga: MangaResponse, userId: string, role: Role) {
    return (
      role === 'admin' || (role === 'uploader' && manga.ownerId === userId)
    )
  }

  public static async search(
    title: string | null = null,
    limit = 10,
    offset = 0,
    delay = false,
  ) {
    let url = `?limit=${limit}&offset=${offset}`

    if (title)
      url += `&title=${title}`

    const response = await Manga._get(url, {}, delay)

    return Manga._handleResponse<MangaSearchResponse>(response)
  }

  public static async create(data: MangaSchema, auth: AxiosRequestConfig) {
    const response = await Manga._post('', data, auth)

    return Manga._handleResponse<MangaResponse>(response)
  }

  public static async get(mangaId: string, delay = false) {
    const response = await Manga._get(`/${mangaId}`, {}, delay)

    const handlers = {
      404: 'api.manga.404',
    }

    return Manga._handleResponse<MangaResponse>(response, handlers)
  }

  public static async edit(
    mangaId: string,
    data: MangaSchema,
    auth: AxiosRequestConfig,
  ) {
    const response = await Manga._put(`/${mangaId}`, data, auth)

    const handlers = {
      404: 'api.manga.404',
    }

    return Manga._handleResponse<MangaResponse>(response, handlers)
  }

  public static async delete(mangaId: string, auth: AxiosRequestConfig) {
    const response = await Manga._delete(`/${mangaId}`, auth)

    const handlers = {
      404: 'api.manga.404',
    }

    return Manga._handleResponse<string>(response, handlers)
  }

  public static async chapters(mangaId: string, auth = {}, delay = false) {
    const url = `/${mangaId}/chapters`
    const response = await Manga._get(url, auth, delay)

    const handlers = {
      404: 'api.manga.404',
    }

    return Manga._handleResponse<ChapterResponse[]>(response, handlers)
  }

  public static async setCover(
    mangaId: string,
    cover: File,
    auth: AxiosRequestConfig,
  ) {
    const url = `/${mangaId}/cover`
    const form = new FormData()
    form.append('payload', cover)

    const response = await Manga._put(url, form, auth, 'multipart/form-data')

    const handlers = {
      400: 'api.manga.cover_400',
      404: 'api.manga.404',
    }

    return Manga._handleResponse<MangaResponse>(response, handlers)
  }
}
