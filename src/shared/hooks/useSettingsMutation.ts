import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { SettingsAPI } from '@/shared/api/settings/settings'
import type { CalendarView, ReminderTiming } from '@/shared/types/settings/settings'
import { useAuthStore } from '@/store/useAuthStore'

export const useSettingsMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: () => {
      alert('업데이트 실패')
    },
  }

  const toggleBriefing = useMutation({
    mutationFn: SettingsAPI.toggleDailyBriefing,
    ...mutationOptions,
  })

  const updateTime = useMutation({
    mutationFn: SettingsAPI.updateBriefingTime,
    ...mutationOptions,
  })

  const updateReminder = useMutation({
    mutationFn: (timing: ReminderTiming) => SettingsAPI.updateReminderTiming(timing),
    ...mutationOptions,
  })

  const toggleSuggestion = useMutation({
    mutationFn: SettingsAPI.toggleSuggestion,
    ...mutationOptions,
  })

  const updateView = useMutation({
    mutationFn: (view: CalendarView) => SettingsAPI.updateDefaultView(view),
    ...mutationOptions,
  })

  const deleteUser = useMutation({
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

  return {
    toggleBriefing,
    updateTime,
    updateReminder,
    toggleSuggestion,
    updateView,
    deleteUser,
  }
}
