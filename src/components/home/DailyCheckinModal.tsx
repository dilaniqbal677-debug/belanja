import React, { useState } from 'react';
import { X, Sparkles, Coins, Gift, Check, Trophy, RotateCw } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({ isOpen, onClose }) => {
  const { user, claimDailyReward, showToast } = useEcommerce();
  const [checkedDays, setCheckedDays] = useState<number[]>([1, 2]);
  const [spinning, setSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  const [spinPrize, setSpinPrize] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDay = 3;
  const days = [
    { day: 1, coins: 500 },
    { day: 2, coins: 800 },
    { day: 3, coins: 1100, isToday: true },
    { day: 4, coins: 1400 },
    { day: 5, coins: 1700 },
    { day: 6, coins: 2000 },
    { day: 7, coins: 5000, isSuper: true },
  ];

  const handleClaim = (day: number) => {
    if (checkedDays.includes(day)) return;
    setCheckedDays((prev) => [...prev, day]);
    claimDailyReward(day);
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinPrize(null);

    const randomRotations = 5 + Math.floor(Math.random() * 5);
    const randomSegment = Math.floor(Math.random() * 6);
    const targetDeg = spinDeg + randomRotations * 360 + randomSegment * 60;
    setSpinDeg(targetDeg);

    setTimeout(() => {
      setSpinning(false);
      const prizes = [
        'Koin BeliKuy +2.500',
        'Voucher Diskon 30%',
        'Gratis Ongkir Xtra Rp0',
        'Cashback Koin 10.000',
        'Kupon Flash Sale VIP',
        'Koin BeliKuy +5.000',
      ];
      const won = prizes[randomSegment];
      setSpinPrize(won);
      showToast(`🎉 Hadiah Roda Keberuntungan: ${won}!`);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 animate-fadeIn">
      <div className="w-full max-w-[390px] bg-gradient-to-b from-amber-50 via-white to-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-amber-200/50 flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-black/20 hover:bg-black/30 text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 mx-auto mb-1.5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
            <Coins className="w-6 h-6 text-amber-200 fill-amber-300" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight">Klaim Koin & Hadiah Harian</h2>
          <p className="text-[11px] text-amber-100">
            Total Koin Anda: <span className="font-bold text-white">{user.coins.toLocaleString('id-ID')} Koin</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
          {/* 7 Day Streak Calendar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Check-in 7 Hari Berturut-turut
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Streak: Day 3/7
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {days.slice(0, 4).map((d) => {
                const isClaimed = checkedDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    onClick={() => d.day === currentDay && handleClaim(d.day)}
                    disabled={isClaimed || d.day > currentDay}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isClaimed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : d.isToday
                        ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-400/50 shadow-sm animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                    }`}
                  >
                    <span className="text-[10px] font-semibold">Hari {d.day}</span>
                    <span className="text-xs font-bold my-0.5">+{d.coins}</span>
                    {isClaimed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {days.slice(4).map((d) => {
                const isClaimed = checkedDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    onClick={() => d.day === currentDay && handleClaim(d.day)}
                    disabled={isClaimed || d.day > currentDay}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isClaimed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : d.isSuper
                        ? 'bg-gradient-to-b from-amber-100 to-orange-100 border-amber-400 text-amber-900 font-extrabold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                    }`}
                  >
                    <span className="text-[10px] font-semibold">{d.isSuper ? 'Peti Emas 🎁' : `Hari ${d.day}`}</span>
                    <span className="text-xs font-bold my-0.5">+{d.coins}</span>
                    <Gift className={`w-3.5 h-3.5 ${d.isSuper ? 'text-orange-500' : 'text-amber-500'}`} />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleClaim(currentDay)}
              disabled={checkedDays.includes(currentDay)}
              className="w-full mt-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Coins className="w-4 h-4 fill-amber-200" />
              <span>{checkedDays.includes(currentDay) ? 'Sudah Diklaim Hari Ini' : 'Klaim Koin Hari Ini (+1.100)'}</span>
            </button>
          </div>

          {/* Lucky Wheel Minigame */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-orange-500" />
                Roda Putar Keberuntungan
              </span>
              <span className="text-[10px] text-slate-400">Gratis 1x Putar Tiap Hari</span>
            </div>

            <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
              {/* Spinning wheel element */}
              <div
                style={{
                  transform: `rotate(${spinDeg}deg)`,
                  transition: spinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                }}
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-md relative overflow-hidden bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center"
              >
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="bg-amber-400/90 border-r border-b border-white/30 flex items-center justify-center text-[9px] font-bold text-white">🎁 2.5K</div>
                  <div className="bg-orange-500/90 border-b border-white/30 flex items-center justify-center text-[9px] font-bold text-white">🎟️ Disc</div>
                  <div className="bg-rose-500/90 border-r border-white/30 flex items-center justify-center text-[9px] font-bold text-white">🚚 Ongkir</div>
                  <div className="bg-emerald-500/90 flex items-center justify-center text-[9px] font-bold text-white">💰 5K</div>
                </div>
              </div>

              {/* Center Hub Indicator */}
              <div className="absolute w-8 h-8 rounded-full bg-white shadow-lg border-2 border-slate-800 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>

              {/* Pointer Triangle */}
              <div className="absolute -top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-slate-900 z-20"></div>
            </div>

            {spinPrize && (
              <div className="p-2 mb-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold animate-fadeIn">
                🎉 Selamat! Anda Memenangkan: {spinPrize}!
              </div>
            )}

            <button
              onClick={handleSpinWheel}
              disabled={spinning}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} />
              <span>{spinning ? 'Memutar...' : 'Putar Roda Sekarang!'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
