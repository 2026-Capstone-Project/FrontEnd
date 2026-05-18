import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
  const pendingPathRef = useRef<string | null>(null)
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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
    pendingPathRef.current = null
    setIsUnsavedConfirmOpen(false)
  }, [])

  const handleLeaveUnsavedForm = useCallback(() => {
    const pendingPath = pendingPathRef.current
    pendingPathRef.current = null
    setIsUnsavedConfirmOpen(false)
    onDiscard?.()
    if (pendingPath) {
      navigate(pendingPath)
      return
    }
    requestClose(true)
  }, [navigate, onDiscard, requestClose])

  useEffect(() => {
    if (!isDirty) return undefined

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return

      const nextUrl = new URL(anchor.href, window.location.href)
      if (nextUrl.origin !== window.location.origin) return

      const currentPath = `${location.pathname}${location.search}${location.hash}`
      const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
      if (nextPath === currentPath) return

      event.preventDefault()
      event.stopPropagation()
      pendingPathRef.current = nextPath
      setIsUnsavedConfirmOpen(true)
    }

    document.addEventListener('click', handleDocumentClick, true)

    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [isDirty, location.hash, location.pathname, location.search])

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
