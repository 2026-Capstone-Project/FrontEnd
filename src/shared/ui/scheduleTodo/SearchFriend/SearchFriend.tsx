import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Close from '@/shared/assets/icons/close.svg?react'
import Plus from '@/shared/assets/icons/plus.svg?react'
import Search from '@/shared/assets/icons/search.svg?react'
import { MOCK_SCHEDULE_SHARE_FRIENDS } from '@/shared/constants/scheduleShareFriend'
import { theme } from '@/shared/styles'
import type { ScheduleShareFriend } from '@/shared/types/schedule/shareFriend'
import { isElementVisible } from '@/shared/utils/domVisibility'
import { filterScheduleShareFriends } from '@/shared/utils/scheduleShareFriend'

import * as S from './SearchFriend.style'

type SearchFriendProps = {
  selectedFriends: ScheduleShareFriend[]
  onToggleFriend: (friend: ScheduleShareFriend) => void
}

const SearchFriend = ({ selectedFriends, onToggleFriend }: SearchFriendProps) => {
  const [keyword, setKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [resultPosition, setResultPosition] = useState({ left: 0, top: 0, width: 0 })
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const selectedFriendIds = useMemo(
    () => new Set(selectedFriends.map((friend) => friend.userId)),
    [selectedFriends],
  )
  const trimmedKeyword = keyword.trim().toLowerCase()
  const filteredFriends = useMemo(
    () => filterScheduleShareFriends(MOCK_SCHEDULE_SHARE_FRIENDS, trimmedKeyword),
    [trimmedKeyword],
  )

  const shouldShowResult = isOpen && Boolean(trimmedKeyword) && filteredFriends.length > 0

  const updateResultPosition = () => {
    const inputWrapper = inputWrapperRef.current
    if (!inputWrapper) return

    if (!isElementVisible(inputWrapper)) {
      setIsOpen(false)
      return
    }

    const rect = inputWrapper.getBoundingClientRect()

    setResultPosition({
      left: rect.left + 12,
      top: rect.bottom,
      width: rect.width - 24,
    })
  }

  const renderFriendResult = () => {
    if (!shouldShowResult || typeof document === 'undefined') return null

    return createPortal(
      <S.SearchResult ref={resultRef} position={resultPosition}>
        {filteredFriends.map((friend) => {
          const isSelected = selectedFriendIds.has(friend.userId)

          return (
            <S.SearchResultItem
              key={friend.userId}
              type="button"
              isAdded={isSelected}
              onClick={() => onToggleFriend(friend)}
            >
              <S.Name isAdded={isSelected}>{friend.userName}</S.Name>
              <div className="divider" />
              <S.Email>{friend.email}</S.Email>
              {isSelected ? (
                <Close
                  aria-hidden="true"
                  focusable="false"
                  height={18}
                  width={18}
                  color={theme.colors.textColor3}
                  className="close"
                />
              ) : (
                <Plus
                  aria-hidden="true"
                  focusable="false"
                  height={20}
                  width={20}
                  color="#594FCA"
                  className="plus"
                />
              )}
            </S.SearchResultItem>
          )
        })}
      </S.SearchResult>,
      document.body,
    )
  }

  useEffect(() => {
    if (!shouldShowResult) return

    const animationFrameId = window.requestAnimationFrame(updateResultPosition)

    window.addEventListener('resize', updateResultPosition)
    window.addEventListener('scroll', updateResultPosition, true)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateResultPosition)
      window.removeEventListener('scroll', updateResultPosition, true)
    }
  }, [selectedFriends.length, shouldShowResult])

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (!(target instanceof Node)) return
      if (inputWrapperRef.current?.contains(target)) return
      if (resultRef.current?.contains(target)) return

      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  const handleKeywordChange = (value: string) => {
    const hasKeyword = value.trim().length > 0

    setKeyword(value)
    setIsOpen(hasKeyword)
  }

  return (
    <div>
      <S.InputWrapper ref={inputWrapperRef}>
        <S.SearchInput
          type="text"
          value={keyword}
          placeholder="일정 공유할 친구 찾기"
          onChange={(event) => handleKeywordChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            event.stopPropagation()
            setIsOpen(Boolean(trimmedKeyword))
          }}
        />
        <S.InputActions>
          <S.SearchButton
            type="button"
            disabled={!trimmedKeyword}
            onClick={() => {
              setIsOpen(true)
            }}
            aria-label="친구 검색"
            title="친구 검색"
          >
            <Search width={18} height={18} />
          </S.SearchButton>
        </S.InputActions>
      </S.InputWrapper>
      {renderFriendResult()}
    </div>
  )
}

export default SearchFriend
