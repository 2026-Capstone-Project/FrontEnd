import * as yup from 'yup'

import { EVENT_COLORS } from '@/shared/constants/event'
import type { EventColorType } from '@/shared/types/event/event'

import { DateSchema, description, isAllday, repeatConfigSchema, title } from './common'

const eventColor = yup
  .mixed<EventColorType>()
  .oneOf(EVENT_COLORS, '유효하지 않은 색상입니다.')
  .required('색상을 선택하세요.')

export const addTodoSchema = yup.object().shape({
  todoTitle: title,
  todoDescription: description,
  todoDate: DateSchema,
  todoEndTime: yup.string().required('종료 시간은 필수 입력 사항입니다.'),
  isAllday,
  eventColor,

  repeatConfig: repeatConfigSchema,
})
