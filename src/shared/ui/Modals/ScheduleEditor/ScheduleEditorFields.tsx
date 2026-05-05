// 일정 편집 화면의 제목, 날짜, 상세, 반복 섹션을 배치하는 조합 컴포넌트입니다.
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'
import ScheduleDateTimeSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleDateTimeSection'
import ScheduleDetailsSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleDetailsSection'
import ScheduleRepeatSection from '@/shared/ui/Modals/ScheduleEditor/ScheduleRepeatSection'
import ScheduleTitleField from '@/shared/ui/Modals/ScheduleEditor/ScheduleTitleField'

import ShareSchedulePanel from './ShareSchedulePanel'

type ScheduleEditorFieldsProps = Pick<
  ScheduleEditorFormProps,
  'headerTitlePortalTarget' | 'isEditing' | 'isShared' | 'modalWrapperElement' | 'mode'
> & {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
  handleAllDayToggle: () => void
  onTitleConfirm: (value: string) => void
  onSharedChange?: (isShared: boolean) => void
}

const ScheduleEditorFields = ({
  headerTitlePortalTarget,
  isEditing = false,
  isShared = false,
  modalWrapperElement,
  mode = 'modal',
  updateConfig,
  handleRepeatType,
  handleAllDayToggle,
  onTitleConfirm,
  onSharedChange,
}: ScheduleEditorFieldsProps) => {
  return (
    <>
      <S.FormContent>
        <ScheduleTitleField
          portalTarget={headerTitlePortalTarget}
          autoFocus={!isEditing}
          isShared={isShared}
          onTitleConfirm={onTitleConfirm}
        />
        <ScheduleDateTimeSection mode={mode} handleAllDayToggle={handleAllDayToggle} />
        <ScheduleDetailsSection mode={mode} modalWrapperElement={modalWrapperElement} />
      </S.FormContent>
      <ScheduleRepeatSection updateConfig={updateConfig} handleRepeatType={handleRepeatType} />
      <ShareSchedulePanel onSharedChange={onSharedChange} />
    </>
  )
}

export default ScheduleEditorFields
