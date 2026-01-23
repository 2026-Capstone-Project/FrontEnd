import React from 'react'
import type { ViewStatic } from 'react-big-calendar'
import Week from 'react-big-calendar/lib/Week'

type WeekProps = React.ComponentProps<typeof Week>

const CustomWeekView: React.ComponentType<WeekProps> & ViewStatic = ((props: WeekProps) => (
  <Week {...props} />
)) as React.ComponentType<WeekProps> & ViewStatic

CustomWeekView.navigate = Week.navigate
CustomWeekView.title = Week.title

export { CustomWeekView }
export default CustomWeekView
