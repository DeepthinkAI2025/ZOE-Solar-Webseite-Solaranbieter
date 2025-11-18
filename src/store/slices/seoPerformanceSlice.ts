import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SEOmetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface KeywordRanking {
  keyword: string;
  position: number;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  url: string;
}

export interface Backlink {
  domain: string;
  url: string;
  anchorText: string;
  domainAuthority: number;
  relevanceScore: number;
  date: string;
}

export interface SEOPerformanceState {
  metrics: SEOmetrics;
  keywordRankings: KeywordRanking[];
  backlinks: Backlink[];
  coreWebVitals: {
    pass: boolean;
    url: string;
    timestamp: Date;
  }[];
  pagespeedInsights: {
    score: number;
    url: string;
    timestamp: Date;
  }[];
  localSEO: {
    gmbProfile: {
      views: number;
      clicks: number;
      calls: number;
      directions: number;
    };
    citations: number;
    reviews: {
      count: number;
      averageRating: number;
    };
  };
  aiOptimizations: {
    optimizedPages: number;
    contentSuggestions: number;
    keywordSuggestions: number;
    lastOptimization: Date | null;
  };
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: SEOPerformanceState = {
  metrics: {
    pageLoadTime: 0,
    timeToInteractive: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
  },
  keywordRankings: [],
  backlinks: [],
  coreWebVitals: [],
  pagespeedInsights: [],
  localSEO: {
    gmbProfile: {
      views: 0,
      clicks: 0,
      calls: 0,
      directions: 0,
    },
    citations: 0,
    reviews: {
      count: 0,
      averageRating: 0,
    },
  },
  aiOptimizations: {
    optimizedPages: 0,
    contentSuggestions: 0,
    keywordSuggestions: 0,
    lastOptimization: null,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

const seoPerformanceSlice = createSlice({
  name: 'seoPerformance',
  initialState,
  reducers: {
    // Metrics
    updateMetrics: (state, action: PayloadAction<Partial<SEOmetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
      state.lastUpdated = new Date();
    },

    // Keyword rankings
    setKeywordRankings: (state, action: PayloadAction<KeywordRanking[]>) => {
      state.keywordRankings = action.payload;
      state.lastUpdated = new Date();
    },
    addKeywordRanking: (state, action: PayloadAction<KeywordRanking>) => {
      const existingIndex = state.keywordRankings.findIndex(
        (k) => k.keyword === action.payload.keyword
      );
      if (existingIndex >= 0) {
        state.keywordRankings[existingIndex] = action.payload;
      } else {
        state.keywordRankings.push(action.payload);
      }
      state.lastUpdated = new Date();
    },

    // Backlinks
    setBacklinks: (state, action: PayloadAction<Backlink[]>) => {
      state.backlinks = action.payload;
      state.lastUpdated = new Date();
    },
    addBacklink: (state, action: PayloadAction<Backlink>) => {
      state.backlinks.unshift(action.payload); // Add to beginning
      state.lastUpdated = new Date();
    },

    // Core Web Vitals
    addCoreWebVitalsResult: (state, action: PayloadAction<SEOPerformanceState['coreWebVitals'][0]>) => {
      state.coreWebVitals.push(action.payload);
      state.lastUpdated = new Date();
    },

    // PageSpeed Insights
    addPageSpeedInsightsResult: (state, action: PayloadAction<SEOPerformanceState['pagespeedInsights'][0]>) => {
      state.pagespeedInsights.push(action.payload);
      state.lastUpdated = new Date();
    },

    // Local SEO
    updateLocalSEO: (state, action: PayloadAction<Partial<SEOPerformanceState['localSEO']>>) => {
      state.localSEO = { ...state.localSEO, ...action.payload };
      state.lastUpdated = new Date();
    },
    updateGMBProfile: (state, action: PayloadAction<Partial<SEOPerformanceState['localSEO']['gmbProfile']>>) => {
      state.localSEO.gmbProfile = { ...state.localSEO.gmbProfile, ...action.payload };
      state.lastUpdated = new Date();
    },

    // AI Optimizations
    updateAIOptimizations: (state, action: PayloadAction<Partial<SEOPerformanceState['aiOptimizations']>>) => {
      state.aiOptimizations = { ...state.aiOptimizations, ...action.payload };
      state.lastUpdated = new Date();
    },
    incrementOptimizedPages: (state) => {
      state.aiOptimizations.optimizedPages += 1;
      state.aiOptimizations.lastOptimization = new Date();
      state.lastUpdated = new Date();
    },
    incrementContentSuggestions: (state, action: PayloadAction<number>) => {
      state.aiOptimizations.contentSuggestions += action.payload;
      state.lastUpdated = new Date();
    },
    incrementKeywordSuggestions: (state, action: PayloadAction<number>) => {
      state.aiOptimizations.keywordSuggestions += action.payload;
      state.lastUpdated = new Date();
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear data
    clearSEOData: (state) => {
      Object.assign(state, initialState);
    },
    clearMetrics: (state) => {
      state.metrics = initialState.metrics;
    },
  },
});

export const {
  updateMetrics,
  setKeywordRankings,
  addKeywordRanking,
  setBacklinks,
  addBacklink,
  addCoreWebVitalsResult,
  addPageSpeedInsightsResult,
  updateLocalSEO,
  updateGMBProfile,
  updateAIOptimizations,
  incrementOptimizedPages,
  incrementContentSuggestions,
  incrementKeywordSuggestions,
  setLoading,
  setError,
  clearSEOData,
  clearMetrics,
} = seoPerformanceSlice.actions;

export default seoPerformanceSlice.reducer;