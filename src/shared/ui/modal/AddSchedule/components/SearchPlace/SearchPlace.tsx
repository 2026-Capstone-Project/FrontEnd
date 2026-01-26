import Search from '@/shared/assets/icons/search.svg?react'

import RecentSearch from '../RecentSearch/RecentSearch'
import * as S from './SearchPlace.style'
const SearchPlace = () => {
  const data = [
    { id: 1, name: '강남역 카페' },
    { id: 2, name: '홍대 맛집' },
    { id: 3, name: '여의도 공원' },
    { id: 4, name: '서울숲' },
    { id: 5, name: '이태원 바' },
  ]
  return (
    <S.Wrapper>
      <S.InputWrapper>
        <input type="text" placeholder="장소를 입력하세요" />
        <Search width={20} className="icon" />
      </S.InputWrapper>
      <S.SearchList>
        {data.map((item) => (
          <RecentSearch key={item.id} name={item.name} />
        ))}
      </S.SearchList>
      <div>maparea</div>
    </S.Wrapper>
  )
}
export default SearchPlace
