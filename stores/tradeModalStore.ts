import create from "zustand"

type State = {
  open: boolean
  symbol?: string
  side?: "BUY" | "SELL"
  accountId?: string
  openModal: (payload?: Partial<State>) => void
  closeModal: () => void
}

export const useTradeModalStore = create<State>((set) => ({
  open: false,
  symbol: "BTC",
  side: "BUY",
  accountId: undefined,
  openModal: (payload = {}) => set({ open: true, ...payload }),
  closeModal: () => set({ open: false }),
}))
