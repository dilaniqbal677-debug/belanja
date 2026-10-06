import React, { useState } from 'react';
import { WalletBar } from './WalletBar';
import { BannerCarousel } from './BannerCarousel';
import { CategoryIcons } from './CategoryIcons';
import { FlashSaleSection } from './FlashSaleSection';
import { LiveStreamHighlights } from './LiveStreamHighlights';
import { ProductCard } from '../product/ProductCard';
import { useEcommerce } from '../../context/EcommerceContext';
import { Sparkles, ShieldCheck, Flame, Truck } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useEcommerce();
  const [activeFeedTab, setActiveFeedTab] = useState<'forYou' | 'official' | 'diskon' | 'ongkir'>('forYou');

  const filteredProducts = products.filter((p) => {
    if (activeFeedTab === 'official') return p.isOfficial;
    if (activeFeedTab === 'diskon') return p.discountPercent >= 20;
    if (activeFeedTab === 'ongkir') return p.isGratisOngkirXtra;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 pb-20">
      {/* 1. Wallet & Coin Bar */}
      <WalletBar />

      {/* 2. Hero Promo Banner Carousel */}
      <BannerCarousel />

      {/* 3. Quick 8 Services Grid */}
      <CategoryIcons />

      {/* 4. Signature Flash Sale Section */}
      <FlashSaleSection />

      {/* 5. Live Shopping Highlight Carousel */}
      <LiveStreamHighlights />

      {/* 6. Feed Segment Control ("Untuk Anda" / For You Feed) */}
      <div className="mx-3 mt-1.5 mb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveFeedTab('forYou')}
          className={`py-1.5 px-3 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            activeFeedTab === 'forYou'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Untuk Anda</span>
        </button>

        <button
          onClick={() => setActiveFeedTab('official')}
          className={`py-1.5 px-3 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            activeFeedTab === 'official'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Official Mall</span>
        </button>

        <button
          onClick={() => setActiveFeedTab('diskon')}
          className={`py-1.5 px-3 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            activeFeedTab === 'diskon'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Diskon 50%+</span>
        </button>

        <button
          onClick={() => setActiveFeedTab('ongkir')}
          className={`py-1.5 px-3 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
            activeFeedTab === 'ongkir'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-3 h-3" />
          <span>Bebas Ongkir</span>
        </button>
      </div>

      {/* 7. Product Grid */}
      <div className="px-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};
