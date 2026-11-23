import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { CompareProvider, useCompare } from './context/CompareContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Compare } from './pages/Compare';
import { Recommendations } from './pages/Recommendations';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { InfoPage } from './pages/InfoPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function CompareFeedbackToast() {
  const { feedbackMessage, clearFeedback, compareIds } = useCompare();
  const { pathname } = useLocation();

  if (!feedbackMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-[#1E293B] text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-xs sm:text-sm"
    >
      <span className="flex-1">{feedbackMessage}</span>
      {pathname !== '/compare' && compareIds.length > 0 && (
        <Link
          to="/compare"
          onClick={clearFeedback}
          className="font-semibold text-[#93C5FD] hover:underline whitespace-nowrap shrink-0"
        >
          View ({compareIds.length})
        </Link>
      )}
      <button
        type="button"
        onClick={clearFeedback}
        aria-label="Dismiss notification"
        className="p-1 text-[#94A3B8] hover:text-white rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold text-[#1E293B] font-display">Page not found</h1>
      <p className="text-sm text-[#475569]">
        The page you requested could not be found on CampusCart.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
      >
        Return Home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <CompareProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/info/:section" element={<InfoPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <CompareFeedbackToast />
            </div>
          </CompareProvider>
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
