/** @jsxImportSource @emotion/react */
import { useId } from 'react'

import Check from '@/shared/assets/icons/rounded_check.svg?react'

import * as S from './TodoCheckbox.style'
const TodoCheckbox = ({
  checked,
  onChange,
  label,
  activeColor,
  inactiveColor,
}: {
  label?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  activeColor?: string
  inactiveColor?: string
}) => {
  const id = useId()
  const checkColor = checked ? '#ffffff' : '#D2D3D2'
  return (
    <S.CheckboxWrapper>
      <S.CheckboxContainer>
        <S.Checkbox
          id={id}
          isChecked={checked}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <S.CheckIcon>
          <Check width={20} height={20} color={checkColor} />
        </S.CheckIcon>
      </S.CheckboxContainer>
      {label && <label htmlFor={id}>{label}</label>}
    </S.CheckboxWrapper>
  )
}
export default TodoCheckbox
