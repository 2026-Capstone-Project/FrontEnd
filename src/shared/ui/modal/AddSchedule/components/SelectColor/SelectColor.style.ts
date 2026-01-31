import styled from '@emotion/styled'

export const CircleOption = styled.div<{ color: string; isSelected?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &::after {
    content: '${(props) => (props.isSelected ? '✓' : '')}';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
  }
`

export const Circle = styled.div<{ color: string }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`
export const ColorDropdown = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
  padding: 8px 4px 8px 10px;
  width: fit-content;
  align-items: center;
  background-color: ${(props) => props.theme.colors.inputColor};
  border-radius: 8px;
  cursor: pointer;
`
export const ColorOptions = styled.div`
  position: absolute;
  top: 42px;
  right: 0px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  column-gap: 12px;
  padding: 10px;
  background-color: ${(props) => props.theme.colors.inputColor};
  border-radius: 8px;
`
