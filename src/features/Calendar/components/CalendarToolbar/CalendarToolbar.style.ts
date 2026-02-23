import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${media.down(theme.breakPoints.desktop)} {
    justify-content: center;
  }
  align-items: center;
  padding: 0px 20px 10px 20px;
  position: relative;

  .view-buttons {
    ${media.down(theme.breakPoints.desktop)} {
      display: none;
    }
  }

  .date-label {
    font-size: 24px;
    font-weight: 700;
    color: #202124;
    ${media.down(theme.breakPoints.desktop)} {
      font-size: 20px;
    }
  }
  .nav-buttons {
    display: flex;
    gap: 12px;
    button {
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .back {
      ${media.down(theme.breakPoints.desktop)} {
        width: 20px;
      }
    }
    .next {
      transform: rotate(180deg);
      ${media.down(theme.breakPoints.desktop)} {
        width: 20px;
      }
    }
    ${media.down(theme.breakPoints.desktop)} {
      position: absolute;
      right: 10px;
      gap: 6px;
    }
  }
`
