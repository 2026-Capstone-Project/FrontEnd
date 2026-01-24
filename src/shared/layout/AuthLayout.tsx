import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.gradients.default};
`

export default function AuthLayout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  )
}
