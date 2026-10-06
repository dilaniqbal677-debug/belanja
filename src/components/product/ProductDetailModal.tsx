import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Heart,
  Share2,
  Truck,
  MessageSquare,
  ShoppingCart,
  ChevronRight,
  Check,
  ThumbsUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatCompact, formatRupiah } from '../../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    setShowCheckoutModal,
    showToast,
  } = useEcommerce();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detail' | 'reviews'>('detail');

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);

  // Initialize variant defaults if available
  const variantKeys = selectedProduct.variants || [];
  const currentVariantSummary = variantKeys
    .map((v) => {
      const chosen = selectedVariants[v.id] || v.options[0]?.label;
      return chosen;
    })
    .join(', ');

  // Calculate dynamic price based on variant
  let finalPrice = selectedProduct.price;
  if (selectedProduct.variants) {
    selectedProduct.variants.forEach((v) => {
      const chosenLabel = selectedVariants[v.id] || v.options[0]?.label;
      const opt = v.options.find((o) => o.label === chosenLabel);
      if (opt && opt.priceModifier) {
        finalPrice += opt.priceModifier;
      }
    });
  }

  const handleVariantSelect = (variantId: string, optionLabel: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: optionLabel,
    }));
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentVariantSummary, finalPrice);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, currentVariantSummary, finalPrice);
    setSelectedProduct(null);
    setShowCheckoutModal(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link produk disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[94vh] sm:h-[860px] max-h-[96vh] relative">

        {/* Sticky Top Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[220px]">
            {selectedProduct.name}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Main Gallery */}
          <div className="relative aspect-4/3 sm:aspect-square bg-slate-100">
            <img
              src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {/* Image counter indicator */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {activeImageIndex + 1}/{selectedProduct.images.length}
            </div>

            {selectedProduct.isFlashSale && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-orange-600 to-rose-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-md">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  FLASH SALE EKSKLUSIF
                </span>
                <span className="text-amber-200">Hemat {selectedProduct.discountPercent}%</span>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {selectedProduct.images.length > 1 && (
            <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar bg-slate-50 border-b border-slate-100">
              {selectedProduct.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    i === activeImageIndex
                      ? 'border-emerald-600 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Price & Title Block */}
          <div className="p-4 bg-white border-b border-slate-100">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatRupiah(finalPrice)}
              </span>
              {selectedProduct.discountPercent > 0 && (
                <>
                  <span className="text-xs text-slate-400 line-through">
                    {formatRupiah(selectedProduct.originalPrice)}
                  </span>
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-md">
                    -{selectedProduct.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              {selectedProduct.isOfficial && (
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  OFFICIAL STORE
                </span>
              )}
              {selectedProduct.cashbackPercent && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded">
                  Cashback {selectedProduct.cashbackPercent}% Koin
                </span>
              )}
            </div>

            <h1 className="text-sm sm:text-base font-bold text-slate-800 leading-snug mb-3">
              {selectedProduct.name}
            </h1>

            {/* Rating, Sold, Reviews stats */}
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating}</span>
                <span className="text-slate-400 font-normal">({formatCompact(selectedProduct.reviewCount)} ulasan)</span>
              </div>
              <span className="text-slate-300">·</span>
              <span>Terjual {formatCompact(selectedProduct.soldCount)}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedProduct.city}
              </span>
            </div>
          </div>

          {/* Variants Selector */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="p-4 bg-white border-b border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Pilih Varian Produk:</h3>
              {selectedProduct.variants.map((variant) => {
                const currentChosen = selectedVariants[variant.id] || variant.options[0]?.label;

                return (
                  <div key={variant.id} className="space-y-1.5">
                    <p className="text-[11px] font-medium text-slate-500">
                      {variant.name}: <span className="font-bold text-slate-800">{currentChosen}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = currentChosen === opt.label;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleVariantSelect(variant.id, opt.label)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20 shadow-xs'
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                            } ${!opt.inStock ? 'opacity-40 line-through' : ''}`}
                            disabled={!opt.inStock}
                          >
                            {opt.label}
                            {opt.priceModifier > 0 && (
                              <span className="text-[10px] ml-1 text-emerald-600">
                                (+{formatRupiah(opt.priceModifier)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Delivery & Shipping Estimator */}
          <div className="p-4 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800">Pengiriman & Ongkos Kirim</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Gratis Ongkir Xtra
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Ongkir Reguler (J&T / SiCepat)</span>
                <span className="font-bold text-emerald-700">Rp0 <span className="line-through text-slate-400 font-normal">Rp15.000</span></span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Estimasi tiba 1 - 2 Hari Kerja
                </span>
                <span>Instant 2 Jam Tersedia</span>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="p-4 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.store.avatar}
                  alt={selectedProduct.store.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    {selectedProduct.store.name}
                    {selectedProduct.store.isOfficial && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedProduct.store.location} · Aktif 5 mnt lalu
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span>★ {selectedProduct.store.rating} Rating Toko</span>
                    <span>·</span>
                    <span>{selectedProduct.store.responseRate} Chat Dibalas</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => showToast(`Mengunjungi ${selectedProduct.store.name}`)}
                className="px-3 py-1.5 border border-emerald-600 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Kunjungi Toko
              </button>
            </div>
          </div>

          {/* Product Description & Specs */}
          <div className="p-4 bg-white border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Spesifikasi & Deskripsi Produk</h3>
            
            {/* Specs Table */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 divide-y divide-slate-200/60 text-xs">
              {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                <div key={key} className="py-1.5 first:pt-0 last:pb-0 flex items-start justify-between">
                  <span className="text-slate-400 w-1/3">{key}</span>
                  <span className="text-slate-800 font-medium w-2/3 text-right">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-2">
              {selectedProduct.description}
            </p>
          </div>

          {/* Customer Reviews Section */}
          <div className="p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Ulasan Pembeli</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedProduct.rating} dari 5 bintang · {formatCompact(selectedProduct.reviewCount)} ulasan
                </p>
              </div>
              <button
                onClick={() => showToast('Melihat semua ulasan terverifikasi')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
              >
                Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              {selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                        Pembeli Terverifikasi
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">Varian: {rev.variant}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>Membantu ({rev.helpfulCount})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Buttons */}
        <div className="absolute bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex items-center gap-2">
          {/* Chat Toko */}
          <button
            onClick={() => showToast(`Menghubungkan chat langsung dengan ${selectedProduct.store.name}`)}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-emerald-600 flex flex-col items-center justify-center transition-colors shrink-0"
            title="Chat Penjual"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5">Chat</span>
          </button>

          {/* Tambah Keranjang */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>+ Keranjang</span>
          </button>

          {/* Beli Sekarang */}
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
