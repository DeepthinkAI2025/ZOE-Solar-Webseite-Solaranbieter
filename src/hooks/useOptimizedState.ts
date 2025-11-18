import { useState, useEffect, useCallback, useReducer, useRef, useMemo } from 'react'

// Optimized state management hooks for better performance

// Enhanced useState with comparison function
export function useCompareState<T>(
  initialValue: T,
  areEqual: (prev: T, next: T) => boolean = (prev, next) => prev === next
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)

  const setCompareState = useCallback((newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(stateRef.current)
      : newValue

    if (!areEqual(stateRef.current, resolvedValue)) {
      stateRef.current = resolvedValue
      setState(resolvedValue)
    }
  }, [areEqual])

  return [state, setCompareState]
}

// Batch multiple state updates together
export function useBatchedUpdates<T extends Record<string, unknown>>(
  initialState: T
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const [state, setState] = useState(initialState)

  const batchedSetState = useCallback((updates: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState(prevState => {
      const resolvedUpdates = typeof updates === 'function'
        ? (updates as (prev: T) => Partial<T>)(prevState)
        : updates

      // Only update if there are actual changes
      const hasChanges = Object.keys(resolvedUpdates).some(
        key => !Object.is(prevState[key], resolvedUpdates[key])
      )

      if (!hasChanges) return prevState

      return { ...prevState, ...resolvedUpdates }
    })
  }, [])

  return [state, batchedSetState]
}

// Optimized state with derived values
export function useDerivedState<S, D>(
  initialState: S,
  derive: (state: S) => D
): [S, (value: S | ((prev: S) => S)) => void, D] {
  const [state, setState] = useState(initialState)

  const derivedState = useMemo(() =>
    derive(state),
    [state, derive]
  )

  return [state, setState, derivedState]
}

// State with history/undo functionality
interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useUndoableState<T>(
  initialValue: T,
  maxHistorySize: number = 50
): [T, (value: T | ((prev: T) => T)) => void, () => void, () => void, boolean, boolean] {
  const [historyState, setHistoryState] = useState<HistoryState<T>>({
    past: [],
    present: initialValue,
    future: []
  })

  const setState = useCallback((newValue: T | ((prev: T) => T)) => {
    setHistoryState(currentState => {
      const resolvedValue = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(currentState.present)
        : newValue

      // Don't add to history if value hasn't changed
      if (Object.is(currentState.present, resolvedValue)) {
        return currentState
      }

      return {
        past: [...currentState.past.slice(-(maxHistorySize - 1)), currentState.present],
        present: resolvedValue,
        future: []
      }
    })
  }, [maxHistorySize])

  const undo = useCallback(() => {
    setHistoryState(currentState => {
      if (currentState.past.length === 0) return currentState

      const previous = currentState.past[currentState.past.length - 1]
      const newPast = currentState.past.slice(0, currentState.past.length - 1)

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future]
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistoryState(currentState => {
      if (currentState.future.length === 0) return currentState

      const next = currentState.future[0]
      const newFuture = currentState.future.slice(1)

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture
      }
    })
  }, [])

  return [
    historyState.present,
    setState,
    undo,
    redo,
    historyState.past.length > 0,
    historyState.future.length > 0
  ]
}

// Optimized reducer with action batching
export function useOptimizedReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  options: {
    batchActions?: boolean
    batchDelay?: number
    compareStates?: (prev: S, next: S) => boolean
  } = {}
): [S, (action: A) => void, () => void] {
  const { batchActions = false, batchDelay = 16, compareStates: _compareStates } = options

  const [state, dispatch] = useReducer(reducer, initialState)
  const actionQueue = useRef<A[]>([])
  const batchTimeout = useRef<NodeJS.Timeout | null>(null)

  const flushActions = useCallback(() => {
    if (actionQueue.current.length === 0) return

    const actions = [...actionQueue.current]
    actionQueue.current = []

    actions.forEach(action => {
      dispatch(action)
    })
  }, [])

  const optimizedDispatch = useCallback((action: A) => {
    if (!batchActions) {
      dispatch(action)
      return
    }

    actionQueue.current.push(action)

    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current)
    }

    batchTimeout.current = setTimeout(() => {
      flushActions()
    }, batchDelay)
  }, [batchActions, batchDelay, flushActions])

  useEffect(() => {
    return () => {
      if (batchTimeout.current) {
        clearTimeout(batchTimeout.current)
      }
    }
  }, [])

  return [state, optimizedDispatch, flushActions]
}

// State with computed values and memoization
export function useComputedState<T, K extends keyof T>(
  initialState: T,
  computeFunctions: {
    [Key in K]: (state: T) => T[Key]
  }
): [T, (updates: Partial<T>) => void, Pick<T, K>] {
  const [state, setState] = useState(initialState)

  const computedValues = useMemo(() => {
    const computed = {} as Pick<T, K>

    for (const key in computeFunctions) {
      if (key in computeFunctions) {
        computed[key as K] = computeFunctions[key as K](state)
      }
    }

    return computed
  }, [state, computeFunctions])

  const updateState = useCallback((updates: Partial<T>) => {
    setState(prevState => ({ ...prevState, ...updates }))
  }, [])

  return [state, updateState, computedValues]
}

// Optimized form state management
export function useOptimizedForm<T extends Record<string, unknown>>(
  initialValues: T,
  validation?: (values: T) => Partial<Record<keyof T, string>>,
  options: {
    debounceMs?: number
    validateOnChange?: boolean
  } = {}
) {
  const { debounceMs = 300, validateOnChange = false } = options

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debounced validation
  const debouncedValidation = useMemo(() => {
    if (!validation || !validateOnChange) return null

    let timeoutId: NodeJS.Timeout
    return (currentValues: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const validationErrors = validation(currentValues)
        setErrors(validationErrors)
      }, debounceMs)
    }
  }, [validation, validateOnChange, debounceMs])

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))

    if (debouncedValidation) {
      debouncedValidation({ ...values, [field]: value })
    }
  }, [values, debouncedValidation])

  const setValuesBatch = useCallback((updates: Partial<T>) => {
    const newValues = { ...values, ...updates }
    setValues(newValues)

    if (debouncedValidation) {
      debouncedValidation(newValues)
    }
  }, [values, debouncedValidation])

  const validateForm = useCallback(() => {
    if (!validation) return true

    const validationErrors = validation(values)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [validation, values])

  const submitForm = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true)

    try {
      const isValid = validateForm()
      if (!isValid) {
        setIsSubmitting(false)
        return false
      }

      await onSubmit(values)
      return true
    } catch (error) {
      console.error('Form submission error:', error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setValues: setValuesBatch,
    validateForm,
    submitForm,
    resetForm,
    isValid: Object.keys(errors).length === 0
  }
}

// Smart state with persistent storage
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  storage: Storage = localStorage,
  options: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
    syncAcrossTabs?: boolean
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { serialize = JSON.stringify, deserialize = JSON.parse, syncAcrossTabs = false } = options

  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.warn(`Error reading ${key} from storage:`, error)
      return initialValue
    }
  })

  // Sync state to storage
  useEffect(() => {
    try {
      storage.setItem(key, serialize(state))
    } catch (error) {
      console.warn(`Error writing ${key} to storage:`, error)
    }
  }, [key, state, serialize])

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    if (!syncAcrossTabs) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue)
          setState(newValue)
        } catch (error) {
          console.warn(`Error syncing ${key} across tabs:`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserialize, syncAcrossTabs])

  return [state, setState]
}

export default {
  useCompareState,
  useBatchedUpdates,
  useDerivedState,
  useUndoableState,
  useOptimizedReducer,
  useComputedState,
  useOptimizedForm,
  usePersistentState
}