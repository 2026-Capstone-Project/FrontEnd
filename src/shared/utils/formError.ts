const collectMessages = (value: unknown, messages: Set<string>, visited: WeakSet<object>) => {
  if (!value) return

  if (Array.isArray(value)) {
    value.forEach((item) => collectMessages(item, messages, visited))
    return
  }

  if (typeof value !== 'object') return

  if (visited.has(value)) return
  visited.add(value)

  if ('message' in value && typeof value.message === 'string') {
    const message = value.message.trim()
    if (message) {
      messages.add(message)
    }
  }

  Object.entries(value).forEach(([key, item]) => {
    if (key === 'ref') return
    collectMessages(item, messages, visited)
  })
}

export const getFormErrorMessage = (
  errors: unknown,
  fallbackMessage = '입력 항목을 다시 확인해주세요.',
) => {
  const messages = new Set<string>()
  collectMessages(errors, messages, new WeakSet<object>())

  const uniqueMessages = Array.from(messages)

  if (uniqueMessages.length === 0) {
    return fallbackMessage
  }

  if (uniqueMessages.length <= 2) {
    return uniqueMessages.join(' / ')
  }

  return `${uniqueMessages.slice(0, 2).join(' / ')} 외 ${uniqueMessages.length - 2}건`
}
