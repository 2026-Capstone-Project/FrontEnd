import { useQueryClient } from '@tanstack/react-query'

import { deleteEvent, patchEvent, postEvents } from '@/shared/api/calendar/api'
import type { RecurrenceEventSeriesScope } from '@/shared/constants/recurrenceScope'
import { getErrorMessage, markErrorToastHandled } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

import { useCustomMutation } from '../common/customQuery'

export function useCalendarMutation() {
  const queryClient = useQueryClient()
  const invalidateCalendarQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] })
    queryClient.invalidateQueries({ queryKey: ['calendar', 'detail'] })
  }
  function usePostEvent() {
    return useCustomMutation(postEvents, {
      onSuccess: () => {
        invalidateCalendarQueries()
        useToastStore.getState().showToast({
          title: '일정이 저장되었습니다',
          message: '새 일정이 정상적으로 등록되었어요.',
          toastType: 'success',
        })
      },
      onError: (error: unknown) => {
        useToastStore.getState().showToast({
          title: '일정 저장에 실패했습니다',
          message: getErrorMessage(error),
          toastType: 'error',
        })
        markErrorToastHandled(error)
      },
    })
  }
  function usePatchEvent() {
    return useCustomMutation(
      ({
        eventId,
        eventData,
        params,
      }: {
        eventId: number
        eventData: Parameters<typeof patchEvent>[1]
        params: Parameters<typeof patchEvent>[2]
      }) => patchEvent(eventId, eventData, params),
      {
        onSuccess: () => {
          invalidateCalendarQueries()
          useToastStore.getState().showToast({
            title: '일정이 수정되었습니다',
            message: '변경 사항이 정상적으로 반영되었어요.',
            toastType: 'success',
          })
        },
        onError: (error: unknown) => {
          useToastStore.getState().showToast({
            title: '일정 수정에 실패했습니다',
            message: getErrorMessage(error),
            toastType: 'error',
          })
          markErrorToastHandled(error)
        },
      },
    )
  }
  function useDeleteEvent() {
    return useCustomMutation(
      ({
        eventId,
        params,
      }: {
        eventId: number
        params: {
          scope?: RecurrenceEventSeriesScope
          occurrenceDate: string
        }
      }) => deleteEvent(eventId, params),
      {
        onSuccess: () => {
          invalidateCalendarQueries()
          useToastStore.getState().showToast({
            title: '일정이 삭제되었습니다',
            message: '선택한 일정이 정상적으로 삭제되었어요.',
            toastType: 'success',
          })
        },
        onError: (error: unknown) => {
          useToastStore.getState().showToast({
            title: '일정 삭제에 실패했습니다',
            message: getErrorMessage(error),
            toastType: 'error',
          })
          markErrorToastHandled(error)
        },
      },
    )
  }
  return {
    usePostEvent,
    usePatchEvent,
    useDeleteEvent,
  }
}
