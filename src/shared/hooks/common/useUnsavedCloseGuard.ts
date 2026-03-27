import { useCallback, useEffect, useRef, useState } from 'react'

type UseUnsavedCloseGuardArgs = {
  isDirty: boolean
  onClose: () => void
  onDiscard?: () => void
  registerCloseGuard?: (guard?: (() => boolean) | null) => void
}

export const useUnsavedCloseGuard = ({
  isDirty,
  onClose,
  onDiscard,
  registerCloseGuard,
}: UseUnsavedCloseGuardArgs) => {
  const allowCloseRef = useRef(false)
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false)

  const requestClose = useCallback(
    (force?: boolean) => {
      if (force) {
        allowCloseRef.current = true
      }
      onClose()
    },
    [onClose],
  )

  // 모달 레이아웃에서 닫기 클릭 시 이 가드가 실행됩니다.
  // isDirty 상태면 즉시 닫지 않고 확인 모달을 띄워 사용자 선택을 받습니다.
  const closeGuard = useCallback(() => {
    if (allowCloseRef.current) {
      allowCloseRef.current = false
      return true
    }
    if (!isDirty) return true
    setIsUnsavedConfirmOpen(true)
    return false
  }, [isDirty])

  const handleCloseUnsavedConfirm = useCallback(() => {
    setIsUnsavedConfirmOpen(false)
  }, [])

  const handleLeaveUnsavedForm = useCallback(() => {
    setIsUnsavedConfirmOpen(false)
    onDiscard?.()
    requestClose(true)
  }, [onDiscard, requestClose])

  useEffect(() => {
    if (!registerCloseGuard) return
    registerCloseGuard(closeGuard)
    return () => registerCloseGuard()
  }, [closeGuard, registerCloseGuard])

  return {
    isUnsavedConfirmOpen,
    requestClose,
    handleCloseUnsavedConfirm,
    handleLeaveUnsavedForm,
  }
}
