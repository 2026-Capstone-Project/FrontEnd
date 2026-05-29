/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react'

import SharedScheduleItem from '@/features/Friends/SharedScheduleItem'
import { friendApi, friendRequestApi } from '@/shared/api/friends/friends'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import SearchIcon from '@/shared/assets/icons/search.svg?react'
import { useCustomQuery } from '@/shared/hooks/common/customQuery'
import { useFriendMutations } from '@/shared/hooks/friends/useFriendsMutations'
import type { FriendItem, ReceivedFriendRequestItem } from '@/shared/types/friends/friends'

import * as S from '../../../features/Friends/Friend.styles'
import FriendListSection from '../../../features/Friends/FriendListSection'
import ScheduleItem from '../../../features/Friends/ScheduleItem'
import AddFriendModal from '../../../shared/ui/Modals/AddFriendsModal/AddFriendsModal'

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

  const FriendsData = friendsList.map((item: FriendItem) => ({
    id: item.id,
    name: item.opponentName || '알 수 없음',
    email: item.opponentEmail || '',
    info: '공유 중인 일정',
    avatarColor: getAvatarColor(item.opponentEmail || String(item.id)),
  }))

  const RequestsData = receivedRequests.map((item: ReceivedFriendRequestItem) => ({
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
          data={FriendsData}
          maxHeight="330px"
          onDelete={handleDeleteFriend}
          headerAction={
            <div
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <AddIcon />
            </div>
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
            {RequestsData.length === 0 ? (
              <div
                style={{ padding: '16px 0', color: '#999', fontSize: '14px', textAlign: 'center' }}
              >
                받은 친구 요청이 없습니다.
              </div>
            ) : (
              RequestsData.map((item) => (
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

      {/* 오른쪽 일정 공유 영역 시작 부분 입니다. */}
      <S.Column width="60%">
        <S.SectionContainer bgColor="#f0f2ff">
          <S.SharedHeader bgColor="#f0f2ff">
            <S.HeaderTitle color="#5c6ac4">일정 공유</S.HeaderTitle>
            <S.HeaderBadge>0</S.HeaderBadge>
          </S.SharedHeader>
          <S.SharedContent>
            <ScheduleItem
              inviter="서캘리"
              title="대전 여행"
              startDate="2024-07-01"
              endDate="2024-07-02"
              location="대전"
              participants={4}
              accentColor="#ffbb00"
            />
            <ScheduleItem
              inviter="지캘리"
              title="일본 여행"
              startDate="2024-07-01"
              endDate="2024-07-02"
              location="일본"
              participants={4}
              accentColor="#06bdff"
            />
            <ScheduleItem
              inviter="지캘리"
              title="제주 여행"
              startDate="2026-07-15"
              endDate="2026-07-16"
              location="제주"
              participants={4}
              accentColor="#00ff9d"
            />
          </S.SharedContent>
        </S.SectionContainer>

        <S.SectionContainer bgColor="#f4f5ff">
          <S.SectionTitle color="#5c6ac4">공유 중인 일정</S.SectionTitle>
          <SharedScheduleItem
            title="가족 모임"
            startDate="2024-04-24"
            sharerName="나"
            accentColor="#748ffc"
          />
          <SharedScheduleItem
            title="스터디"
            startDate="2024-04-16"
            sharerName="김캘리"
            accentColor="#ffd43b"
          />
          <SharedScheduleItem
            title="일본 여행"
            startDate="2024-05-05"
            endDate="2024-05-09"
            sharerName="김캘리"
            accentColor="#d0bfff"
          />
        </S.SectionContainer>
      </S.Column>

      <AddFriendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </S.PageLayout>
  )
}
