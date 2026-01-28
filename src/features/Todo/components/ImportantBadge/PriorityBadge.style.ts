import styled from '@emotion/styled'

export const Badge = styled.span<{ baseColor: string; pointColor: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.pointColor};
  background-color: ${(props) => props.baseColor};
`
