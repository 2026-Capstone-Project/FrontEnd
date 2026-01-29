import * as yup from 'yup'

import { DateSchema, description, isAllday, repeatConfigSchema, rotate, title } from './common'
export const addTodoSchema = yup.object().shape({
  todoTitle: title,
  todoDescription: description,
  todoDate: DateSchema,
  todoEndTime: yup.string().required('시작 시간은 필수 입력 사항입니다.'),
  isAllday,
  rotate,
  repeatConfig: repeatConfigSchema,
})
