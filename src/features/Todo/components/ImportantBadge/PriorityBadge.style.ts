import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Badge = styled.span<{ baseColor: string; pointColor: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) => props.pointColor};
  background-color: ${(props) => props.baseColor};
  ${media.down(theme.breakPoints.tablet)} {
    padding: 6px 10px;
    font-size: 10px;
  }
`
