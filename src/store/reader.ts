import { defineStore } from 'pinia'

type FakeBoolean = 0 | 1

type ReaderMode = 'single' | 'double' | 'vertical'

export const useReader = defineStore('reader', {
  state: () => ({
    direction: 0 as FakeBoolean,
    fit: 'default',
    parity: 0 as FakeBoolean,
    width: '75%',
    readerMode: 'single' as ReaderMode,
  }),
  persist: {
    key: 'monochrome-state-reader',
  },
})
