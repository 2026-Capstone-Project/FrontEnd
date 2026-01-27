import { type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { UseFormRegister } from 'react-hook-form'

import type { AddScheduleFormValues } from '@/shared/types/event'

import * as S from './TitleSuggestionInput.style'

const defaultSuggestions = [
  '동아리 스터디 참여',
  '동아리 회의 참여',
  '동아리 OT 참석',
  '동아리 행사 준비',
  '동아리 벚꽃 사진 촬영',
  '동아리 회식 자리',
  '동아리 MT 계획',
  '동아리 세미나 참여',
]

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getHighlightedSegments = (text: string, query: string) => {
  if (!query) {
    return [{ text }]
  }
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  const segments: Array<{ text: string; highlight?: boolean }> = []
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

type TitleSuggestionInputProps = {
  register: UseFormRegister<AddScheduleFormValues>
  eventTitle: string | undefined
  setEventTitle: (value: string) => void
  placeholder?: string
  suggestions?: string[]
}

const TitleSuggestionInput = ({
  register,
  eventTitle,
  setEventTitle,
  placeholder = '새로운 일정',
  suggestions = defaultSuggestions,
}: TitleSuggestionInputProps) => {
  const normalizedTitleQuery = eventTitle?.trim() ?? ''
  const filteredSuggestions = useMemo(() => {
    if (!normalizedTitleQuery) return []
    const lowerQuery = normalizedTitleQuery.toLowerCase()
    return suggestions.filter((item) => item.toLowerCase().includes(lowerQuery))
  }, [normalizedTitleQuery, suggestions])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [dismissedTitleQuery, setDismissedTitleQuery] = useState<string | null>(null)

  useEffect(() => {
    if (!normalizedTitleQuery || filteredSuggestions.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestionsVisible(false)
      setDismissedTitleQuery(null)
      return
    }
    if (dismissedTitleQuery === normalizedTitleQuery) {
      return
    }
    setSuggestionsVisible(true)
  }, [filteredSuggestions.length, normalizedTitleQuery, dismissedTitleQuery])

  useEffect(() => {
    if (!suggestionsVisible) return undefined
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      if (wrapperRef.current?.contains(target)) return
      setSuggestionsVisible(false)
      setDismissedTitleQuery(normalizedTitleQuery)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [suggestionsVisible, normalizedTitleQuery])

  const handleSelectSuggestion = (value: string) => {
    setEventTitle(value)
    setSuggestionsVisible(false)
    setDismissedTitleQuery(value.trim())
  }

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Input {...register('eventTitle')} placeholder={placeholder} />
      {suggestionsVisible && filteredSuggestions.length > 0 && (
        <S.SuggestionList>
          {filteredSuggestions.map((item) => (
            <S.SuggestionItem
              type="button"
              key={item}
              onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                handleSelectSuggestion(item)
              }}
            >
              {getHighlightedSegments(item, normalizedTitleQuery).map((segment, index) =>
                segment.highlight ? (
                  <S.Highlight key={`${item}-${index}`}>{segment.text}</S.Highlight>
                ) : (
                  <span key={`${item}-${index}`}>{segment.text}</span>
                ),
              )}
            </S.SuggestionItem>
          ))}
        </S.SuggestionList>
      )}
    </S.Wrapper>
  )
}

export default TitleSuggestionInput
