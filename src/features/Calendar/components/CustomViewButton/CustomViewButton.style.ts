import styled from '@emotion/styled'
export const ButtonWrapper = styled.div`
  background: white;
  padding: 4px;
  border-radius: 12px;
  display: flex;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  button {
    border: none;
    padding: 8px 18px;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.black};
    &.active {
      background: ${({ theme }) => theme.colors.sub};
      color: ${({ theme }) => theme.colors.textPrimary};
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
  }
`
