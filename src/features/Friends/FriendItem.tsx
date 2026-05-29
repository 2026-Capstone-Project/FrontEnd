/** @jsxImportSource @emotion/react */
import * as S from './Friend.styles'

export interface FriendData {
  id: number
  name: string
  email: string
  info?: string
  avatarColor: string
}

interface FriendItemProps extends FriendData {
  type: 'list' | 'request'
  onDelete?: (friendId: number) => void // 👈 추가
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '10px',
          background: avatarColor,
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
        {name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '15px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#333',
              letterSpacing: '-0.3px',
            }}
          >
            {name}
            {type === 'list' ? ' ·' : ''}
          </span>
          {info && (
            <span
              style={{
                color: '#5c7cff',
                marginLeft: '8px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {info}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#999',
            whiteSpace: 'nowrap',
          }}
        >
          {email}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
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
      </div>
    </div>
  )
}
