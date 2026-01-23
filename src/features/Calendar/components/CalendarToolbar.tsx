import moment from 'moment'
import { type ToolbarProps } from 'react-big-calendar'

import Arrow from '@/assets/icons/chevron.svg?react'
import * as S from '@/pages/Calendar/Calendar.style'

const CustomToolbar = <TEvent extends object>({
  date,
  onView,
  onNavigate,
  view,
}: ToolbarProps<TEvent>) => {
  const formattedLabel =
    view === 'day'
      ? moment(date).format('YYYY년 MM월 DD일')
      : view === 'week'
        ? moment(date).format('YYYY년 M월')
        : moment(date).format('YYYY년 M월')
  return (
    <S.ToolbarWrapper>
      <div className="view-buttons">
        <button className={view === 'month' ? 'active' : ''} onClick={() => onView('month')}>
          월
        </button>
        <button className={view === 'week' ? 'active' : ''} onClick={() => onView('week')}>
          주
        </button>
        <button className={view === 'day' ? 'active' : ''} onClick={() => onView('day')}>
          일
        </button>
      </div>
      <div className="date-label">{formattedLabel}</div>
      <div className="nav-buttons">
        <button onClick={() => onNavigate('PREV')}>
          <Arrow className="back" />
        </button>
        <button onClick={() => onNavigate('NEXT')}>
          <Arrow className="next" />
        </button>
      </div>
    </S.ToolbarWrapper>
  )
}

export default CustomToolbar
