import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ChevronDown,
  ShoppingCart,
  MessageSquareText,
  Heart,
  Camera,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';

export const Header: React.FC = () => {
  const {
    user,
    cart,
    wishlist,
    setShowSearchModal,
    setShowCartDrawer,
    setActiveTab,
  } = useEcommerce();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchPlaceholders = [
    'Cari iPhone 16 Pro...',
    'Cari Kaos Erigo Oversize...',
    'Cari Serum Somethinc...',
    'Cari Sepatu Ventela...',
    'Cari Kopi Kenangan...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const primaryAddress = user.addresses.find((a) => a.isPrimary) || user.addresses[0];

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all">
      {/* Location / Deliver To Bar (Compact Mobile) */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-50 border-b border-slate-100 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-1 text-slate-700 hover:text-emerald-600 transition-colors truncate max-w-[240px]"
        >
          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="text-[10px] text-slate-400">Kirim ke:</span>
          <span className="font-semibold text-slate-800 truncate text-[10px]">
            {primaryAddress.label} · {primaryAddress.city.split(',')[0]}
          </span>
          <ChevronDown className="w-2.5 h-2.5 text-slate-400 shrink-0" />
        </button>

        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Gratis Ongkir</span>
        </div>
      </div>

      {/* Main Search & Navigation Bar (Calibrated for Mobile Viewport) */}
      <div className="px-3 py-2 flex items-center gap-1.5">
        {/* Search Input Box */}
        <div
          onClick={() => setShowSearchModal(true)}
          role="button"
          tabIndex={0}
          className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100/90 hover:bg-slate-100 rounded-xl border border-slate-200/80 cursor-pointer transition-all group shadow-inner min-w-0"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          <div className="flex-1 overflow-hidden relative h-4.5 flex items-center">
            <span
              key={placeholderIndex}
              className="text-[11px] text-slate-400 group-hover:text-slate-600 truncate animate-fadeIn"
            >
              {searchPlaceholders[placeholderIndex]}
            </span>
          </div>
          <Camera className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0 ml-0.5" />
        </div>

        {/* Action Buttons: Wishlist, Chat, Cart */}
        <div className="flex items-center gap-0.5 text-slate-700 shrink-0">
          {/* Wishlist */}
          <button
            onClick={() => setActiveTab('profile')}
            className="p-1.5 relative hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-rose-500"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            )}
          </button>

          {/* Chat Messenger */}
          <button
            onClick={() => setActiveTab('orders')}
            className="p-1.5 relative hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-emerald-600"
            title="Pesan"
          >
            <MessageSquareText className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 min-w-3 h-3 px-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center ring-1 ring-white">
              2
            </span>
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="p-1.5 relative hover:bg-slate-100 rounded-lg transition-colors text-slate-700 hover:text-emerald-600"
            title="Keranjang"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-1 ring-white shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
