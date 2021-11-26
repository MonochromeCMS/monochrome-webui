import type { AxiosRequestConfig } from 'axios';

import type { ChapterCommentsResponse } from '@/api/Comment';
import type { MangaResponse } from '@/api/Manga';
import type { Role } from '@/api/User';
import i18n from '@/i18n';

import type { ApiResponse, Pagination } from './Base';
import Base from './Base';

export interface ChapterSchema {
  name: string;
  webtoon: boolean;
  volume?: number;
  number: number;
  scanGroup: string;
}

export interface ChapterResponse extends ChapterSchema {
  id: string;
  version: number;
  mangaId: string;
  length: number;
  uploadTime: string;
  ownerId: string;
}

export interface DetailedChapterResponse extends ChapterResponse {
  manga: MangaResponse;
}

type LatestChaptersResponse = Pagination<DetailedChapterResponse>;

export default class Chapter extends Base {
  public static readonly router: string = '/chapter';

  public static canCreate(role: Role) {
    return ['uploader', 'admin'].includes(role);
  }

  public static canEdit(chapter: ChapterResponse, userId: string, role: Role) {
    return role === 'admin' || (role === 'uploader' && chapter.ownerId === userId);
  }

  public static async latest(limit = 10, offset = 0, delay = false) {
    const url = `?limit=${limit}&offset=${offset}`;

    const response = await this._get(url, {}, delay);

    const result: ApiResponse<LatestChaptersResponse> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async get(chapterId: string, delay = false) {
    const response = await this._get(`/${chapterId}`, {}, delay);

    const result: ApiResponse<DetailedChapterResponse> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 404:
        result.error = i18n.tc('api.chapter.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async edit(chapterId: string, data: ChapterSchema, auth: AxiosRequestConfig) {
    const response = await this._put(`/${chapterId}`, data, auth);

    const result: ApiResponse<ChapterResponse> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.chapter.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async delete(chapterId: string, auth: AxiosRequestConfig) {
    const response = await this._delete(`/${chapterId}`, auth);

    const result: ApiResponse<string> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = 'OK';
        break;
      case 401:
        result.error = i18n.tc('api.401');
        return await this._handle_401(response.config, result);
      case 404:
        result.error = i18n.tc('api.chapter.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }

  public static async getComments(chapterId: string, limit = 10, offset = 0) {
    const url = `/${chapterId}/comments?limit=${limit}&offset=${offset}`;

    const response = await this._get(url, {});

    const result: ApiResponse<ChapterCommentsResponse> = this._apiResponse(response.status);

    switch (response.status) {
      case 200:
        result.data = response.data;
        break;
      case 404:
        result.error = i18n.tc('api.chapter.404');
        break;
      case 422:
        result.error = i18n.tc('api.422');
        break;
      default:
        result.error = response.data?.detail ?? response.statusText;
    }
    return result;
  }
}
