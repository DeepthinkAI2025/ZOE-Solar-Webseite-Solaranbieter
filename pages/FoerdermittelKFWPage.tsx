import React from 'react';
import FoerdermittelOverviewPage from './FoerdermittelOverviewPage';
import { Page } from '../types';

interface RoutedPageProps {
  setPage: (page: Page, options?: { scrollToTop?: boolean; anchor?: string }) => void;
  currentPage: Page;
  bannerHeight: number;
  headerHeight: number;
}

const FoerdermittelKFWPage: React.FC<RoutedPageProps> = () => {
  return <FoerdermittelOverviewPage />;
};

export default FoerdermittelKFWPage;
