import type { View } from 'react-big-calendar'

import Plus from '@/assets/icons/common/plus.svg?react'
import { theme } from '@/shared/styles/theme'
import dayjs from '@/shared/utils/dayjs'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import * as S from './CustomCalendar.style'

type CustomCalendarMobileActionsProps = {
  view: View
  onView: (nextView: View) => void
  currentDate: Date
  onAddEvent: (referenceDate?: Date) => void
}

const buildDefaultAddEventDate = (currentDate: Date) =>
  dayjs(currentDate).startOf('day').hour(9).toDate()

const CustomCalendarMobileActions = ({
  view,
  onView,
  currentDate,
  onAddEvent,
}: CustomCalendarMobileActionsProps) => (
  <S.MobileButtons>
    <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
    <button
      aria-label="새 일정 추가"
      className="add-button"
      onClick={() => onAddEvent(buildDefaultAddEventDate(currentDate))}
      type="button"
    >
      <Plus
        aria-hidden="true"
        focusable="false"
        height={20}
        width={20}
        color={theme.colors.primary}
      />
    </button>
  </S.MobileButtons>
)

export default CustomCalendarMobileActions
