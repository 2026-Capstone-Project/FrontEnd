import type { BriefingResponse, ReminderResponse } from '@/shared/types/home/home'

import axiosInstance from '../axios'

export const fetchTodayBriefing = async (): Promise<BriefingResponse> => {
  const res = await axiosInstance.get<BriefingResponse>('/briefings')

  return res.data
}

export const fetchReminders = async (): Promise<ReminderResponse> => {
  const res = await axiosInstance.get<ReminderResponse>('/reminders')
  return res.data
}
