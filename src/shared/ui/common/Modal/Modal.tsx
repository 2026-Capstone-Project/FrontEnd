/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type TModalprops = {
  children: ReactNode
  onClick?: () => void
}

export default function Modal({ children, onClick }: TModalprops) {
  return createPortal(
    <div
      onClick={onClick}
      css={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20000,
      }}
    >
      <div
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!,
  )
}
