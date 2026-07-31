import { css, Global } from '@emotion/react'

import reset from './reset'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        ${reset}
        /*
          @font-face 선언은 index.html로 옮겼습니다.
          Emotion Global 안에 두면 JS 번들이 실행된 뒤에야 폰트 다운로드가 시작돼 LCP가 늦어집니다.
        */
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
