import type { AxiosRequestConfig } from "axios"

import type { UserResponse } from "@/api/User"
import i18n from "@/i18n"

import type { ApiResponse, Pagination } from "./Base"
import Base from "./Base"
import type { Role } from "./User"

export interface CommentEditSchema {
  content: string
}

export interface CommentSchema extends CommentEditSchema {
  chapterId: string
  replyTo?: string
}

export interface CommentResponse extends CommentSchema {
  id: string
  version: number
  createTime: string
  authorId: string
}

export interface DetailedCommentResponse extends CommentResponse {
  author: UserResponse
}

export type ChapterCommentsResponse = Pagination<DetailedCommentResponse>

export default class Comment extends Base {
  public static readonly router: string = "/comment"

  public static canCreate(role: Role) {
    return ["user", "uploader", "admin"].includes(role)
  }

  public static canEdit(comment: CommentResponse, userId: string, role: Role) {
    return role === "admin" || role === "uploader" || comment.authorId === userId
  }

  public static async create(data: CommentSchema, auth: AxiosRequestConfig) {
    const response = await this._post("", data, auth)

    const result: ApiResponse<CommentResponse> = this._apiResponse(response.status)

    switch (response.status) {
      case 201:
        result.data = response.data
        break
      case 400:
        result.error = i18n.tc("api.comment.reply_400")
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

  public static async get(commentId: string, delay = false) {
    const response = await this._get(`/${commentId}`, {}, delay)

    const result: ApiResponse<CommentResponse> = this._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 404:
        result.error = i18n.tc("api.comment.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async delete(commentId: string, auth: AxiosRequestConfig) {
    const response = await this._delete(`/${commentId}`, auth)

    const result: ApiResponse<string> = this._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = "OK"
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 404:
        result.error = i18n.tc("api.comment.404")
        break
      case 422:
        result.error = i18n.tc("api.422")
        break
      default:
        result.error = response.data?.detail ?? response.statusText
    }
    return result
  }

  public static async edit(commentId: string, data: CommentEditSchema, auth: AxiosRequestConfig) {
    const response = await this._put(`/${commentId}`, data, auth)

    const result: ApiResponse<CommentResponse> = this._apiResponse(response.status)

    switch (response.status) {
      case 200:
        result.data = response.data
        break
      case 401:
        result.error = i18n.tc("api.401")
        return await this._handle_401(response.config, result)
      case 404:
        result.error = i18n.tc("api.comment.404")
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
