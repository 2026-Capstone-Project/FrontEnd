import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { SettingsAPI } from '@/shared/api/settings/settings'
import type { TCommonResponse } from '@/shared/types/common/common'
import type { CalendarView, ReminderTiming } from '@/shared/types/settings/settings'
import { useAuthStore } from '@/store/useAuthStore'

export const useSettingsMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleResponse = async <T>(apiCall: Promise<TCommonResponse<T>>) => {
    const res = await apiCall
    if (!res.isSuccess) {
      throw new Error(res.message || '업데이트 실패')
    }
    return res
  }

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error: Error) => {
      alert(error.message || '업데이트 실패')
    },
  }

  const toggleBriefing = useMutation({
    mutationFn: () => handleResponse(SettingsAPI.toggleDailyBriefing()),
    ...mutationOptions,
  })

  const updateTime = useMutation({
    mutationFn: (time: string) => handleResponse(SettingsAPI.updateBriefingTime(time)),
    ...mutationOptions,
  })

  const updateReminder = useMutation({
    mutationFn: (timing: ReminderTiming) =>
      handleResponse(SettingsAPI.updateReminderTiming(timing)),
    ...mutationOptions,
  })

  const toggleSuggestion = useMutation({
    mutationFn: () => handleResponse(SettingsAPI.toggleSuggestion()),
    ...mutationOptions,
  })

  const updateView = useMutation({
    mutationFn: (view: CalendarView) => handleResponse(SettingsAPI.updateDefaultView(view)),
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
      } else {
        alert(res.message || '탈퇴 실패')
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
