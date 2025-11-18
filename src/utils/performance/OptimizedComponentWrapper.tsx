import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { debounce, throttle } from 'lodash-es'

// Extended Performance interface for memory monitoring
interface ExtendedPerformance extends Performance {
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// Performance monitoring interface
interface PerformanceMetrics {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  totalRenderTime: number
}

// Higher-order component for performance optimization
export function withPerformanceOptimization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    memo?: boolean
    debounceProps?: string[]
    throttleProps?: string[]
    customShouldUpdate?: (prevProps: P, nextProps: P) => boolean
    trackPerformance?: boolean
  } = {}
) {
  const {
    memo: shouldMemo = true,
    debounceProps = [],
    throttleProps = [],
    customShouldUpdate,
    trackPerformance = false
  } = options

  const Component = trackPerformance
    ? withPerformanceTracking(WrappedComponent)
    : WrappedComponent

  const MemoizedComponent = shouldMemo
    ? memo(Component, customShouldUpdate)
    : Component

  return (props: P) => {
    // Process debounced props
    const debouncedProps = useMemo(() => {
      const processed: Record<string, unknown> = {}

      debounceProps.forEach(prop => {
        if (prop in props) {
          const debouncedValue = useMemo(
            () => debounce((value: unknown) => value, 300),
            []
          )
          processed[prop] = debouncedValue((props as Record<string, unknown>)[prop])
        }
      })

      return processed
    }, [props])

    // Process throttled props
    const throttledProps = useMemo(() => {
      const processed: Record<string, unknown> = {}

      throttleProps.forEach(prop => {
        if (prop in props) {
          const throttledValue = useMemo(
            () => throttle((value: unknown) => value, 100),
            []
          )
          processed[prop] = throttledValue((props as Record<string, unknown>)[prop])
        }
      })

      return processed
    }, [props])

    // Merge processed props with original props
    const finalProps = useMemo(() => ({
      ...props,
      ...debouncedProps,
      ...throttledProps
    }), [props, debouncedProps, throttledProps])

    return <MemoizedComponent {...finalProps} />
  }
}

// Performance tracking wrapper
function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const TrackedComponent = (props: P) => {
    const metricsRef = useRef<PerformanceMetrics>({
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      totalRenderTime: 0
    })

    const renderStart = performance.now()

    useEffect(() => {
      const renderTime = performance.now() - renderStart
      const metrics = metricsRef.current

      metrics.renderCount++
      metrics.lastRenderTime = renderTime
      metrics.totalRenderTime += renderTime
      metrics.averageRenderTime = metrics.totalRenderTime / metrics.renderCount

      // Log performance warnings
      if (renderTime > 16) { // 60fps threshold
        console.warn(
          `Slow render detected in ${WrappedComponent.name}:`,
          `${renderTime.toFixed(2)}ms (avg: ${metrics.averageRenderTime.toFixed(2)}ms)`
        )
      }

      // Report to analytics service periodically
      if (metrics.renderCount % 10 === 0) {
        // analytics.reportPerformance(WrappedComponent.name, metrics)
      }
    })

    return <WrappedComponent {...props} />
  }

  TrackedComponent.displayName = `withPerformanceTracking(${WrappedComponent.displayName || WrappedComponent.name})`

  return TrackedComponent
}

// Render-optimized component for lists
interface OptimizedListItemProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemKey?: (item: T, index: number) => string | number
  getItemHeight?: (item: T) => number
  containerHeight?: number
  overscan?: number
}

export function OptimizedVirtualList<T>({
  items,
  renderItem,
  itemKey = (_, index) => index,
  getItemHeight = () => 50,
  containerHeight = 400,
  overscan = 5
}: OptimizedListItemProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    let start = 0
    let accumulatedHeight = 0

    // Find start index based on scrollTop
    for (let i = 0; i < items.length; i++) {
      const itemHeight = getItemHeight(items[i])
      if (accumulatedHeight + itemHeight > scrollTop) {
        start = Math.max(0, i - overscan)
        break
      }
      accumulatedHeight += itemHeight
    }

    let end = start
    accumulatedHeight = 0

    // Find end index based on container height
    for (let i = start; i < items.length; i++) {
      accumulatedHeight += getItemHeight(items[i])
      if (accumulatedHeight > containerHeight) {
        end = Math.min(items.length - 1, i + overscan)
        break
      }
      end = i
    }

    return { start, end }
  }, [items, scrollTop, getItemHeight, containerHeight, overscan])

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.reduce((total, item) => total + getItemHeight(item), 0)
  }, [items, getItemHeight])

  // Calculate offset for visible items
  const offsetY = useMemo(() => {
    let offset = 0
    for (let i = 0; i < visibleRange.start; i++) {
      offset += getItemHeight(items[i])
    }
    return offset
  }, [items, visibleRange.start, getItemHeight])

  const handleScroll = useCallback(
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }, 16), // 60fps
    []
  )

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1)
  }, [items, visibleRange])

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={itemKey(item, visibleRange.start + index)}
              style={{ height: getItemHeight(item) }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for optimizing expensive calculations
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: {
    maxAge?: number // Time in ms before recalculating
    comparator?: (prev: T, next: T) => boolean
  } = {}
): T {
  const { maxAge, comparator } = options
  const cachedRef = useRef<{ value: T; timestamp: number } | null>(null)
  const prevDepsRef = useRef<React.DependencyList | null>(null)

  const shouldRecalculate = useMemo(() => {
    // Check if dependencies changed
    const depsChanged = !prevDepsRef.current ||
      deps.some((dep, i) => dep !== prevDepsRef.current![i])

    // Check if cached value is expired
    const expired = cachedRef.current &&
      maxAge &&
      Date.now() - cachedRef.current.timestamp > maxAge

    return depsChanged || expired || !cachedRef.current
  }, [deps, maxAge])

  const newValue = useMemo(() => {
    if (!shouldRecalculate && cachedRef.current) {
      return cachedRef.current.value
    }

    const value = factory()

    // Check comparator if provided
    if (comparator && cachedRef.current) {
      if (comparator(cachedRef.current.value, value)) {
        return cachedRef.current.value
      }
    }

    cachedRef.current = {
      value,
      timestamp: Date.now()
    }
    prevDepsRef.current = [...deps]

    return value
  }, [shouldRecalculate, factory, comparator])

  return newValue
}

// Hook for debounced state updates
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, (value: T | ((prev: T) => T)) => void, T] {
  const [state, setState] = useState(initialValue)
  const [debouncedState, setDebouncedState] = useState(initialValue)

  const debouncedSetState = useMemo(
    () => debounce((value: T) => {
      setDebouncedState(value)
    }, delay),
    [delay]
  )

  useEffect(() => {
    debouncedSetState(state)
    return () => debouncedSetState.cancel()
  }, [state, debouncedSetState])

  return [state, setState, debouncedState]
}

// Hook for throttled state updates
export function useThrottledState<T>(
  initialValue: T,
  delay: number = 100
): [T, (value: T | ((prev: T) => T)) => void, T] {
  const [state, setState] = useState(initialValue)
  const [throttledState, setThrottledState] = useState(initialValue)

  const throttledSetState = useMemo(
    () => throttle((value: T) => {
      setThrottledState(value)
    }, delay),
    [delay]
  )

  useEffect(() => {
    throttledSetState(state)
    return () => throttledSetState.cancel()
  }, [state, throttledSetState])

  return [state, setState, throttledState]
}

// Performance monitoring utilities
export const PerformanceMonitor = {
  // Measure function execution time
  measure<T>(fn: () => T, label: string): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()

    console.log(`${label}: ${(end - start).toFixed(2)}ms`)
    return result
  },

  // Measure async function execution time
  async measureAsync<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()

    console.log(`${label}: ${(end - start).toFixed(2)}ms`)
    return result
  },

  // Create performance marks and measures
  mark(name: string): void {
    performance.mark(name)
  },

  measurePerformance(markName: string, startMark: string, endMark?: string): number {
    try {
      performance.measure(markName, startMark, endMark)
      const entry = performance.getEntriesByName(markName, 'measure').pop()
      return entry ? entry.duration : 0
    } catch (e) {
      console.warn('Performance measure failed:', e)
      return 0
    }
  },

  // Get memory usage
  getMemoryUsage(): { used: number; total: number } | null {
    if ('memory' in performance) {
      const memory = (performance as ExtendedPerformance).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize
      }
    }
    return null
  }
}

export default {
  withPerformanceOptimization,
  OptimizedVirtualList,
  useOptimizedMemo,
  useDebouncedState,
  useThrottledState,
  PerformanceMonitor
}