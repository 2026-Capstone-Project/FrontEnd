import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { monthViewStyles } from './styles/monthView'
import { weekViewStyles } from './styles/weekView'
import { dayViewStyles } from './styles/dayView'

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .day-number-wrapper {
    width: 100%;
    display: flex;
    border-top: 1px solid #f5f5f5;
    border-right: 1px solid #f5f5f5;
    padding: 12px;
    justify-content: flex-start;
    align-items: center;
  }

  .day-name {
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    color: #70757a;
    padding: 10px 0;
    text-align: center;
  }
`

export const DayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  width: 100%;
  height: 44px; /* 높이 고정 */
  border-top: 1px solid #f5f5f5; /* 요일과 숫자 사이 구분선 */
  border-right: 1px solid #f5f5f5; /* 요일과 숫자 사이 구분선 */

  .day-number {
    font-size: 16px;
    margin: 8px 0; /* 숫자 위아래 간격 */
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
`

export const CalendarWrapper = styled.div<{ view: string }>`
  width: 100%;
  max-width: 900px;
  height: ${(props) => (props.view === 'week' ? 'auto' : 'fit-content')};
  min-height: 600px;
  margin: 0 auto;
  padding: 20px 0 0 0;
  background-color: white;
  border: 1px solid #efefef;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  .rbc-calendar {
    font-family: 'Pretendard', sans-serif;
  }

  .rbc-date-cell {
    text-align: start;
    padding: 12px;
    .rbc-button-link {
      font-size: 16px;
    }
  }

  /* 1. 모든 기본 테두리 제거 및 초기화 */
  .rbc-month-view,
  .rbc-time-view,
  .rbc-header,
  .rbc-month-row,
  .rbc-day-bg,
  .rbc-time-header {
    border: none !important;
  }
  .rbc-label {
    padding: 0;
  }
  /* 2. 주간/일간 뷰 세로선 (All-day 영역 포함) */
  .rbc-day-bg {
    border-left: 1px solid #f5f5f5 !important;
    &:first-of-type {
      border-left: none !important;
    }
  }

  /* 3. 헤더 영역 스타일 */
  .rbc-header {
    border-bottom: none !important;
    .rbc-button-link {
      width: 100%;
    }
  }

  /* 4. 오늘 날짜 하이라이트 */
  .rbc-today,
  .rbc-current {
    background-color: transparent !important;
    .day-number {
      background-color: #e94b43;
      color: white !important;
    }
    .day-name {
      color: ${(props) => (props.view === 'month' ? '#e94b43' : '')} !important;
    }
  }

  ${(props) => (props.view === 'month' ? monthViewStyles : css``)}
  ${(props) => (props.view === 'week' ? weekViewStyles : css``)}
  ${(props) => (props.view === 'day' ? dayViewStyles : css``)}

  /* --- 이벤트 스타일 --- */
  .rbc-event {
    background-color: #f3f4f6;
    color: #374151;
    border: none !important;
    border-radius: 8px !important;
    padding: 6px 10px;
    margin: 2px 4px !important;
    font-size: 12px;
  }
`
export const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  .view-buttons {
    background: white;
    padding: 4px;
    border-radius: 12px;
    display: flex;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
    button {
      border: none;
      padding: 8px 18px;
      border-radius: 10px;
      background: transparent;
      cursor: pointer;
      font-size: 13px;
      color: #111827;
      &.active {
        background: #e9f4f7;
        color: #025a74;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
    }
  }
  .date-label {
    font-size: 24px;
    font-weight: 700;
    color: #202124;
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
    .next {
      transform: rotate(180deg);
    }
  }
`
