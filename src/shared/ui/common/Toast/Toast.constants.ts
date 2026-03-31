import type { ToastType } from '@/shared/types/common/toast'

export type ToastVariant = {
  background: string
  accent: string
  titleColor: string
  messageColor: string
}

export const TOAST_VARIANTS: Record<ToastType, ToastVariant> = {
  success: {
    background: '#E8F8F5',
    accent: '#2BBDA8',
    titleColor: '#0F6E56',
    messageColor: '#63B9A8',
  },
  error: {
    background: '#FEF0F0',
    accent: '#F47878',
    titleColor: '#C0392B',
    messageColor: '#F28C89',
  },
  warning: {
    background: '#FEF8EC',
    accent: '#F5B942',
    titleColor: '#9A6800',
    messageColor: '#F0BE54',
  },
  info: {
    background: '#EAF4FB',
    accent: '#6DB8E8',
    titleColor: '#1A6FA8',
    messageColor: '#7EB5E7',
  },
}
