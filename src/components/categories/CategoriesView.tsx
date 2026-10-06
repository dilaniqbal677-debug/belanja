import React, { useState } from 'react';
import {
  Smartphone,
  Shirt,
  Sparkles,
  Coffee,
  Home,
  Headphones,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { ProductCard } from '../product/ProductCard';

export const CategoriesView: React.FC = () => {
  const { products, setSelectedCategory, selectedCategory } = useEcommerce();
  const [activeCat, setActiveCat] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Semua Kategori', icon: LayoutGrid },
    { id: 'Gadget & Elektronik', name: 'Gadget & Elektronik', icon: Smartphone },
    { id: 'Fashion Pria', name: 'Fashion & Sepatu', icon: Shirt },
    { id: 'Kecantikan & Skincare', name: 'Kecantikan & Perawatan', icon: Sparkles },
    { id: 'Makanan & Minuman', name: 'Makanan & Kuliner', icon: Coffee },
    { id: 'Audio & Musik', name: 'Audio & Musik', icon: Headphones },
    { id: 'Peralatan Rumah', name: 'Peralatan Rumah', icon: Home },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCat === 'all') return true;
    if (activeCat === 'Fashion Pria') {
      return p.category.includes('Fashion') || p.category.includes('Sepatu');
    }
    return p.category === activeCat;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-xs px-4 py-3">
        <h1 className="font-extrabold text-base text-slate-800">Katalog Kategori BeliKuy</h1>
        <p className="text-xs text-slate-400">Jelajahi jutaan produk resmi bergaransi</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Category Sidebar */}
        <div className="w-20 bg-white border-r border-slate-100 overflow-y-auto no-scrollbar shrink-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`w-full p-2 py-3 flex flex-col items-center text-center transition-all border-l-3 ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${
                    isActive ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] leading-tight line-clamp-2">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-2.5 overflow-y-auto no-scrollbar space-y-2.5">
          <div className="flex items-center justify-between pb-0.5">
            <span className="text-[11px] font-extrabold text-slate-700">
              {categories.find((c) => c.id === activeCat)?.name} ({filteredProducts.length})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
