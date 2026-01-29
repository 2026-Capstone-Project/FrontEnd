import { type RepeatConfigSchema } from '@/shared/types/event'

const serializeRepeatConfig = (config: RepeatConfigSchema) => JSON.stringify(config)

export const areRepeatConfigsEqual = (
  left: RepeatConfigSchema,
  right: RepeatConfigSchema,
): boolean => serializeRepeatConfig(left) === serializeRepeatConfig(right)
