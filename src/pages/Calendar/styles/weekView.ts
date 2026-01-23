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

  .rbc-row {
    margin: 0;
    border: none;
  }

  .rbc-row-segment {
    padding: 0;
    margin: 0;
    height: fit-content;
  }

  .rbc-time-view .rbc-row,
  .rbc-time-view .rbc-row-segment {
    border: none !important;
    box-sizing: border-box;
    gap: 0;
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

  .rbc-day-bg {
    height: 100%;
    width: 100%;
    right: 0;
    border-right: 0.5px solid #f5f5f5;
    border-left: 0.5px solid #f5f5f5;
  }
  .rbc-time-gutter {
    display: none;
  }
  .rbc-addons-dnd-row-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rbc-addons-dnd-row-body > div {
    width: 100%;
  }
  .rbc-event-content {
    padding: 2px;
  }
`
