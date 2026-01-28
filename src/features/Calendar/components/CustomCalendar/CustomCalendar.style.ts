import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { dayViewStyles } from '@/features/Calendar/components/CustomView/dayView'
import { monthViewStyles } from '@/features/Calendar/components/CustomView/monthView'
import { weekViewStyles } from '@/features/Calendar/components/CustomView/weekView'
import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const DayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  width: 100%;
  height: 44px; /* 높이 고정 */
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; /* 요일과 숫자 사이 구분선 */
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray}; /* 요일과 숫자 사이 구분선 */

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

export const MobileButtons = styled.div`
  display: none;
  width: 100%;
  margin-bottom: 12px;
  ${media.down(theme.breakPoints.desktop)} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-button {
    position: absolute;
    right: 0;
    background-color: #e9f4f7;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
`

export const CalendarWrapper = styled.div<{ view: string }>`
  width: 100%;
  height: ${(props) => (props.view === 'week' ? 'auto' : 'fit-content')};
  min-height: 600px;
  padding: 20px 0 0 0;
  background-color: white;
  border: 1px solid #efefef;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;

  ${media.down(theme.breakPoints.tablet)} {
    min-height: fit-content;
  }
  .rbc-calendar {
    font-family: 'Pretendard', sans-serif;
  }

  /* 1. 모든 기본 테두리 제거 및 초기화 */
  .rbc-month-view,
  .rbc-time-view,
  .rbc-header,
  .rbc-month-row,
  .rbc-time-header {
    border: none !important;
  }
  .rbc-label {
    padding: 0;
  }

  .rbc-row-bg {
    right: 0;
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
    background-color: transparent;
    .day-number {
      background-color: ${theme.colors.red};
      color: white !important;
    }
    .day-name {
      color: ${(props) => (props.view === 'month' ? theme.colors.red : '')} !important;
    }
  }

  .rbc-date-header {
    .day-number {
      transition:
        background-color 0.2s,
        color 0.2s;
    }
    &.rbc-active .day-number,
    .rbc-active .day-number {
      background-color: ${theme.colors.primary2};
      color: ${theme.colors.white};
    }
  }

  .rbc-date-cell {
    &.rbc-selected .day-number,
    &:focus-within .day-number {
      background-color: ${theme.colors.primary2};
      color: ${theme.colors.white};
      box-shadow: 0 0 0 2px ${theme.colors.primary2};
    }
  }

  ${(props) => (props.view === 'month' ? monthViewStyles : css``)}
  ${(props) => (props.view === 'week' ? weekViewStyles : css``)}
  ${(props) => (props.view === 'day' ? dayViewStyles : css``)}

  /* --- 이벤트 스타일 --- */
  .rbc-event {
    background-color: transparent;
    color: inherit;
    border: none !important;
    border-radius: 0 !important;
    padding: 0;
    font-size: inherit;
  }
`
