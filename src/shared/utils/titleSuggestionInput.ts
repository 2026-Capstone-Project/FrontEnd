import type { HighlightedSegment } from '@/shared/types/scheduleTodo/titleSuggestionInput'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getHighlightedSegments = (text: string, query: string): HighlightedSegment[] => {
  if (!query) {
    return [{ text }]
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const segments: HighlightedSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) })
    }
    segments.push({ text: match[0], highlight: true })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }

  return segments
}
