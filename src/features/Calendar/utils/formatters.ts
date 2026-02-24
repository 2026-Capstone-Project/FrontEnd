import moment from 'moment'

import { WEEK_DAYS } from '@/shared/constants/event'

// 주 단위 헤더에서 사용할 요일(일~토) 문자열을 반환한다.
export const formatWeekday = (date: Date) => WEEK_DAYS[moment(date).day()]

// 월간/일간 헤더에서 날짜가 1일이면 "M/D", 아니면 "D" 형태로 표시한다.
export const formatDayHeaderLabel = (date: Date) => {
  const dayMoment = moment(date)
  return dayMoment.date() === 1 ? dayMoment.format('M/D') : dayMoment.format('D')
}

// 월간 셀의 숫자 라벨을 한 자리 또는 두 자리 날짜로 정규화한다.
export const formatDayNumber = (date: Date) => moment(date).format('D')
