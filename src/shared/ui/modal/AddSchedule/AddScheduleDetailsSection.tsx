import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useSchedulePlaceOverlay } from '@/shared/hooks/addSchedule'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'
import SearchPlace from '@/shared/ui/modal/common/SearchPlace/SearchPlace'

type AddScheduleDetailsSectionProps = Pick<AddScheduleFormProps, 'modalWrapperElement' | 'mode'>

const AddScheduleDetailsSection = ({
  modalWrapperElement,
  mode = 'modal',
}: AddScheduleDetailsSectionProps) => {
  const { control, register, setValue } = useFormContext<AddScheduleFormValues>()
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
          <S.Textarea {...register('eventDescription')} />
        </S.TextareaWrapper>
        <S.FieldRow style={{ width: '100%' }}>
          <S.FieldMap
            type="button"
            onClick={() => openSearchPlace()}
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

export default AddScheduleDetailsSection
