import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import DefaultAppLayout from './defaultAppLayout'

const Wrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`

export default function MainLayout() {
  return (
    <Wrapper>
      <DefaultAppLayout>
        <Outlet />
      </DefaultAppLayout>
    </Wrapper>
  )
}
