import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  flex: 1;
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 24px 40px;
  ${media.down(theme.breakPoints.desktop)} {
    padding: 12px 12px;
    border-radius: 16px;
  }
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .add-button {
    padding: 14px 18px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    background-color: ${theme.colors.primary2};
    color: white;
    font-weight: 500;
    font-size: 16px;
    ${media.down(theme.breakPoints.tablet)} {
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
    }
    label {
      ${media.down(theme.breakPoints.tablet)} {
        display: none;
      }
    }
  }
`

export const StateButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

export const StateButton = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  ${({ $isActive }) =>
    $isActive
      ? `background-color: ${theme.colors.primary2}; color: white;`
      : `background-color: white; color: ${theme.colors.textColor3};`}
  ${media.down(theme.breakPoints.tablet)} {
    padding: 6px 12px;
    font-size: 10px;
  }
`
export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
