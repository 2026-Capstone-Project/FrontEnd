import type { ErrorInfo, ReactNode } from 'react'
import { Component, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

import AsyncBoundaryFallback from './AsyncBoundaryFallback'

type AsyncBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  errorFallback?: (error: Error, reset: () => void) => ReactNode
  resetKeys?: Array<unknown>
}

type AsyncBoundaryState = {
  error?: Error
}

class ErrorBoundary extends Component<
  {
    children: ReactNode
    fallback?: (error: Error, reset: () => void) => ReactNode
    resetKeys?: Array<unknown>
  },
  AsyncBoundaryState
> {
  state: AsyncBoundaryState = {}

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
  }

  componentDidUpdate(prevProps: Readonly<{ resetKeys?: Array<unknown> }>) {
    const { error } = this.state
    const { resetKeys } = this.props
    if (!error || !resetKeys || !prevProps.resetKeys) return

    const hasResetKeyChanged =
      resetKeys.length !== prevProps.resetKeys.length ||
      resetKeys.some((key, index) => !Object.is(key, prevProps.resetKeys?.[index]))

    if (hasResetKeyChanged) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    this.setState({ error: undefined })
  }

  render() {
    const { error } = this.state
    if (error) {
      const { fallback } = this.props
      if (fallback) {
        return fallback(error, this.resetErrorBoundary)
      }
      return <AsyncBoundaryFallback error={error} onReset={this.resetErrorBoundary} />
    }
    return this.props.children
  }
}

const AsyncBoundary = ({ children, fallback, errorFallback, resetKeys }: AsyncBoundaryProps) => {
  const location = useLocation()
  const derivedResetKeys = resetKeys ?? [location.pathname, location.search, location.hash]

  return (
    <ErrorBoundary fallback={errorFallback} resetKeys={derivedResetKeys}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default AsyncBoundary
