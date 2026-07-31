import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

/*
  `vite build` 이후에 실행되어, 라우트별 정적 HTML을 dist에 추가로 만듭니다.

  Vite의 SSR 모듈 로더를 그대로 쓰기 때문에 별도 SSR 번들을 만들 필요가 없고,
  alias / svgr / TS 설정이 앱과 100% 동일하게 적용됩니다.
*/

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const DIST = path.join(ROOT, 'dist')

const SEO_START = '<!--seo:start-->'
const SEO_END = '<!--seo:end-->'
const ROOT_PLACEHOLDER = '<div id="root"></div>'

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** 라우트 하나의 `<head>` 메타 블록을 만듭니다. */
const buildHead = ({ meta, siteUrl, resolveTitle, ogDescription, ogImagePath }) => {
  const title = escapeHtml(resolveTitle(meta.title))
  const tags = [`<title>${title}</title>`]

  if (meta.description) {
    tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`)
  }

  tags.push(`<meta name="robots" content="${meta.noIndex ? 'noindex, nofollow' : 'index, follow'}" />`)

  // canonical은 색인 대상 페이지에만 넣습니다. noindex 페이지에 있으면 신호가 충돌합니다.
  if (!meta.noIndex && meta.canonicalPath) {
    tags.push(`<link rel="canonical" href="${siteUrl}${meta.canonicalPath}" />`)
  }

  tags.push(
    '<meta name="theme-color" content="#fafafa" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Calio" />',
    '<meta property="og:locale" content="ko_KR" />',
    `<meta property="og:title" content="${title}" />`,
  )

  // 링크 미리보기는 색인 여부와 무관하게 랜딩 정보를 보여주는 편이 자연스럽습니다.
  const description = meta.noIndex ? ogDescription : meta.description || ogDescription
  tags.push(
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${siteUrl}${meta.canonicalPath ?? '/'}" />`,
    `<meta property="og:image" content="${siteUrl}${ogImagePath}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Calio 서비스 대표 이미지" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${siteUrl}${ogImagePath}" />`,
  )

  return tags.map((tag) => `    ${tag}`).join('\n')
}

const replaceBetween = (source, start, end, replacement) => {
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end)

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`index.html에서 ${start} / ${end} 마커를 찾지 못했습니다.`)
  }

  return source.slice(0, startIndex + start.length) + replacement + source.slice(endIndex)
}

/** `/login` -> `dist/login/index.html`, `/` -> `dist/index.html` */
const outputPathFor = (routePath) =>
  routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, routePath.replace(/^\//, ''), 'index.html')

const main = async () => {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf-8')

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'warn',
  })

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
    const meta = await vite.ssrLoadModule('/src/shared/seo/routeMeta.ts')
    const { PRERENDER_ROUTES, resolveTitle, resolveSiteUrl } = meta
    const siteUrl = resolveSiteUrl(process.env.VITE_SITE_URL)

    for (const route of PRERENDER_ROUTES) {
      const head = buildHead({
        meta: route.meta,
        siteUrl,
        resolveTitle,
        ogDescription: meta.LANDING_OG_DESCRIPTION,
        ogImagePath: meta.OG_IMAGE_PATH,
      })

      let body = `<div id="root" data-prerender-path="${route.path}"></div>`
      let styles = ''

      if (route.prerender) {
        const rendered = await render(route.path)
        body = `<div id="root" data-prerender-path="${route.path}">${rendered.html}</div>`
        styles = rendered.styles
      }

      let html = replaceBetween(template, SEO_START, SEO_END, `\n${head}\n    `)
      html = html.replace(ROOT_PLACEHOLDER, body)
      if (styles) html = html.replace('</head>', `${styles}\n  </head>`)

      const outputPath = outputPathFor(route.path)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, html, 'utf-8')

      const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1)
      const label = route.prerender ? '프리렌더' : '메타만'
      console.log(`  ${route.path.padEnd(10)} ${label}  ${sizeKb}kB  ->  ${path.relative(ROOT, outputPath)}`)
    }
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error('[prerender] 실패:', error)
  process.exit(1)
})
