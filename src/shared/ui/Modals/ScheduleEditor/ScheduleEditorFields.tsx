import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'
import ScheduleDateTimeSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleDateTimeSection'
import ScheduleDetailsSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleDetailsSection'
import ScheduleRepeatSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleRepeatSection'
import ScheduleTitleField from '@/shared/ui/Modals/ScheduleEditor/ScheduleTitleField'

type ScheduleEditorFieldsProps = Pick<
  ScheduleEditorFormProps,
  'headerTitlePortalTarget' | 'modalWrapperElement' | 'mode'
> & {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
  handleAllDayToggle: () => void
  onTitleConfirm: (value: string) => void
}

const ScheduleEditorFields = ({
  headerTitlePortalTarget,
  modalWrapperElement,
  mode = 'modal',
  updateConfig,
  handleRepeatType,
  handleAllDayToggle,
  onTitleConfirm,
}: ScheduleEditorFieldsProps) => {
  return (
    <>
      <S.FormContent>
        <ScheduleTitleField
          portalTarget={headerTitlePortalTarget}
          onTitleConfirm={onTitleConfirm}
        />
        <ScheduleDateTimeSection mode={mode} handleAllDayToggle={handleAllDayToggle} />
        <ScheduleDetailsSection mode={mode} modalWrapperElement={modalWrapperElement} />
      </S.FormContent>
      <ScheduleRepeatSection updateConfig={updateConfig} handleRepeatType={handleRepeatType} />
    </>
  )
}

export default ScheduleEditorFields
