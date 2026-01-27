import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const ModalWrapper = styled.div`
  background-color: #fff;
  padding: 40px 50px 20px 50px;
  border-radius: 20px;
  box-shadow: 0 0 100px 30px rgba(0, 0, 0, 0.1);
  width: fit-content;
  max-width: 400px;
  gap: 28px;
  display: flex;
  flex-direction: column;
  ${media.down(theme.breakPoints.mobile)} {
    max-width: 90vw;
  }
`

export const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: ${theme.colors.textColor2};
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const CancelButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${theme.colors.primary2};
  font-size: 16px;
  border-radius: 16px;
  background-color: ${theme.colors.sub};
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
`

export const DeleteButton = styled.button`
  border: 1px solid ${theme.colors.red};
  border-radius: 16px;
  color: ${theme.colors.red};
  font-size: 16px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
`

export const OptionWrapper = styled.div`
  cursor: pointer;
  display: flex;
  gap: 8px;
`
