/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BatteryInfo } from '../types/bridge';
import {
  Battery,
  BatteryCharging,
  Zap,
  SlidersHorizontal,
  Flame,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Moon,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface BatteryDashboardProps {
  battery: BatteryInfo;
  isNativeBridge: boolean;
  onAbrirAjustesBateria: () => void;
  onAbrirConsumoBateria: () => void;
  onAbrirAjustesGenerales: () => void;
  onAbrirOptimizacionDoze: () => void;
  onVerConsumoApps: () => void;
  onSetBatteryLevel: (level: number) => void;
  onToggleCharging: () => void;
  onTogglePowerSaver: () => void;
  isOverridden: boolean;
}

export const BatteryDashboard: React.FC<BatteryDashboardProps> = ({
  battery,
  isNativeBridge,
  onAbrirAjustesBateria,
  onAbrirConsumoBateria,
  onAbrirAjustesGenerales,
  onAbrirOptimizacionDoze,
  onVerConsumoApps,
  onSetBatteryLevel,
  onToggleCharging,
  onTogglePowerSaver,
  isOverridden,
}) => {
  // Determine color theme based on battery state
  const isLow = battery.level <= 20;
  const isMedium = battery.level > 20 && battery.level <= 50;

  const getAccentColor = () => {
    if (battery.charging) return 'text-emerald-400';
    if (isLow) return 'text-rose-400';
    if (isMedium) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStrokeColor = () => {
    if (battery.charging) return '#10b981';
    if (isLow) return '#f43f5e';
    if (isMedium) return '#f59e0b';
    return '#10b981';
  };

  // SVG circle calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (battery.level / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Native Bridge Detection Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isNativeBridge
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                {isNativeBridge ? 'AndroidBridge Conectado' : 'Simulador Android Activo'}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                  isNativeBridge
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {isNativeBridge ? 'Entorno Nativo' : 'Navegador Web'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isNativeBridge
                ? 'Llamadas dirigidas a window.AndroidBridge.abrirAjustesBateria()'
                : 'Simula el comportamiento de MainActivity.kt e intercepta el Intent'}
            </p>
          </div>
        </div>

        {battery.isRealApi && !isOverridden && (
          <div className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Datos reales de batería (Web Battery API)</span>
          </div>
        )}
      </div>

      {/* Hero Battery Gauge Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background circle track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Progress fill */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={getStrokeColor()}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Gauge center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 text-slate-400 mb-1">
                {battery.charging ? (
                  <BatteryCharging className="w-5 h-5 text-emerald-400 animate-pulse" />
                ) : (
                  <Battery className={`w-5 h-5 ${getAccentColor()}`} />
                )}
                <span className="text-xs uppercase tracking-wider font-semibold">
                  {battery.charging ? 'Cargando' : 'Nivel'}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {battery.level}
                <span className="text-xl sm:text-2xl text-slate-400 font-sans font-normal ml-0.5">
                  %
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {battery.powerSaverActive ? 'Ahorro activado' : 'Consumo estándar'}
              </div>
            </div>
          </div>

          {/* Details & Primary CTA */}
          <div className="flex-1 space-y-5 w-full text-center md:text-left">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Control de Energía de Android
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Ahorro de Batería
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Invoca la actividad nativa <code className="text-emerald-300 font-mono text-xs bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">Settings.ACTION_BATTERY_SAVER_SETTINGS</code> mediante el puente JavaScript inyectado en el WebView.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={onAbrirAjustesBateria}
                className="flex-1 min-h-[50px] px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>Abrir Ajustes de Batería</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={onVerConsumoApps}
                className="min-h-[50px] px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 active:scale-[0.98] text-white border border-slate-700 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Apps de Mayor Consumo</span>
              </button>

              <button
                onClick={onTogglePowerSaver}
                className={`min-h-[50px] px-4 py-3 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  battery.powerSaverActive
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title="Alternar simulación de ahorro"
              >
                <Moon className="w-4 h-4" />
                <span>{battery.powerSaverActive ? 'Ahorro: On' : 'Ahorro: Off'}</span>
              </button>
            </div>

            {/* Secondary fallback test buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="text-[11px] uppercase tracking-wider text-slate-500">
                Acciones de Sistema:
              </span>
              <button
                onClick={onAbrirConsumoBateria}
                className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer font-medium"
              >
                Intent ACTION_POWER_USAGE_SUMMARY
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={onAbrirAjustesGenerales}
                className="hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Ajustes Generales (Fallback)
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={onAbrirOptimizacionDoze}
                className="hover:text-white hover:underline transition-colors cursor-pointer"
              >
                Optimización Doze
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salud de Celda</span>
            </div>
            <div className="text-base font-bold text-white mt-1 tabular-nums">
              {battery.health}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Temperatura</span>
            </div>
            <div className="text-base font-bold text-white mt-1 tabular-nums font-mono">
              {battery.temperature} °C
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Voltaje</span>
            </div>
            <div className="text-base font-bold text-white mt-1 tabular-nums font-mono">
              {battery.voltage} V
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Battery className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autonomía Aprox.</span>
            </div>
            <div className="text-base font-bold text-white mt-1 tabular-nums font-mono">
              {battery.charging
                ? 'Cargando rápido'
                : `~${Math.round((battery.level / 100) * 8.5)}h ${Math.round((battery.level % 12) * 5)}m`}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator controls */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Simulador de Telemetría</h3>
            </div>
            {isOverridden && (
              <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Valores forzados manualmente
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ajusta los parámetros para probar cómo responde la interfaz y las advertencias de batería baja en tu WebView.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Nivel de Batería:</span>
              <span className="text-white font-semibold">{battery.level}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={battery.level}
              onChange={e => onSetBatteryLevel(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => onSetBatteryLevel(12)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
              >
                12% Crítica
              </button>
              <button
                onClick={() => onSetBatteryLevel(25)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors"
              >
                25% Baja
              </button>
              <button
                onClick={() => onSetBatteryLevel(75)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                75% Normal
              </button>
              <button
                onClick={() => onSetBatteryLevel(100)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-colors"
              >
                100% Llena
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Estado de Conexión Eléctrica</span>
            <button
              onClick={onToggleCharging}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                battery.charging
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{battery.charging ? 'Desconectar cargador' : 'Conectar cargador'}</span>
            </button>
          </div>
        </div>

        {/* Best practices & Doze guide */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Consejos para Android WebView</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="font-semibold text-white mb-0.5">1. Hilo de Interfaz (UI Thread)</div>
              <p className="text-slate-400">
                Tu código utiliza <code className="text-emerald-300 font-mono">runOnUiThread &#123; ... &#125;</code>. Esto es crucial porque las funciones anotadas con <code className="text-emerald-300 font-mono">@JavascriptInterface</code> se ejecutan en un hilo secundario propio del WebView.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="font-semibold text-white mb-0.5">2. Manejo de Fallback con Try/Catch</div>
              <p className="text-slate-400">
                Excelente práctica implementada: si un fabricante (Xiaomi MIUI, Samsung OneUI, Huawei) renombra la actividad de ahorro, el bloque <code className="text-emerald-300 font-mono">catch</code> abre los Ajustes generales evitando un crash.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="font-semibold text-white mb-0.5">3. WebChromeClient para Depuración</div>
              <p className="text-slate-400">
                Recuerda añadir <code className="text-emerald-300 font-mono">webView.webChromeClient = WebChromeClient()</code> para que los <code className="text-emerald-300 font-mono">console.log()</code> y los diálogos JS funcionen correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
