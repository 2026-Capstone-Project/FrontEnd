import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import AddScheduleDateTimeSection from '@/shared/ui/modal/AddSchedule/AddScheduleDateTimeSection'
import AddScheduleDetailsSection from '@/shared/ui/modal/AddSchedule/AddScheduleDetailsSection'
import AddScheduleRepeatSection from '@/shared/ui/modal/AddSchedule/AddScheduleRepeatSection'
import AddScheduleTitleField from '@/shared/ui/modal/AddSchedule/AddScheduleTitleField'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'

type AddScheduleFormFieldsProps = Pick<
  AddScheduleFormProps,
  'headerTitlePortalTarget' | 'modalWrapperElement' | 'mode'
> & {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
  handleAllDayToggle: () => void
  onTitleConfirm: (value: string) => void
}

const AddScheduleFormFields = ({
  headerTitlePortalTarget,
  modalWrapperElement,
  mode = 'modal',
  updateConfig,
  handleRepeatType,
  handleAllDayToggle,
  onTitleConfirm,
}: AddScheduleFormFieldsProps) => {
  return (
    <>
      <S.FormContent>
        <AddScheduleTitleField
          portalTarget={headerTitlePortalTarget}
          onTitleConfirm={onTitleConfirm}
        />
        <AddScheduleDateTimeSection mode={mode} handleAllDayToggle={handleAllDayToggle} />
        <AddScheduleDetailsSection mode={mode} modalWrapperElement={modalWrapperElement} />
      </S.FormContent>
      <AddScheduleRepeatSection updateConfig={updateConfig} handleRepeatType={handleRepeatType} />
    </>
  )
}

export default AddScheduleFormFields
