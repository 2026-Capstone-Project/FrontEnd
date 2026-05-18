import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import Close from '@/shared/assets/icons/close.svg?react'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { ScheduleShareFriend } from '@/shared/types/schedule/shareFriend'
import SearchFriend from '@/shared/ui/scheduleTodo/SearchFriend/SearchFriend'
import { getEventParticipantFriendId } from '@/shared/utils/eventParticipants'

import * as S from './index.style'

type ShareSchedulePanelProps = {
  isShared?: boolean
  invitedParticipants?: CalendarEvent['eventParticipantInfo']
  onSharedChange?: (isShared: boolean) => void
  readOnly?: boolean
  onReadOnlyAttempt?: () => void
}

const ShareSchedulePanel = ({
  isShared = false,
  invitedParticipants = [],
  onSharedChange,
  readOnly = false,
  onReadOnlyAttempt,
}: ShareSchedulePanelProps) => {
  const { control, setValue } = useFormContext<ScheduleEditorFormValues>()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<ScheduleShareFriend[]>([])
  const selectedFriendIds = useWatch({ control, name: 'friendIds' }) ?? []
  const visibleInvitedParticipants = readOnly
    ? invitedParticipants
    : invitedParticipants.filter((participant) => {
        const friendId = getEventParticipantFriendId(participant)

        return friendId != null && selectedFriendIds.includes(friendId)
      })
  const displayedFriends = [
    ...visibleInvitedParticipants.map((participant) => {
      const friendId = getEventParticipantFriendId(participant)

      return {
        id: String(friendId ?? participant.eventParticipantId),
        name: participant.name,
      }
    }),
    ...selectedFriends.map((friend) => ({
      id: friend.userId,
      name: friend.userName,
    })),
  ]

  const handleToggleFriend = (friend: ScheduleShareFriend) => {
    if (readOnly) {
      onReadOnlyAttempt?.()
      return
    }
    const friendId = Number(friend.userId)
    const isSelected = selectedFriendIds.includes(friendId)
    const nextFriendIds = isSelected
      ? selectedFriendIds.filter((selectedFriendId) => selectedFriendId !== friendId)
      : [...selectedFriendIds, friendId]

    setValue('friendIds', nextFriendIds, { shouldDirty: true, shouldValidate: true })
    onSharedChange?.(nextFriendIds.length > 0)

    setSelectedFriends((previous) => {
      if (isSelected) {
        return previous.filter((selectedFriend) => selectedFriend.userId !== friend.userId)
      }

      return [...previous, friend]
    })
  }

  const handleRemoveFriend = (friendId: ScheduleShareFriend['userId']) => {
    if (readOnly) {
      onReadOnlyAttempt?.()
      return
    }
    const numericFriendId = Number(friendId)
    const nextFriendIds = selectedFriendIds.filter(
      (selectedFriendId) => selectedFriendId !== numericFriendId,
    )
    setValue('friendIds', nextFriendIds, { shouldDirty: true, shouldValidate: true })
    onSharedChange?.(nextFriendIds.length > 0)
    setSelectedFriends((previous) => previous.filter((friend) => friend.userId !== friendId))
  }

  return (
    <S.FriendWrapper>
      <S.FriendSectionOpenButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isShared={isShared || selectedFriendIds.length > 0}
      >
        <div className="section-title">
          <div className="dot" />
          공유 일정
        </div>
        <Arrow color="#505050" className="arrow" />
      </S.FriendSectionOpenButton>
      {isOpen && (
        <S.FriendSection>
          {!readOnly && (
            <SearchFriend
              selectedFriendIds={selectedFriendIds}
              onToggleFriend={handleToggleFriend}
            />
          )}

          {displayedFriends.length > 0 && (
            <div className="added-friend-list">
              {displayedFriends.map((friend) => (
                <div key={friend.id} className="added-friend">
                  {friend.name}
                  {!readOnly && (
                    <button
                      type="button"
                      className="remove-friend-button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleRemoveFriend(friend.id)
                      }}
                      aria-label={`${friend.name} 삭제`}
                      title={`${friend.name} 삭제`}
                    >
                      <Close width={14} height={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </S.FriendSection>
      )}
    </S.FriendWrapper>
  )
}

export default ShareSchedulePanel
