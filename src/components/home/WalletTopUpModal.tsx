import React, { useState } from 'react';
import { X, Wallet, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatRupiah } from '../../utils/formatters';

interface WalletTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletTopUpModal: React.FC<WalletTopUpModalProps> = ({ isOpen, onClose }) => {
  const { topUpWallet, user } = useEcommerce();
  const [selectedAmount, setSelectedAmount] = useState<number>(200000);
  const [selectedMethod, setSelectedMethod] = useState<'bca' | 'mandiri' | 'qris'>('bca');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(selectedAmount);
      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Top Up Saldo BeliKuy Pay</h3>
              <p className="text-xs text-slate-400">Saldo saat ini: {formatRupiah(user.walletBalance)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Pilih Nominal Top Up</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedAmount === amt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Channels */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Metode Pembayaran</label>
            <div className="space-y-2">
              <div
                onClick={() => setSelectedMethod('bca')}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMethod === 'bca'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-blue-700 text-xs bg-blue-100 px-2 py-1 rounded">BCA</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">BCA Virtual Account</p>
                    <p className="text-[11px] text-slate-400">Verifikasi instan otomatis</p>
                  </div>
                </div>
                {selectedMethod === 'bca' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>

              <div
                onClick={() => setSelectedMethod('mandiri')}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMethod === 'mandiri'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-amber-600 text-xs bg-amber-100 px-2 py-1 rounded">MANDIRI</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Mandiri Bill Payment</p>
                    <p className="text-[11px] text-slate-400">Livin' by Mandiri</p>
                  </div>
                </div>
                {selectedMethod === 'mandiri' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>

              <div
                onClick={() => setSelectedMethod('qris')}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedMethod === 'qris'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-slate-900 text-xs bg-slate-200 px-2 py-1 rounded">QRIS</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">QRIS Instan</p>
                    <p className="text-[11px] text-slate-400">Scan via Semua E-Wallet & Bank</p>
                  </div>
                </div>
                {selectedMethod === 'qris' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Terjamin aman & diawasi Bank Indonesia & OJK</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500">Total Pembayaran</p>
            <p className="text-base font-extrabold text-emerald-600">{formatRupiah(selectedAmount)}</p>
          </div>
          <button
            onClick={handleTopUp}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Konfirmasi Top Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
