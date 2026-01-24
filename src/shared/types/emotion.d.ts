import '@emotion/react'

import { theme } from '../styles/theme'

declare module '@emotion/react' {
  export type Theme = typeof theme
}
