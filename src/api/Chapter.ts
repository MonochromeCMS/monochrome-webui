import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'
import type { Pagination } from './Base'
import type { ProgressTrackingSchema } from './Progress'
import type { ChapterCommentsResponse } from '@/api/Comment'
import type { MangaResponse } from '@/api/Manga'
import type { Role } from '@/api/User'

export interface ChapterSchema {
  name: string
  webtoon: boolean
  volume?: number
  number: number
  scanGroup: string
}

export interface ChapterResponse extends ChapterSchema {
  id: string
  version: number
  mangaId: string
  length: number
  uploadTime: string
  ownerId: string
  tracking?: ProgressTrackingSchema[]
}

export interface DetailedChapterResponse extends ChapterResponse {
  manga: MangaResponse
}

type LatestChaptersResponse = Pagination<DetailedChapterResponse>

export class Chapter extends Base {
  public static readonly router: string = '/chapter'

  public static canCreate(role: Role) {
    return ['uploader', 'admin'].includes(role)
  }

  public static canEdit(chapter: ChapterResponse, userId: string, role: Role) {
    return (
      role === 'admin' || (role === 'uploader' && chapter.ownerId === userId)
    )
  }

  public static async latest(limit = 10, offset = 0, auth = {}, delay = false) {
    const url = `?limit=${limit}&offset=${offset}`

    const response = await Chapter._get(url, auth, delay)

    return Chapter._handleResponse<LatestChaptersResponse>(response)
  }

  public static async get(chapterId: string, delay = false) {
    const response = await Chapter._get(`/${chapterId}`, {}, delay)

    const handlers = {
      404: 'api.chapter.404',
    }

    return Chapter._handleResponse<DetailedChapterResponse>(response, handlers)
  }

  public static async edit(
    chapterId: string,
    data: ChapterSchema,
    auth: AxiosRequestConfig,
  ) {
    const response = await Chapter._put(`/${chapterId}`, data, auth)

    const handlers = {
      404: 'api.chapter.404',
    }

    return Chapter._handleResponse<ChapterResponse>(response, handlers)
  }

  public static async delete(chapterId: string, auth: AxiosRequestConfig) {
    const response = await Chapter._delete(`/${chapterId}`, auth)

    const handlers = {
      404: 'api.chapter.404',
    }

    return Chapter._handleResponse<string>(response, handlers)
  }

  public static async getComments(chapterId: string, limit = 10, offset = 0) {
    const url = `/${chapterId}/comments?limit=${limit}&offset=${offset}`

    const response = await Chapter._get(url, {})

    const handlers = {
      404: 'api.chapter.404',
    }

    return Chapter._handleResponse<ChapterCommentsResponse>(response, handlers)
  }
}
