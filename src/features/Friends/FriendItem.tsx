import type { FriendData } from '@/shared/types/friends/friends'

import * as S from './Friend.styles'
import * as F from './FriendItem.style'

interface FriendItemProps extends FriendData {
  type: 'list' | 'request'
  onDelete?: (friendId: number) => void
}

export default function FriendItem({
  id,
  name,
  email,
  info,
  avatarColor,
  type,
  onDelete,
}: FriendItemProps) {
  return (
    <F.Container>
      <F.Avatar color={avatarColor}>{name[0]}</F.Avatar>
      <F.Content>
        <F.NameLine>
          <F.Name>
            {name}
            {type === 'list' ? ' ·' : ''}
          </F.Name>
          {info && <F.Info>{info}</F.Info>}
        </F.NameLine>
        <F.Email>{email}</F.Email>
      </F.Content>
      <F.Actions>
        {type === 'list' ? (
          <S.CommonButton bgColor="#fdf2f2" textColor="#ff4d4f" onClick={() => onDelete?.(id)}>
            삭제
          </S.CommonButton>
        ) : (
          <>
            <S.CommonButton bgColor="#f5f5f5" textColor="#999">
              거절
            </S.CommonButton>
            <S.CommonButton bgColor="#e6f4ff" textColor="#1890ff">
              수락
            </S.CommonButton>
          </>
        )}
      </F.Actions>
    </F.Container>
  )
}
