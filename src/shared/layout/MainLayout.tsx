import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import Header from '@/shared/ui/Header/Header'

import DefaultAppLayout from './defaultAppLayout'

const Wrapper = styled.div`
  min-height: 100dvh;
  height: 100dvh;
  max-height: 100dvh;
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
