import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, Sparkles } from 'lucide-react';

interface Banner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  bgColor: string;
  image: string;
  highlightText: string;
}

export const BannerCarousel: React.FC = () => {
  const banners: Banner[] = [
    {
      id: 'b-1',
      badge: 'WAKTU INDONESIA BELANJA',
      title: 'Diskon Spesial Hingga 90%',
      subtitle: 'Gratis Ongkir Xtra se-Indonesia tanpa minimum belanja!',
      bgColor: 'from-emerald-700 via-teal-800 to-slate-900',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
      highlightText: 'Cashback Rp500.000',
    },
    {
      id: 'b-2',
      badge: 'SUPER GADGET FESTIVAL',
      title: 'Upgrade Flagship 2026',
      subtitle: 'iPhone 16 Pro & Galaxy S Series Cicilan 0% hingga 24 bulan',
      bgColor: 'from-blue-700 via-indigo-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      highlightText: 'Garansi Resmi 100%',
    },
    {
      id: 'b-3',
      badge: 'BELIKUY MALL EXCLUSIVE',
      title: '100% Original Brand Mall',
      subtitle: 'Jaminan 7 Hari Pengembalian & Garansi Uang Kembali 2x Lipat',
      bgColor: 'from-rose-700 via-purple-900 to-slate-900',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
      highlightText: 'Voucher Toko s/d Rp150K',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="mx-3 my-1.5">
      <div className="relative h-36 sm:h-38 rounded-2xl overflow-hidden shadow-2xs group">
        {/* Banner Slides */}

        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-r ${banner.bgColor} ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Banner Background Image with overlay */}
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover mix-blend-overlay opacity-30 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Banner Content */}
            <div className="relative z-20 h-full p-4 flex flex-col justify-between max-w-[70%] text-white">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-extrabold tracking-wider text-amber-300 border border-white/20 mb-1.5 uppercase">
                  <Zap className="w-2.5 h-2.5 fill-amber-300" />
                  {banner.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black leading-tight tracking-tight text-white drop-shadow-sm">
                  {banner.title}
                </h3>
                <p className="text-[11px] text-slate-200 mt-1 line-clamp-2 leading-relaxed font-normal">
                  {banner.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md shadow-xs">
                  {banner.highlightText}
                </span>
                <span className="text-[10px] text-slate-300 font-medium flex items-center">
                  Beli Sekarang <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Dots */}
        <div className="absolute bottom-2.5 right-3.5 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-full">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
