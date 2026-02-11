import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GoogleIcon from '@/assets/social/google.svg?react'
import KakaoIcon from '@/assets/social/kakao.svg?react'
import NaverIcon from '@/assets/social/naver.svg?react'
import Modal from '@/features/Common/Modal'
import { SettingsAPI } from '@/shared/api/settings/settings'
import type { CalendarView, ReminderTiming } from '@/shared/types/settings/settings'
import { useAuthStore } from '@/store/useAuthStore'

import * as S from './Settings.styles'

const PROVIDER_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  google: GoogleIcon,
  kakao: KakaoIcon,
  naver: NaverIcon,
}

const User = {
  name: '김컴과',
  email: 'computer@gmail.com',
  provider: 'google',
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const timeOptions = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

  const navigate = useNavigate()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await SettingsAPI.getSettings()
      if (!res.isSuccess) throw new Error('설정 불러오기 실패')
      return res.result
    },
    enabled: isLoggedIn,
  })

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: () => {
      alert('업데이트 실패')
    },
  }

  const toggleBriefingMutation = useMutation({
    mutationFn: SettingsAPI.toggleDailyBriefing,
    ...mutationOptions,
  })

  const updateTimeMutation = useMutation({
    mutationFn: SettingsAPI.updateBriefingTime,
    ...mutationOptions,
  })

  const updateReminderMutation = useMutation({
    mutationFn: (timing: ReminderTiming) => SettingsAPI.updateReminderTiming(timing),
    ...mutationOptions,
  })

  const toggleSuggestionMutation = useMutation({
    mutationFn: SettingsAPI.toggleSuggestion,
    ...mutationOptions,
  })

  const updateViewMutation = useMutation({
    mutationFn: (view: CalendarView) => SettingsAPI.updateDefaultView(view),
    ...mutationOptions,
  })

  const deleteUserMutation = useMutation({
    mutationFn: SettingsAPI.deleteUser,
    onSuccess: (res) => {
      if (res.isSuccess) {
        queryClient.clear()
        logout()
        alert('회원 탈퇴가 완료되었습니다.')
        navigate('/', { replace: true })
      }
    },
    onError: () => {
      alert('탈퇴 처리 중 오류가 발생했습니다.')
    },
  })

  function handleConfirmDelete() {
    deleteUserMutation.mutate()
    setShowDeleteModal(false)
  }

  const handleToggleDailyBriefing = () => toggleBriefingMutation.mutate()
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateTimeMutation.mutate(e.target.value)
  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateReminderMutation.mutate(e.target.value as ReminderTiming)
  const handleToggleSuggestion = () => toggleSuggestionMutation.mutate()
  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateViewMutation.mutate(e.target.value as CalendarView)

  if (isLoading || !settings) return null

  const IconComponent = PROVIDER_ICONS[User.provider]

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
                <S.Name>{User.name}</S.Name>
                <S.InfoRow>
                  <S.ProviderIconWrapper>
                    {IconComponent && <IconComponent width={30} height={30} />}
                  </S.ProviderIconWrapper>
                  <S.Email>{User.email}</S.Email>
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
              onChange={handleToggleDailyBriefing}
              disabled={toggleBriefingMutation.isPending}
            />
          </S.Row>
          <S.Row>
            <S.InfoGroup>
              <label>브리핑 시간</label>
              <span>브리핑 받을 시간을 설정하세요.</span>
            </S.InfoGroup>
            <S.Select
              value={settings.dailyBriefingTime}
              onChange={handleTimeChange}
              disabled={updateTimeMutation.isPending}
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
              onChange={handleReminderChange}
              disabled={updateReminderMutation.isPending}
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
              onChange={handleToggleSuggestion}
              disabled={toggleSuggestionMutation.isPending}
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
              onChange={handleViewChange}
              disabled={updateViewMutation.isPending}
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
            <S.Button>로그아웃</S.Button>
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
        onConfirm={handleConfirmDelete}
        title="정말 계정을 삭제할까요?"
        description="이 작업은 되돌릴 수 없습니다."
        confirmText="계정 삭제"
        cancelText="취소"
        isDanger={true}
      />
    </S.Container>
  )
}
