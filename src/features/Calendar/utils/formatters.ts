import moment from 'moment'

import { WEEK_DAYS } from '@/shared/constants/weekDays'

export const formatWeekday = (date: Date) => WEEK_DAYS[moment(date).day()]

export const formatDayHeaderLabel = (date: Date) => {
  const dayMoment = moment(date)
  return dayMoment.date() === 1 ? dayMoment.format('M/D') : dayMoment.format('D')
}

export const formatDayNumber = (date: Date) => moment(date).format('D')
