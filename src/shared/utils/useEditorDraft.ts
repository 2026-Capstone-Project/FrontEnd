import { useCallback, useEffect, useRef, useState } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import type { ItemType } from '@/shared/types/modal/itemEditor'
import { buildDefaultItemEditorDraft } from '@/shared/utils'

type UseEditorDraftParams = {
  date: string
  initialType: ItemType
  initialEvent: CalendarEvent | null
  isEditing: boolean
  externalDraftValues?: ItemEditorDraft | null
  onExternalDraftChange?: (draft: ItemEditorDraft | null) => void
}

export const useEditorDraft = ({
  date,
  initialType,
  initialEvent,
  isEditing,
  externalDraftValues,
  onExternalDraftChange,
}: UseEditorDraftParams) => {
  const [internalDraftValues, setInternalDraftValues] = useState<ItemEditorDraft | null>(() =>
    isEditing ? null : buildDefaultItemEditorDraft(date, initialType, initialEvent),
  )

  const draftValues = externalDraftValues ?? internalDraftValues
  const draftValuesRef = useRef(draftValues)

  useEffect(() => {
    draftValuesRef.current = draftValues
  }, [draftValues])

  useEffect(() => {
    if (externalDraftValues !== undefined) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternalDraftValues(
      isEditing ? null : buildDefaultItemEditorDraft(date, initialType, initialEvent),
    )
  }, [date, externalDraftValues, initialEvent, initialType, isEditing])

  const setDraftValues = useCallback(
    (draft: ItemEditorDraft | null) => {
      if (onExternalDraftChange) {
        onExternalDraftChange(draft)
        return
      }
      setInternalDraftValues(draft)
    },
    [onExternalDraftChange],
  )

  return { draftValues, draftValuesRef, setDraftValues }
}
