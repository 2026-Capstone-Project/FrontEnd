import moment from 'moment'
import type { View } from 'react-big-calendar'

import Plus from '@/shared/assets/icons/plus.svg?react'
import { theme } from '@/shared/styles/theme'

import { CustomViewButton } from '../CustomViewButton/CustomViewButton'
import * as S from './CustomCalendar.style'

type CustomCalendarMobileActionsProps = {
  view: View
  onView: (nextView: View) => void
  currentDate: Date
  onAddEvent: (referenceDate?: Date) => void
}

const buildDefaultAddEventDate = (currentDate: Date) =>
  moment(currentDate).startOf('day').set({ hour: 9, minute: 0, second: 0, millisecond: 0 }).toDate()

const CustomCalendarMobileActions = ({
  view,
  onView,
  currentDate,
  onAddEvent,
}: CustomCalendarMobileActionsProps) => (
  <S.MobileButtons>
    <CustomViewButton view={view} onView={onView} className="mobile-custom-view-button" />
    <button
      className="add-button"
      onClick={() => onAddEvent(buildDefaultAddEventDate(currentDate))}
      type="button"
    >
      <Plus height={20} width={20} color={theme.colors.primary} />
    </button>
  </S.MobileButtons>
)

export default CustomCalendarMobileActions
