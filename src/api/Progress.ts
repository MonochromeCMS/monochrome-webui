import type { AxiosRequestConfig } from 'axios'

import { Base } from './Base'

export interface ProgressTrackingSchema {
  chapterId: string
  page: number
  read: boolean
  chapterVersion: number
}

export class Progress extends Base {
  public static readonly router: string = '/tracking'

  public static async pushTracking(
    trackingData: ProgressTrackingSchema,
    auth: AxiosRequestConfig,
  ) {
    const response = await Progress._post('', trackingData, auth)

    return Progress._handleResponse<ProgressTrackingSchema>(response)
  }
}
