import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  X,
  Send,
  ShoppingBag,
  Eye,
  Sparkles,
  Gift,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { useEcommerce } from '../../context/EcommerceContext';
import { formatCompact, formatRupiah } from '../../utils/formatters';

interface FloatingHeart {
  id: number;
  x: number;
  color: string;
}

export const LiveStreamView: React.FC = () => {
  const {
    activeLiveStream,
    setActiveLiveStream,
    setSelectedProduct,
    addToCart,
    showToast,
  } = useEcommerce();

  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [likesCount, setLikesCount] = useState(
    activeLiveStream ? activeLiveStream.likes : 48000
  );
  const [comments, setComments] = useState<
    { id: string; user: string; text: string; isVip?: boolean }[]
  >([
    { id: 'c1', user: 'Dimas Nugroho', text: 'Spill warna Black Titanium dong kak! 😍' },
    { id: 'c2', user: 'Rina Anggraini', text: 'Bisa cicilan 0% tanpa kartu kredit gak ya?' },
    { id: 'c3', user: 'Aldi Pratama', text: 'Udah CO 1 unit min, tolong kirim hari ini ya!', isVip: true },
    { id: 'c4', user: 'Clarissa', text: 'Voucher 500rb masih bisa diklaim ga min?' },
  ]);
  const [inputComment, setInputComment] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Periodic incoming viewer comments simulation
  useEffect(() => {
    if (!activeLiveStream) return;

    const dummyStreamComments = [
      { user: 'Bambang S.', text: 'Keren banget promo hari ini 🔥' },
      { user: 'Siti Rahma', text: 'Beli 2 dapet gratis ongkir juga kan?' },
      { user: 'Jessica M.', text: 'Gercep guys sebelum voucher diskonnya abis!' },
      { user: 'Reza Fauzi', text: 'Garansi resmi iBox kan min?', isVip: true },
      { user: 'Dewi K.', text: 'Langsung checkout mumpung live!' },
    ];

    let commentIdx = 0;
    const interval = setInterval(() => {
      const nextComm = dummyStreamComments[commentIdx % dummyStreamComments.length];
      commentIdx++;
      setComments((prev) => [...prev.slice(-6), { id: `c-${Date.now()}`, ...nextComm }]);
      setLikesCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [activeLiveStream]);

  if (!activeLiveStream) return null;

  const handleScreenTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const colors = ['#f43f5e', '#ec4899', '#f97316', '#eab308', '#10b981'];
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: Math.min(Math.max(x, 40), rect.width - 40),
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setHearts((prev) => [...prev.slice(-12), newHeart]);
    setLikesCount((prev) => prev + 1);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1800);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    setComments((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, user: 'Anda', text: inputComment.trim() },
    ]);
    setInputComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] h-full sm:h-[880px] bg-slate-950 sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between">

        {/* Stream Background Mock Video Simulation */}
        <div
          onClick={handleScreenTap}
          className="absolute inset-0 bg-cover bg-center select-none cursor-pointer"
          style={{
            backgroundImage: `url(${activeLiveStream.thumbnail})`,
          }}
        >
          {/* Ambient Video Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/70 pointer-events-none" />

          {/* Floating Hearts Animation */}
          {hearts.map((heart) => (
            <div
              key={heart.id}
              style={{
                left: `${heart.x}px`,
                bottom: '80px',
                color: heart.color,
              }}
              className="absolute pointer-events-none animate-floatUp"
            >
              <Heart className="w-7 h-7 fill-current drop-shadow-md" />
            </div>
          ))}
        </div>

        {/* Top Header Bar */}
        <div className="relative z-20 p-3 pt-4 flex items-center justify-between text-white">
          {/* Host Card */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md p-1 pr-3 rounded-full border border-white/20">
            <img
              src={activeLiveStream.streamerAvatar}
              alt={activeLiveStream.streamerName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500"
            />
            <div>
              <p className="text-xs font-bold leading-tight truncate max-w-[100px]">
                {activeLiveStream.streamerName}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-300">
                <Eye className="w-3 h-3 text-rose-400" />
                <span>{formatCompact(activeLiveStream.viewers)}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showToast(`Mengikuti ${activeLiveStream.streamerName}`);
              }}
              className="ml-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold rounded-full transition-transform active:scale-95 shadow-xs"
            >
              + Ikuti
            </button>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveLiveStream(null)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Deal Floating Banner */}
        <div className="relative z-20 px-3 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/90 to-rose-600/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-lg border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{activeLiveStream.discountText}</span>
          </div>
        </div>

        {/* Bottom Section: Chat comments + Pinned Product + Inputs */}
        <div className="relative z-20 p-3 pb-4 space-y-3">
          {/* Chat Comments Stream */}
          <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1.5 flex flex-col justify-end pointer-events-none">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="bg-black/40 backdrop-blur-md rounded-xl px-2.5 py-1 text-xs text-white max-w-[85%] self-start border border-white/10"
              >
                <span className="font-extrabold text-amber-300 mr-1.5">
                  {comm.user}
                  {comm.isVip && (
                    <span className="ml-1 px-1 py-0.2 bg-rose-500 text-[8px] text-white rounded">
                      BUYER
                    </span>
                  )}
                  :
                </span>
                <span className="text-slate-100">{comm.text}</span>
              </div>
            ))}
          </div>

          {/* Pinned Featured Product Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-2xl border border-white/40">
            <div
              onClick={() => setSelectedProduct(activeLiveStream.featuredProduct)}
              role="button"
              tabIndex={0}
              className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={activeLiveStream.featuredProduct.images[0]}
                  alt={activeLiveStream.featuredProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-0.5 right-0.5 px-1 py-0.2 bg-rose-600 text-[8px] font-bold text-white rounded">
                  -{activeLiveStream.featuredProduct.discountPercent}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {activeLiveStream.featuredProduct.name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-extrabold text-rose-600">
                    {formatRupiah(activeLiveStream.featuredProduct.price)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatRupiah(activeLiveStream.featuredProduct.originalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(activeLiveStream.featuredProduct, 1);
                showToast('Produk Live berhasil dimasukkan keranjang!');
              }}
              className="py-2 px-3 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95 shrink-0 flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli Sekarang</span>
            </button>
          </div>

          {/* Comment Input Bar */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2">
            <div className="flex-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 px-3 py-2 flex items-center gap-2 text-white">
              <input
                type="text"
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
                placeholder="Ketik komentar untuk host..."
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-300 focus:outline-hidden"
              />
              <button type="submit" className="text-emerald-400 hover:text-emerald-300">
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Tap Heart Button */}
            <button
              type="button"
              onClick={handleScreenTap}
              className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center transition-transform active:scale-90 shadow-md shrink-0"
              title="Kirim Suka"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="text-[8px] font-black">{formatCompact(likesCount)}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
