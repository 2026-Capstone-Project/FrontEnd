/** @jsxImportSource @emotion/react */

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type TModalprops = {
  children: ReactNode
}

export default function Modal({ children }: TModalprops) {
  return createPortal(
    <div
      css={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div>{children}</div>
    </div>,
    document.getElementById('modal-root')!,
  )
}
