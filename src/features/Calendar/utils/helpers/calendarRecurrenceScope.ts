import type { RecurrenceEventSeriesScope } from '@/shared/constants/recurrenceScope'
import { RECURRENCE_EVENT_SCOPE, RECURRENCE_TODO_SCOPE } from '@/shared/constants/recurrenceScope'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { EditConfirmOption } from '@/shared/ui/Modals'

export const getEventOccurrenceScope = (
  isRecurring: boolean,
): RecurrenceEventSeriesScope | undefined =>
  isRecurring ? RECURRENCE_EVENT_SCOPE.THIS_EVENT : undefined

export const getTodoOccurrenceScope = (isRecurring: boolean): RecurrenceTodoScope | undefined =>
  isRecurring ? RECURRENCE_TODO_SCOPE.THIS_TODO : undefined

export const getEventScopeFromEditOption = (
  option: EditConfirmOption,
): RecurrenceEventSeriesScope =>
  option === 'future'
    ? RECURRENCE_EVENT_SCOPE.THIS_AND_FOLLOWING_EVENTS
    : RECURRENCE_EVENT_SCOPE.THIS_EVENT

export const getTodoScopeFromEditOption = (option: EditConfirmOption): RecurrenceTodoScope =>
  option === 'future' ? RECURRENCE_TODO_SCOPE.THIS_AND_FOLLOWING : RECURRENCE_TODO_SCOPE.THIS_TODO

export const isTodoFollowingScope = (scope?: RecurrenceTodoScope): boolean =>
  scope === RECURRENCE_TODO_SCOPE.THIS_AND_FOLLOWING
