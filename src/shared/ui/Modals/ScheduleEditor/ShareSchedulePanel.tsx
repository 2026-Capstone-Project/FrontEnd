import { useEffect, useState } from 'react'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import Close from '@/shared/assets/icons/close.svg?react'
import type { ScheduleShareFriend } from '@/shared/types/schedule/shareFriend'
import SearchFriend from '@/shared/ui/scheduleTodo/SearchFriend/SearchFriend'

import * as S from './index.style'

type ShareSchedulePanelProps = {
  onSharedChange?: (isShared: boolean) => void
}

const ShareSchedulePanel = ({ onSharedChange }: ShareSchedulePanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<ScheduleShareFriend[]>([])

  useEffect(() => {
    onSharedChange?.(selectedFriends.length > 0)
  }, [onSharedChange, selectedFriends.length])

  const handleToggleFriend = (friend: ScheduleShareFriend) => {
    setSelectedFriends((previous) => {
      const isSelected = previous.some((selectedFriend) => selectedFriend.userId === friend.userId)

      if (isSelected) {
        return previous.filter((selectedFriend) => selectedFriend.userId !== friend.userId)
      }

      return [...previous, friend]
    })
  }

  const handleRemoveFriend = (friendId: ScheduleShareFriend['userId']) => {
    setSelectedFriends((previous) => previous.filter((friend) => friend.userId !== friendId))
  }

  return (
    <S.FriendWrapper>
      <S.FriendSectionOpenButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        isShared={selectedFriends.length > 0}
      >
        <div className="section-title">
          <div className="dot" />
          공유 일정
        </div>
        <Arrow color="#505050" className="arrow" />
      </S.FriendSectionOpenButton>
      {isOpen && (
        <S.FriendSection>
          <SearchFriend selectedFriends={selectedFriends} onToggleFriend={handleToggleFriend} />

          <div className="added-friend-list">
            {selectedFriends.map((friend) => (
              <div key={friend.userId} className="added-friend">
                {friend.userName}
                <button
                  type="button"
                  className="remove-friend-button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRemoveFriend(friend.userId)
                  }}
                  aria-label={`${friend.userName} 삭제`}
                  title={`${friend.userName} 삭제`}
                >
                  <Close width={14} height={14} />
                </button>
              </div>
            ))}
          </div>
        </S.FriendSection>
      )}
    </S.FriendWrapper>
  )
}

export default ShareSchedulePanel
