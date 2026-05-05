const OVERFLOW_SCROLL_PATTERN = /(auto|scroll|hidden|clip)/

const getIntersectionRect = (firstRect: DOMRect, secondRect: DOMRect) => {
  const top = Math.max(firstRect.top, secondRect.top)
  const right = Math.min(firstRect.right, secondRect.right)
  const bottom = Math.min(firstRect.bottom, secondRect.bottom)
  const left = Math.max(firstRect.left, secondRect.left)

  return {
    top,
    right,
    bottom,
    left,
    width: right - left,
    height: bottom - top,
  }
}

const hasVisibleArea = (rect: Pick<DOMRect, 'width' | 'height'>) =>
  rect.width > 0 && rect.height > 0

const isClippedByScrollableParent = (element: HTMLElement, parent: HTMLElement) => {
  const parentStyle = window.getComputedStyle(parent)
  const clipsContent = OVERFLOW_SCROLL_PATTERN.test(
    `${parentStyle.overflow}${parentStyle.overflowX}${parentStyle.overflowY}`,
  )

  if (!clipsContent) return false

  const visibleRect = getIntersectionRect(
    element.getBoundingClientRect(),
    parent.getBoundingClientRect(),
  )

  return !hasVisibleArea(visibleRect)
}

export const isElementVisible = (element: HTMLElement) => {
  const elementRect = element.getBoundingClientRect()
  const viewportRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight)
  const viewportVisibleRect = getIntersectionRect(elementRect, viewportRect)

  if (!hasVisibleArea(viewportVisibleRect)) return false

  let parentElement = element.parentElement

  while (parentElement && parentElement !== document.body) {
    if (isClippedByScrollableParent(element, parentElement)) return false
    parentElement = parentElement.parentElement
  }

  return true
}
