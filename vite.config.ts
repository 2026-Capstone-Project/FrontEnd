import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

/** VITE_SITE_URL이 없을 때 사용하는 기본 배포 도메인입니다. */
const FALLBACK_SITE_URL = 'https://calio.co.kr'

/** 검색엔진에 노출하지 않는 경로입니다. (로그인 이후에만 존재하는 화면 + OAuth 콜백) */
const PRIVATE_PATHS = ['/login/callback/', '/calendar', '/todo', '/friends', '/settings']

/**
 * 사이트맵에 넣는 공개 경로입니다.
 *
 * `/login`은 넣지 않습니다. SPA라 모든 경로가 같은 index.html을 받기 때문에
 * JS를 실행하지 않는 크롤러에게는 `/login`도 랜딩 title/canonical로 보입니다.
 * 색인 가치도 없어서 페이지 자체를 noindex로 두고 사이트맵에서 제외합니다.
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
        ...PRIVATE_PATHS.map((privatePath) => `Disallow: ${privatePath}`),
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
  const siteUrl = (env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, '')

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
