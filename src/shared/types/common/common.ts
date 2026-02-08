export type TCommonResponse<T> = {
  isSuccess: boolean
  code: string
  message: string
  result: T
}
