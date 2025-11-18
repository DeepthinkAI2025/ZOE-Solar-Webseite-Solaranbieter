import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyDashboard = lazy(() => import('../pages/DashboardPage'));
export const LazyAgriPVPage = lazy(() => import('../pages/AgriPVPage'));
export const LazyAIChatFunnel = lazy(() => import('../../components/AIChatFunnel'));
export const LazyComparisonModal = lazy(() => import('../../components/ComparisonModal'));
export const LazyProductDetailModal = lazy(() => import('../../components/ProductDetailModal'));

// Lazy load heavy services
export const loadAIServices = () => import('../services/aiAPIIntegration');
export const loadMarketingServices = () => import('../services/marketingAssetsService');
export const loadAnalyticsService = () => import('../services/serenaMCPOptimizationService');

// Lazy load admin components
export const LazyAdminDashboard = lazy(() => import('../../components/admin/AdminDashboard'));
export const LazyABTestingDashboard = lazy(() => import('../../components/ab-testing/ABTestingDashboard'));

// Lazy load complex visualization components
export const LazyCommandHub = lazy(() => import('../../components/CommandHub'));
export const LazyUnifiedStrategyDashboard = lazy(() => import('../../pages/UnifiedStrategyDashboardPage'));

export default {
  LazyDashboard,
  LazyAgriPVPage,
  LazyAIChatFunnel,
  LazyComparisonModal,
  LazyProductDetailModal,
  LazyAdminDashboard,
  LazyABTestingDashboard,
  LazyCommandHub,
  LazyUnifiedStrategyDashboard,
};