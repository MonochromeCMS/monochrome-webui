import type { AxiosRequestConfig } from 'axios';

import type { ChapterResponse, ChapterSchema } from '@/api/Chapter';
import i18n from '@/i18n';

import type { ApiResponse } from './Base';
import Base from './Base';

export interface UploadSessionSchema {
  mangaId: string;
  chapterId?: string;
}

export interface UploadedBlobResponse {
  id: string;
  name: string;
}

export interface UploadSessionResponse extends UploadSessionSchema {
  id: string;
  blobs: UploadedBlobResponse[];
  ownerId: string;
}

export interface CommitUploadSession {
  chapterDraft: ChapterSchema;
  pageOrder: string[];
}

export default class Upload extends Base {
  public static readonly router: string = '/upload';

  public static async begin(mangaId: string, chapterId: string | null, auth: AxiosRequestConfig) {
    const data = { chapterId, mangaId };
    const response = await Upload._post('/begin', data, auth);

    const result: ApiResponse<UploadSessionResponse> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = i18n.tc('api.upload.parent_400');
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async get(sessionId: string, auth: AxiosRequestConfig, delay = false) {
    const response = await Upload._get(`/${sessionId}`, auth, delay);

    const result: ApiResponse<UploadSessionResponse> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.upload.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async upload(
    sessionId: string,
    files: File[],
    auth: AxiosRequestConfig,
    onUploadProgress: (progressEvent: any) => void,
  ) {
    if (files.length === 0) {
      const result = Upload._apiResponse(0);
      result.error = 'No file was provided';
      return result;
    }

    const form = new FormData();
    for (const file of files) {
      form.append('payload', file);
    }

    const config: AxiosRequestConfig = {
      ...auth,
      onUploadProgress,
    };

    const response = await Upload._post(`/${sessionId}`, form, config, 'multipart/form-data');

    const result: ApiResponse<UploadedBlobResponse[]> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = i18n.tc('api.upload.file_400');
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.upload.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async delete(sessionId: string, auth: AxiosRequestConfig) {
    const response = await Upload._delete(`/${sessionId}`, auth);

    const result: ApiResponse<string> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.upload.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
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
    };
    const url = `/${sessionId}/commit`;

    const response = await Upload._post(url, data, auth);

    const result: ApiResponse<ChapterResponse> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 200:
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = i18n.tc('api.upload.pages_400');
        break;
      case 404:
        result.error = i18n.tc('api.404');
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async deleteBlob(sessionId: string, blobId: string, auth: AxiosRequestConfig) {
    const url = `/${sessionId}/${blobId}`;
    const response = await Upload._delete(url, auth);

    const result: ApiResponse<string> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = 'OK';
        break;
      case 400:
        result.error = i18n.tc('api.upload.no_page_400');
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.upload.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async deleteAllBlob(sessionId: string, auth: AxiosRequestConfig) {
    const url = `/${sessionId}/files`;
    const response = await Upload._delete(url, auth);

    const result: ApiResponse<string> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = 'OK';
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.upload.404');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async slice(sessionId: string, pageOrder: string[], auth: AxiosRequestConfig) {
    const url = `/${sessionId}/slice`;

    const response = await Upload._post(url, pageOrder, auth);

    const result: ApiResponse<UploadedBlobResponse[]> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = i18n.tc('api.upload.pages_400');
        break;
      case 404:
        result.error = i18n.tc('api.404');
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }
}
