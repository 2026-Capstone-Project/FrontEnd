import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import Header from '@/features/Common/Header'

import DefaultAppLayout from './defaultAppLayout'

const Wrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

export default function MainLayout() {
  return (
    <Wrapper>
      <Header />
      <DefaultAppLayout>
        <Outlet />
      </DefaultAppLayout>
    </Wrapper>
  )
}
