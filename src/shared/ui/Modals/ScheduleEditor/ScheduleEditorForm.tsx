// 일정 편집 폼 상태를 만들고 FormProvider로 하위 섹션에 전달합니다.
import { FormProvider } from 'react-hook-form'

import { useScheduleEditorForm } from '@/shared/hooks/form/useScheduleEditorForm'
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import ScheduleEditorContent from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorContent'

const ScheduleEditorForm = ({
  date,
  initialEvent,
  isEditing,
  draftValues,
  onDraftChange,
  ...rest
}: ScheduleEditorFormProps) => {
  const schedule = useScheduleEditorForm({
    date,
    initialEvent,
    isEditing,
    draftValues,
    onDraftChange,
  })

  return (
    <FormProvider {...schedule.formMethods}>
      <ScheduleEditorContent
        {...rest}
        date={date}
        initialEvent={initialEvent}
        isEditing={isEditing}
        schedule={schedule}
      />
    </FormProvider>
  )
}

export default ScheduleEditorForm
