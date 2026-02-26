import { FormProvider } from 'react-hook-form'

import { useAddScheduleForm } from '@/shared/hooks/form/useAddScheduleForm'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import AddScheduleFormContent from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormContent'

const AddScheduleForm = ({ date, initialEvent, isEditing, ...rest }: AddScheduleFormProps) => {
  const schedule = useAddScheduleForm({ date, initialEvent, isEditing })

  return (
    <FormProvider {...schedule.formMethods}>
      <AddScheduleFormContent
        {...rest}
        date={date}
        initialEvent={initialEvent}
        schedule={schedule}
      />
    </FormProvider>
  )
}

export default AddScheduleForm
