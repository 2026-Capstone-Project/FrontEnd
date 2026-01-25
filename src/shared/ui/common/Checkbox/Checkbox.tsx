/** @jsxImportSource @emotion/react */
import { useId } from 'react'

import Check from '@/shared/assets/icons/rounded_check.svg?react'

import * as S from './Checkbox.style'
const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const id = useId()
  return (
    <S.CheckboxWrapper>
      <S.CheckboxContainer>
        <S.Checkbox
          id={id}
          isChecked={checked}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <S.CheckIcon isVisible={checked}>
          <Check width={12} height={12} />
        </S.CheckIcon>
      </S.CheckboxContainer>
      <label htmlFor={id}>{label}</label>
    </S.CheckboxWrapper>
  )
}
export default Checkbox
