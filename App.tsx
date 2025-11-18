import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PopupManager } from './components/popup-enhanced';

// Modular Components
import { AppInitialization } from './components/initialization/AppInitialization';
import { AppLayout } from './components/layout/AppLayout';
import { AppRouter } from './components/router/AppRouter';

// Custom Hooks
import { useThemeState } from './components/providers/ThemeProvider';
import { useAIState } from './components/providers/AIStateProvider';
import { useSEOState } from './components/providers/SEOProvider';

// Configuration and Constants
import { ROUTES } from './constants/AppConstants';
import appConfig from './config/AppConfig';

// Data Types (simplified)
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface Article {
  slug: string;
  title: string;
  content: string | ContentBlock[];
  id?: string;
}

interface Guide {
  slug: string;
  title: string;
  content: string | ContentBlock[];
  id?: string;
  description?: string;
  type?: string;
  icon?: string;
  imageUrl?: string;
  date?: string;
}

interface ContentBlock {
  type: string;
  text?: string;
  items?: string[];
  imageUrl?: string;
  caption?: string;
  attribution?: string;
  icon?: string;
  title?: string;
}

interface UseCase {
  id: string;
  slug: string;
  title: string;
  description: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}
// Data imports (simplified - only essential data)
import { articles } from './data/articles';
import { guides } from './data/guidesData';


// Page enum for navigation
type Page = 'home' | 'photovoltaik' | 'e-mobilitaet' | 'elektro' | 'kontakt' | string;

// ===== MAIN APP COMPONENT =====
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use custom hooks for state management
  const { state: themeState } = useThemeState();
  const { state: aiState } = useAIState();
  const { state: seoState } = useSEOState();

  // Core application state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [openCommandHub, setOpenCommandHub] = useState<(() => void)>(() => () => {});

  // Event handlers for navigation and user interactions
  const handleSetPage = useCallback((page: Page) => {
    setCurrentPage(page);
    // Use centralized routing (would need route mapping utility)
    navigate(`/${page}`);
  }, [navigate]);

  const handleSelectAnwendungsfall = useCallback((slug: string) => {
    navigate(`/anwendungsfaelle/${slug}`);
  }, [navigate]);

  const handleSelectHersteller = useCallback((slug: string) => {
    navigate(`/hersteller/${slug}`);
  }, [navigate]);

  const handleLogin = useCallback((userData: UserData) => {
    setIsLoggedIn(true);
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleToggleCompare = useCallback((product: Product) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const handleSelectWissen = useCallback((wissenKey: string) => {
    handleSetPage(wissenKey as Page);
  }, [handleSetPage]);

  // Handle article and guide selection events
  useEffect(() => {
    const onSelectArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const slug = String(detail);
      const article = articles.find(a => a.slug === slug) || null;
      setSelectedArticle(article);
      navigate(`/artikel/${slug}`);
    };

    const onSelectGuide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const slug = String(detail);
      const guide = guides.find(g => g.slug === slug) || null;
      setSelectedGuide(guide);
      navigate(`/leitfaden/${slug}`);
    };

    document.addEventListener('select-article', onSelectArticle as EventListener);
    document.addEventListener('select-guide', onSelectGuide as EventListener);

    return () => {
      document.removeEventListener('select-article', onSelectArticle as EventListener);
      document.removeEventListener('select-guide', onSelectGuide as EventListener);
    };
  }, [navigate]);

  return (
    <AppInitialization
      onInitializationComplete={() => {
        console.log('🚀 App initialization completed');
      }}
      onInitializationError={(error) => {
        console.error('❌ App initialization failed:', error);
      }}
      showProgressUI={!appConfig.isProduction}
    >
      <PopupManager>
        <AppLayout
          currentPage={currentPage}
          setPage={handleSetPage}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onSelectHersteller={handleSelectHersteller}
          onSelectWissen={handleSelectWissen}
          onBack={handleBack}
          openCommandHub={openCommandHub}
        >
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            }
          >
            <AppRouter
              currentPage={currentPage}
              setPage={handleSetPage}
              isLoggedIn={isLoggedIn}
              user={user}
              selectedArticle={selectedArticle}
              setSelectedArticle={setSelectedArticle}
              selectedGuide={selectedGuide}
              setSelectedGuide={setSelectedGuide}
              selectedUseCase={selectedUseCase}
              setSelectedUseCase={setSelectedUseCase}
              comparisonList={comparisonList}
              onToggleCompare={handleToggleCompare}
              onSelectAnwendungsfall={handleSelectAnwendungsfall}
              onSelectHersteller={handleSelectHersteller}
              onSelectWissen={handleSelectWissen}
              onLogout={handleLogout}
              onLogin={handleLogin}
              onBack={handleBack}
              openCommandHub={openCommandHub}
              theme={themeState.currentMode}
              onToggleTheme={() => {
                // Theme is handled by ThemeProvider
              }}
              userPreferences={themeState.preferences}
              voiceInterfaceActive={aiState.voiceInterfaceActive}
              arMode={aiState.arMode}
              gestureControl={aiState.gestureControl}
            />
          </Suspense>
        </AppLayout>
      </PopupManager>
    </AppInitialization>
  );
};

export default App;
