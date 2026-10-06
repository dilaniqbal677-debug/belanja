import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  TrendingUp,
  Clock,
  Filter,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { ProductCard } from '../product/ProductCard';
import { CATEGORIES } from '../../data/mockData';

export const SearchModal: React.FC = () => {
  const {
    showSearchModal,
    setShowSearchModal,
    products,
  } = useEcommerce();

  const [query, setQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'relevant' | 'sold' | 'lowest' | 'highest' | 'rating'>('relevant');
  const [onlyOfficial, setOnlyOfficial] = useState(false);
  const [onlyGratisOngkir, setOnlyGratisOngkir] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const trendingTags = [
    'iPhone 16 Pro',
    'Erigo Kaos Oversize',
    'Sepatu Ventela Low',
    'Serum Somethinc',
    'Sony WH-1000XM5',
    'Air Fryer Low Watt',
    'Biji Kopi Arabika',
  ];

  const recentSearches = ['iPhone 16 resmi', 'Kaos distro katun', 'Sneakers lokal'];

  const filteredResults = useMemo(() => {
    return products.filter((p) => {
      // Search text match
      const q = query.toLowerCase().trim();
      const matchText =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.store.name.toLowerCase().includes(q);

      // Filters
      if (!matchText) return false;
      if (onlyOfficial && !p.isOfficial) return false;
      if (onlyGratisOngkir && !p.isGratisOngkirXtra) return false;
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'sold') return b.soldCount - a.soldCount;
      if (selectedSort === 'lowest') return a.price - b.price;
      if (selectedSort === 'highest') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, query, onlyOfficial, onlyGratisOngkir, activeCategory, selectedSort]);

  if (!showSearchModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] h-full sm:h-[880px] bg-slate-50 flex flex-col sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Search Header */}
        <div className="bg-white px-3 py-2.5 border-b border-slate-100 shadow-xs flex items-center gap-2">

        <button
          onClick={() => setShowSearchModal(false)}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari jutaan produk berkualitas..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowSearchModal(false)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 px-1"
        >
          Batal
        </button>
      </div>

      {/* Filter / Sort Segment Bar */}
      <div className="bg-white px-3 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {/* Sort Select */}
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-hidden"
        >
          <option value="relevant">Paling Sesuai</option>
          <option value="sold">Terlaris</option>
          <option value="lowest">Harga Terendah</option>
          <option value="highest">Harga Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>

        {/* Official Store Toggle */}
        <button
          onClick={() => setOnlyOfficial(!onlyOfficial)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
            onlyOfficial
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 text-slate-600 bg-white'
          }`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Official Store</span>
        </button>

        {/* Gratis Ongkir Toggle */}
        <button
          onClick={() => setOnlyGratisOngkir(!onlyGratisOngkir)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
            onlyGratisOngkir
              ? 'border-teal-600 bg-teal-50 text-teal-700'
              : 'border-slate-200 text-slate-600 bg-white'
          }`}
        >
          <span>Gratis Ongkir</span>
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pb-20 no-scrollbar">
        {/* Suggestions when query is empty */}
        {!query && (
          <div className="space-y-4">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Pencarian Terakhir</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Hot Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                <span>Pencarian Populer di BeliKuy</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    🔥 {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredResults.length}</strong> produk
            {query && ` untuk "${query}"`}
          </span>
        </div>

        {/* Product Grid */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <p className="font-bold text-sm text-slate-700">Produk tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau nonaktifkan beberapa filter pencarian.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

