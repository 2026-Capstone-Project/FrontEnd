import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Card = styled.div`
  width: 426px;
  border-radius: 20px;
  background: ${theme.colors.lightGray};
  padding: 40px 40px 30px 40px;
  box-sizing: border-box;

  ${media.down(theme.breakPoints.tablet)} {
    width: min(90vw, 426px);
  }
`

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 600;
  color: #000000;
`

export const Description = styled.p`
  margin: 32px 0 0;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 500;
  color: ${theme.colors.textColor2};
`

export const ButtonRow = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
`

export const KeepButton = styled.button`
  height: 45px;
  border: none;
  border-radius: 16px;
  background: #d7e2e9;
  color: ${theme.colors.primary2};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`

export const LeaveButton = styled.button`
  height: 45px;
  border: 1px solid ${theme.colors.red};
  border-radius: 16px;
  background: transparent;
  color: ${theme.colors.red};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`
