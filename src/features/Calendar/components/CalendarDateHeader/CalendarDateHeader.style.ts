import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const CalendarDateHeaderCell = styled.button<{ weekend?: 'sun' | 'sat' }>`
  text-align: start;
  font-size: 16px;
  padding: 0;
  width: 100%;
  color: ${({ weekend }) =>
    weekend === 'sun' ? theme.colors.red : weekend === 'sat' ? theme.colors.primary2 : 'inherit'};
`
