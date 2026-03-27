import { type RepeatConfigSchema } from '@/shared/types/event/event'

// 깊은 비교를 위해 반복 설정 객체를 직렬화 가능한 문자열로 변환한다.
const serializeRepeatConfig = (config: RepeatConfigSchema) => JSON.stringify(config)

// 동일한 반복 설정인지 판단할 때 필드 단위 비교 대신 직렬화 결과를 비교한다.
export const areRepeatConfigsEqual = (
  left: RepeatConfigSchema,
  right: RepeatConfigSchema,
): boolean => serializeRepeatConfig(left) === serializeRepeatConfig(right)
