import { create } from 'zustand'

import type { ToastType } from '@/shared/ui/common/Toast/Toast.constants'

type ToastPayload = {
  title: string
  message: string
  toastType: ToastType
  autoCloseDuration?: number
}

type ToastItem = ToastPayload & {
  id: number
}

interface ToastState {
  toast: ToastItem | null
  showToast: (payload: ToastPayload) => void
  hideToast: () => void
}

let toastId = 0

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (payload) =>
    set({
      toast: {
        id: (toastId += 1),
        ...payload,
      },
    }),
  hideToast: () => set({ toast: null }),
}))
