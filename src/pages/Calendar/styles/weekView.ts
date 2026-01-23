import { css } from '@emotion/react'

export const weekViewStyles = css`
  .rbc-time-view {
    display: flex !important;

    .rbc-time-header-content {
      border-left: none !important;
    }

    .rbc-time-content {
      display: none !important;
      border-top: 1px solid #f5f5f5 !important;
    }
  }
  .rbc-time-header-cell {
    .rbc-row .rbc-header:last-child .day-number-wrapper {
      border-right: none !important;
    }
    .rbc-header:nth-of-type(7n) .day-number-wrapper {
      border-right: none !important;
    }
  }
  .rbc-header {
    padding: 0;
  }
  .day-number {
    height: 30px;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 16px;
  }
  .rbc-today {
    .day-number {
      background-color: #e94b43;
      color: white !important;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
  }

  .rbc-allday-cell {
    height: auto !important;
    min-height: 540px !important;
  }

  /* 일요일/토요일 색상 (모든 뷰 공통) */
  .rbc-header:first-of-type .day-name,
  .rbc-header:first-of-type .day-number {
    color: #e94b43;
  }
  .rbc-header:last-child .day-name,
  .rbc-header:last-child .day-number {
    color: #4784c1;
  }
`
