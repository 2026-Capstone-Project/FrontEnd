import * as yup from 'yup'

import { EVENT_COLORS } from '@/shared/constants/event'
import type { EventColorType } from '@/shared/types/event/event'

import { DateSchema, description, isAllday, repeatConfigSchema, title } from './common'

// 날짜/시간/색상 입력은 필수로 받으며, 종료 시간은 시작 시간 이후여야 합니다.
const eventStartTime = yup
  .string()
  .when('isAllday', (isAllday, schema) =>
    isAllday
      ? schema.notRequired().nullable()
      : schema.required('시작 시간은 필수 입력 사항입니다.'),
  )
const eventEndTime = yup
  .string()
  .when('isAllday', (isAllday, schema) =>
    isAllday
      ? schema.notRequired().nullable()
      : schema.required('종료 시간은 필수 입력 사항입니다.'),
  )
  .test('is-greater', '종료 시간은 시작 시간보다 늦어야 합니다.', function (value) {
    const { eventStartTime, isAllday } = this.parent
    if (isAllday) return true
    // 스키마 평가 시점에는 value/eventStartTime이 undefined일 수 있어 안전하게 분기합니다.
    if (typeof value !== 'string' || typeof eventStartTime !== 'string') return false
    return value > eventStartTime
  })

const scheduleTitle = title.transform((value) =>
  typeof value === 'string' && value.trim() === '' ? '새 일정' : value,
)

//일정 색상도 스키마에 포함시켜 선택된 컬러가 유효한 값인지 확인합니다.
const eventColor = yup
  .mixed<EventColorType>()
  .oneOf(EVENT_COLORS, '유효하지 않은 색상입니다.')
  .required('색상을 선택하세요.')

// 반복 설정 관련 조건들을 하나의 객체로 묶어서 검증합니다.

export const addScheduleSchema = yup.object().shape({
  eventTitle: scheduleTitle,
  eventDescription: description,
  location: yup.string().trim().max(100, '장소는 최대 100자까지 입력 가능합니다.').default(''),
  address: yup
    .string()
    .trim()
    .nullable()
    .max(255, '주소는 최대 255자까지 입력 가능합니다.')
    .default(null),
  eventStartDate: DateSchema,
  eventEndDate: DateSchema,
  eventStartTime,
  eventEndTime,
  isAllday,
  eventColor,
  repeatConfig: repeatConfigSchema,
})
