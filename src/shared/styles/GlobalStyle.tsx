import { css, Global } from '@emotion/react'

import reset from './reset'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        @import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap');

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
