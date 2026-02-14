import { type FC, type SVGProps, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GoogleIcon from '@/assets/social/google.svg?react'
import KakaoIcon from '@/assets/social/kakao.svg?react'
import NaverIcon from '@/assets/social/naver.svg?react'
import Modal from '@/features/Common/Modal'
import { fetchUserInfo, logoutAPI } from '@/shared/api/auth/auth'
import { queryClient } from '@/shared/api/queryClient'
import { SettingsAPI } from '@/shared/api/settings/settings'
import { useCustomQuery, useCustomSuspenseQuery } from '@/shared/hooks/customQuery'
import { useSettingsMutation } from '@/shared/hooks/useSettingsMutation'
import type { CalendarView, ReminderTiming } from '@/shared/types/settings/settings'
import { useAuthStore } from '@/store/useAuthStore'

import * as S from './Settings.styles'

const PROVIDER_ICONS: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  GOOGLE: GoogleIcon,
  KAKAO: KakaoIcon,
  NAVER: NaverIcon,
}

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutAPI()
    } finally {
      queryClient.clear()
      logout()
      alert('로그아웃 되셨습니다.')
      navigate('/')
    }
  }

  const { toggleBriefing, updateTime, updateReminder, toggleSuggestion, updateView, deleteUser } =
    useSettingsMutation()

  const timeOptions = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

  const { data: settings } = useCustomSuspenseQuery(['settings'], async () => {
    const res = await SettingsAPI.getSettings()
    if (!res.isSuccess) throw new Error('설정 불러오기 실패')
    return res.result
  })

  const { data: User } = useCustomQuery(['userInfo'], fetchUserInfo, {
    select: (response) => response.result,
  })

  const IconComponent = User?.provider ? PROVIDER_ICONS[User.provider] : null

  return (
    <S.Container>
      <S.HeaderWrapper>
        <S.HeaderContent>
          <h1>설정</h1>
          <p>알림과 계정을 관리하세요.</p>
        </S.HeaderContent>
      </S.HeaderWrapper>

      <S.Content>
        <S.Section>
          <S.SectionTitle>내 정보</S.SectionTitle>
          <S.Row>
            <S.ProfileWrapper>
              <S.TextGroup>
                <S.Name>{User?.nickname}</S.Name>
                <S.InfoRow>
                  <S.ProviderIconWrapper>
                    {IconComponent && <IconComponent width={30} height={30} />}
                  </S.ProviderIconWrapper>
                  <S.Email>{User?.email}</S.Email>
                </S.InfoRow>
              </S.TextGroup>
            </S.ProfileWrapper>
          </S.Row>
        </S.Section>

        <S.Section>
          <S.SectionTitle>알림 설정</S.SectionTitle>
          <S.Row>
            <S.InfoGroup>
              <label>오늘의 브리핑</label>
              <span>매일 아침 AI 비서가 일정을 요약해드려요.</span>
            </S.InfoGroup>
            <S.Toggle
              type="checkbox"
              checked={settings.dailyBriefingEnabled}
              onChange={() => toggleBriefing.mutate()}
              disabled={toggleBriefing.isPending}
            />
          </S.Row>
          <S.Row>
            <S.InfoGroup>
              <label>브리핑 시간</label>
              <span>브리핑 받을 시간을 설정하세요.</span>
            </S.InfoGroup>
            <S.Select
              value={settings.dailyBriefingTime}
              onChange={(e) => updateTime.mutate(e.target.value)}
              disabled={updateTime.isPending}
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </S.Select>
          </S.Row>

          <S.Row>
            <S.InfoGroup>
              <label>일정 리마인더 타이밍</label>
              <span>일정 몇 시간 전부터 알림을 받을지 설정하세요.</span>
            </S.InfoGroup>
            <S.Select
              value={settings.reminderTiming}
              onChange={(e) => updateReminder.mutate(e.target.value as ReminderTiming)}
              disabled={updateReminder.isPending}
            >
              <option value="FIVE_MINUTES">5분 전</option>
              <option value="FIFTEEN_MINUTES">15분 전</option>
              <option value="THIRTY_MINUTES">30분 전</option>
              <option value="ONE_HOUR">1시간 전</option>
              <option value="TWO_HOURS">2시간 전</option>
              <option value="ONE_DAY">1일 전</option>
            </S.Select>
          </S.Row>

          <S.Row>
            <S.InfoGroup>
              <label>선제적 제안</label>
              <span>AI가 일정 패턴을 분석해 일정을 먼저 제안해드려요.</span>
            </S.InfoGroup>
            <S.Toggle
              type="checkbox"
              checked={settings.suggestionEnabled}
              onChange={() => toggleSuggestion.mutate()}
              disabled={toggleSuggestion.isPending}
            />
          </S.Row>
        </S.Section>

        <S.Section>
          <S.SectionTitle>캘린더 설정</S.SectionTitle>
          <S.Row>
            <S.InfoGroup>
              <label>기본 뷰</label>
              <span>캘린더 화면에서 볼 기본 캘린더 양식</span>
            </S.InfoGroup>
            <S.Select
              value={settings.defaultView}
              onChange={(e) => updateView.mutate(e.target.value as CalendarView)}
              disabled={updateView.isPending}
            >
              <option value="MONTH">월간 뷰</option>
              <option value="WEEK">주간 뷰</option>
              <option value="DAY">일간 뷰</option>
            </S.Select>
          </S.Row>
        </S.Section>

        <S.Section>
          <S.SectionTitle>계정</S.SectionTitle>
          <S.Row>
            <S.InfoGroup>
              <label>로그아웃</label>
            </S.InfoGroup>
            <S.Button onClick={handleLogout}>로그아웃</S.Button>
          </S.Row>
          <S.Row>
            <S.InfoGroup>
              <label>회원 탈퇴</label>
              <span>모든 데이터가 삭제됩니다.</span>
            </S.InfoGroup>
            <S.Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              탈퇴
            </S.Button>
          </S.Row>
        </S.Section>
      </S.Content>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteUser.mutate()
          setShowDeleteModal(false)
        }}
        title="정말 계정을 삭제할까요?"
        description="이 작업은 되돌릴 수 없습니다."
        confirmText="계정 삭제"
        cancelText="취소"
        isDanger={true}
      />
    </S.Container>
  )
}
