import { useReducer, useCallback, useMemo } from 'react';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  details?: Record<string, unknown>;
}

export interface DataState<T> {
  data: T | null;
  isFetching: boolean;
  lastUpdated?: Date;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface OptimizedStateActions<T> {
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: Error | null, details?: Record<string, unknown>) => void;
  setData: (data: T | null) => void;
  setFetching: (fetching: boolean) => void;
  updateData: (updater: (prev: T | null) => T | null) => void;
  reset: () => void;
}

// Generic reducer for common state patterns
function createOptimizedReducer<T, E extends Error = Error>(
  initialState: T & LoadingState & ErrorState
) {
  return (state: T & LoadingState & ErrorState, action: any): T & LoadingState & ErrorState => {
    switch (action.type) {
      case 'SET_LOADING':
        return {
          ...state,
          isLoading: action.payload.loading,
          message: action.payload.message,
        };
      case 'SET_ERROR':
        return {
          ...state,
          hasError: action.payload.error !== null,
          error: action.payload.error,
          details: action.payload.details,
          isLoading: false,
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };
}

// Hook for common state patterns
export function useOptimizedState<T = any>(
  initialState: T,
  options: {
    onError?: (error: Error) => void;
    onSuccess?: (data: T) => void;
  } = {}
): [T, OptimizedStateActions<T>] {
  const [state, dispatch] = useReducer(
    createOptimizedReducer({
      ...initialState,
      isLoading: false,
      hasError: false,
    } as T & LoadingState & ErrorState),
    initialState
  );

  const setLoading = useCallback(
    (loading: boolean, message?: string) => {
      dispatch({ type: 'SET_LOADING', payload: { loading, message } });
      if (loading && options.onError) {
        // Clear any previous errors when loading
        dispatch({ type: 'SET_ERROR', payload: { error: null } });
      }
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: Error | null, details?: Record<string, unknown>) => {
      dispatch({ type: 'SET_ERROR', payload: { error, details } });
      if (error && options.onError) {
        options.onError(error);
      }
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return [state, { setLoading, setError, reset } as OptimizedStateActions<T>];
}

// Hook for data fetching state
export function useDataState<T>(
  initialData: T | null = null,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
): [DataState<T>, {
  setData: (data: T | null) => void;
  setFetching: (fetching: boolean) => void;
  updateData: (updater: (prev: T | null) => T | null) => void;
  reset: () => void;
}] {
  const [state, setState] = useReducer((state: DataState<T>, action) => {
    switch (action.type) {
      case 'SET_DATA':
        return {
          ...state,
          data: action.payload,
          isFetching: false,
          lastUpdated: new Date(),
        };
      case 'SET_FETCHING':
        return {
          ...state,
          isFetching: action.payload,
        };
      case 'UPDATE_DATA':
        return {
          ...state,
          data: action.payload(state.data),
          lastUpdated: new Date(),
        };
      case 'RESET':
        return {
          data: initialData,
          isFetching: false,
          lastUpdated: undefined,
        };
      default:
        return state;
    }
  }, { data: initialData, isFetching: false, lastUpdated: undefined });

  const setData = useCallback(
    (data: T | null) => {
      setState({ type: 'SET_DATA', payload: data });
      if (data && options.onSuccess) {
        options.onSuccess(data);
      }
    },
    [setState]
  );

  const setFetching = useCallback(
    (fetching: boolean) => {
      setState({ type: 'SET_FETCHING', payload: fetching });
    },
    [setState]
  );

  const updateData = useCallback(
    (updater: (prev: T | null) => T | null) => {
      setState({ type: 'UPDATE_DATA', payload: updater });
    },
    [setState]
  );

  const reset = useCallback(() => {
    setState({ type: 'RESET' });
  }, [setState]);

  return [state, { setData, setFetching, updateData, reset }];
}

// Hook for pagination state
export function usePaginationState(
  initialTotal: number = 0,
  itemsPerPage: number = 10
): [PaginationState, {
  setCurrentPage: (page: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
}] {
  const [state, setState] = useReducer((state: PaginationState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_PAGE':
        return {
          ...state,
          currentPage: action.payload,
        };
      case 'SET_TOTAL_ITEMS':
        const totalPages = Math.ceil(action.payload / itemsPerPage);
        return {
          ...state,
          totalItems: action.payload,
          totalPages,
          currentPage: Math.min(state.currentPage, totalPages - 1),
        };
      case 'NEXT_PAGE':
        return {
          ...state,
          currentPage: Math.min(state.currentPage + 1, state.totalPages - 1),
        };
      case 'PREV_PAGE':
        return {
          ...state,
          currentPage: Math.max(state.currentPage - 1, 0),
        };
      case 'GO_TO_PAGE':
        return {
          ...state,
          currentPage: Math.min(Math.max(0, action.payload), state.totalPages - 1),
        };
      case 'RESET':
        return {
          currentPage: 0,
          totalPages: Math.ceil(initialTotal / itemsPerPage),
          itemsPerPage,
          totalItems: initialTotal,
        };
      default:
        return state;
    }
  }, {
    currentPage: 0,
    totalPages: Math.ceil(initialTotal / itemsPerPage),
    itemsPerPage,
    totalItems: initialTotal,
  });

  const setCurrentPage = useCallback((page: number) => {
    setState({ type: 'SET_CURRENT_PAGE', payload: page });
  }, [setState]);

  const setTotalItems = useCallback((total: number) => {
    setState({ type: 'SET_TOTAL_ITEMS', payload: total });
  }, [setState]);

  const nextPage = useCallback(() => {
    setState({ type: 'NEXT_PAGE' });
  }, [setState]);

  const prevPage = useCallback(() => {
    setState({ type: 'PREV_PAGE' });
  }, [setState]);

  const goToPage = useCallback((page: number) => {
    setState({ type: 'GO_TO_PAGE', payload: page });
  }, [setState]);

  const reset = useCallback(() => {
    setState({ type: 'RESET' });
  }, [setState]);

  return [state, { setCurrentPage, setTotalItems, nextPage, prevPage, goToPage, reset }];
}

// Combined hook for common data operations
export function useOptimizedDataState<T>(
  initialData: T | null = null,
  options?: {
    pagination?: {
      itemsPerPage?: number;
    };
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [dataState, dataActions] = useDataState<T>(initialData, options);
  const [paginationState, paginationActions] = usePaginationState(
    Array.isArray(initialData) ? initialData.length : 0,
    options?.pagination?.itemsPerPage
  );

  const combinedActions = useMemo(() => ({
    ...dataActions,
    ...paginationActions,
    // Combined actions
    setDataWithPagination: (data: T[]) => {
      dataActions.setData(data);
      paginationActions.setTotalItems(data.length);
    },
    resetAll: () => {
      dataActions.reset();
      paginationActions.reset();
    },
  }), [dataActions, paginationActions]);

  return [dataState, paginationState, combinedActions];
}