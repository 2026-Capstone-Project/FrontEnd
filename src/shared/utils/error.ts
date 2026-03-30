import axios from 'axios'

type ErrorResponseData = {
  message?: string
}

export const getErrorMessage = (error: unknown, fallbackMessage = '잠시 후 다시 시도해주세요.') => {
  if (axios.isAxiosError<ErrorResponseData>(error)) {
    const responseMessage = error.response?.data?.message?.trim()
    if (responseMessage) return responseMessage

    if (error.code === 'ERR_NETWORK') {
      return '네트워크 연결을 확인한 뒤 다시 시도해주세요.'
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
