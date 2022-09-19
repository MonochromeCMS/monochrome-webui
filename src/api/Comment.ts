import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'
import type { Pagination } from './Base'
import type { Role } from './User'
import type { UserResponse } from '@/api/User'

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

export class Comment extends Base {
  public static readonly router: string = '/comment'

  public static canCreate(role: Role) {
    return ['user', 'uploader', 'admin'].includes(role)
  }

  public static canEdit(comment: CommentResponse, userId: string, role: Role) {
    return (
      role === 'admin' || role === 'uploader' || comment.authorId === userId
    )
  }

  public static async create(data: CommentSchema, auth: AxiosRequestConfig) {
    const response = await Comment._post('', data, auth)

    const handlers = {
      400: 'api.comment.reply_400',
    }

    return Comment._handleResponse<CommentResponse>(response, handlers)
  }

  public static async get(commentId: string, delay = false) {
    const response = await Comment._get(`/${commentId}`, {}, delay)

    const handlers = {
      404: 'api.comment.404',
    }

    return Comment._handleResponse<CommentResponse>(response, handlers)
  }

  public static async delete(commentId: string, auth: AxiosRequestConfig) {
    const response = await Comment._delete(`/${commentId}`, auth)

    const handlers = {
      404: 'api.comment.404',
    }

    return Comment._handleResponse<string>(response, handlers)
  }

  public static async edit(
    commentId: string,
    data: CommentEditSchema,
    auth: AxiosRequestConfig,
  ) {
    const response = await Comment._put(`/${commentId}`, data, auth)

    const handlers = {
      404: 'api.comment.404',
    }

    return Comment._handleResponse<CommentResponse>(response, handlers)
  }
}
