import { css, Global } from '@emotion/react'

import reset from './reset'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        ${reset}
        @font-face {
          font-family: 'GmarketSansMedium';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff')
            format('woff');
        }
        @font-face {
          font-family: 'KIMM_Light';
          src: url('https://cdn.jsdelivr.net/gh/fontbee/font@main/Kimm/KIMM_Light.woff2')
            format('woff2');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'NanumSquare';
          src: url('https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css');
          font-style: normal;
          font-display: swap;
        }
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
