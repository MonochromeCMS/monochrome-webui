import { defineStore } from 'pinia'

export type NotificationColor = 'success' | 'error' | 'warning'

export interface Notification {
  color: NotificationColor
  message: string
  context: string
}

function delay(amount: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve('done!'), amount)
  })
}

export const useNotifications = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    displayAmount: 0,
  }),
  getters: {
    latest: (state) => {
      const length = state.notifications.length
      return length ? state.notifications[length - 1] : null
    },
    amount: state => state.notifications.length,
  },
  actions: {
    async close() {
      this.displayAmount = this.amount - 1
      await delay(300)
      this.notifications.pop()
    },
    async deferAmount() {
      this.displayAmount = 0
      await delay(300)
      this.displayAmount = this.amount
    },
    async push(notification: Notification) {
      this.notifications.push(notification)
      await this.deferAmount()
    },
    async create(color: NotificationColor, context: string, message: string) {
      const notification = { color, context, message }
      await this.push(notification)
    },
  },
})
