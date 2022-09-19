import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'
import type { ChapterResponse, ChapterSchema } from '@/api/Chapter'

export interface UploadSessionSchema {
  mangaId: string
  chapterId?: string
}

export interface UploadedBlobResponse {
  id: string
  name: string
}

export interface UploadSessionResponse extends UploadSessionSchema {
  id: string
  blobs: UploadedBlobResponse[]
  ownerId: string
}

export interface CommitUploadSession {
  chapterDraft: ChapterSchema
  pageOrder: string[]
}

export class Upload extends Base {
  public static readonly router: string = '/upload'

  public static async begin(
    mangaId: string,
    chapterId?: string,
    auth: AxiosRequestConfig = {},
  ) {
    const data = { chapterId, mangaId }
    const response = await Upload._post('/begin', data, auth)

    const handlers = {
      400: 'api.upload.parent_400',
    }

    return Upload._handleResponse<UploadSessionResponse>(response, handlers)
  }

  public static async get(
    sessionId: string,
    auth: AxiosRequestConfig,
    delay = false,
  ) {
    const response = await Upload._get(`/${sessionId}`, auth, delay)

    const handlers = {
      404: 'api.upload.404',
    }

    return Upload._handleResponse<UploadSessionResponse>(response, handlers)
  }

  public static async upload(
    sessionId: string,
    files: FileList,
    auth: AxiosRequestConfig,
    onUploadProgress: (progressEvent: any) => void,
  ) {
    if (files.length === 0) {
      const result = Upload._apiResponse<UploadedBlobResponse[]>(0)
      result.error = 'No file was provided'
      return result
    }

    const form = new FormData()
    for (const file of files)
      form.append('payload', file)

    const config: AxiosRequestConfig = {
      ...auth,
      onUploadProgress,
    }

    const response = await Upload._post(
      `/${sessionId}`,
      form,
      config,
      'multipart/form-data',
    )

    const handlers = {
      400: 'api.upload.file_400',
      404: 'api.upload.404',
    }

    return Upload._handleResponse<UploadedBlobResponse[]>(response, handlers)
  }

  public static async delete(sessionId: string, auth: AxiosRequestConfig) {
    const response = await Upload._delete(`/${sessionId}`, auth)

    const handlers = {
      404: 'api.upload.404',
    }

    return Upload._handleResponse<string>(response, handlers)
  }

  public static async commit(
    sessionId: string,
    chapterDraft: ChapterSchema,
    pageOrder: string[],
    auth: AxiosRequestConfig,
  ) {
    const data: CommitUploadSession = {
      chapterDraft,
      pageOrder,
    }
    const url = `/${sessionId}/commit`

    const response = await Upload._post(url, data, auth)

    const handlers = {
      400: 'api.upload.pages_400',
    }

    return Upload._handleResponse<ChapterResponse>(response, handlers)
  }

  public static async deleteBlob(
    sessionId: string,
    blobId: string,
    auth: AxiosRequestConfig,
  ) {
    const url = `/${sessionId}/${blobId}`
    const response = await Upload._delete(url, auth)

    const handlers = {
      400: 'api.upload.no_page_400',
      404: 'api.upload.404',
    }

    return Upload._handleResponse<string>(response, handlers)
  }

  public static async deleteAllBlob(
    sessionId: string,
    auth: AxiosRequestConfig,
  ) {
    const url = `/${sessionId}/files`
    const response = await Upload._delete(url, auth)

    const handlers = {
      404: 'api.upload.404',
    }

    return Upload._handleResponse<string>(response, handlers)
  }

  public static async slice(
    sessionId: string,
    pageOrder: string[],
    auth: AxiosRequestConfig,
  ) {
    const url = `/${sessionId}/slice`

    const response = await Upload._post(url, pageOrder, auth)

    const handlers = {
      400: 'api.upload.page_400',
    }

    return Upload._handleResponse<UploadedBlobResponse[]>(response, handlers)
  }
}
