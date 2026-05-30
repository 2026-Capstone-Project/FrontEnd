/** @jsxImportSource @emotion/react */
import * as S from './Friend.styles'
import FriendItem from './FriendItem'
import ScheduleItem from './ScheduleItem'

export default function FriendsPage() {
  return (
    <S.PageLayout>
      {/* LEFT: 친구 관리 */}
      <S.Column width="38%">
        <S.SectionContainer>
          <S.SectionTitle>
            친구 <span style={{ cursor: 'pointer', fontSize: '16px' }}>👤+</span>
          </S.SectionTitle>
          <input
            placeholder="친구 검색"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '20px',
              border: '1px solid #eee',
              marginBottom: '16px',
              outline: 'none',
            }}
          />
          <S.ScrollArea maxHeight="350px">
            <FriendItem
              name="김캘리"
              email="aabcd@gmail.com"
              info="공유하는 일정 1개"
              avatarColor="#eee"
              type="list"
              id={0}
            />
            <FriendItem
              name="김캘리"
              email="aabcd@gmail.com"
              info="공유하는 일정 1개"
              avatarColor="#f3e5f5"
              type="list"
              id={0}
            />
            <FriendItem
              name="김캘리"
              email="aabcd@gmail.com"
              info="공유하는 일정 없음"
              avatarColor="#e3f2fd"
              type="list"
              id={0}
            />
          </S.ScrollArea>
        </S.SectionContainer>

        <S.SectionContainer>
          <S.SectionTitle>친구 요청</S.SectionTitle>
          <S.ScrollArea maxHeight="200px">
            <FriendItem
              name="김캘리"
              email="aabcd@gmail.com"
              avatarColor="#fff9c4"
              type="request"
              id={0}
            />
            <FriendItem
              name="김캘리"
              email="aabcd@gmail.com"
              avatarColor="#ffebee"
              type="request"
              id={0}
            />
          </S.ScrollArea>
        </S.SectionContainer>
      </S.Column>

      {/* RIGHT: 일정 관리 */}
      <S.Column width="62%">
        <S.SectionContainer bgColor="#f0f2ff">
          <S.SectionTitle color="#5c6ac4">
            일정 공유{' '}
            <span
              style={{
                background: '#5c6ac4',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
              }}
            >
              3
            </span>
          </S.SectionTitle>
          <S.ScrollArea maxHeight="450px">
            <ScheduleItem
              inviter="김캘리"
              title="대전 여행"
              startDate="2026-05-01"
              endDate="2026-05-03"
              location="대전"
              participants={4}
              accentColor="#ffbb00"
            />
            <ScheduleItem
              inviter="김캘리"
              title="벚꽃 구경 >.<"
              startDate="2026-04-08"
              endDate="2026-04-08"
              location="여의도 한강 공원"
              participants={2}
              accentColor="#ff85a1"
            />
          </S.ScrollArea>
        </S.SectionContainer>

        <S.SectionContainer bgColor="#f4f5ff">
          <S.SectionTitle color="#5c6ac4">공유 중인 일정</S.SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['가족 모임', '스터디', '일본 여행'].map((item) => (
              <div
                key={item}
                style={{
                  background: '#fff',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600 }}>● {item}</span>
                <S.CommonButton bgColor="#f0f2ff" textColor="#5c6ac4">
                  공유 취소
                </S.CommonButton>
              </div>
            ))}
          </div>
        </S.SectionContainer>
      </S.Column>
    </S.PageLayout>
  )
}
