import { css } from '@emotion/react'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const monthViewStyles = css`
  .rbc-month-view {
    display: flex !important;
    .day-number {
      display: none;
    }
    .rbc-month-row {
      border-top: 1px solid ${theme.colors.lightGray} !important;
      &:first-of-type {
        border-top: none !important;
      }
    }
  }
  .rbc-off-range {
    color: #d2d3d2 !important;
  }
  .rbc-off-range-bg {
    background-color: transparent;
  }
  .rbc-month-row {
    border-top: none;
    min-height: 120px;
    ${media.down(theme.breakPoints.desktop)} {
      min-height: 100px;
    }
    ${media.down(theme.breakPoints.tablet)} {
      min-height: 80px;
    }
  }

  .rbc-day-bg {
    border-left: 1px solid ${theme.colors.lightGray} !important;
  }

  .rbc-date-cell {
    text-align: left;
    padding: 12px;
    .rbc-button-link {
      font-size: 16px;
    }
    &.rbc-now .rbc-button-link {
      background-color: ${theme.colors.red};
      color: white !important;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .rbc-date-cell:first-of-type {
    color: ${theme.colors.red};
  }
  .rbc-date-cell:last-child {
    color: #4784c1;
  }

  .rbc-header {
    color: ${theme.colors.black};
    font-weight: 500;
    display: flex;
    padding: 10px 12px;
    ${media.down(theme.breakPoints.tablet)} {
      width: 100%;
      justify-content: center;
    }
  }

  .rbc-header:first-of-type {
    color: ${theme.colors.red};
  }
  .rbc-header:last-child {
    color: #4784c1;
  }
`
