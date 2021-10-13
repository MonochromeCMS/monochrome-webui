import type { ApiResponse } from './Base';
import Base from './Base';
import type { AxiosRequestConfig } from 'axios';
import type { ChapterResponse, ChapterSchema } from '@/api/Chapter';

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
}

export interface CommitUploadSession {
  chapterDraft: ChapterSchema;
  pageOrder: string[];
}

export default class Upload extends Base {
  public static readonly router: string = '/upload';

  public static async begin(mangaId: string, chapterId: string | null, auth: AxiosRequestConfig) {
    const data = { mangaId, chapterId };
    const response = await Upload._post('/begin', data, auth);

    const result: ApiResponse<UploadSessionResponse> = Upload._apiResponse(response.status);

    switch (response.status) {
      case 201:
        result.data = response.data;
        break;
      case 400:
        result.error = "Can't edit Upload chapter";
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = response.data?.detail;
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'Upload session not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
        result.error = "One of the files provided isn't valid";
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'Upload session not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'Upload session not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
      case 404:
        result.error = response.data?.detail;
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
        result.error = "That file doesn't exist in the current session";
        break;
      case 401:
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'Upload session not found';
        break;
      case 422:
        result.error = 'The data provided is not valid';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
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
        result.error = 'Please log in again';
        break;
      case 404:
        result.error = 'Upload session not found';
        break;
      default:
        result.error = response.data.detail ?? response.statusText;
    }
    return result;
  }
}
