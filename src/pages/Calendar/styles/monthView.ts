import { css } from '@emotion/react'

export const monthViewStyles = css`
  .rbc-month-view {
    display: flex !important;
    .day-number {
      display: none;
    }
    .rbc-month-row {
      border-top: 1px solid #f5f5f5 !important;
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
  }

  .rbc-day-bg {
    border-left: 1px solid #f5f5f5 !important;
  }

  .rbc-date-cell {
    text-align: left;
    padding: 12px;
    .rbc-button-link {
      font-size: 16px;
    }
    &.rbc-now .rbc-button-link {
      background-color: #e94b43;
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
    color: #e94b43;
  }
  .rbc-date-cell:last-child {
    color: #4784c1;
  }

  .rbc-header {
    color: #111827;
    font-weight: 500;
    display: flex;
    padding: 10px 12px;
  }

  .rbc-header:first-of-type {
    color: #e94b43;
  }
  .rbc-header:last-child {
    color: #4784c1;
  }
`
