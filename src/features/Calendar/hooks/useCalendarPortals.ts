// 캘린더 모달/카드 포털 DOM을 제공하는 훅
export const useCalendarPortals = () => {
  const modalPortalRoot =
    typeof document === 'undefined' ? null : document.getElementById('modal-root')
  const cardPortalRoot =
    typeof document === 'undefined' ? null : document.getElementById('desktop-card-area')

  return { modalPortalRoot, cardPortalRoot }
}
