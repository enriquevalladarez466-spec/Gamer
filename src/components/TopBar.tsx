import React from 'react';
import { Download } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  activeView: 'dashboard' | 'apps' | 'inspector' | 'guide';
  onSelectView: (view: 'dashboard' | 'apps' | 'inspector' | 'guide') => void;
  onOpenExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onSelectView,
  onOpenExport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element brand wordmark */}
        <button
          onClick={() => onSelectView('dashboard')}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          AndroidBridge Lab
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'dashboard'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Estado de Batería
          </button>
          <button
            onClick={() => onSelectView('apps')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'apps'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Consumo por App
          </button>
          <button
            onClick={() => onSelectView('inspector')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'inspector'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Consola del Puente
          </button>
          <button
            onClick={() => onSelectView('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === 'guide'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Publicar en Google Play
          </button>
        </nav>

        {/* Zone 3: 1 primary action with optional in-app install button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton />
          <button
            onClick={onOpenExport}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar mi_pagina.html</span>
          </button>
        </div>
      </div>
    </header>
  );
};
