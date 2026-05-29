/** @jsxImportSource @emotion/react */
import type { ReactNode } from 'react'

import type { FriendData } from '@/shared/types/friends/friends'

import * as S from './Friend.styles'
import FriendItem from './FriendItem'

interface SectionProps {
  title: string
  data: FriendData[]
  type: 'list' | 'request'
  maxHeight?: string
  headerAction?: ReactNode
  children?: ReactNode
  isScrollable?: boolean
  onDelete?: (friendId: number) => void
}

export default function FriendListSection({
  title,
  data,
  type,
  maxHeight = '300px',
  headerAction,
  children,
  isScrollable = true,
  onDelete,
}: SectionProps) {
  return (
    <S.SectionContainer>
      <S.SectionTitle>
        <span>{title}</span>
        {headerAction}
      </S.SectionTitle>
      {children}

      {isScrollable ? (
        <S.ScrollArea maxHeight={maxHeight}>
          {data.map((item) => (
            <FriendItem
              key={item.id}
              name={item.name}
              email={item.email}
              info={item.info}
              avatarColor={item.avatarColor}
              type={type}
              id={item.id}
              onDelete={onDelete}
            />
          ))}
        </S.ScrollArea>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.map((item) => (
            <FriendItem
              key={item.id}
              name={item.name}
              email={item.email}
              info={item.info}
              avatarColor={item.avatarColor}
              type={type}
              id={item.id}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </S.SectionContainer>
  )
}
