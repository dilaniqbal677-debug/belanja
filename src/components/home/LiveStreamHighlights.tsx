import React from 'react';
import { Video, Eye, ChevronRight, Sparkles } from 'lucide-react';
import { MOCK_LIVE_STREAMS } from '../../data/mockData';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatCompact, formatRupiah } from '../../utils/formatters';

export const LiveStreamHighlights: React.FC = () => {
  const { setActiveLiveStream, setActiveTab } = useEcommerce();

  return (
    <div className="mx-3 my-2 bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-lg bg-rose-50 text-rose-600">
            <Video className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <div>
            <h3 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
              <span>BeliKuy Live</span>
              <span className="px-1.5 py-0.2 bg-rose-600 text-[7.5px] font-black text-white rounded-full">
                LIVE
              </span>
            </h3>
            <p className="text-[9.5px] text-slate-400">Voucher eksklusif saat live</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('live')}
          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 flex items-center"
        >
          Semua <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Stream Cards */}
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {MOCK_LIVE_STREAMS.map((stream) => (
          <div
            key={stream.id}
            onClick={() => setActiveLiveStream(stream)}
            role="button"
            tabIndex={0}
            className="w-38 shrink-0 rounded-xl overflow-hidden relative cursor-pointer group shadow-2xs hover:shadow-xs transition-all border border-slate-100"
          >

            {/* Thumbnail */}
            <div className="h-48 relative bg-slate-900">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40"></div>

              {/* Live Badge & Viewers */}
              <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[8px] font-black rounded-md flex items-center gap-1 shadow-xs">
                  <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                  LIVE
                </span>
                <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-medium rounded-md flex items-center gap-1">
                  <Eye className="w-2.5 h-2.5" />
                  {formatCompact(stream.viewers)}
                </span>
              </div>

              {/* Streamer Avatar & Name */}
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-white/20">
                <img
                  src={stream.streamerAvatar}
                  alt={stream.streamerName}
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
                <span className="text-[9px] text-white font-medium truncate max-w-[65px]">
                  {stream.streamerName}
                </span>
              </div>

              {/* Pinned Product Card inside live preview */}
              <div className="absolute bottom-2 inset-x-2 z-10 bg-white/95 backdrop-blur-md rounded-lg p-1.5 flex items-center gap-2 shadow-lg border border-white/40">
                <img
                  src={stream.featuredProduct.images[0]}
                  alt={stream.featuredProduct.name}
                  className="w-9 h-9 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-slate-800 truncate">
                    {stream.featuredProduct.name}
                  </p>
                  <p className="text-[10px] font-extrabold text-rose-600">
                    {formatRupiah(stream.featuredProduct.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
