/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, Signal, Battery, RefreshCw } from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  batteryLevel: number;
  isCharging: boolean;
  onRefresh: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  batteryLevel,
  isCharging,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Device wrapper */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl ring-1 ring-slate-800 shadow-emerald-950/20 flex flex-col border-4 border-slate-800">
        {/* Hardware side buttons emulation */}
        <div className="absolute -left-[7px] top-28 w-1 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[7px] top-44 w-1 h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[7px] top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

        {/* Inner screen */}
        <div className="relative w-full h-full bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-800/80">
          {/* Android Status Bar */}
          <div className="h-10 px-6 pt-2 flex items-center justify-between text-xs text-slate-300 font-mono z-20 shrink-0 bg-slate-950/80 backdrop-blur-sm select-none">
            <span className="font-semibold text-xs tracking-tight">12:45</span>

            {/* Camera cutout */}
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>

            <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-1 font-semibold">
                <span className="text-[10px] tabular-nums">{batteryLevel}%</span>
                <Battery className={`w-3.5 h-3.5 ${isCharging ? 'text-emerald-400' : ''}`} />
              </div>
            </div>
          </div>

          {/* WebView App Bar */}
          <div className="h-11 px-4 flex items-center justify-between border-b border-slate-800/70 bg-slate-900/90 text-xs shrink-0 select-none">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-400 truncate">
                file:///android_asset/mi_pagina.html
              </span>
            </div>
            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Recargar WebView"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* WebView Content Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-slate-950">
            {children}
          </div>

          {/* Android Bottom Navigation Pill Bar */}
          <div className="h-6 flex items-center justify-center bg-slate-950 shrink-0 select-none">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
