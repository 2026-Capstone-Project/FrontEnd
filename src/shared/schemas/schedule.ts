import * as yup from 'yup'
const eventTitle = yup
  .string()
  .required('일정 제목은 필수 입력 사항입니다.')
  .max(50, '일정 제목은 최대 50자까지 입력 가능합니다.')
const eventDescription = yup.string().max(500, '일정 설명은 최대 500자까지 입력 가능합니다.')
const eventDate = yup.date().required('날짜는 필수 입력 사항입니다.')

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

export const addScheduleSchema = yup.object().shape({
  eventTitle,
  eventDescription,
  eventStartDate: eventDate,
  eventEndDate: eventDate,
  eventStartTime,
  eventEndTime,
  isAllday,
  rotate,
})
