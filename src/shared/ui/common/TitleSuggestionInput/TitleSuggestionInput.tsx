import {
  type MouseEvent as ReactMouseEvent,
  type RefCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

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

type TitleSuggestionInputFormController<TFieldValues extends FieldValues> = {
  register: UseFormRegister<TFieldValues>
  watch: UseFormWatch<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
}

type TitleSuggestionInputProps<TFieldValues extends FieldValues> = {
  fieldName: Path<TFieldValues>
  placeholder?: string
  suggestions?: string[]
  autoFocus?: boolean
  formController?: TitleSuggestionInputFormController<TFieldValues>
}

const TitleSuggestionInput = <TFieldValues extends FieldValues>({
  fieldName,
  placeholder = '새로운 일정',
  suggestions = defaultSuggestions,
  autoFocus = false,
  formController,
}: TitleSuggestionInputProps<TFieldValues>) => {
  const context = useFormContext<TFieldValues>()
  const registerFn = formController?.register ?? context?.register
  const watchFn = formController?.watch ?? context?.watch
  const setValueFn = formController?.setValue ?? context?.setValue

  if (!registerFn || !watchFn || !setValueFn) {
    throw new Error('TitleSuggestionInput requires react-hook-form context or controller props')
  }

  const rawTitle = watchFn(fieldName) as PathValue<TFieldValues, typeof fieldName>
  const normalizedTitleQuery = typeof rawTitle === 'string' ? rawTitle.trim() : ''
  const filteredSuggestions = useMemo(() => {
    if (!normalizedTitleQuery) return []
    const lowerQuery = normalizedTitleQuery.toLowerCase()
    return suggestions.filter((item) => item.toLowerCase().includes(lowerQuery))
  }, [normalizedTitleQuery, suggestions])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [dismissedTitleQuery, setDismissedTitleQuery] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref: registerRef, ...registerProps } = registerFn(fieldName)
  const handleInputRef: RefCallback<HTMLInputElement | null> = (element) => {
    registerRef(element)
    inputRef.current = element
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!normalizedTitleQuery || filteredSuggestions.length === 0) {
      setSuggestionsVisible(false)
      setDismissedTitleQuery(null)
      return
    }
    if (dismissedTitleQuery === normalizedTitleQuery) {
      return
    }
    setSuggestionsVisible(true)
  }, [filteredSuggestions.length, normalizedTitleQuery, dismissedTitleQuery])
  /* eslint-enable react-hooks/set-state-in-effect */

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

  useEffect(() => {
    if (!autoFocus) return
    const target = inputRef.current
    if (!target) return
    target.focus()
  }, [autoFocus])

  const handleSelectSuggestion = (value: string) => {
    setValueFn(fieldName, value as PathValue<TFieldValues, typeof fieldName>, {
      shouldValidate: true,
    })
    setSuggestionsVisible(false)
    setDismissedTitleQuery(value.trim())
  }

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Input {...registerProps} ref={handleInputRef} placeholder={placeholder} />
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
