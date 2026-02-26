import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import Header from '@/shared/ui/Header/Header'

const Wrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const Content = styled.main`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export default function SettingLayout() {
  return (
    <Wrapper>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  )
}
