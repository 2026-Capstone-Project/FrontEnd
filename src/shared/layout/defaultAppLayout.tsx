/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Outlet } from 'react-router-dom'

import { media } from '../styles/media'
import { theme } from '../styles/theme'
//TODO: 추후 헤더 교체
const DefaultAppLayout = () => {
  return (
    <div css={LayoutWrapper}>
      <div>헤더입니다</div>
      <div css={ContentWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default DefaultAppLayout

const LayoutWrapper = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
`
const ContentWrapper = css`
  flex: 1;
  width: 100%;
  display: flex;
  overflow-x: hidden;
  padding: 24px 48px;
  ${media.down(theme.breakPoints.tablet)} {
    padding: 16px 24px;
  }
  ${media.down(theme.breakPoints.mobile)} {
    padding: 8px 16px;
  }
`
