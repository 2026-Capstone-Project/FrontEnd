/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import CustomCalendar from '@/features/Calendar/components/CustomCalendar/CustomCalendar'

const CalendarPage = () => {
  return (
    <div css={PageLayout}>
      <CustomCalendar />
    </div>
  )
}

export default CalendarPage

const PageLayout = css`
  width: 100%;
  height: 100%;
  display: flex;
`
