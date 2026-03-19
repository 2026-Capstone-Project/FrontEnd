import Close from '@/shared/assets/icons/close.svg?react'
import { theme } from '@/shared/styles/theme'

import * as S from './RecentSearch.style'

type RecentSearchProps = {
  name: string
  onClick: () => void
  onDelete?: () => void
}

const RecentSearch = ({ name, onClick, onDelete }: RecentSearchProps) => {
  return (
    <S.Wrapper>
      <S.SearchButton type="button" onClick={onClick}>
        {name}
      </S.SearchButton>
      {onDelete && (
        <S.DeleteButton
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          aria-label={`${name} 최근 검색어 삭제`}
        >
          <Close width={19} color={theme.colors.textColor3} />
        </S.DeleteButton>
      )}
    </S.Wrapper>
  )
}
export default RecentSearch
