import styled from '@emotion/styled'

export const DayViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
`

export const AllDaySection = styled.div`
  padding: 0 0 20px 50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 40px;
  padding-top: 10px;
  padding: 0 92px;
`

export const TimeSlotRow = styled.div`
  display: flex;
  height: 50px;
  position: relative;
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
`

export const SlotContent = styled.div`
  flex: 1;
  height: 100%;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  position: relative;

  &.last-slot {
    border-bottom: 1px solid #e0e0e0;
  }
`

export const EventBadge = styled.div<{ color?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.color || '#FFF2B2'};
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  z-index: 1;
`

export const DateInfo = styled.div`
  position: relative;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  border-bottom: 1px solid #f5f5f5;
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
  background-color: ${(props) => (props.highlight ? '#e94b43' : 'transparent')};
  color: ${(props) => (props.highlight ? 'white' : '#111827')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

export const EventBadgeWrapper = styled.div<{ color?: string }>`
  background-color: ${(props) => props.color || '#E2F2ED'};
  border-radius: 20px;
  padding: 4px 16px;
  font-size: 12px;
  width: fit-content;
  display: inline-flex;
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
`
