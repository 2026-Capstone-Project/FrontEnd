import { type ToolbarProps } from 'react-big-calendar'

import Arrow from '@/assets/icons/common/chevron.svg?react'
import { theme } from '@/shared/styles/theme'
import dayjs from '@/shared/utils/dayjs'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import * as S from './CalendarToolbar.style'

const CustomToolbar = <TEvent extends object>({
  date,
  onView,
  onNavigate,
  view,
}: ToolbarProps<TEvent>) => {
  const formattedLabel = dayjs(date).format('YYYY년 M월')
  return (
    <S.ToolbarWrapper>
      <CustomViewButton view={view} onView={onView} className="view-buttons" />
      <button
        type="button"
        className="date-label"
        onClick={() => onNavigate('TODAY')}
        title="오늘로 이동"
        aria-label="오늘로 이동"
      >
        {formattedLabel}
      </button>
      <div className="nav-buttons">
        <button onClick={() => onNavigate('PREV')} aria-label="이전 달">
          <Arrow className="back" color={theme.colors.black} />
        </button>
        <button onClick={() => onNavigate('NEXT')} aria-label="다음 달">
          <Arrow className="next" color={theme.colors.black} />
        </button>
      </div>
    </S.ToolbarWrapper>
  )
}

export default CustomToolbar
