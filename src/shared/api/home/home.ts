import type { BriefingResponse, ReminderResponse } from '@/shared/types/home/home'

import axiosInstance from '../axios'

export const fetchTodayBriefing = async (): Promise<BriefingResponse> => {
  const res = await axiosInstance.get<BriefingResponse>('/api/v1/briefings')

  return res.data
}

export const fetchReminders = async (): Promise<ReminderResponse> => {
  const res = await axiosInstance.get<ReminderResponse>('/api/v1/reminders')
  return res.data
}
