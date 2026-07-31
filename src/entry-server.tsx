import createCache from '@emotion/cache'
import { CacheProvider, ThemeProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { renderToString } from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'

import AuthRoutes from '@/routes/AuthRoutes'
import GlobalStyle from '@/shared/styles/GlobalStyle'
import { theme } from '@/shared/styles/theme'

/**
 * 빌드 타임 프리렌더 전용 엔트리입니다. (`scripts/prerender.mjs`에서만 사용)
 *
 * 실제 라우트 트리(`AuthRoutes`)를 그대로 렌더하므로, 정적 HTML과 React가
 * 마운트한 뒤의 화면이 어긋날 수 없습니다.
 *
 * 하이드레이션은 하지 않습니다. 앱은 로그인 힌트에 따라 다른 라우터를 고르기 때문에
 * (`main.tsx`) 서버가 고른 트리와 클라이언트가 고른 트리가 다를 수 있어,
 * `createRoot`로 정적 HTML을 통째로 교체하는 편이 안전합니다.
 * 정적 HTML의 역할은 어디까지나 "JS 실행 전에 보이는 첫 화면"입니다.
 */
export const render = async (path: string) => {
  const handler = createStaticHandler([AuthRoutes])
  const context = await handler.query(new Request(`http://prerender.local${path}`))

  if (context instanceof Response) {
    throw new Error(`프리렌더 중 리다이렉트가 발생했습니다: ${path}`)
  }

  const router = createStaticRouter(handler.dataRoutes, context)
  const cache = createCache({ key: 'css' })
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

  const html = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </ThemeProvider>
    </CacheProvider>,
  )

  return { html, styles: constructStyleTagsFromChunks(extractCriticalToChunks(html)) }
}
