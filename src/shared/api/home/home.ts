import type {
  BriefingResponse,
  ChatResponse,
  ReminderResponse,
  SuggestionListResponse,
} from '@/shared/types/home/home'

import axiosInstance from '../axios'

export const fetchTodayBriefing = async (): Promise<BriefingResponse> => {
  const res = await axiosInstance.get<BriefingResponse>('/briefings')

  return res.data
}

export const fetchReminders = async (): Promise<ReminderResponse> => {
  const res = await axiosInstance.get<ReminderResponse>('/reminders')
  return res.data
}

export const suggestionApi = {
  getSuggestions: async () => {
    const res = await axiosInstance.get<SuggestionListResponse>('/suggestions')
    return res.data
  },

  acceptSuggestion: async (suggestionId: number) => {
    const res = await axiosInstance.post(`/suggestions/${suggestionId}/acceptance`)
    return res.data
  },

  rejectSuggestion: async (suggestionId: number) => {
    const res = await axiosInstance.post(`/suggestions/${suggestionId}/rejection`)
    return res.data
  },

  createSuggestion: async () => {
    await axiosInstance.post('/suggestions')
  },
  deleteSuggestion: async () => {
    await axiosInstance.delete('/suggestions')
  },
}

export const nlpApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const res = await axiosInstance.post<ChatResponse>('/chat', { message })
    return res.data
  },
}
