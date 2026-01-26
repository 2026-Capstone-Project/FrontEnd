import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const DayViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  background-color: #fff;
  overflow-y: auto;
`

export const AllDaySection = styled.div`
  max-width: 600px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex-direction: column;
  width: 100%;
  column-gap: 40px;
  row-gap: 8px;
  ${media.down(theme.breakPoints.desktop)} {
    padding: 40px 0 0 0;
    grid-template-columns: 1fr;
  }
`

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  padding-top: 10px;
  max-width: 600px;
  width: 100%;
  ${media.down(theme.breakPoints.desktop)} {
    padding: 10px 0;
    column-gap: 20px;
    margin-top: 20px;
  }
`

export const SlotColumn = styled.div`
  position: relative;
  width: 100%;
`

export const TimeOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50px;
  right: 0;
  pointer-events: none;
  width: auto;
  ${media.down(theme.breakPoints.tablet)} {
    left: 33px;
  }
`

export const TimeSlotRow = styled.div`
  display: flex;
  height: 50px;
  position: relative;
  ${media.down(theme.breakPoints.desktop)} {
    height: 40px;
  }
`

export const TimeLabel = styled.div`
  width: 50px;
  font-size: 12px;
  color: #757575;
  text-align: right;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  line-height: 1;
  ${media.down(theme.breakPoints.desktop)} {
    width: 33px;
    font-size: 10px;
  }
`

export const SlotContent = styled.div`
  flex: 1;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-top: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  position: relative;

  &.last-slot {
    border-bottom: 1px solid #e0e0e0;
  }
`

export const EventBadge = styled.div<{ color?: string }>`
  position: relative;
  background-color: ${(props) => props.color || '#FFF2B2'};
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  z-index: 1;
`

export const DayEventBadge = styled(EventBadge)`
  position: absolute;
  right: 1px;
  left: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  width: 100%;
  padding: 8px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
`

export const DateInfo = styled.div`
  position: relative;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`

export const DateLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
`

export const DateCircle = styled.div<{ highlight?: boolean }>`
  position: absolute;
  top: 50px;
  width: 30px;
  height: 30px;
  background-color: ${(props) => (props.highlight ? props.theme.colors.red : 'transparent')};
  color: ${(props) => (props.highlight ? 'white' : props.theme.colors.black)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

export const EventBadgeWrapper = styled.div<{ color?: string }>`
  background-color: ${(props) => props.color || '#E2F2ED'};
  border-radius: 20px;
  padding: 0px 8px;
  gap: 4px;
  font-size: 12px;
  align-items: center;
  width: 100%;
  display: flex;

  ${media.down(theme.breakPoints.desktop)} {
    padding: 4px;
  }
`

export const EventTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.black};
`

export const EventMeta = styled.div`
  font-size: 11px;
  color: #4b5563;
`

export const EventLocation = styled.div`
  font-size: 11px;
  color: #4b5563;
`

export const EventRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const PlaceholderLabel = styled.div`
  width: 50px;
  flex-shrink: 0;
`

export const CalendarWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`
export const Circle = styled.div<{ backgroundColor?: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
`

export const dayViewStyles = css`
  /* 전체 컨테이너 높이 및 스크롤 제거 */
  .rbc-time-view {
    border: none !important;
    overflow: visible !important;
    height: auto !important;
    flex: none !important;
  }

  /* 헤더(요일/숫자) 영역 - 종강, 할머니댁 같은 All-day 이벤트 배치 */
  .rbc-time-header {
    margin-right: 0 !important;
    .rbc-time-header-content {
      border-left: none !important;
    }
  }

  /* 핵심: 시간 영역을 Grid로 2단 분할 */
  .rbc-time-content {
    display: grid !important;
    grid-template-columns: 1fr 1fr; /* 좌우 50%씩 */
    border-top: none !important;
    overflow: visible !important;
    height: auto !important;
    gap: 0 40px; /* 좌우 컬럼 사이 간격 */
    padding: 0 20px;
  }

  /* 시간 라벨과 그리드를 감싸는 기본 컬럼 설정 해제 */
  .rbc-time-gutter,
  .rbc-day-slot {
    flex: none !important;
    width: 100% !important;
  }

  /* 시간 숫자(00:00) 스타일 */
  .rbc-label {
    padding: 0 10px !important;
    font-size: 13px;
    color: #70757a;
  }

  /* 각 시간 칸의 높이 조절 */
  .rbc-timeslot-group {
    min-height: 45px !important;
    border-bottom: 1px solid #f1f1f1 !important;
  }

  /* 00-11시와 12-23시를 구분하는 로직은 JS에서 처리하는 것이 베스트이나, 
     CSS만으로 구현할 경우 다음과 같이 처리합니다. */

  /* 좌측 컬럼 (0시~12시만 표시) */
  .rbc-time-content > .rbc-time-gutter {
    grid-column: 1;
    display: flex;
    flex-direction: column;
  }

  /* 우측 컬럼 (12시~24시 표시용 가상 요소처럼 작동하게 구성) */
  .rbc-day-slot {
    grid-column: 2;
    border-left: 1px solid #f1f1f1 !important;
  }

  /* 이벤트 스타일 */
  .rbc-event {
    border: none !important;
    border-radius: 4px !important;
    padding: 10px !important;
    width: 95% !important;
    left: 2.5% !important;
  }
`
