import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import { resolveSiteUrl } from './src/shared/seo/routeMeta'

/**
 * robots.txt에서 크롤링 자체를 막는 경로입니다.
 *
 * OAuth 콜백만 막습니다. URL에 인가 코드가 실리므로 크롤러가 접근할 이유가 없습니다.
 * 로그인 이후 화면(/calendar 등)은 여기 넣지 않습니다. Disallow하면 크롤러가
 * 페이지의 noindex 메타를 영영 읽지 못해, 외부 링크가 생겼을 때 "차단됨" 상태로
 * URL만 색인될 수 있습니다. 해당 페이지들은 PageMeta의 noindex에만 맡깁니다.
 */
const CRAWL_BLOCKED_PATHS = ['/login/callback/']

/**
 * 사이트맵에 넣는 공개 경로입니다.
 *
 * `/login`은 프리렌더 대상이지만 색인 가치가 없어 noindex로 두고 사이트맵에서 제외합니다.
 */
const PUBLIC_ROUTES = [{ path: '/', priority: '1.0', changefreq: 'weekly' }]

/**
 * 배포 도메인을 한 곳에서 관리하는 플러그인입니다.
 * - index.html의 `%SITE_URL%`을 실제 도메인으로 치환합니다.
 * - robots.txt와 sitemap.xml을 빌드 결과물로 생성합니다. (public/에 두면 도메인이 이중 관리됩니다)
 */
function seoPlugin(siteUrl: string): Plugin {
  const buildDate = new Date().toISOString().slice(0, 10)

  return {
    name: 'calio-seo',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
    generateBundle() {
      const robots = [
        'User-agent: *',
        ...CRAWL_BLOCKED_PATHS.map((blockedPath) => `Disallow: ${blockedPath}`),
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
        '',
      ].join('\n')

      const urls = PUBLIC_ROUTES.map(
        ({ path: routePath, priority, changefreq }) => `  <url>
    <loc>${siteUrl}${routePath}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
      ).join('\n')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}

/**
 * 배포마다 바뀌지 않는 프레임워크 코드만 별도 청크로 고정해 브라우저 캐시를 살립니다.
 *
 * 이 목록을 넓히면 안 됩니다. manualChunks로 지정한 청크는 "아직 배정되지 않은 의존성"까지
 * 함께 흡수하기 때문에, 예를 들어 react-big-calendar를 청크로 지정하면 React 코어까지
 * 그 청크로 끌려가고, 결국 진입 청크가 캘린더 청크 전체(348kB)를 정적으로 의존하게 됩니다.
 * 나머지 라이브러리는 Rollup의 기본 분할에 맡기는 편이 안전합니다.
 */
const FRAMEWORK_PACKAGES = new Set([
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'scheduler',
])

/** pnpm 중첩 경로까지 고려해 모듈이 속한 실제 패키지 이름을 뽑습니다. */
const getPackageName = (id: string) => {
  const segments = id.split('node_modules/')
  const parts = segments[segments.length - 1].split('/')

  return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
}

const manualChunk = (id: string) => {
  if (!id.includes('node_modules/')) return
  // CSS를 vendor 청크에 넣으면 진입 HTML에 스타일시트로 끌려옵니다.
  if (id.endsWith('.css')) return

  const packageName = getPackageName(id)

  if (FRAMEWORK_PACKAGES.has(packageName) || packageName.startsWith('@emotion/')) {
    return 'react-vendor'
  }

  return
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = resolveSiteUrl(env.VITE_SITE_URL)

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      svgr(),
      tsconfigPaths(),
      seoPlugin(siteUrl),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => manualChunk(id),
        },
      },
    },
  }
})
