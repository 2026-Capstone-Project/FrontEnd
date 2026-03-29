import { useSearchPlaceToggle } from '@/shared/hooks/form/useSearchPlaceToggle'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'

type UseSchedulePlaceOverlayProps = Pick<AddScheduleFormProps, 'modalWrapperElement' | 'mode'>

export const useSchedulePlaceOverlay = ({
  modalWrapperElement,
  mode = 'modal',
}: UseSchedulePlaceOverlayProps) => {
  const { mapRef, isSearchPlaceOpen, closeSearchPlace, openSearchPlace } = useSearchPlaceToggle()
  const isInlineMode = mode === 'inline'
  const searchPlacePortalPlacement: 'container' | 'viewport' = isInlineMode
    ? 'container'
    : 'viewport'
  const searchPlacePortalTarget =
    typeof document === 'undefined'
      ? null
      : isInlineMode
        ? (modalWrapperElement ?? null)
        : document.getElementById('modal-root')

  return {
    closeSearchPlace,
    isSearchPlaceOpen,
    mapRef,
    openSearchPlace,
    searchPlacePortalPlacement,
    searchPlacePortalTarget,
    shouldShowOverlay: !isInlineMode && isSearchPlaceOpen,
  }
}
