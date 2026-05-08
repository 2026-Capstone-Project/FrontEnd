import { type ReactNode, useCallback, useState } from 'react'

export const useEditorRegistry = (onClose: () => void) => {
  const [footerChildren, setFooterChildren] = useState<ReactNode | null>(null)
  const [deleteHandler, setDeleteHandler] = useState<() => void>(() => () => undefined)
  const [closeGuard, setCloseGuard] = useState<null | (() => boolean)>(null)

  const noopDeleteHandler = useCallback(() => undefined, [])

  const registerDeleteHandler = useCallback(
    (handler?: (() => void) | null) => {
      setDeleteHandler(() => handler ?? noopDeleteHandler)
    },
    [noopDeleteHandler],
  )

  const registerFooterChildren = useCallback((node: ReactNode | null) => {
    setFooterChildren((prev) => (prev === node ? prev : node))
  }, [])

  const registerCloseGuard = useCallback((guard?: (() => boolean) | null) => {
    setCloseGuard((prev) => {
      const next = guard ?? null
      return prev === next ? prev : next
    })
  }, [])

  const handleClose = useCallback(() => {
    if (closeGuard && !closeGuard()) return
    onClose()
  }, [closeGuard, onClose])

  return {
    footerChildren,
    deleteHandler,
    handleClose,
    registerDeleteHandler,
    registerFooterChildren,
    registerCloseGuard,
  }
}
