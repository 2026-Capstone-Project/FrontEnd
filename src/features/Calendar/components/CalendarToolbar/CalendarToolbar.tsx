import moment from 'moment'
import { type ToolbarProps } from 'react-big-calendar'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { theme } from '@/shared/styles/theme'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import * as S from './CalendarToolbar.style'

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
      <CustomViewButton view={view} onView={onView} className="view-buttons" />
      <div className="date-label">{formattedLabel}</div>
      <div className="nav-buttons">
        <button onClick={() => onNavigate('PREV')}>
          <Arrow className="back" color={theme.colors.black} />
        </button>
        <button onClick={() => onNavigate('NEXT')}>
          <Arrow className="next" color={theme.colors.black} />
        </button>
      </div>
    </S.ToolbarWrapper>
  )
}

export default CustomToolbar
