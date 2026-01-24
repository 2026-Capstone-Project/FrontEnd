import '@emotion/react'
import { theme } from './theme'

declare module '@emotion/react' {
  export type Theme = typeof theme
}
