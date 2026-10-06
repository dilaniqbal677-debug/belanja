import React from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { LiveFeedTab } from './components/live/LiveFeedTab';
import { CategoriesView } from './components/categories/CategoriesView';
import { OrdersView } from './components/orders/OrdersView';
import { ProfileView } from './components/profile/ProfileView';

// Modals
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { SearchModal } from './components/search/SearchModal';
import { LiveStreamView } from './components/live/LiveStreamView';
import { DailyCheckinModal } from './components/home/DailyCheckinModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    showDailyCheckin,
    setShowDailyCheckin,
    toastMessage,
  } = useEcommerce();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'live':
        return <LiveFeedTab />;
      case 'categories':
        return <CategoriesView />;
      case 'orders':
        return <OrdersView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <DeviceFrame>
      {/* Sticky Header with Search & Actions (hidden on live full tab for maximum immersion) */}
      {activeTab !== 'live' && <Header />}

      {/* Main Tab Screen Content */}
      <main className="flex-1 flex flex-col">{renderActiveTabContent()}</main>

      {/* Sticky Mobile Bottom Navigation */}
      <BottomNav />

      {/* Overlays & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />
      <LiveStreamView />
      <DailyCheckinModal
        isOpen={showDailyCheckin}
        onClose={() => setShowDailyCheckin(false)}
      />

      {/* Reactive Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-12 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-60 pointer-events-none animate-bounce">
          <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <EcommerceProvider>
      <AppContent />
    </EcommerceProvider>
  );
}
