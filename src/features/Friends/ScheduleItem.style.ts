import styled from '@emotion/styled'

import { CommonButton } from './Friend.styles'

export const Container = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: flex-start;
`

export const InviterArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f3f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #adb5bd;
`

export const InviterTextArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InviterTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333333;
`

export const RelativeTime = styled.div`
  font-size: 13px;
  color: #adb5bd;
  margin-top: 2px;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`

export const ActionButton = styled(CommonButton)`
  border-radius: 12px;
`

export const DetailCard = styled.div<{ color: string }>`
  background: ${(props) => `${props.color}1A`};
  padding: 20px;
  border-radius: 20px;
`

export const Title = styled.div`
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Dot = styled.span<{ color: string }>`
  color: ${(props) => props.color || '#ffbb00'};
  font-size: 11px;
`

export const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #495057;
`

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 16px;
    height: 16px;
  }
`
