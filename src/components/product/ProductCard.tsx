import React from 'react';
import { Star, MapPin, Plus, Heart, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatCompact, formatRupiah } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, wishlist, toggleWishlist } = useEcommerce();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      role="button"
      tabIndex={0}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {product.isOfficial ? (
            <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-extrabold rounded-md flex items-center gap-0.5 shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5" />
              MALL
            </span>
          ) : product.isStarSeller ? (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-extrabold rounded-md shadow-xs">
              STAR+
            </span>
          ) : null}

          {product.discountPercent > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
          title="Simpan ke Favorit"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors mb-1.5">
            {product.name}
          </h4>

          {/* Price */}
          <div className="mb-1">
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
              {formatRupiah(product.price)}
            </p>
            {product.discountPercent > 0 && (
              <p className="text-[10px] text-slate-400 line-through">
                {formatRupiah(product.originalPrice)}
              </p>
            )}
          </div>

          {/* Badges: Gratis Ongkir & Cashback */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.isGratisOngkirXtra && (
              <span className="text-[9px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-1.5 py-0.2 rounded">
                Gratis Ongkir
              </span>
            )}
            {product.cashbackPercent && (
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                CB {product.cashbackPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Footer: Rating, Sold Count, Location, Quick Add */}
        <div className="pt-1.5 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <div className="flex items-center text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="truncate">Terjual {formatCompact(product.soldCount)}</span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-6 h-6 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-all shrink-0 ml-1 shadow-2xs active:scale-95"
            title="Tambah ke Keranjang"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* City Location */}
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 truncate">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{product.city}</span>
        </div>
      </div>
    </div>
  );
};
