import styled from '@emotion/styled'

export const Circle = styled.div<{ backgroundColor?: string }>`
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
`
export const MonthEventContainer = styled.div<{ backgroundColor?: string }>`
  display: flex;
  flex-direction: row;
  gap: 4px;
  white-space: normal;
  align-items: center;
  justify-content: space-between;
  color: #1f1f1f;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
  padding: 0 6px;
  border-radius: 8px;
`

export const WeekEventContainer = styled.div<{ backgroundColor?: string }>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  max-width: 100%;
  justify-self: center;
  gap: 8px;
  color: #1b1b1b;
  background-color: ${({ backgroundColor }) => backgroundColor ?? '#ffffff'};
  padding: 6px 8px;
  border-radius: 4px;
`

export const EventTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EventMeta = styled.div`
  font-size: 8px;
  color: #111827;
  white-space: nowrap;
  width: fit-content;
`
export const EventWeekMeta = styled.div`
  font-size: 10px;
  color: #111827;
`

export const EventLocation = styled.div`
  font-size: 10px;
  color: #111827;
`

export const EventRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  max-width: 85%;
`
