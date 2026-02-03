export const useCalendarPortals = () => {
  const modalPortalRoot =
    typeof document === 'undefined' ? null : document.getElementById('modal-root')
  const cardPortalRoot =
    typeof document === 'undefined' ? null : document.getElementById('desktop-card-area')

  return { modalPortalRoot, cardPortalRoot }
}
