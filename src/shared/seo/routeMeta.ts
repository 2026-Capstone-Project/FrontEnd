/**
 * 라우트별 메타 정보의 단일 소스입니다.
 *
 * - 런타임: 각 페이지가 `PageMeta`에 이 값을 그대로 전달합니다.
 * - 빌드 타임: `scripts/prerender.mjs`가 같은 값으로 정적 HTML의 `<head>`를 생성합니다.
 *
 * 두 경로가 같은 상수를 쓰므로 문구가 어긋날 일이 없습니다.
 */

export type RouteMeta = {
  title: string
  description?: string
  canonicalPath?: string
  noIndex?: boolean
}

export const SITE_NAME = 'Calio'

/** `VITE_SITE_URL`이 없을 때 canonical / og:url / sitemap에 쓰는 기본 배포 도메인입니다. */
export const DEFAULT_SITE_URL = 'https://calio.co.kr'

/** 배포 도메인을 정규화합니다. (끝의 `/`를 제거해 경로와 이어 붙일 수 있게 만듭니다) */
export const resolveSiteUrl = (siteUrl?: string) => (siteUrl || DEFAULT_SITE_URL).replace(/\/$/, '')

/** og:image 등 절대 URL이 필요한 곳에서 쓰는 배포 도메인입니다. */
export const OG_IMAGE_PATH = '/og-image.jpg'

/** 문서 제목을 확정합니다. 이미 서비스명이 들어 있으면 접미사를 붙이지 않습니다. */
export const resolveTitle = (title: string) =>
  title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

export const LANDING_META: RouteMeta = {
  title: 'Calio(캘리오) | 말 한마디로 일정이 완성되는 AI 일정 관리',
  description:
    'Calio는 자연어로 말하면 AI가 일정과 할 일을 자동으로 등록해주는 일정 관리 서비스입니다. 반복 일정 추천부터 친구와의 일정 공유까지 한 곳에서 관리하세요.',
  canonicalPath: '/',
}

/** 링크 미리보기용 설명입니다. 검색 스니펫보다 짧게 씁니다. */
export const LANDING_OG_DESCRIPTION =
  '자연어로 말하면 AI가 일정과 할 일을 자동으로 등록해줘요. 반복 일정 추천과 친구 일정 공유까지 한 번에.'

export const LOGIN_META: RouteMeta = { title: '로그인', noIndex: true }
export const NOT_FOUND_META: RouteMeta = { title: '페이지를 찾을 수 없어요', noIndex: true }
export const HOME_META: RouteMeta = { title: '홈', noIndex: true }
export const CALENDAR_META: RouteMeta = { title: '캘린더', noIndex: true }
export const TODO_META: RouteMeta = { title: '할 일', noIndex: true }
export const FRIENDS_META: RouteMeta = { title: '친구', noIndex: true }
export const SETTINGS_META: RouteMeta = { title: '설정', noIndex: true }

/**
 * 정적 HTML을 생성할 경로 목록입니다.
 *
 * `prerender`가 true인 경로만 실제 React 트리를 렌더합니다.
 * 나머지는 로그인 이후에만 도달하는 화면이라 본문 없이 메타만 맞춘 HTML을 만듭니다.
 * (인증/데이터 없이 렌더할 수 없고, 크롤러에게도 보일 필요가 없습니다)
 */
export const PRERENDER_ROUTES: Array<{ path: string; meta: RouteMeta; prerender: boolean }> = [
  { path: '/', meta: LANDING_META, prerender: true },
  { path: '/login', meta: LOGIN_META, prerender: true },
  { path: '/calendar', meta: CALENDAR_META, prerender: false },
  { path: '/todo', meta: TODO_META, prerender: false },
  { path: '/friends', meta: FRIENDS_META, prerender: false },
  { path: '/settings', meta: SETTINGS_META, prerender: false },
]
