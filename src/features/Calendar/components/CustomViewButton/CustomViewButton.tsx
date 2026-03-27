import type { View } from 'react-big-calendar'

import * as S from './CustomViewButton.style'
export const CustomViewButton = ({
  view,
  onView,
  className,
}: {
  view: View
  onView: (view: View) => void
  className?: string
}) => {
  return (
    <S.ButtonWrapper className={className}>
      <button className={view === 'month' ? 'active' : ''} onClick={() => onView('month')}>
        월
      </button>
      <button className={view === 'week' ? 'active' : ''} onClick={() => onView('week')}>
        주
      </button>
      <button className={view === 'day' ? 'active' : ''} onClick={() => onView('day')}>
        일
      </button>
    </S.ButtonWrapper>
  )
}
