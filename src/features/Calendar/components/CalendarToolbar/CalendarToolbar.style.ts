import styled from '@emotion/styled'

export const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  .view-buttons {
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
      color: #111827;
      &.active {
        background: #e9f4f7;
        color: #025a74;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
    }
  }
  .date-label {
    font-size: 24px;
    font-weight: 700;
    color: #202124;
  }
  .nav-buttons {
    display: flex;
    gap: 12px;
    button {
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .next {
      transform: rotate(180deg);
    }
  }
`
