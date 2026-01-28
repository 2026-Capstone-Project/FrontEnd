import * as yup from 'yup'

import { EVENT_COLORS } from '@/shared/constants/event'
import type { EventColorType } from '@/shared/types/event'
import {
  type CustomRepeatBasis,
  MONTHLY_DAY_OPTIONS,
  MONTHLY_WEEK_OPTIONS,
  type MonthlyPatternDay,
  type MonthlyPatternWeek,
  REPEAT_TYPES,
  type RepeatTermination,
  type RepeatType,
  TERMINATION_TYPES,
  WEEKDAY_NAMES,
  type WeekdayName,
} from '@/shared/types/repeat'

const eventTitle = yup
  .string()
  .required('일정 제목은 필수 입력 사항입니다.')
  .max(50, '일정 제목은 최대 50자까지 입력 가능합니다.')
const eventDescription = yup.string().max(500, '일정 설명은 최대 500자까지 입력 가능합니다.')
const eventDate = yup.date().required('날짜는 필수 입력 사항입니다.')

// 날짜/시간/색상 입력은 필수로 받으며, 종료 시간은 시작 시간 이후여야 합니다.
const eventStartTime = yup.string().required('시작 시간은 필수 입력 사항입니다.')
const eventEndTime = yup
  .string()
  .required('종료 시간은 필수 입력 사항입니다.')
  .test('is-greater', '종료 시간은 시작 시간보다 늦어야 합니다.', function (value) {
    const { eventStartTime } = this.parent
    return value > eventStartTime
  })

const rotate = yup
  .string()
  .nullable()
  .oneOf(
    ['EVERYDAY', 'EVERYWEEK', 'EVERYMONTH', 'EVERYYEAR', 'CUSTOM'],
    '유효하지 않은 반복 유형입니다.',
  )

const isAllday = yup.boolean()
//일정 색상도 스키마에 포함시켜 선택된 컬러가 유효한 값인지 확인합니다.
const eventColor = yup
  .mixed<EventColorType>()
  .oneOf(EVENT_COLORS, '유효하지 않은 색상입니다.')
  .required('색상을 선택하세요.')

// 반복 설정 관련 조건들을 하나의 객체로 묶어서 검증합니다.
const repeatConfigSchema = yup.object().shape({
  repeatType: yup
    .mixed<RepeatType>()
    .oneOf(REPEAT_TYPES, '반복 유형을 선택하세요.')
    .required('반복 유형을 선택하세요.'),
  customBasis: yup
    .mixed<CustomRepeatBasis>()
    .oneOf(['daily', 'weekly', 'monthly', 'yearly'])
    .nullable()
    .when('repeatType', {
      is: 'custom',
      then: (schema) => schema.required('사용자 지정 반복 기준을 선택하세요.'),
      otherwise: (schema) => schema,
    }),
  // 사용자 지정 - 매일 기준: 간격을 몇일마다로 입력해야 함
  customDailyInterval: yup
    .number()
    .typeError('정수를 입력하세요.')
    .min(1, '반복 간격은 1일 이상이어야 합니다.')
    .max(365, '반복 간격은 최대 365일입니다.')
    .when(['repeatType', 'customBasis'], (values, schema) => {
      const [repeatType, customBasis] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'daily'
        ? schema.required('반복 간격을 입력하세요.')
        : schema
    }),
  // 사용자 지정 - 매주 기준: 최소 1개 이상의 요일을 선택해야 함
  customWeeklyDays: yup
    .array()
    .of(yup.mixed<WeekdayName>().oneOf(WEEKDAY_NAMES))
    .default([])
    .when(['repeatType', 'customBasis'], (values, schema) => {
      const [repeatType, customBasis] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'weekly'
        ? schema.min(1, '반복 요일을 최소 하나 선택하세요.').required('반복 요일을 선택하세요.')
        : schema
    }),
  // 사용자 지정 - 매월 기준: 간격과 날짜/패턴을 각각 검증
  customMonthlyInterval: yup
    .number()
    .typeError('정수를 입력하세요.')
    .min(1, '반복 간격은 1개월 이상이어야 합니다.')
    .max(11, '최대 11개월까지 설정할 수 있습니다.')
    .when(['repeatType', 'customBasis'], (values, schema) => {
      const [repeatType, customBasis] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'monthly'
        ? schema.required('몇 개월마다 반복할지 입력하세요.')
        : schema
    }),
  // 월별 조건이 날짜 선택 모드인지 패턴 모드인지
  customMonthlyMode: yup.string().oneOf(['dates', 'pattern']).default('dates'),
  customMonthlyDates: yup
    .array()
    .of(yup.number().min(1).max(31))
    .default([])
    .when(['repeatType', 'customBasis', 'customMonthlyMode'], (values, schema) => {
      const [repeatType, customBasis, mode] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
        string | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'monthly' && mode === 'dates'
        ? schema.min(1, '반복 날짜를 하나 이상 선택하세요.').required('반복 날짜를 선택하세요.')
        : schema
    }),
  customMonthlyPatternWeek: yup
    .mixed<MonthlyPatternWeek>()
    .oneOf(MONTHLY_WEEK_OPTIONS)
    .default('1')
    .when(['repeatType', 'customBasis', 'customMonthlyMode'], (values, schema) => {
      const [repeatType, customBasis, mode] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
        string | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'monthly' && mode === 'pattern'
        ? schema.required('몇 번째 주인지 선택하세요.')
        : schema
    }),
  customMonthlyPatternDay: yup
    .mixed<MonthlyPatternDay>()
    .oneOf(MONTHLY_DAY_OPTIONS)
    .default('mon')
    .when(['repeatType', 'customBasis', 'customMonthlyMode'], (values, schema) => {
      const [repeatType, customBasis, mode] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
        string | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'monthly' && mode === 'pattern'
        ? schema.required('반복할 요일/그룹을 선택하세요.')
        : schema
    }),
  // 사용자 지정 - 매년 기준: 몇 년마다 반복, 반복할 월 선택, 조건 지정
  customYearlyInterval: yup
    .number()
    .typeError('정수를 입력하세요.')
    .min(1, '반복 간격은 1년 이상이어야 합니다.')
    .max(99, '최대 99년까지 설정할 수 있습니다.')
    .when(['repeatType', 'customBasis'], (values, schema) => {
      const [repeatType, customBasis] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'yearly'
        ? schema.required('몇 년마다 반복할지 입력하세요.')
        : schema
    }),
  customYearlyMonths: yup
    .array()
    .of(yup.number().min(1).max(12))
    .default([])
    .when(['repeatType', 'customBasis'], (values, schema) => {
      const [repeatType, customBasis] = values as [
        RepeatType | undefined,
        CustomRepeatBasis | null | undefined,
      ]
      return repeatType === 'custom' && customBasis === 'yearly'
        ? schema.min(1, '반복할 월을 하나 이상 선택하세요.').required('반복할 월을 선택하세요.')
        : schema
    }),
  // 추가 조건이 켜져 있으면 주/요일을 반드시 선택해야 함
  customYearlyConditionEnabled: yup.boolean().default(false),
  customYearlyConditionWeek: yup
    .mixed<MonthlyPatternWeek>()
    .oneOf(MONTHLY_WEEK_OPTIONS)
    .default('1')
    .when('customYearlyConditionEnabled', (enabled, schema) =>
      enabled ? schema.required('반복 조건의 주를 선택하세요.') : schema,
    ),
  customYearlyConditionDay: yup
    .mixed<MonthlyPatternDay>()
    .oneOf(MONTHLY_DAY_OPTIONS)
    .default('mon')
    .when('customYearlyConditionEnabled', (enabled, schema) =>
      enabled ? schema.required('반복 조건의 요일/그룹을 선택하세요.') : schema,
    ),
  // 반복 종료: 선택한 반복 유형에 따라 날짜/횟수 중 하나를 필수로 받음
  customEndType: yup
    .mixed<RepeatTermination>()
    .oneOf(TERMINATION_TYPES, '반복 종료 조건을 선택하세요.')
    .when('repeatType', {
      is: 'none',
      otherwise: (schema) => schema.required('반복 종료 조건을 선택하세요.'),
    }),
  customEndDate: yup.string().when(['repeatType', 'customEndType'], (values, schema) => {
    const [repeatType, endType] = values as [RepeatType | undefined, RepeatTermination | undefined]
    return repeatType !== 'none' && endType === 'until'
      ? schema
          .required('종료 날짜를 입력하세요.')
          .test(
            'is-date',
            '유효한 날짜를 입력하세요.',
            (date) => !!date && !Number.isNaN(Date.parse(date)),
          )
      : schema
  }),
  customEndCount: yup
    .number()
    .integer()
    .positive()
    .when(['repeatType', 'customEndType'], (values, schema) => {
      const [repeatType, endType] = values as [
        RepeatType | undefined,
        RepeatTermination | undefined,
      ]
      return repeatType !== 'none' && endType === 'count'
        ? schema.required('반복 횟수를 입력하세요.')
        : schema
    }),
})

export const addScheduleSchema = yup.object().shape({
  eventTitle,
  eventDescription,
  eventStartDate: eventDate,
  eventEndDate: eventDate,
  eventStartTime,
  eventEndTime,
  isAllday,
  rotate,
  eventColor,
  repeatConfig: repeatConfigSchema,
})
