/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppBatteryUsageItem } from '../types/bridge';
import { INITIAL_APP_USAGE } from '../data/appUsageData';
import {
  ExternalLink,
  ShieldAlert,
  Tv,
  Video,
  Camera,
  PlaySquare,
  MessageSquare,
  Cpu,
  Globe,
  Music,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  PowerOff,
  RotateCcw,
  StopCircle,
  Zap,
} from 'lucide-react';

interface AppBatteryUsageProps {
  onAbrirConsumoNativo: () => void;
  onAbrirDetallesApp: (packageName: string) => void;
  onDetenerApp: (packageName: string, appName: string) => void;
  onDetenerTodas: (apps: AppBatteryUsageItem[]) => void;
  onForzarDetencionApp: (packageName: string) => void;
  isNativeBridge: boolean;
}

export const AppBatteryUsage: React.FC<AppBatteryUsageProps> = ({
  onAbrirConsumoNativo,
  onAbrirDetallesApp,
  onDetenerApp,
  onDetenerTodas,
  onForzarDetencionApp,
  isNativeBridge,
}) => {
  const [apps, setApps] = useState<AppBatteryUsageItem[]>(INITIAL_APP_USAGE);
  const [filter, setFilter] = useState<'all' | 'high' | 'background' | 'system'>('all');
  const [selectedApp, setSelectedApp] = useState<AppBatteryUsageItem | null>(null);

  // Calculate total saved mAh from stopped apps
  const stoppedApps = apps.filter(a => a.isStopped);
  const savedMah = stoppedApps.reduce((acc, a) => acc + Math.round(a.mah * 0.7), 0);
  const savedMinutes = Math.round((savedMah / 300) * 60);

  const handleStopApp = (app: AppBatteryUsageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setApps(prev =>
      prev.map(a => (a.id === app.id ? { ...a, isStopped: true } : a))
    );
    onDetenerApp(app.packageName, app.name);
  };

  const handleRestartApp = (app: AppBatteryUsageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setApps(prev =>
      prev.map(a => (a.id === app.id ? { ...a, isStopped: false } : a))
    );
  };

  const handleStopAllBackground = () => {
    const stoppable = apps.filter(a => a.category !== 'sistema' && !a.isStopped);
    setApps(prev =>
      prev.map(a => (a.category !== 'sistema' ? { ...a, isStopped: true } : a))
    );
    onDetenerTodas(stoppable);
  };

  const toggleRestrict = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApps(prev =>
      prev.map(app =>
        app.id === id ? { ...app, isBackgroundRestricted: !app.isBackgroundRestricted } : app
      )
    );
  };

  const filteredApps = apps.filter(app => {
    if (filter === 'high') return app.isHighDrain;
    if (filter === 'background') return app.backgroundTime !== '0m' && !app.category.includes('sistema');
    if (filter === 'system') return app.category === 'sistema';
    return true;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Tv':
        return <Tv className="w-5 h-5 text-emerald-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-rose-400" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-purple-400" />;
      case 'PlaySquare':
        return <PlaySquare className="w-5 h-5 text-red-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-sky-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-emerald-300" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Native Intent Trigger and Stop All Button */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Control de Procesos y Energía
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Detener Aplicaciones de Alto Consumo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Finaliza procesos en segundo plano usando <code className="text-emerald-300 font-mono text-xs">ActivityManager.killBackgroundProcesses()</code> o fuerza el cierre nativo en los Ajustes de Android.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            onClick={handleStopAllBackground}
            className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer"
          >
            <PowerOff className="w-4 h-4" />
            <span>Detener Todas en 2º Plano</span>
          </button>

          <button
            onClick={onAbrirConsumoNativo}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Uso en Android</span>
          </button>
        </div>
      </div>

      {/* Dynamic Energy Saved Alert Banner */}
      {stoppedApps.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-4 animate-in fade-in duration-300 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {stoppedApps.length} {stoppedApps.length === 1 ? 'aplicación detenida' : 'aplicaciones detenidas'}
              </div>
              <div className="text-xs text-emerald-300 mt-0.5">
                Se han liberado ~{savedMah} mAh acumulados · Extensión estimada: +{savedMinutes} min de batería
              </div>
            </div>
          </div>

          <button
            onClick={() => setApps(INITIAL_APP_USAGE)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      )}

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-xs text-slate-400">Mayor Consumidor</div>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>Pantalla (Display)</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">26.4%</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">924 mAh consumidos (hardware)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-xs text-slate-400">Apps con Mayor Gasto en 2º Plano</div>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>TikTok &amp; Instagram</span>
            <span className="text-xs font-mono text-rose-400 font-semibold">32.8%</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">4h 35m acumuladas en segundo plano</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-xs text-slate-400">Estado de Procesos</div>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>{stoppedApps.length} de {apps.filter(a => a.category !== 'sistema').length} detenidas</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            {stoppedApps.length > 0 ? 'Energía recuperada en segundo plano' : 'Procesos activos en memoria'}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({apps.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'high'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mayor Consumo (3)
          </button>
          <button
            onClick={() => setFilter('background')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'background'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Segundo Plano Activo
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'system'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Servicios del Sistema
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Acción:</span>
          <span className="text-slate-300 font-medium">Usa &quot;Detener&quot; o &quot;Forzar Cierre&quot; para apagar apps</span>
        </div>
      </div>

      {/* App List */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800/80 shadow-xl">
        {filteredApps.map(app => {
          const isSelected = selectedApp?.id === app.id;
          const isStoppable = app.category !== 'sistema';

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApp(isSelected ? null : app)}
              className={`p-4 sm:p-5 transition-colors cursor-pointer ${
                app.isStopped
                  ? 'bg-slate-950/70 opacity-80'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* App Identity */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {getIcon(app.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {app.name}
                      </span>
                      {app.isStopped ? (
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Detenida en 2º Plano
                        </span>
                      ) : app.isHighDrain ? (
                        <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Consumo Elevado
                        </span>
                      ) : null}

                      {app.isBackgroundRestricted && !app.isStopped && (
                        <span className="text-[11px] font-medium text-amber-400">
                          Restricción Activa
                        </span>
                      )}
                    </div>

                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="font-mono text-slate-500">{app.packageName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {app.foregroundTime}
                      </span>
                      {app.backgroundTime !== '0m' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className={app.isStopped ? 'line-through text-slate-500' : 'text-amber-400/90'}>
                            {app.backgroundTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Percentage & Progress Bar */}
                <div className="flex items-center gap-5 shrink-0 self-end sm:self-center">
                  <div className="w-28 sm:w-36 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                        {app.isStopped ? (app.percentage * 0.4).toFixed(1) : app.percentage}
                      </span>
                      <span className="text-xs text-slate-400 font-sans">%</span>
                      <span className="text-xs text-slate-500 font-mono tabular-nums ml-1">
                        ({app.isStopped ? Math.round(app.mah * 0.4) : app.mah} mAh)
                      </span>
                    </div>

                    {/* Bar meter */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          app.isStopped
                            ? 'bg-slate-600'
                            : app.percentage > 18
                            ? 'bg-rose-500'
                            : app.percentage > 10
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{
                          width: `${Math.min(100, (app.isStopped ? app.percentage * 0.4 : app.percentage) * 3.5)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions to STOP the app */}
                  <div className="flex items-center gap-2">
                    {isStoppable ? (
                      app.isStopped ? (
                        <button
                          onClick={e => handleRestartApp(app, e)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Restablecer monitoreo"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Reanudar</span>
                        </button>
                      ) : (
                        <button
                          onClick={e => handleStopApp(app, e)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Detener procesos en segundo plano usando killBackgroundProcesses"
                        >
                          <StopCircle className="w-3.5 h-3.5" />
                          <span>Detener</span>
                        </button>
                      )
                    ) : null}

                    {isStoppable && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onForzarDetencionApp(app.packageName);
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                        title="Abrir pantalla para Forzar Detención en Ajustes de Android"
                      >
                        Forzar Cierre
                      </button>
                    )}

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onAbrirDetallesApp(app.packageName);
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Ajustes y permisos de la aplicación"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable recommendations detail */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Consejo:</strong> {app.recommendation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isStoppable && (
                      <button
                        onClick={e => toggleRestrict(app.id, e)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          app.isBackgroundRestricted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {app.isBackgroundRestricted ? 'Restricción Doze: Activa' : 'Activar Restricción Doze'}
                      </button>
                    )}
                    <button
                      onClick={() => onForzarDetencionApp(app.packageName)}
                      className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-medium border border-rose-500/20 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <span>Pantalla Forzar Cierre</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technical Explanation for Android Developers */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white">
            Cómo funciona detener aplicaciones en el código Android nativo
          </div>
          <p>
            En Android existen 2 métodos estándar implementados en tu puente:
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-300">
            <li>
              <strong>1. ActivityManager.killBackgroundProcesses(packageName)</strong>: Libera memoria RAM y detiene servicios en segundo plano sin reiniciar el dispositivo. Requiere el permiso <code className="text-emerald-300 font-mono">android.permission.KILL_BACKGROUND_PROCESSES</code> en el AndroidManifest.
            </li>
            <li>
              <strong>2. Forzar Cierre vía ACTION_APPLICATION_DETAILS_SETTINGS</strong>: Abre la pantalla oficial de la app con el botón nativo de Android <em>&quot;Forzar detención&quot;</em>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
