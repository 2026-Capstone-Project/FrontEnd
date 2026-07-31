import 'dayjs/locale/ko'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

/*
 * 앱 전역에서 사용하는 dayjs 설정 모듈입니다.
 * dayjs는 'dayjs'에서 직접 import하지 말고 반드시 이 모듈에서 import하세요.
 * (플러그인 확장과 ko 로케일 적용이 보장되지 않으면 isBetween 등이 런타임에 터집니다)
 *
 * react-big-calendar의 dayjsLocalizer는 자신이 필요한 플러그인을 스스로 extend하지만,
 * 앱 코드가 캘린더 로드 여부와 무관하게 동작하도록 여기서 명시적으로 extend합니다.
 */
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.locale('ko')

export type { Dayjs } from 'dayjs'
export default dayjs
