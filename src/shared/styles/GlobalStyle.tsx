import { css, Global } from '@emotion/react'

import reset from './reset'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        ${reset}
        body {
          font-family:
            'Pretendard',
            system-ui,
            -apple-system,
            sans-serif;
          color: #111827; /* 블랙 통일 */
          background-color: #fafafa; /* 전체 바탕 */
        }
      `}
    />
  )
}
