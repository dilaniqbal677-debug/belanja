import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Ticket,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatRupiah } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    showCartDrawer,
    setShowCartDrawer,
    cart,
    updateCartQty,
    toggleCartItem,
    toggleSelectAllCart,
    removeFromCart,
    appliedVoucher,
    setShowCheckoutModal,
    showToast,
  } = useEcommerce();

  if (!showCartDrawer) return null;

  const allChecked = cart.length > 0 && cart.every((i) => i.checked);
  const checkedItems = cart.filter((i) => i.checked);
  const totalCheckedCount = checkedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = checkedItems.reduce(
    (acc, curr) => acc + curr.selectedPrice * curr.quantity,
    0
  );

  // Group cart items by store
  const storeGroups = cart.reduce((acc, item) => {
    const storeId = item.product.store.id;
    if (!acc[storeId]) {
      acc[storeId] = {
        store: item.product.store,
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { store: typeof cart[0]['product']['store']; items: typeof cart }>);

  const handleProceedToCheckout = () => {
    if (checkedItems.length === 0) {
      showToast('Pilih setidaknya 1 produk untuk checkout');
      return;
    }
    setShowCartDrawer(false);
    setShowCheckoutModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-slate-50 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[92vh] sm:h-[840px] max-h-[96vh] relative">

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCartDrawer(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-extrabold text-sm text-slate-800">
              Keranjang Belanja ({cart.length})
            </h2>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleSelectAllCart(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Pilih Semua</span>
              </label>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3 pb-28">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">Wah, keranjang belanjamu kosong</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Yuk jelajahi jutaan produk diskon menarik dan gratis ongkir di BeliKuy!
              </p>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            Object.values(storeGroups).map((group) => {
              const allStoreChecked = group.items.every((i) => i.checked);

              return (
                <div
                  key={group.store.id}
                  className="bg-white rounded-2xl border border-slate-100 p-3 shadow-xs space-y-3"
                >
                  {/* Store Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allStoreChecked}
                        onChange={() => {
                          const targetState = !allStoreChecked;
                          group.items.forEach((item) => {
                            if (item.checked !== targetState) {
                              toggleCartItem(item.id);
                            }
                          });
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-800">
                          {group.store.name}
                        </span>
                        {group.store.isOfficial && (
                          <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[8px] font-extrabold rounded flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            MALL
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{group.store.location}</span>
                  </div>

                  {/* Items for this store */}
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2.5 pt-1 border-t border-slate-50 first:border-0 first:pt-0"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleCartItem(item.id)}
                          className="mt-4 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                        />

                        {/* Product Thumbnail */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                        />

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>

                          {item.selectedVariantText && (
                            <span className="inline-block mt-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.selectedVariantText}
                            </span>
                          )}

                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900">
                              {formatRupiah(item.selectedPrice)}
                            </span>
                          </div>

                          {/* Stepper & Delete */}
                          <div className="mt-2 flex items-center justify-between">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                              <button
                                onClick={() => updateCartQty(item.id, -1)}
                                className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs text-xs font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-slate-800 w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQty(item.id, 1)}
                                className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs text-xs font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Checkout Bar */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] p-3">
            {/* Voucher preview strip */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold truncate">
                <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {appliedVoucher ? appliedVoucher.title : 'Gunakan Voucher & Diskon'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                {appliedVoucher ? 'Kupon Aktif' : 'Pilih Voucher'}
              </span>
            </div>

            {/* Total and Checkout button */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Pembayaran</span>
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={checkedItems.length === 0}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Checkout ({totalCheckedCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
