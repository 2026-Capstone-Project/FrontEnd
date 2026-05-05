import {
  type MouseEvent as ReactMouseEvent,
  type RefCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { FieldValues, PathValue } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import type { TitleSuggestionInputProps } from '@/shared/types/scheduleTodo/titleSuggestionInput'
import { getHighlightedSegments } from '@/shared/utils/titleSuggestionInput'

import * as S from './TitleSuggestionInput.style'

const TitleSuggestionInput = <TFieldValues extends FieldValues>({
  fieldName,
  placeholder = '새로운 일정',
  suggestions = [],
  autoFocus = false,
  formController,
  inputColor,
  onConfirm,
  onLiveChange,
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
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [dismissedTitleQuery, setDismissedTitleQuery] = useState<string | null>(null)
  const [isInputActive, setIsInputActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref: registerRef, ...registerProps } = registerFn(fieldName)
  const handleInputRef: RefCallback<HTMLInputElement | null> = (element) => {
    registerRef(element)
    inputRef.current = element
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isInputActive || !normalizedTitleQuery || suggestions.length === 0) {
      setSuggestionsVisible(false)
      return
    }
    if (dismissedTitleQuery === normalizedTitleQuery) {
      return
    }
    setSuggestionsVisible(true)
  }, [dismissedTitleQuery, isInputActive, normalizedTitleQuery, suggestions.length])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!suggestionsVisible) return undefined
    const handleCloseSuggestions = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return
      if (wrapperRef.current?.contains(target)) return
      setSuggestionsVisible(false)
      setIsInputActive(false)
      setDismissedTitleQuery(normalizedTitleQuery)
    }
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      handleCloseSuggestions(event.target)
    }
    const handleFocusOutside = (event: FocusEvent) => {
      handleCloseSuggestions(event.target)
    }
    document.addEventListener('focusin', handleFocusOutside)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('focusin', handleFocusOutside)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [suggestionsVisible, normalizedTitleQuery])

  useEffect(() => {
    if (!autoFocus) return
    const target = inputRef.current
    if (!target) return
    target.focus()
  }, [autoFocus])

  const handleSelectSuggestion = (value: string) => {
    setValueFn(fieldName, value as PathValue<TFieldValues, typeof fieldName>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    onLiveChange?.(value)
    setSuggestionsVisible(false)
    setDismissedTitleQuery(value.trim())
    setIsInputActive(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    const value = (watchFn(fieldName) as string | undefined) ?? ''
    onConfirm?.(value)
  }

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.Input
        {...registerProps}
        ref={handleInputRef}
        $color={inputColor}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          setIsInputActive(true)
          setDismissedTitleQuery(null)
        }}
        onChange={(event) => {
          registerProps.onChange?.(event)
          setDismissedTitleQuery(null)
          setIsInputActive(true)
          onLiveChange?.(event.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
      {suggestionsVisible && suggestions.length > 0 && (
        <S.SuggestionList>
          {suggestions.map((item, index) => (
            <S.SuggestionItem
              type="button"
              key={`${item}-${index}`}
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
