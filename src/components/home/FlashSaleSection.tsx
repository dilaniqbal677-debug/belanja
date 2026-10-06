import React, { useState, useEffect } from 'react';
import { Zap, Flame, ChevronRight } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatRupiah, padZero } from '../../utils/formatters';

export const FlashSaleSection: React.FC = () => {
  const { products, setSelectedProduct } = useEcommerce();

  // Live countdown timer state (2 hours, 14 mins, 35 secs)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 14 * 60 + 35);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const flashSaleItems = products.filter((p) => p.isFlashSale);

  return (
    <div id="flash-sale-section" className="mx-3 my-2 bg-gradient-to-b from-orange-50 via-white to-white p-2.5 rounded-2xl border border-orange-100/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 font-black text-xs tracking-tight text-orange-600">
            <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-bounce" />
            <span>FLASH SALE</span>
          </div>

          {/* Countdown Boxes */}
          <div className="flex items-center gap-0.5 text-[10px] font-mono font-bold">
            <span className="bg-slate-900 text-white px-1 py-0.2 rounded shadow-2xs">
              {padZero(hours)}
            </span>
            <span className="text-slate-800 font-bold">:</span>
            <span className="bg-slate-900 text-white px-1 py-0.2 rounded shadow-2xs">
              {padZero(minutes)}
            </span>
            <span className="text-slate-800 font-bold">:</span>
            <span className="bg-orange-600 text-white px-1 py-0.2 rounded shadow-2xs">
              {padZero(seconds)}
            </span>
          </div>
        </div>

        <button className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center">
          Semua <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {flashSaleItems.map((item) => {
          const totalStock = item.flashSaleTotalStock || 50;
          const leftStock = item.flashSaleStockLeft || 5;
          const soldPercent = Math.round(((totalStock - leftStock) / totalStock) * 100);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedProduct(item)}
              role="button"
              tabIndex={0}
              className="w-27 shrink-0 bg-white rounded-xl border border-slate-100 hover:border-orange-200 shadow-2xs p-1.5 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5"
            >

              {/* Product Image & Discount Tag */}
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-slate-50">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                  -{item.discountPercent}%
                </span>
              </div>

              {/* Price & Name */}
              <div>
                <p className="text-[11px] font-medium text-slate-700 line-clamp-1 mb-1">
                  {item.name}
                </p>
                <p className="text-xs font-black text-rose-600 tracking-tight">
                  {formatRupiah(item.price)}
                </p>
                <p className="text-[9px] text-slate-400 line-through">
                  {formatRupiah(item.originalPrice)}
                </p>
              </div>

              {/* Progress Bar (Shopee style flame meter) */}
              <div className="mt-2">
                <div className="relative w-full h-3.5 bg-orange-100 rounded-full overflow-hidden flex items-center">
                  <div
                    style={{ width: `${soldPercent}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full transition-all"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-extrabold text-white drop-shadow-xs">
                    {leftStock <= 5 ? '🔥 SEGERA HABIS' : `Terjual ${soldPercent}%`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
