import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const CalendarDateHeaderCell = styled.button<{
  weekend?: 'sun' | 'sat'
  isToday?: boolean
}>`
  text-align: start;
  font-size: 16px;
  padding: 0;
  width: 100%;
  .date {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ weekend }) =>
      weekend === 'sun'
        ? theme.colors.red
        : weekend === 'sat'
          ? theme.colors.primary2
          : theme.colors.textColor2};
    ${({ isToday }) =>
      isToday
        ? `
    border-radius: 50%;
    padding: 0 6px;
    background-color: ${theme.colors.red};
    color: ${theme.colors.white};
  `
        : ''}
  }
`
