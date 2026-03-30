import { useShallow } from 'zustand/react/shallow'

import Toast from '@/shared/ui/common/Toast/Toast'
import { useToastStore } from '@/store/useToastStore'

const ToastViewport = () => {
  const { toast, hideToast } = useToastStore(
    useShallow((state) => ({
      toast: state.toast,
      hideToast: state.hideToast,
    })),
  )

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
