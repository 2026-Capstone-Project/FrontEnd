import moment from 'moment'

export const weekdays = ['일', '월', '화', '수', '목', '금', '토']

export const formatWeekday = (date: Date) => weekdays[moment(date).day()]

export const formatDayHeaderLabel = (date: Date) => {
  const dayMoment = moment(date)
  return dayMoment.date() === 1 ? dayMoment.format('M/D') : dayMoment.format('D')
}

export const formatDayNumber = (date: Date) => moment(date).format('D')
