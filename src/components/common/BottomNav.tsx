import React from 'react';
import { Home, Video, LayoutGrid, ReceiptText, User } from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, orders, user } = useEcommerce();

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'packing' || o.status === 'shipping'
  ).length;

  const navItems = [
    {
      id: 'home' as const,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'live' as const,
      label: 'Live & Video',
      icon: Video,
      badge: 'LIVE',
      isLive: true,
    },
    {
      id: 'categories' as const,
      label: 'Kategori',
      icon: LayoutGrid,
    },
    {
      id: 'orders' as const,
      label: 'Transaksi',
      icon: ReceiptText,
      count: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'profile' as const,
      label: 'Akun',
      icon: User,
      avatar: user.avatar,
    },
  ];

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-3px_10px_rgba(0,0,0,0.03)] px-1 py-1 safe-bottom transition-all">
      <nav className="flex items-center justify-around h-12">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-0.5 relative transition-all group ${
                isActive ? 'text-emerald-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Icon Container with badges */}
              <div className="relative mb-0.5">
                {item.avatar && isActive ? (
                  <div className="w-5 h-5 rounded-full ring-2 ring-emerald-500 overflow-hidden">
                    <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Icon
                    className={`w-4.5 h-4.5 transition-transform duration-150 ${
                      isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                    }`}
                  />
                )}

                {/* Live blinking badge */}
                {item.isLive && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 bg-rose-500 text-[7.5px] font-black tracking-tighter text-white rounded-full flex items-center gap-0.5 shadow-2xs animate-pulse">
                    <span className="w-1 h-1 rounded-full bg-white"></span>
                    LIVE
                  </span>
                )}

                {/* Orders count badge */}
                {item.count && (
                  <span className="absolute -top-1 -right-2 min-w-3 h-3 px-0.5 bg-emerald-600 text-[8px] font-bold text-white rounded-full flex items-center justify-center ring-1 ring-white">
                    {item.count}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] tracking-tight transition-colors ${
                  isActive ? 'font-bold text-emerald-600' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );

};
