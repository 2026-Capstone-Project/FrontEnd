import Close from '@/shared/assets/icons/close.svg?react'
import { theme } from '@/shared/styles/theme'

import * as S from './RecentSearch.style'
const RecentSearch = ({ name }: { name: string }) => {
  return (
    <S.Wrapper>
      {name}
      <Close width={19} color={theme.colors.textColor3} />
    </S.Wrapper>
  )
}
export default RecentSearch
