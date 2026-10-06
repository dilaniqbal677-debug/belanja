import React, { useState } from 'react';
import { Wallet, Coins, Ticket, PlusCircle, Sparkles } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatRupiah } from '../../utils/formatters';
import { WalletTopUpModal } from './WalletTopUpModal';

export const WalletBar: React.FC = () => {
  const { user, vouchers, setShowDailyCheckin } = useEcommerce();
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const activeVouchersCount = vouchers.filter((v) => v.claimed).length;

  return (
    <>
      <div className="mx-3 my-2 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-2.5 shadow-xs border border-slate-700/50">
        <div className="grid grid-cols-3 divide-x divide-slate-700/60 items-center">
          {/* 1. GoPay / BeliKuy Saldo */}
          <div className="px-2 first:pl-0.5">
            <div className="flex items-center gap-1 text-slate-300 text-[9.5px] font-medium mb-0.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-black shrink-0">
                G
              </div>
              <span className="truncate">GoPay / Saldo</span>
            </div>
            <p className="font-extrabold text-[11px] text-white tracking-tight truncate">
              {formatRupiah(user.walletBalance)}
            </p>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="mt-0.5 flex items-center gap-0.5 text-[9.5px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <PlusCircle className="w-2.5 h-2.5" />
              <span>Top Up</span>
            </button>
          </div>

          {/* 2. Koin BeliKuy */}
          <div className="px-2">
            <div className="flex items-center gap-1 text-amber-300 text-[9.5px] font-medium mb-0.5">
              <Coins className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
              <span className="truncate">Koin Reward</span>
            </div>
            <p className="font-extrabold text-[11px] text-amber-300 tracking-tight truncate">
              {user.coins.toLocaleString('id-ID')}
            </p>
            <button
              onClick={() => setShowDailyCheckin(true)}
              className="mt-0.5 flex items-center gap-0.5 text-[9.5px] text-amber-300 hover:text-amber-200 font-bold transition-colors"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" />
              <span>Klaim Koin</span>
            </button>
          </div>

          {/* 3. Voucher & PayLater */}
          <div className="px-2 last:pr-0.5">
            <div className="flex items-center gap-1 text-slate-300 text-[9.5px] font-medium mb-0.5">
              <Ticket className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate">Voucher</span>
            </div>
            <p className="font-extrabold text-[11px] text-white tracking-tight truncate">
              {activeVouchersCount} Kupon
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[9.5px] text-rose-300 font-semibold truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
              <span className="truncate">CB 20%</span>
            </div>
          </div>
        </div>
      </div>

      <WalletTopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
      />
    </>
  );
};
