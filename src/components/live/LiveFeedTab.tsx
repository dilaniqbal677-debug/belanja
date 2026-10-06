import React from 'react';
import { Video, Eye, Heart, Flame, Sparkles } from 'lucide-react';
import { MOCK_LIVE_STREAMS } from '../../data/mockData';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatCompact, formatRupiah } from '../../utils/formatters';

export const LiveFeedTab: React.FC = () => {
  const { setActiveLiveStream } = useEcommerce();

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white min-h-screen pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
            <Video className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>BeliKuy Live & Video</span>
              <span className="px-1.5 py-0.2 bg-rose-600 text-[8px] font-black rounded-full">
                LIVE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">Tonton live host & klaim diskon instan</p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
          Voucher Live 50%
        </span>
      </div>

      {/* Streams Feed */}
      <div className="p-3.5 space-y-4">
        {MOCK_LIVE_STREAMS.map((stream) => (
          <div
            key={stream.id}
            onClick={() => setActiveLiveStream(stream)}
            role="button"
            tabIndex={0}
            className="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-lg cursor-pointer group hover:border-rose-500 transition-all"
          >
            {/* Stream Video Preview Canvas */}
            <div className="relative aspect-16/10 bg-slate-950">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/60"></div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded-md flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  LIVE STREAM
                </span>
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-semibold rounded-md flex items-center gap-1">
                  <Eye className="w-3 h-3 text-rose-400" />
                  {formatCompact(stream.viewers)} penonton
                </span>
              </div>

              {/* Streamer Avatar */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                <img
                  src={stream.streamerAvatar}
                  alt={stream.streamerName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="text-[10px] text-white font-bold">{stream.streamerName}</span>
              </div>

              {/* Likes counter bottom right */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] text-rose-400 bg-black/60 px-2 py-0.5 rounded-full">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{formatCompact(stream.likes)} suka</span>
              </div>
            </div>

            {/* Stream Footer Info */}
            <div className="p-3 space-y-2">
              <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
                {stream.title}
              </h3>

              {/* Pinned Featured Item Bar */}
              <div className="bg-slate-900/90 rounded-xl p-2 flex items-center justify-between border border-slate-700/60">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={stream.featuredProduct.images[0]}
                    alt={stream.featuredProduct.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate">
                      {stream.featuredProduct.name}
                    </p>
                    <p className="text-xs font-extrabold text-rose-400">
                      {formatRupiah(stream.featuredProduct.price)}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold text-white bg-rose-600 px-3 py-1.5 rounded-lg shrink-0 shadow-xs">
                  Buka Live &gt;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
