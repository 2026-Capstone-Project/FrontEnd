import { FormProvider } from 'react-hook-form'

import { useScheduleEditorForm } from '@/shared/hooks/form/useScheduleEditorForm'
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import ScheduleEditorContent from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorContent'

const ScheduleEditorForm = ({
  date,
  initialEvent,
  isEditing,
  ...rest
}: ScheduleEditorFormProps) => {
  const schedule = useScheduleEditorForm({ date, initialEvent, isEditing })

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
