import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import AddModalLayout from '@/shared/ui/modal/AddModalLayout/AddModalLayout'
import AddScheduleForm from '@/shared/ui/modal/AddSchedule/components/AddScheduleForm'
import AddTodoForm from '@/shared/ui/modal/AddTodo/components/AddTodoForm'

import * as S from './AddItem.style'

type ActiveType = 'todo' | 'schedule'

type AddItemModalProps = {
  onClose: () => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: number
  defaultType?: ActiveType
  tabsVisible?: boolean
  isEditing?: boolean
}

const AddItemModal = ({
  onClose,
  date,
  mode = 'modal',
  eventId,
  defaultType = 'todo',
  tabsVisible = true,
  isEditing = false,
}: AddItemModalProps) => {
  const [activeType, setActiveType] = useState<ActiveType>(defaultType)
  const [footerChildren, setFooterChildren] = useState<ReactNode | null>(null)
  const [deleteHandler, setDeleteHandler] = useState<() => void>(() => () => undefined)

  const registerDeleteHandler = useCallback((handler: () => void) => {
    setDeleteHandler(() => handler)
  }, [])

  const registerFooterChildren = useCallback((node: React.ReactNode | null) => {
    setFooterChildren(node)
  }, [])

  useEffect(() => {
    setActiveType(defaultType)
  }, [defaultType])

  const handleSubmitId = useMemo(
    () => (activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'),
    [activeType],
  )

  const tabs = (
    <S.TabControls>
      <S.TabButton
        type="button"
        $isActive={activeType === 'todo'}
        onClick={() => setActiveType('todo')}
      >
        할 일
      </S.TabButton>
      <S.TabButton
        type="button"
        $isActive={activeType === 'schedule'}
        onClick={() => setActiveType('schedule')}
      >
        일정
      </S.TabButton>
    </S.TabControls>
  )

  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('desktop-card-area')
  }, [])

  const layout = (
    <AddModalLayout
      mode={mode}
      type={activeType}
      onClose={onClose}
      submitFormId={handleSubmitId}
      handleDelete={deleteHandler}
      footerChildren={footerChildren}
      headerExtras={tabsVisible ? tabs : undefined}
    >
      {activeType === 'todo' ? (
        <AddTodoForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={onClose}
          registerDeleteHandler={registerDeleteHandler}
          isEditing={isEditing}
        />
      ) : (
        <AddScheduleForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={onClose}
          registerDeleteHandler={registerDeleteHandler}
          registerFooterChildren={registerFooterChildren}
          isEditing={isEditing}
        />
      )}
    </AddModalLayout>
  )

  if (mode === 'inline' && portalRoot) {
    return createPortal(layout, portalRoot)
  }

  return layout
}

export default AddItemModal
