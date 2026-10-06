import React, { useState } from 'react';
import {
  User,
  Crown,
  QrCode,
  Wallet,
  Coins,
  Ticket,
  Package,
  Truck,
  Clock,
  Star,
  Heart,
  Store,
  MapPin,
  Shield,
  HelpCircle,
  Settings,
  ChevronRight,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatRupiah } from '../../utils/formatters';
import { WalletTopUpModal } from '../home/WalletTopUpModal';

export const ProfileView: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    vouchers,
    setActiveTab,
    setShowDailyCheckin,
    showToast,
  } = useEcommerce();

  const [showTopUp, setShowTopUp] = useState(false);

  const packingCount = orders.filter((o) => o.status === 'packing').length;
  const shippingCount = orders.filter((o) => o.status === 'shipping').length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen pb-24">
      {/* Top Profile Header */}
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 pt-6 rounded-b-3xl shadow-lg relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-xs">
                <Crown className="w-3 h-3 fill-slate-950" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-xs">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-emerald-100">{user.email}</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">{user.phone}</p>
            </div>
          </div>

          <button
            onClick={() => showToast('Kode Barcode Member Toko Offline')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20"
            title="Scan QR Member"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* Member Tier Progress Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <div>
              <p className="font-bold text-[11px] text-white">Member Platinum</p>
              <p className="text-[10px] text-emerald-100">Kumpulkan 4 transaksi lagi menuju Diamond</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md">
            18 Keuntungan
          </span>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="p-3.5 space-y-3 -mt-3 relative z-10">
        {/* Wallet & Coins Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-3">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {/* Saldo */}
            <div className="px-2 first:pl-0">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Wallet className="w-3 h-3 text-blue-500" />
                <span>GoPay / Saldo</span>
              </div>
              <p className="text-xs font-black text-slate-800 truncate">
                {formatRupiah(user.walletBalance)}
              </p>
              <button
                onClick={() => setShowTopUp(true)}
                className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-bold hover:underline"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Top Up</span>
              </button>
            </div>

            {/* Coins */}
            <div className="px-2">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Coins className="w-3 h-3 text-amber-500" />
                <span>Koin BeliKuy</span>
              </div>
              <p className="text-xs font-black text-amber-600 truncate">
                {user.coins.toLocaleString('id-ID')}
              </p>
              <button
                onClick={() => setShowDailyCheckin(true)}
                className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-bold hover:underline"
              >
                <span>Klaim Koin</span>
              </button>
            </div>

            {/* Vouchers */}
            <div className="px-2 last:pr-0">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                <Ticket className="w-3 h-3 text-rose-500" />
                <span>Voucher Saya</span>
              </div>
              <p className="text-xs font-black text-slate-800">
                {vouchers.length} Kupon
              </p>
              <span className="mt-1 block text-[10px] text-rose-500 font-bold">
                Aktif Digunakan
              </span>
            </div>
          </div>
        </div>

        {/* Status Pesanan Hub */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-800">Pesanan Saya</h3>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              Lihat Riwayat Transaksi <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {/* Belum Bayar */}
            <button
              onClick={() => setActiveTab('orders')}
              className="flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center relative mb-1 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Belum Bayar</span>
            </button>

            {/* Dikemas */}
            <button
              onClick={() => setActiveTab('orders')}
              className="flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center relative mb-1 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
                {packingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {packingCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Dikemas</span>
            </button>

            {/* Dikirim */}
            <button
              onClick={() => setActiveTab('orders')}
              className="flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center relative mb-1 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
                {shippingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {shippingCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Dikirim</span>
            </button>

            {/* Beri Ulasan */}
            <button
              onClick={() => setActiveTab('orders')}
              className="flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative mb-1 group-hover:scale-105 transition-transform">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-600 font-medium">Beri Ulasan</span>
            </button>
          </div>
        </div>

        {/* Activity & Favorites */}
        <div className="bg-white rounded-2xl divide-y divide-slate-100 border border-slate-100 shadow-sm overflow-hidden text-xs">
          <button
            onClick={() => {
              setActiveTab('home');
              showToast(`Melihat ${wishlist.length} produk favorit Anda`);
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="font-semibold text-slate-700">Wishlist & Favorit Saya</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-xs font-bold text-slate-600">{wishlist.length} Barang</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => showToast('Melihat toko langganan')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">Toko Langganan Official</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-xs font-bold text-slate-600">6 Toko</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => showToast('Alamat Tersimpan: Jl. Senopati No. 42')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-700">Daftar Alamat Pengiriman</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-xs font-bold text-slate-600">{user.addresses.length} Alamat</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => showToast('Pusat Bantuan CS 24 Jam Siap Melayani')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-slate-700">Pusat Bantuan & Live Chat CS</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-[10px] text-emerald-600 font-bold">Online 24/7</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => showToast('Pengaturan Akun & Keamanan')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-700">Pengaturan Akun & Keamanan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <WalletTopUpModal isOpen={showTopUp} onClose={() => setShowTopUp(false)} />
    </div>
  );
};
