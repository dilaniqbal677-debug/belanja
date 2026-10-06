import React, { useState, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Polyline,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Truck,
  CheckCircle,
  Navigation,
  Clock,
  ShieldCheck,
  LocateFixed,
  Play,
  Pause,
  Store,
  Home,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Order } from '../../types';

interface Waypoint {
  lat: number;
  lng: number;
}

interface LiveGoogleMapsTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

// High-precision road coordinates following real Jakarta streets (Medan Merdeka -> Thamrin -> Sudirman -> Semanggi -> Senopati)
// Every single node is positioned directly on the road center line
const PRECISE_ROAD_COORDINATES: Waypoint[] = [
  { lat: -6.17540, lng: 106.82715 }, // 0: Gudang Monas / Medan Merdeka Barat
  { lat: -6.17820, lng: 106.82520 }, // 1: Silang Merdeka Barat
  { lat: -6.18150, lng: 106.82420 }, // 2: Patung Kuda Arjuna Wiwaha
  { lat: -6.18420, lng: 106.82400 }, // 3: Awal Jl. M.H. Thamrin (Kemenag)
  { lat: -6.18680, lng: 106.82390 }, // 4: Thamrin (Gedung BPPT / Bank Indonesia)
  { lat: -6.18950, lng: 106.82370 }, // 5: Sarinah Plaza
  { lat: -6.19200, lng: 106.82345 }, // 6: Plaza Indonesia
  { lat: -6.19400, lng: 106.82320 }, // 7: Grand Indonesia Sisi Timur
  { lat: -6.19500, lng: 106.82300 }, // 8: Bundaran HI
  { lat: -6.19650, lng: 106.82310 }, // 9: Masuk Jl. Jend. Sudirman
  { lat: -6.19900, lng: 106.82320 }, // 10: Tosari / Grand Hyatt
  { lat: -6.20150, lng: 106.82310 }, // 11: Underpass Dukuh Atas
  { lat: -6.20450, lng: 106.82290 }, // 12: Stasiun BNI City
  { lat: -6.20750, lng: 106.82260 }, // 13: Wisma 46 Kota BNI
  { lat: -6.21050, lng: 106.82220 }, // 14: Karet Sudirman / Le Meridien
  { lat: -6.21350, lng: 106.82180 }, // 15: Sampoerna Strategic Square
  { lat: -6.21600, lng: 106.82120 }, // 16: Bendungan Hilir Sudirman
  { lat: -6.21850, lng: 106.81980 }, // 17: Dekat Flyover Semanggi
  { lat: -6.21980, lng: 106.81750 }, // 18: Jalur Kupingan Semanggi Masuk Selatan
  { lat: -6.22150, lng: 106.81520 }, // 19: Depan Polda Metro Jaya
  { lat: -6.22380, lng: 106.81380 }, // 20: Jl. Jend. Sudirman Selatan
  { lat: -6.22550, lng: 106.81310 }, // 21: Belok Masuk Akses SCBD Lot 8
  { lat: -6.22680, lng: 106.81260 }, // 22: Jl. SCBD Lot 8 (Asphalt jalan kawasan)
  { lat: -6.22800, lng: 106.81220 }, // 23: Pintu Keluar SCBD Menuju Senopati
  { lat: -6.22890, lng: 106.81180 }, // 24: Persimpangan Jl. Senopati
  { lat: -6.22975, lng: 106.81152 }, // 25: Tiba di Alamat Pembeli (Jl. Senopati No. 42)
];

// Inner map manager for Directions API & camera positioning
const GoogleMapsRouteManager: React.FC<{
  onPathCalculated: (path: Waypoint[]) => void;
  courierPos: Waypoint;
  centerMode: 'courier' | 'all';
  activeRoadPath: Waypoint[];
}> = ({ onPathCalculated, courierPos, centerMode, activeRoadPath }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const hasFetched = useRef(false);

  // Compute live real road directions from Google's road network
  useEffect(() => {
    if (!routesLib || !map || hasFetched.current) return;

    try {
      const g = (window as any).google;
      if (!g?.maps) return;

      const directionsService = new routesLib.DirectionsService();
      directionsService.route(
        {
          origin: { lat: -6.1754, lng: 106.8272 },
          destination: { lat: -6.22975, lng: 106.81152 },
          travelMode: g.maps.TravelMode?.DRIVING || 'DRIVING',
        },
        (result: any, status: any) => {
          if (status === 'OK' && result?.routes?.[0]?.overview_path) {
            hasFetched.current = true;
            const fullRoadPath = result.routes[0].overview_path.map((pt: any) => ({
              lat: typeof pt.lat === 'function' ? pt.lat() : pt.lat,
              lng: typeof pt.lng === 'function' ? pt.lng() : pt.lng,
            }));
            if (fullRoadPath.length > 5) {
              onPathCalculated(fullRoadPath);
            }
          }
        }
      );
    } catch (e) {
      console.log('Directions service fallback active:', e);
    }
  }, [routesLib, map, onPathCalculated]);


  // Handle camera pan & bounds
  useEffect(() => {
    if (!map) return;

    if (centerMode === 'courier') {
      map.panTo(courierPos);
      map.setZoom(15.5);
    } else {
      const lats = activeRoadPath.map((c) => c.lat);
      const lngs = activeRoadPath.map((c) => c.lng);
      map.fitBounds(
        {
          north: Math.max(...lats) + 0.003,
          south: Math.min(...lats) - 0.003,
          east: Math.max(...lngs) + 0.003,
          west: Math.min(...lngs) - 0.003,
        },
        { top: 40, right: 25, bottom: 40, left: 25 }
      );
    }
  }, [map, centerMode, courierPos, activeRoadPath]);

  return null;
};

export const LiveGoogleMapsTrackingModal: React.FC<LiveGoogleMapsTrackingModalProps> = ({
  order,
  onClose,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Actual road coordinates (defaults to PRECISE_ROAD_COORDINATES which follow streets directly)
  const [roadPath, setRoadPath] = useState<Waypoint[]>(PRECISE_ROAD_COORDINATES);

  // Courier index along the road path
  const [courierIndex, setCourierIndex] = useState(12); // ~50% progress
  const [isSimulating, setIsSimulating] = useState(true);
  const [centerMode, setCenterMode] = useState<'courier' | 'all'>('courier');

  // Callback when Directions API returns higher density road vertices
  const handlePathCalculated = (newPath: Waypoint[]) => {
    setRoadPath(newPath);
    setCourierIndex(Math.floor(newPath.length * 0.45));
  };

  const currentSafeIndex = Math.min(courierIndex, roadPath.length - 1);
  const courierPos = roadPath[currentSafeIndex];
  const originPos = roadPath[0];
  const destPos = roadPath[roadPath.length - 1];

  const stepsRemaining = roadPath.length - 1 - currentSafeIndex;
  const etaMinutes = stepsRemaining === 0 ? 0 : Math.max(3, Math.round(stepsRemaining * 1.2));
  const remainingKm = ((stepsRemaining / roadPath.length) * 7.2).toFixed(1);

  // Smooth courier motion following the exact asphalt street line
  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setCourierIndex((prev) => {
        if (prev < roadPath.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [isSimulating, roadPath.length]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-2 animate-fadeIn">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[94vh] sm:h-[880px] max-h-[96vh] relative">
        {/* Top Header - Authentic Shopee / Tokopedia Style */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-3 border-b border-slate-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-slate-800">Lacak Pengiriman Pesanan</h3>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-[8px] font-extrabold text-emerald-800 rounded-full">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                No. Resi: {order.trackingNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Google Map Canvas */}
        <div className="relative h-[48%] sm:h-[50%] bg-slate-100 overflow-hidden">
          <APIProvider apiKey={apiKey} libraries={['marker', 'routes']}>
            <Map
              mapId="bf51a910020fa25a"
              defaultCenter={courierPos}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI={true}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              className="w-full h-full"
            >
              <GoogleMapsRouteManager
                onPathCalculated={handlePathCalculated}
                courierPos={courierPos}
                centerMode={centerMode}
                activeRoadPath={roadPath}
              />

              {/* 1. Underlying White Border / Casing Line for Google Maps navigation aesthetic */}
              <Polyline
                path={roadPath}
                strokeColor="#ffffff"
                strokeOpacity={1.0}
                strokeWeight={8}
              />

              {/* 2. Traveled Street Path (Emerald Green - Jalur yang sudah dilalui) */}
              <Polyline
                path={roadPath.slice(0, currentSafeIndex + 1)}
                strokeColor="#00aa5b"
                strokeOpacity={1.0}
                strokeWeight={5}
              />

              {/* 3. Remaining Street Path (Google Royal Blue - Jalur jalan nyata di depan) */}
              <Polyline
                path={roadPath.slice(currentSafeIndex)}
                strokeColor="#1a73e8"
                strokeOpacity={0.9}
                strokeWeight={5}
              />

              {/* Origin Marker: Gudang Penjual */}
              <AdvancedMarker position={originPos} title="Gudang Penjual (Asal)">
                <div className="relative flex flex-col items-center">
                  <div className="bg-slate-900 text-white p-1.5 rounded-xl shadow-lg border-2 border-white flex items-center justify-center">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[8.5px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-sm mt-0.5 whitespace-nowrap">
                    Gudang Toko
                  </span>
                </div>
              </AdvancedMarker>

              {/* Destination Marker: Rumah Pembeli */}
              <AdvancedMarker position={destPos} title="Alamat Tujuan Pengiriman">
                <div className="relative flex flex-col items-center">
                  <div className="bg-rose-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white flex items-center justify-center">
                    <Home className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[8.5px] font-black bg-rose-600 text-white px-1.5 py-0.5 rounded shadow-sm mt-0.5 whitespace-nowrap">
                    Alamat Pembeli
                  </span>
                </div>
              </AdvancedMarker>

              {/* Courier Marker moving strictly on the road asphalt */}
              <AdvancedMarker position={courierPos} title="Posisi Motor Kurir">
                <div className="relative flex flex-col items-center -translate-y-2 cursor-pointer">
                  {/* Radar pulse wave */}
                  <div className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></div>

                  {/* Motor Icon Badge */}
                  <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center">
                    <Navigation className="w-4 h-4 rotate-45 text-white" />
                  </div>

                  {/* Driver Tag */}
                  <div className="bg-white text-slate-900 px-2 py-0.5 rounded-full shadow-md text-[8.5px] font-extrabold mt-1 border border-slate-200 flex items-center gap-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Pak Joko (Kurir SiCepat)</span>
                  </div>
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>

          {/* Floating Controls Top Right */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Recenter on Courier */}
            <button
              onClick={() => setCenterMode('courier')}
              className={`p-2 rounded-xl shadow-md border backdrop-blur-md transition-all ${
                centerMode === 'courier'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
              }`}
              title="Pusatkan ke Kurir"
            >
              <LocateFixed className="w-4 h-4" />
            </button>

            {/* Play/Pause Movement */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`p-2 rounded-xl shadow-md border backdrop-blur-md transition-all ${
                isSimulating
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
              }`}
              title={isSimulating ? 'Jeda Kurir' : 'Lanjutkan Kurir'}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Floating ETA Badge Overlay */}
          <div className="absolute top-2.5 left-2.5 z-10 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-2xl shadow-lg border border-slate-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <div>
              <p className="text-[8px] text-slate-300 uppercase font-bold tracking-wider">Estimasi Tiba</p>
              <p className="text-xs font-black text-emerald-400">
                {stepsRemaining === 0 ? 'Kurir Telah Tiba!' : `${etaMinutes} Menit Lagi (${remainingKm} km)`}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Delivery Card - Pure Clean E-Commerce Experience */}
        <div className="flex-1 bg-white overflow-y-auto no-scrollbar p-3.5 space-y-3">
          {/* Driver Contact & Info Card */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Pak Joko"
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[8px] font-bold p-0.5 rounded-full">
                  <CheckCircle className="w-2.5 h-2.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900">Joko Susilo</h4>
                  <span className="text-[10px] text-amber-500 font-bold flex items-center">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> 4.9
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Kurir Ekspedisi · <span className="font-mono font-bold text-slate-800">B 4821 KLY</span>
                </p>
                <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">Honda Vario 160 Hitam</p>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="flex items-center gap-1.5">
              <a
                href="tel:081298765432"
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition-transform active:scale-90 shadow-2xs"
                title="Telepon Kurir"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
              </a>
              <a
                href="https://wa.me/6281298765432"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs"
                title="Chat WhatsApp Kurir"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Current Live Delivery Status Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-extrabold text-emerald-900">
                {stepsRemaining === 0
                  ? 'Paket telah tiba di depan pintu rumah Anda!'
                  : 'Kurir sedang dalam perjalanan menuju alamat Anda'}
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {stepsRemaining === 0
                  ? 'Silakan periksa paket dan konfirmasi penerimaan di aplikasi.'
                  : `Kurir melintas di sekitar kawasan Sudirman / Senopati. Estimasi tiba pukul ${new Date(
                      Date.now() + etaMinutes * 60000
                    ).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.`}
              </p>
            </div>
          </div>

          {/* Delivery Address Destination */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Alamat Pengiriman (Tujuan):</span>
            </div>
            <p className="text-slate-600 text-[10.5px] leading-relaxed pl-5">
              {order.shippingAddress}
            </p>
          </div>

          {/* Package Timeline Milestones */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold text-slate-800">Riwayat Status Paket</h4>
            <div className="space-y-3 pl-2">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  {idx < order.timeline.length - 1 && (
                    <div
                      className={`absolute left-2.5 top-5 w-0.5 h-8 ${
                        step.isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      step.isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold ${step.isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.status}
                      </p>
                      <span className="text-[10px] text-slate-400">{step.time}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi Pengiriman Tepat Waktu</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
