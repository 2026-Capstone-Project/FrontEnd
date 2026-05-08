import type {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

export type TitleSuggestionInputFormController<TFieldValues extends FieldValues> = {
  register: UseFormRegister<TFieldValues>
  watch: UseFormWatch<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
}

export type TitleSuggestionInputProps<TFieldValues extends FieldValues> = {
  fieldName: Path<TFieldValues>
  placeholder?: string
  suggestions?: string[]
  autoFocus?: boolean
  formController?: TitleSuggestionInputFormController<TFieldValues>
  inputColor?: string
  onConfirm?: (value: string) => void
  onLiveChange?: (value: string) => void
}

export type HighlightedSegment = {
  text: string
  highlight?: boolean
}
