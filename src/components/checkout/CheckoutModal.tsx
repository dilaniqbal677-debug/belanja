import React, { useState } from 'react';
import {
  X,
  MapPin,
  Truck,
  Ticket,
  Coins,
  ShieldCheck,
  ChevronRight,
  CheckCircle,
  CreditCard,
  QrCode,
  HandCoins,
  Sparkles,
  Lock,
  Wallet,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import {
  MOCK_SHIPPING_METHODS,
  MOCK_PAYMENT_METHODS,
} from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';

export const CheckoutModal: React.FC = () => {
  const {
    showCheckoutModal,
    setShowCheckoutModal,
    cart,
    user,
    appliedVoucher,
    applyVoucher,
    vouchers,
    useCoins,
    setUseCoins,
    placeOrder,
    setActiveTab,
  } = useEcommerce();

  const [selectedShippingId, setSelectedShippingId] = useState(MOCK_SHIPPING_METHODS[2].id); // Default: Reguler
  const [selectedPaymentId, setSelectedPaymentId] = useState(MOCK_PAYMENT_METHODS[0].id); // Default: GoPay
  const [insuranceActive, setInsuranceActive] = useState(true);
  const [showVoucherSheet, setShowVoucherSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showCheckoutModal) return null;

  const checkedItems = cart.filter((i) => i.checked);
  const primaryAddress = user.addresses.find((a) => a.isPrimary) || user.addresses[0];

  const subtotal = checkedItems.reduce(
    (acc, curr) => acc + curr.selectedPrice * curr.quantity,
    0
  );

  const selectedShipping =
    MOCK_SHIPPING_METHODS.find((s) => s.id === selectedShippingId) ||
    MOCK_SHIPPING_METHODS[2];

  const selectedPayment =
    MOCK_PAYMENT_METHODS.find((p) => p.id === selectedPaymentId) ||
    MOCK_PAYMENT_METHODS[0];

  // Shipping discount calculation
  let shippingDiscount = 0;
  if (appliedVoucher && appliedVoucher.discountType === 'shipping') {
    shippingDiscount = Math.min(selectedShipping.price, appliedVoucher.discountAmount);
  }

  // Voucher discount calculation
  let itemDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      const calc = (subtotal * appliedVoucher.discountAmount) / 100;
      itemDiscount = appliedVoucher.maxDiscount ? Math.min(calc, appliedVoucher.maxDiscount) : calc;
    } else if (appliedVoucher.discountType === 'fixed') {
      itemDiscount = appliedVoucher.discountAmount;
    }
  }

  const insuranceFee = insuranceActive ? 1500 : 0;
  const platformFee = 1000;
  const coinDiscount = useCoins ? Math.min(user.coins, 25000) : 0;

  const finalTotal = Math.max(
    0,
    subtotal + selectedShipping.price - shippingDiscount - itemDiscount - coinDiscount + insuranceFee + platformFee
  );

  const handlePayNow = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(selectedShipping.price, selectedShipping.name, selectedPayment.name);
      setIsSubmitting(false);
      setShowCheckoutModal(false);
      setActiveTab('orders');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-slate-50 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[94vh] sm:h-[860px] max-h-[96vh] relative">

        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-extrabold text-sm text-slate-800">Pengiriman & Pembayaran</h2>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            <span>Enkripsi 256-bit</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3 pb-32">
          {/* Shipping Address Section */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Alamat Pengiriman
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer">
                Ubah Alamat
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">{primaryAddress.recipient}</span>
                <span className="text-[11px] text-slate-500">({primaryAddress.phone})</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">
                  {primaryAddress.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{primaryAddress.fullAddress}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{primaryAddress.city}</p>
            </div>
          </div>

          {/* Ordered Products Preview */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800">
              Ringkasan Produk ({checkedItems.length} item)
            </h3>
            <div className="space-y-2">
              {checkedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.selectedVariantText ? `${item.selectedVariantText} · ` : ''}
                      {item.quantity} x {formatRupiah(item.selectedPrice)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {formatRupiah(item.selectedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Courier Selector */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Pilihan Pengiriman
              </span>
              <span className="text-[10px] text-slate-400">Paling Hemat</span>
            </div>

            <div className="space-y-2">
              {MOCK_SHIPPING_METHODS.map((method) => {
                const isSelected = method.id === selectedShippingId;
                const isRegulerWithVoucher = method.id === 'ship-reguler' && shippingDiscount > 0;

                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedShippingId(method.id)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={isSelected}
                          onChange={() => setSelectedShippingId(method.id)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{method.name}</p>
                          <p className="text-[10px] text-slate-500">{method.courier} · {method.etd}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        {isRegulerWithVoucher ? (
                          <>
                            <span className="text-xs font-bold text-emerald-600">Rp0</span>
                            <span className="text-[10px] text-slate-400 line-through block">
                              {formatRupiah(method.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-slate-800">
                            {formatRupiah(method.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insurance Checkbox */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={insuranceActive}
                  onChange={(e) => setInsuranceActive(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Proteksi Pengiriman & Asuransi
                </span>
              </label>
              <span className="text-xs font-semibold text-slate-700">Rp 1.500</span>
            </div>
          </div>

          {/* Vouchers & Coin Redemption */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
            {/* Voucher Picker Button */}
            <div
              onClick={() => setShowVoucherSheet(!showVoucherSheet)}
              role="button"
              tabIndex={0}
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 cursor-pointer hover:bg-emerald-50"
            >
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    {appliedVoucher ? appliedVoucher.title : 'Gunakan Voucher Belanja'}
                  </p>
                  <p className="text-[10px] text-emerald-600">
                    {appliedVoucher
                      ? appliedVoucher.description
                      : 'Pilih kupon gratis ongkir & diskon'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Voucher Options Drawer */}
            {showVoucherSheet && (
              <div className="p-2 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-700">Kupon Tersedia:</p>
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      applyVoucher(appliedVoucher?.id === v.id ? null : v);
                      setShowVoucherSheet(false);
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      appliedVoucher?.id === v.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{v.title}</p>
                      <p className="text-[10px] text-slate-500">{v.description}</p>
                    </div>
                    {appliedVoucher?.id === v.id ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">Gunakan</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Coins Redemption Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500 fill-amber-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Tukarkan Koin BeliKuy
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Maksimal hemat Rp25.000 (Saldo: {user.coins.toLocaleString('id-ID')})
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={useCoins}
                onChange={(e) => setUseCoins(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              Metode Pembayaran
            </span>

            <div className="space-y-2">
              {MOCK_PAYMENT_METHODS.map((pm) => {
                const isSelected = pm.id === selectedPaymentId;

                return (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPaymentId(pm.id)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setSelectedPaymentId(pm.id)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{pm.name}</p>
                          <p className="text-[10px] text-slate-500">{pm.description}</p>
                        </div>
                      </div>

                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2 text-xs">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Rincian Pembayaran</h3>

            <div className="flex justify-between text-slate-600">
              <span>Total Harga Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Total Ongkos Kirim</span>
              <span>{formatRupiah(selectedShipping.price)}</span>
            </div>

            {shippingDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Diskon Ongkos Kirim</span>
                <span>-{formatRupiah(shippingDiscount)}</span>
              </div>
            )}

            {itemDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Diskon Kupon Promo</span>
                <span>-{formatRupiah(itemDiscount)}</span>
              </div>
            )}

            {useCoins && coinDiscount > 0 && (
              <div className="flex justify-between text-amber-600 font-medium">
                <span>Diskon Koin BeliKuy</span>
                <span>-{formatRupiah(coinDiscount)}</span>
              </div>
            )}

            {insuranceActive && (
              <div className="flex justify-between text-slate-600">
                <span>Biaya Asuransi Pengiriman</span>
                <span>{formatRupiah(insuranceFee)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Biaya Layanan Aplikasi</span>
              <span>{formatRupiah(platformFee)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-extrabold text-slate-900 text-xs">Total Tagihan</span>
              <span className="font-black text-base text-emerald-700 tracking-tight">
                {formatRupiah(finalTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="absolute bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] p-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Tagihan</span>
            <span className="text-base font-black text-slate-900 tracking-tight">
              {formatRupiah(finalTotal)}
            </span>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Memproses Pembayaran...</span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Bayar Sekarang ({formatRupiah(finalTotal)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
