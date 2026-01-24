import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

const Wrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
`

export default function MainLayout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  )
}
