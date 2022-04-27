type fakeBoolean = 0 | 1

interface ReaderState {
  direction: fakeBoolean
  readerMode: string
  parity: fakeBoolean
  width: string
  fit: string
}

const state = (): ReaderState => ({
  direction: 0,
  fit: "default",
  parity: 0,
  readerMode: "Single",
  width: "75%",
})

const getters = {
  getDirection(state: ReaderState): fakeBoolean {
    return state.direction
  },
  getFit(state: ReaderState): string {
    return state.fit
  },
  getParity(state: ReaderState): fakeBoolean {
    return state.parity
  },
  getReaderMode(state: ReaderState): string {
    return state.readerMode
  },
  getWidth(state: ReaderState): string {
    return state.width
  },
}

const mutations = {
  setDirection(state: ReaderState, payload: fakeBoolean): void {
    state.direction = payload
  },
  setFit(state: ReaderState, payload: string): void {
    state.fit = payload
  },
  setParity(state: ReaderState, payload: fakeBoolean): void {
    state.parity = payload
  },
  setReaderMode(state: ReaderState, payload: string): void {
    state.readerMode = payload
  },
  setWidth(state: ReaderState, payload: string): void {
    state.width = payload
  },
}

export default {
  getters,
  mutations,
  state,
}
