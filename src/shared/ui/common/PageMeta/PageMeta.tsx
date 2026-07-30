import { useEffect } from 'react'

interface PageMetaProps {
  /** 문서 제목. `| Calio` 접미사는 이 컴포넌트가 붙입니다. */
  title: string
  /** 검색 결과 스니펫으로 쓰이는 설명. 공개 페이지에만 넣습니다. */
  description?: string
  /** canonical URL로 쓰이는 경로. 예: `/login` */
  canonicalPath?: string
  /** 로그인 이후에만 존재하는 화면처럼 색인에서 제외할 페이지에 사용합니다. */
  noIndex?: boolean
}

const SITE_NAME = 'Calio'

/**
 * index.html에 이미 있는 메타 태그를 "덮어쓰는" 방식으로 동작합니다.
 *
 * React 19의 title/meta 호이스팅을 쓰면 index.html의 정적 태그가 남은 채로
 * 같은 태그가 하나 더 추가돼서 canonical/description이 중복됩니다.
 * 정적 태그는 JS를 실행하지 않는 크롤러가 읽는 유일한 메타라서 지울 수 없으므로,
 * 라우트 이동 시에는 기존 태그의 값을 갱신합니다.
 */
const upsertTag = (selector: string, createTag: () => HTMLElement) => {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) return existing

  const created = createTag()
  document.head.appendChild(created)

  return created
}

const setMetaContent = (name: string, content: string) => {
  const tag = upsertTag(`meta[name="${name}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', name)

    return meta
  })
  tag.setAttribute('content', content)
}

const setPropertyContent = (property: string, content: string) => {
  const tag = upsertTag(`meta[property="${property}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', property)

    return meta
  })
  tag.setAttribute('content', content)
}

export default function PageMeta({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: PageMetaProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  useEffect(() => {
    document.title = fullTitle
    setMetaContent('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setPropertyContent('og:title', fullTitle)

    if (description) {
      setMetaContent('description', description)
      setPropertyContent('og:description', description)
    }

    if (noIndex) {
      // index.html의 canonical(`/`)이 남아 있으면 색인 제외 페이지가 랜딩을 가리키게 됩니다.
      document.head.querySelector('link[rel="canonical"]')?.remove()

      return
    }

    if (canonicalPath) {
      // 배포 도메인이 지정돼 있으면 www/비www 같은 접근 경로와 무관하게 한 URL로 고정합니다.
      const siteUrl =
        (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
        window.location.origin
      const canonicalUrl = `${siteUrl}${canonicalPath}`
      const link = upsertTag('link[rel="canonical"]', () => {
        const created = document.createElement('link')
        created.setAttribute('rel', 'canonical')

        return created
      })
      link.setAttribute('href', canonicalUrl)
      setPropertyContent('og:url', canonicalUrl)
    }
  }, [fullTitle, description, canonicalPath, noIndex])

  return null
}
