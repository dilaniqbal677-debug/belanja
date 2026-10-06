import React from 'react';
import {
  ShieldCheck,
  Zap,
  Video,
  Truck,
  Receipt,
  ShoppingBag,
  Coins,
  CreditCard,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';

export const CategoryIcons: React.FC = () => {
  const { setActiveTab, setShowDailyCheckin, setSelectedCategory } = useEcommerce();

  const services = [
    {
      id: 'mall',
      title: 'BeliKuy Mall',
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-teal-700',
      action: () => setSelectedCategory('cat-all'),
    },
    {
      id: 'flash',
      title: 'Flash Sale',
      icon: Zap,
      gradient: 'from-orange-500 to-red-600',
      action: () => {
        const el = document.getElementById('flash-sale-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'live',
      title: 'BeliKuy Live',
      icon: Video,
      gradient: 'from-rose-500 to-pink-600',
      badge: 'LIVE',
      action: () => setActiveTab('live'),
    },
    {
      id: 'ongkir',
      title: 'Gratis Ongkir',
      icon: Truck,
      gradient: 'from-cyan-500 to-blue-600',
      action: () => setSelectedCategory('cat-all'),
    },
    {
      id: 'topup',
      title: 'Pulsa & Tagihan',
      icon: Receipt,
      gradient: 'from-blue-500 to-indigo-600',
      action: () => setSelectedCategory('cat-gadget'),
    },
    {
      id: 'mart',
      title: 'Supermarket',
      icon: ShoppingBag,
      gradient: 'from-emerald-600 to-green-700',
      action: () => setSelectedCategory('cat-fnb'),
    },
    {
      id: 'koin',
      title: 'Klaim Koin',
      icon: Coins,
      gradient: 'from-amber-400 to-yellow-600',
      badge: 'FREE',
      action: () => setShowDailyCheckin(true),
    },
    {
      id: 'paylater',
      title: 'PayLater 0%',
      icon: CreditCard,
      gradient: 'from-indigo-600 to-violet-700',
      action: () => setSelectedCategory('cat-gadget'),
    },
  ];

  return (
    <div className="mx-3 my-2 bg-white px-2.5 py-3 rounded-2xl border border-slate-100 shadow-2xs">
      <div className="grid grid-cols-4 gap-y-2.5 gap-x-1.5">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center text-center group cursor-pointer focus:outline-hidden py-0.5"
            >
              <div className="relative">
                <div
                  className={`w-9.5 h-9.5 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 group-active:scale-95 transition-all duration-150`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-600 text-[7.5px] font-black text-white rounded-full ring-1.5 ring-white shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-700 mt-1 line-clamp-1 group-hover:text-emerald-700 transition-colors w-full px-0.5">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
