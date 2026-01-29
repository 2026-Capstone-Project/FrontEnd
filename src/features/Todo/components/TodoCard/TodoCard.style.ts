import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Wrapper = styled.div<{ $isHighlight?: boolean; $isEditing?: boolean }>`
  width: 100%;
  height: 88px;
  border-radius: 12px;
  padding: 26px 20px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border: ${({ $isEditing }) => ($isEditing ? `1.5px solid` : 'none')};
  border-color: ${({ $isEditing }) => ($isEditing ? `${theme.colors.textColor3}` : 'none')};
  background: ${({ $isHighlight }) =>
    $isHighlight
      ? ' linear-gradient(90deg, #e9f4f7 0%, rgba(233, 244, 247, 0) 100%), #fff;'
      : 'white'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${media.down(theme.breakPoints.tablet)} {
    padding: 15px 15px;
    height: fit-content;
  }
`
export const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  svg {
    ${media.down(theme.breakPoints.tablet)} {
      width: 16px;
      height: 16px;
    }
  }
`
export const TodoLeftWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`
export const TodoInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
export const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.black};
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 16px;
  }
`
export const Info = styled.div<{ $isHighlight?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  gap: 20px;
  display: flex;
  align-items: center;
  color: ${({ $isHighlight }) =>
    $isHighlight ? `${theme.colors.primary2}` : `${theme.colors.black}`};
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 12px;
    display: flex;

    gap: 4px;
  }
  .repeat-info {
    ${media.down(theme.breakPoints.tablet)} {
      display: none;
    }
  }
`
