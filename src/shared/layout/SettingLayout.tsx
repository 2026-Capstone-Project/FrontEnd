import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import Header from '@/shared/ui/Header/Header'

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
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
