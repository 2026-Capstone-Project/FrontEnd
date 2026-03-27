import styled from '@emotion/styled'

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .day-number-wrapper {
    width: 100%;
    display: flex;
    border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-right: 0.5px solid ${({ theme }) => theme.colors.lightGray};
    border-left: 0.5px solid ${({ theme }) => theme.colors.lightGray};
    padding: 12px;
    justify-content: flex-start;
    align-items: center;
  }

  .day-name {
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    color: #70757a;
    padding: 10px 0;
    text-align: center;
  }
`
