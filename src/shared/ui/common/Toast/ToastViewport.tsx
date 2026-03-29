import Toast from '@/shared/ui/common/Toast/Toast'
import { useToastStore } from '@/store/useToastStore'

const ToastViewport = () => {
  const toast = useToastStore((state) => state.toast)
  const hideToast = useToastStore((state) => state.hideToast)

  if (!toast) return null

  return (
    <Toast
      key={toast.id}
      title={toast.title}
      message={toast.message}
      toastType={toast.toastType}
      autoCloseDuration={toast.autoCloseDuration}
      onClose={hideToast}
    />
  )
}

export default ToastViewport
