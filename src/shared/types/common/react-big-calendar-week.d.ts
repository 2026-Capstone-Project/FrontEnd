declare module 'react-big-calendar/lib/Week' {
  import type { ComponentType } from 'react'
  import type { ViewStatic } from 'react-big-calendar'

  const Week: ComponentType<Record<string, unknown>> & ViewStatic
  export default Week
}
