import { useEffect, useState } from 'react'

import AddIcon from '@/assets/icons/common/add.svg?react'
import SearchIcon from '@/assets/icons/common/search.svg?react'
import * as S from '@/features/Friends/Friend.styles'
import FriendListSection from '@/features/Friends/FriendListSection'
import ScheduleItem from '@/features/Friends/ScheduleItem'
import SharedScheduleItem from '@/features/Friends/SharedScheduleItem'
import { eventShareApi } from '@/shared/api/friends/eventShare'
import { friendApi, friendRequestApi } from '@/shared/api/friends/friends'
import { useCustomQuery } from '@/shared/hooks/common/customQuery'
import { useFriendMutations } from '@/shared/hooks/friends/useFriendsMutations'
import { FRIENDS_META } from '@/shared/seo/routeMeta'
import type { FriendItem, ReceivedFriendRequestItem } from '@/shared/types/friends/friends'
import PageMeta from '@/shared/ui/common/PageMeta/PageMeta'
import AddFriendModal from '@/shared/ui/Modals/AddFriendsModal/AddFriendsModal'

import * as P from './FriendsPage.styles'

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
      <PageMeta {...FRIENDS_META} />
      <S.Column width="40%">
        <FriendListSection
          title="친구"
          type="list"
          data={friendsData}
          maxHeight="330px"
          onDelete={handleDeleteFriend}
          headerAction={
            <P.AddButton type="button" onClick={() => setIsModalOpen(true)} aria-label="친구 추가">
              <AddIcon />
            </P.AddButton>
          }
        >
          <P.SearchWrapper>
            <P.SearchInput
              placeholder="친구 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <P.SearchIconWrapper>
              <SearchIcon />
            </P.SearchIconWrapper>
          </P.SearchWrapper>
        </FriendListSection>

        <S.SectionContainer>
          <S.SectionTitle>
            <span>친구 요청</span>
          </S.SectionTitle>
          <S.ScrollArea maxHeight="100px">
            {requestsData.length === 0 ? (
              <P.EmptyRequest>받은 친구 요청이 없습니다.</P.EmptyRequest>
            ) : (
              requestsData.map((item) => (
                <P.RequestItem key={item.id}>
                  <P.RequestAvatar color={item.avatarColor}>{item.name.charAt(0)}</P.RequestAvatar>
                  <P.RequestInfo>
                    <P.RequestNameLine>
                      <P.RequestName>{item.name}</P.RequestName>
                    </P.RequestNameLine>
                    <P.RequestEmail>{item.email}</P.RequestEmail>
                  </P.RequestInfo>
                  <P.RequestActions>
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
                  </P.RequestActions>
                </P.RequestItem>
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
              <P.EmptyInvitation>
                <P.EmptyInvitationTitle>아직 알림이 없어요</P.EmptyInvitationTitle>
                <P.EmptyInvitationText>
                  새로운 일정이나 변경 사항이 생기면 알려드릴게요
                </P.EmptyInvitationText>
              </P.EmptyInvitation>
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
                isOwner={item.isOwner}
                onCancelSuccess={handleActionSuccess}
              />
            ))
          ) : (
            <P.EmptyShared>공유된 일정 없습니다.</P.EmptyShared>
          )}
        </S.SectionContainer>
      </S.Column>

      <AddFriendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </S.PageLayout>
  )
}
