import type { ComponentType, SVGProps } from 'react'
import { useEffect, useState } from 'react'

import CheckIcon from '@/assets/icons/check.svg?react'
import WarningIcon from '@/assets/icons/exclamation.svg?react'
import FolderIcon from '@/assets/icons/folder.svg?react'
import InfoIcon from '@/assets/icons/uil_info.svg?react'
import CloseIcon from '@/shared/assets/icons/close.svg?react'

import { TOAST_VARIANTS, type ToastType } from './Toast.constants'
import * as S from './Toast.style'

type ToastProps = {
  title: string
  message: string
  toastType: ToastType
  isOpen?: boolean
  onClose?: () => void
  autoCloseDuration?: number
}

const ICON_SIZE: Record<ToastType, number> = {
  success: 20,
  warning: 20,
  info: 18,
  error: 18,
}

const ICON_COMPONENTS: Record<ToastType, ComponentType<SVGProps<SVGSVGElement>>> = {
  success: CheckIcon,
  warning: WarningIcon,
  info: InfoIcon,
  error: FolderIcon,
}

const Toast = ({
  title,
  message,
  toastType,
  isOpen = true,
  onClose,
  autoCloseDuration = 3000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    setIsVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (!isVisible) return

    const timer = window.setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, autoCloseDuration)

    return () => window.clearTimeout(timer)
  }, [autoCloseDuration, isVisible, onClose])

  if (!isVisible) return null

  const variant = TOAST_VARIANTS[toastType]

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const renderStatusIcon = () => {
    const StatusIcon = ICON_COMPONENTS[toastType]

    return <StatusIcon width={ICON_SIZE[toastType]} height={ICON_SIZE[toastType]} />
  }

  return (
    <S.Viewport>
      <S.Card
        $accent={variant.accent}
        $background={variant.background}
        role="status"
        aria-live="assertive"
      >
        <S.Header>
          <S.StatusBadge>{renderStatusIcon()}</S.StatusBadge>
          <S.CloseButton
            $color={variant.accent}
            type="button"
            onClick={handleClose}
            aria-label="토스트 닫기"
          >
            <CloseIcon />
          </S.CloseButton>
        </S.Header>

        <S.Content>
          <S.Title $color={variant.titleColor}>{title}</S.Title>
          <S.Message $color={variant.messageColor}>{message}</S.Message>
        </S.Content>
      </S.Card>
    </S.Viewport>
  )
}

export default Toast
