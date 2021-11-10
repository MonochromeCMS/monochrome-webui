import type { ActionContext } from 'vuex';

export interface NotificationInput {
  color: 'success' | 'error' | 'warning';
  message: string;
  context: string;
}

export interface Notification {
  color: string;
  message: string;
  context: string;
}

interface NotificationsState {
  notifications: Notification[];
  notificationsAmount: number;
}

const colors = {
  error: 'error white--text',
  success: 'success black--text',
  warning: 'warning black--text',
};

const state = (): NotificationsState => ({
  notifications: [],
  notificationsAmount: 0,
});

const getters = {
  getNotification(state: NotificationsState): Notification | null {
    const length = state.notifications.length;
    return length > 0 ? state.notifications[length - 1] : null;
  },
  notificationsAmount(state: NotificationsState): number {
    return state.notificationsAmount;
  },
};

const mutations = {
  addNotification(state: NotificationsState, payload: NotificationInput): void {
    const notification = { ...payload, color: colors[payload.color] };
    state.notifications = state.notifications.concat([notification]);
  },
  closeNotification(state: NotificationsState): void {
    if (state.notifications.length > 0) {
      state.notifications = state.notifications.slice(0, -1);
      state.notificationsAmount = state.notifications.length;
    }
  },
  updateAmount(state: NotificationsState, payload: number) {
    state.notificationsAmount = payload;
  },
};

const actions = {
  async deferAmount({ commit, state }: ActionContext<NotificationsState, any>): Promise<void> {
    const delay = new Promise((resolve) => {
      setTimeout(() => resolve('done!'), 300);
    });

    commit('updateAmount', 0);
    await delay;
    commit('updateAmount', state.notifications.length);
  },
  async pushNotification(
    { commit, state, dispatch }: ActionContext<NotificationsState, any>,
    payload: NotificationInput,
  ): Promise<void> {
    commit('addNotification', payload);
    await dispatch('deferAmount');
  },
};

export default {
  actions,
  getters,
  mutations,
  state,
};
