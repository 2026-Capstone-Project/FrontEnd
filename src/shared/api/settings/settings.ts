import type {
  CalendarView,
  DeleteMemberResponse,
  ReminderTiming,
  SettingsResponse,
  UpdateBriefingTimeResponse,
  UpdateDailyBriefingResponse,
  UpdateDefaultViewResponse,
  UpdateReminderTimingResponse,
  UpdateSuggestionResponse,
} from '@/shared/types/settings/settings'

import axiosInstance from '../axios'

const API_BASE = '/settings'

export const SettingsAPI = {
  getSettings: () => axiosInstance.get<SettingsResponse>(API_BASE).then((res) => res.data),

  toggleSuggestion: () =>
    axiosInstance.patch<UpdateSuggestionResponse>(`${API_BASE}/suggestion`).then((res) => res.data),

  toggleDailyBriefing: () =>
    axiosInstance
      .patch<UpdateDailyBriefingResponse>(`${API_BASE}/daily-briefing`)
      .then((res) => res.data),

  updateReminderTiming: (reminderTiming: ReminderTiming) =>
    axiosInstance
      .patch<UpdateReminderTimingResponse>(`${API_BASE}/reminder/timing`, { reminderTiming })
      .then((res) => res.data),

  updateDefaultView: (defaultView: CalendarView) =>
    axiosInstance
      .patch<UpdateDefaultViewResponse>(`${API_BASE}/default-view`, { defaultView })
      .then((res) => res.data),

  updateBriefingTime: (dailyBriefingTime: string) =>
    axiosInstance
      .patch<UpdateBriefingTimeResponse>(`${API_BASE}/daily-briefing/time`, { dailyBriefingTime })
      .then((res) => res.data),

  deleteUser: async (): Promise<DeleteMemberResponse> => {
    const res = await axiosInstance.delete('/members')
    return res.data
  },
}
