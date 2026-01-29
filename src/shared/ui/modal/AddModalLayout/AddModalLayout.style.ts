import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const ModalOverlay = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: fit-content;

  ${media.down(theme.breakPoints.desktop)} {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1000;
    height: 100vh;
  }
`

export const ModalInner = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ModalWrapper = styled.div<{ mode: 'modal' | 'inline' }>`
  width: 100%;
  max-width: 90vw;
  width: 420px;
  height: fit-content;
  max-height: 80vh;
  overflow: hidden;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  gap: 26px;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10000;
  top: 0;
  ${media.down(theme.breakPoints.desktop)} {
    top: auto;
    align-self: center;
    justify-self: center;
  }
`
export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 24px 0px 24px;
`

export const ModalHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const HeaderExtras = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`
export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.black};
`
export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  scrollbar-gutter: stable both-edges;
`
export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0px 24px 24px 24px;
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

export const InlineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
