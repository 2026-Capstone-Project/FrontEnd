import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'
export const ModalWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  overflow: visible;
  padding: 30px 24px 24px 24px;
  gap: 26px;
  display: flex;
  flex-direction: column;
`
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.black};
`
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`
export const Button = styled.button`
  background-color: ${theme.colors.primary2};
  border: none;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`
export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`
export const FooterLeft = styled.div`
  flex: 1;
`
