import * as yup from 'yup'

import { EVENT_COLORS } from '@/shared/constants/event'
import type { EventColorType } from '@/shared/types/event/event'
import type { PriorityType } from '@/shared/types/event/priority'

import { DateSchema, description, isAllday, repeatConfigSchema } from './common'

const eventColor = yup
  .mixed<EventColorType>()
  .oneOf(EVENT_COLORS, '유효하지 않은 색상입니다.')
  .required('색상을 선택하세요.')

const todoPriority = yup
  .mixed<PriorityType>()
  .oneOf(['HIGH', 'MEDIUM', 'LOW'], '유효하지 않은 중요도입니다.')
  .required('중요도를 선택하세요.')

export const addTodoSchema = yup.object().shape({
  todoTitle: yup.string().max(50, '제목은 최대 50자까지 입력 가능합니다.'),
  todoDescription: description,
  todoDate: DateSchema,
  todoEndTime: yup.string().required('종료 시간은 필수 입력 사항입니다.'),
  isAllday,
  eventColor,
  todoPriority,

  repeatConfig: repeatConfigSchema,
})
