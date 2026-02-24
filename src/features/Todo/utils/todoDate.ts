type DueTimeObject = {
  hour: number
  minute: number
  second: number
  nano: number
}

export type DueTimeLike = string | DueTimeObject | undefined

// 오늘(00:00)을 기준으로 offset일 만큼 이동한 ISO 문자열을 만든다.
export const getIsoDateWithOffset = (offset: number) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString()
}

// Date 객체를 API 파라미터에서 사용하는 YYYY-MM-DD 문자열로 변환한다.
export const formatYmd = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`

// Todo 전용 날짜 문자열(YYYY-MM-DD)을 로컬 Date로 안전하게 파싱한다.
const parseYmd = (value: string) => {
  const [year, month, day] = value.split('-').map((part) => Number.parseInt(part, 10))
  return new Date(year, (month || 1) - 1, day || 1)
}

// dueTime이 문자열/객체 어느 형태로 오더라도 표시용 HH:mm 문자열로 통일한다.
const formatTime = (value?: DueTimeLike) => {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 5)
  const hour = String(value.hour ?? 0).padStart(2, '0')
  const minute = String(value.minute ?? 0).padStart(2, '0')
  return `${hour}:${minute}`
}

// 상대 날짜 문구(이번주/다음주)에 들어갈 요일 한글 라벨을 반환한다.
const getWeekLabel = (date: Date) => {
  const names = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return names[date.getDay()] ?? ''
}

// Todo 카드에 표시할 상대 날짜 텍스트를 계산합니다.
// 예: 오늘/내일/이번주 월요일/다음주 화요일 혹은 YYYY.MM.DD
export const getTodoDateLabel = (occurrenceDate: string, dueTime?: DueTimeLike) => {
  const targetDate = parseYmd(occurrenceDate)
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.floor((targetDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
  const timeLabel = formatTime(dueTime)
  if (diffDays === 0) return `오늘 ${timeLabel}`.trim()
  if (diffDays === 1) return `내일 ${timeLabel}`.trim()
  if (diffDays >= 2 && diffDays <= 6)
    return `이번주 ${getWeekLabel(targetDate)} ${timeLabel}`.trim()
  if (diffDays >= 7 && diffDays <= 13)
    return `다음주 ${getWeekLabel(targetDate)} ${timeLabel}`.trim()
  const ymd = `${targetDate.getFullYear()}.${String(targetDate.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(targetDate.getDate()).padStart(2, '0')}`
  return timeLabel ? `${ymd} ${timeLabel}` : ymd
}

// 마감 시각 비교를 위해 occurrenceDate + dueTime을 실제 Date 객체로 변환합니다.
// 종일 할 일은 해당 날짜 23:59:59.999를 마감 시각으로 사용합니다.
export const getTodoDueDateTime = (
  occurrenceDate: string,
  dueTime?: DueTimeLike,
  isAllDay?: boolean,
) => {
  const base = parseYmd(occurrenceDate)
  if (isAllDay || !dueTime) {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999)
  }
  if (typeof dueTime !== 'string') {
    return new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      dueTime.hour || 0,
      dueTime.minute || 0,
      dueTime.second || 0,
      0,
    )
  }
  const [hour, minute, second] = dueTime.split(':').map((part) => Number.parseInt(part, 10))
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hour || 0,
    minute || 0,
    second || 0,
    0,
  )
}
