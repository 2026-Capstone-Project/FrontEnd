import type { ShowMoreProps } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

import * as S from './CustomEvent.style'

const CustomMonthShowMore = ({ count }: ShowMoreProps<CalendarEvent>) => (
  <S.MonthShowMore>{`+${count}개`}</S.MonthShowMore>
)

export default CustomMonthShowMore
