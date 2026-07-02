/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import * as S from '@/features/Friends/Friend.styles'
import FriendListSection from '@/features/Friends/FriendListSection'
import ScheduleItem from '@/features/Friends/ScheduleItem'
import SharedScheduleItem from '@/features/Friends/SharedScheduleItem'
import { eventShareApi } from '@/shared/api/friends/eventShare'
import { friendApi, friendRequestApi } from '@/shared/api/friends/friends'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import SearchIcon from '@/shared/assets/icons/search.svg?react'
import { useCustomQuery } from '@/shared/hooks/common/customQuery'
import { useFriendMutations } from '@/shared/hooks/friends/useFriendsMutations'
import type { FriendItem, ReceivedFriendRequestItem } from '@/shared/types/friends/friends'
import AddFriendModal from '@/shared/ui/Modals/AddFriendsModal/AddFriendsModal'

export default function FriendsPage() {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // 커스텀 훅에서 기능들 가져오기
  const { handleAccept, handleReject, handleDeleteFriend } = useFriendMutations()

  const getAvatarColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = Math.abs(hash) % 360
    return `hsl(${h}, 75%, 85%)`
  }

  const getAccentColor = (index: number) => {
    const colors = ['#5c6ac4', '#ffbb00', '#06bdff', '#00ff9d', '#ffd43b', '#d0bfff']
    return colors[index % colors.length]
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchKeyword])

  const { data: friendsList = [] } = useCustomQuery(
    ['friends', debouncedKeyword],
    () => {
      if (debouncedKeyword.trim()) {
        return friendApi.searchFriends({ keyword: debouncedKeyword })
      }
      return friendApi.getFriends()
    },
    { select: (response) => response?.result?.friendDetailList ?? [] },
  )

  const { data: receivedRequests = [] } = useCustomQuery(
    ['friendRequests', 'received'],
    () => friendRequestApi.getReceivedRequests(),
    {
      select: (response) => response?.result?.friendRequestDetailList ?? [],
      staleTime: 0,
      refetchOnMount: 'always',
      refetchInterval: 3000,
    },
  )

  const { data: invitations = [], refetch: refetchInvitations } = useCustomQuery(
    ['eventShare', 'invitations'],
    () => eventShareApi.getInvitations(),
    {
      select: (response) => response?.result?.invitations ?? [],
    },
  )

  const { data: sharedEvents = [], refetch: refetchSharedEvents } = useCustomQuery(
    ['eventShare', 'sharedEvents'],
    () => eventShareApi.getSharedEvents(),
    {
      select: (response) => response?.result?.sharedEvents ?? [],
    },
  )

  const handleActionSuccess = () => {
    refetchInvitations()
    refetchSharedEvents()
  }

  const friendsData = friendsList.map((item: FriendItem) => {
    const sharedCount = sharedEvents.filter((event) => event.ownerName === item.opponentName).length

    return {
      id: item.id,
      name: item.opponentName || '알 수 없음',
      email: item.opponentEmail || '',
      info: `공유 중인 일정 ${sharedCount}개`,
      avatarColor: getAvatarColor(item.opponentEmail || String(item.id)),
    }
  })

  const requestsData = receivedRequests.map((item: ReceivedFriendRequestItem) => ({
    id: item.id,
    name: item.opponentName || '알 수 없음',
    email: item.opponentEmail || '',
    avatarColor: getAvatarColor(item.opponentEmail || String(item.id)),
  }))

  return (
    <S.PageLayout>
      <S.Column width="40%">
        <FriendListSection
          title="친구"
          type="list"
          data={friendsData}
          maxHeight="330px"
          onDelete={handleDeleteFriend}
          headerAction={
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label="친구 추가"
              style={{
                width: '54px',
                height: '35px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddIcon />
            </button>
          }
        >
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <input
              placeholder="친구 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '17px 40px 16px 20px',
                borderRadius: '20px',
                border: '1px solid #eee',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <SearchIcon
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
              }}
            />
          </div>
        </FriendListSection>

        <S.SectionContainer>
          <S.SectionTitle>
            <span>친구 요청</span>
          </S.SectionTitle>
          <S.ScrollArea maxHeight="100px">
            {requestsData.length === 0 ? (
              <div
                style={{ padding: '16px 0', color: '#999', fontSize: '14px', textAlign: 'center' }}
              >
                받은 친구 요청이 없습니다.
              </div>
            ) : (
              requestsData.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: item.avatarColor,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      color: '#666',
                      flexShrink: 0,
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ fontSize: '15px' }}>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#333',
                          letterSpacing: '-0.3px',
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#999',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <S.CommonButton
                      bgColor="#f5f5f5"
                      textColor="#999"
                      onClick={() => handleReject(item.id)}
                    >
                      거절
                    </S.CommonButton>
                    <S.CommonButton
                      bgColor="#e6f4ff"
                      textColor="#1890ff"
                      onClick={() => handleAccept(item.id)}
                    >
                      수락
                    </S.CommonButton>
                  </div>
                </div>
              ))
            )}
          </S.ScrollArea>
        </S.SectionContainer>
      </S.Column>

      <S.Column width="60%">
        <S.SectionContainer bgColor="#f0f2ff">
          <S.SharedHeader bgColor="#f0f2ff">
            <S.HeaderTitle color="#5c6ac4">일정 공유 초대</S.HeaderTitle>
            <S.HeaderBadge>{invitations.length}</S.HeaderBadge>
          </S.SharedHeader>
          <S.SharedContent>
            {invitations.length > 0 ? (
              invitations.map((item, index) => (
                <ScheduleItem
                  key={item.participantId}
                  participantId={item.participantId}
                  inviter={item.ownerName}
                  title={item.title}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  location={item.location}
                  participants={item.participantCount}
                  accentColor={getAccentColor(index)}
                  onActionSuccess={handleActionSuccess}
                  createdAt={item.createdAt}
                />
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#333333',
                    marginBottom: '12px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  아직 알림이 없어요
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#868e96',
                    lineHeight: '1.5',
                    letterSpacing: '-0.2px',
                  }}
                >
                  새로운 일정이나 변경 사항이 생기면 알려드릴게요
                </div>
              </div>
            )}
          </S.SharedContent>
        </S.SectionContainer>

        <S.SectionContainer bgColor="#f4f5ff">
          <S.SectionTitle color="#5c6ac4">공유 중인 일정</S.SectionTitle>
          {sharedEvents.length > 0 ? (
            sharedEvents.map((item, index) => (
              <SharedScheduleItem
                key={item.eventId}
                eventId={item.eventId}
                title={item.title}
                startDate={item.startDate}
                endDate={item.endDate}
                sharerName={item.ownerName}
                accentColor={getAccentColor(index + 3)}
                onCancelSuccess={handleActionSuccess}
              />
            ))
          ) : (
            <div
              style={{
                padding: '30px 20px',
                textAlign: 'center',
                color: '#adb5bd',
                background: '#fff',
                borderRadius: '20px',
                fontSize: '14px',
              }}
            >
              공유된 일정 없습니다.
            </div>
          )}
        </S.SectionContainer>
      </S.Column>

      <AddFriendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </S.PageLayout>
  )
}
