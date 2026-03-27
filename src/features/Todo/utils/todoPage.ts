import { formatYmd } from './todoDate'

// 할 일 진행 조회 API에서 사용하는 기준 날짜 파라미터를 생성한다.
export const getTodoProgressDateParam = (baseDate: Date = new Date()) => formatYmd(baseDate)

// 월의 첫 요일을 기준으로 현재 날짜가 몇 번째 주인지 계산합니다.
// 예: 2026-02-23이면 "2026년 2월 4주차" 형태로 반환됩니다.
export const getTodoWeekTitle = (baseDate: Date = new Date()) => {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1
  const firstDay = new Date(year, baseDate.getMonth(), 1).getDay()
  const weekOfMonth = Math.ceil((baseDate.getDate() + firstDay) / 7)
  return `${year}년 ${month}월 ${weekOfMonth}주차`
}
