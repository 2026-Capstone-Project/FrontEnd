import { type RepeatConfigSchema } from '@/shared/types/event'

const serializeRepeatConfig = (config: RepeatConfigSchema) => {
  try {
    return JSON.stringify(config)
  } catch {
    return
  }
}

export const areRepeatConfigsEqual = (
  left: RepeatConfigSchema,
  right: RepeatConfigSchema,
): boolean => serializeRepeatConfig(left) === serializeRepeatConfig(right)
