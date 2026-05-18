// 일정 메모와 장소 검색/선택 UI를 담당하는 상세 정보 섹션입니다.
import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useSchedulePlaceOverlay } from '@/shared/hooks/addSchedule'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'
import SearchPlace from '@/shared/ui/scheduleTodo/SearchPlace/SearchPlace'

type ScheduleDetailsSectionProps = Pick<ScheduleEditorFormProps, 'modalWrapperElement' | 'mode'> & {
  readOnly?: boolean
  onReadOnlyAttempt?: () => void
}

const ScheduleDetailsSection = ({
  modalWrapperElement,
  mode = 'modal',
  readOnly = false,
  onReadOnlyAttempt,
}: ScheduleDetailsSectionProps) => {
  const { control, register, setValue } = useFormContext<ScheduleEditorFormValues>()
  const descriptionField = register('eventDescription')
  const location = useWatch({ control, name: 'location' }) ?? ''
  const {
    closeSearchPlace,
    isSearchPlaceOpen,
    mapRef,
    openSearchPlace,
    searchPlacePortalPlacement,
    searchPlacePortalTarget,
    shouldShowOverlay,
  } = useSchedulePlaceOverlay({
    modalWrapperElement,
    mode,
  })

  return (
    <>
      {shouldShowOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <S.BottomSection>
        <S.TextareaWrapper>
          <S.TextareaHeader>메모</S.TextareaHeader>
          <S.Textarea
            {...descriptionField}
            readOnly={readOnly}
            aria-readonly={readOnly}
            onFocus={() => {
              if (readOnly) onReadOnlyAttempt?.()
            }}
            onChange={(event) => {
              if (readOnly) {
                event.preventDefault()
                onReadOnlyAttempt?.()
                return
              }
              descriptionField.onChange(event)
            }}
          />
        </S.TextareaWrapper>
        <S.FieldRow style={{ width: '100%' }}>
          <S.FieldMap
            type="button"
            onClick={readOnly ? onReadOnlyAttempt : () => openSearchPlace()}
            $hasValue={Boolean(location)}
            title={location || '장소 추가'}
          >
            {location || '장소 추가'}
          </S.FieldMap>
          {isSearchPlaceOpen &&
            searchPlacePortalTarget &&
            createPortal(
              <S.SearchPlacePortal ref={mapRef} $placement={searchPlacePortalPlacement}>
                <SearchPlace
                  selectedLocation={location}
                  onSelectLocation={(nextLocation, options) => {
                    setValue('location', nextLocation, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                    setValue('address', options?.address ?? null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                    if (options?.closeAfterSelect !== false) {
                      closeSearchPlace()
                    }
                  }}
                />
              </S.SearchPlacePortal>,
              searchPlacePortalTarget,
            )}
        </S.FieldRow>
      </S.BottomSection>
    </>
  )
}

export default ScheduleDetailsSection
