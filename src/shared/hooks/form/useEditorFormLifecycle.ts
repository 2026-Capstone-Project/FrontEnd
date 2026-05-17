import { useEffect, useRef } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'

type UseEditorFormLifecycleArgs<TValues extends FieldValues> = {
  formMethods: UseFormReturn<TValues>
  registeredFields: Array<Path<TValues>>
  resetKey: string
  isEditing: boolean
  initialValues: TValues
  editingResetValues?: TValues | null
  onDraftChange?: (draft: ItemEditorDraft) => void
  mapDraft: (values: TValues) => ItemEditorDraft
}

export const useEditorFormLifecycle = <TValues extends FieldValues>({
  formMethods,
  registeredFields,
  resetKey,
  isEditing,
  initialValues,
  editingResetValues,
  onDraftChange,
  mapDraft,
}: UseEditorFormLifecycleArgs<TValues>) => {
  const previousResetKeyRef = useRef(resetKey)
  const { register, reset } = formMethods

  useEffect(() => {
    registeredFields.forEach((field) => register(field))
  }, [register, registeredFields])

  useEffect(() => {
    if (!isEditing || !editingResetValues) return
    reset(editingResetValues)
  }, [editingResetValues, isEditing, reset])

  useEffect(() => {
    if (isEditing) return
    if (previousResetKeyRef.current === resetKey) return
    previousResetKeyRef.current = resetKey
    reset(initialValues)
  }, [initialValues, isEditing, reset, resetKey])

  useEffect(() => {
    if (isEditing || !onDraftChange) return
    const subscription = formMethods.watch((values) => {
      onDraftChange(mapDraft(values as TValues))
    })

    return () => subscription.unsubscribe()
  }, [formMethods, isEditing, mapDraft, onDraftChange])
}
