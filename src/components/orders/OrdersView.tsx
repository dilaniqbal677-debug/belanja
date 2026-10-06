import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  MessageSquare,
  MapPin,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { Order, OrderStatus } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { LiveGoogleMapsTrackingModal } from './LiveGoogleMapsTrackingModal';

export const OrdersView: React.FC = () => {

  const { orders, setSelectedProduct, showToast, setActiveTab } = useEcommerce();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  const filterTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'packing', label: 'Dikemas' },
    { id: 'shipping', label: 'Dikirim' },
    { id: 'delivered', label: 'Selesai' },
    { id: 'unpaid', label: 'Belum Bayar' },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusTab === 'all') return true;
    return o.status === selectedStatusTab;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'unpaid':
        return { text: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-800' };
      case 'packing':
        return { text: 'Sedang Dikemas Penjual', color: 'bg-blue-100 text-blue-800' };
      case 'shipping':
        return { text: 'Dalam Pengiriman Kurir', color: 'bg-teal-100 text-teal-800' };
      case 'delivered':
      case 'completed':
        return { text: 'Pesanan Selesai', color: 'bg-emerald-100 text-emerald-800' };
      case 'cancelled':
        return { text: 'Dibatalkan', color: 'bg-slate-200 text-slate-700' };
      default:
        return { text: 'Diproses', color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-xs">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="font-extrabold text-base text-slate-800">Daftar Transaksi</h1>
          <span className="text-xs text-slate-400 font-medium">
            {orders.length} Pesanan
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-3 pb-2 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = selectedStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-3.5 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Package className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-sm text-slate-700">Belum ada transaksi di status ini</h3>
            <p className="text-xs text-slate-400 mt-1">
              Yuk temukan jutaan produk impianmu dengan promo gratis ongkir!
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const firstItem = order.items[0];

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-3"
              >
                {/* Header: Store & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Belanja</span>
                    <span className="text-[10px] text-slate-400">· {order.createdAt}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>

                {/* Primary Item Preview */}
                <div
                  onClick={() => setSelectedProduct(firstItem.product)}
                  role="button"
                  tabIndex={0}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <img
                    src={firstItem.product.images[0]}
                    alt={firstItem.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {firstItem.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {firstItem.quantity} barang {firstItem.variantText ? `· ${firstItem.variantText}` : ''}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">
                      {formatRupiah(firstItem.price)}
                    </p>
                  </div>
                </div>

                {order.items.length > 1 && (
                  <p className="text-[11px] text-slate-400 pt-1">
                    +{order.items.length - 1} produk lainnya
                  </p>
                )}

                {/* Tracking Preview Snippet */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-slate-600 truncate text-[11px]">
                      {order.shippingCourier}
                    </span>
                  </div>
                  <button
                    onClick={() => setTrackedOrder(order)}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 shrink-0 ml-2"
                  >
                    Lacak Paket &gt;
                  </button>
                </div>

                {/* Footer: Total & Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Belanja</span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatRupiah(order.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackedOrder(order)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Lacak
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(firstItem.product);
                        showToast('Membuka produk untuk beli lagi');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Beli Lagi
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Real-time Order Tracking Google Maps Modal */}
      {trackedOrder && (
        <LiveGoogleMapsTrackingModal
          order={trackedOrder}
          onClose={() => setTrackedOrder(null)}
        />
      )}
    </div>
  );
};

