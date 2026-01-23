import React from 'react'
import type { ViewStatic } from 'react-big-calendar'
import Week from 'react-big-calendar/lib/Week'

type WeekProps = React.ComponentProps<typeof Week>

//TODO: hover 시 이벤트를 추가할 수 있는 버튼 띄우기 기능 추가

const CustomWeekView: React.ComponentType<WeekProps> & ViewStatic = ((props: WeekProps) => (
  <Week {...props} />
)) as React.ComponentType<WeekProps> & ViewStatic

CustomWeekView.navigate = Week.navigate
CustomWeekView.title = Week.title

export { CustomWeekView }
export default CustomWeekView
