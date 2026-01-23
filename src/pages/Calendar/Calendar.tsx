import { Calendar, momentLocalizer, Views, type View } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/ko' // 한글 로케일 적용
import 'react-big-calendar/lib/css/react-big-calendar.css'
import * as S from './Calendar.style'
import { getViewConfig } from './viewConfig'
import CustomToolbar from './components/CalendarToolbar'
import CustomDayView from './components/CustomDayView'
import { useCallback, useState } from 'react'

moment.locale('ko')
const localizer = momentLocalizer(moment)

const CalendarPage = () => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())

  const onView = useCallback((newView: View) => setView(newView), [])
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  const viewConfig = getViewConfig(view)

  return (
    <S.CalendarWrapper view={view}>
      <Calendar
        localizer={localizer}
        culture="ko"
        views={{
          month: true,
          week: true,
          day: CustomDayView, // 커스텀 뷰 주입 확인
        }}
        view={view}
        date={date}
        onView={onView}
        onNavigate={onNavigate}
        components={{
          toolbar: CustomToolbar,
          // 일간 뷰일 때는 기존의 복잡한 헤더 컴포넌트를 비활성화하거나 대체
          ...(view === Views.DAY ? {} : viewConfig.components),
        }}
        // 일간 뷰일 때는 CustomDayView.title에서 형식을 제어하므로 formats를 조건부 적용
        formats={view === Views.DAY ? {} : viewConfig.formats}
        {...(viewConfig.allDayAccessor ? { allDayAccessor: viewConfig.allDayAccessor } : {})}
        style={{ height: '100%', width: '100%' }}
      />
    </S.CalendarWrapper>
  )
}

export default CalendarPage
