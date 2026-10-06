import React, { useState } from 'react';
import { Smartphone, Monitor, Shield, Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fluid'>('phone');
  const [currentTime, setCurrentTime] = useState('09:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 sm:py-6 selection:bg-emerald-500 selection:text-white">
      {/* Top Device Switcher Toolbar for desktop reviewers */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between px-4 py-2 mb-3 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg text-slate-300 text-xs">
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>BeliKuy Mobile Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setDeviceMode('phone')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              deviceMode === 'phone'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Frame Smartphone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setDeviceMode('fluid')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              deviceMode === 'fluid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Penuh Layar"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        </div>
      </header>

      {/* Main Container - Strictly locked to authentic mobile smartphone dimensions */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-slate-50 overflow-hidden ${
          deviceMode === 'phone'
            ? 'max-w-[420px] h-[900px] sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-0 sm:border-[8px] sm:border-slate-800'
            : 'max-w-[420px] min-h-screen sm:min-h-[900px] sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-700/80'
        }`}
      >

        {/* Dynamic Island / Mobile Status Bar (Visible in phone frame) */}
        {deviceMode === 'phone' && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-white select-none z-40 text-slate-900 text-xs font-semibold border-b border-slate-100">
            <span>{currentTime}</span>

            {/* Dynamic Island Capsule */}
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60"></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>
        )}

        {/* Child Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative bg-slate-50">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        {deviceMode === 'phone' && (
          <div className="hidden sm:flex justify-center pb-2 pt-1 bg-white/80 backdrop-blur-sm z-30">
            <div className="w-32 h-1 bg-slate-400 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
