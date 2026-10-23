/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, BatteryCharging, Zap, ShieldCheck, Clock, Sliders, Check, Tv, Video, Camera, PlaySquare, MessageSquare, Cpu, BarChart3 } from 'lucide-react';
import { INITIAL_APP_USAGE } from '../data/appUsageData';

interface SimulatedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batteryLevel: number;
  isCharging: boolean;
  powerSaverActive: boolean;
  onTogglePowerSaver: () => void;
  intentAction: string;
}

export const SimulatedSettingsModal: React.FC<SimulatedSettingsModalProps> = ({
  isOpen,
  onClose,
  batteryLevel,
  isCharging,
  powerSaverActive,
  onTogglePowerSaver,
  intentAction,
}) => {
  const [adaptiveBattery, setAdaptiveBattery] = useState(true);
  const [scheduleMode, setScheduleMode] = useState<'none' | 'percentage' | 'routine'>('percentage');

  // If intent was for usage summary, default view tab to usage
  const isUsageIntent = intentAction.includes('ACTION_POWER_USAGE_SUMMARY');
  const [activeTab, setActiveTab] = useState<'saver' | 'usage'>(isUsageIntent ? 'usage' : 'saver');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Android Top System Bar Emulation */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 bg-slate-950/60 select-none">
          <span>12:45</span>
          <div className="flex items-center gap-2">
            <span>5G</span>
            <span className="tabular-nums">{batteryLevel}%</span>
          </div>
        </div>

        {/* Settings Header */}
        <div className="px-5 py-3 flex items-center gap-3 border-b border-slate-800 bg-slate-900">
          <button
            onClick={onClose}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Cerrar ajustes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white truncate">
              {activeTab === 'usage' ? 'Uso de la batería' : 'Ahorro de batería'}
            </h2>
            <div className="text-[11px] text-emerald-400 font-mono truncate">
              {intentAction}
            </div>
          </div>
        </div>

        {/* Sub-Tabs inside Android Settings */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('usage')}
            className={`py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'usage'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consumo por App</span>
          </button>
          <button
            onClick={() => setActiveTab('saver')}
            className={`py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'saver'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Ahorro de Energía</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {activeTab === 'usage' ? (
            /* Android Battery Usage Breakdown Screen */
            <div className="space-y-4">
              {/* Battery Chart Representation */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">Uso desde última carga completa</div>
                  <div className="text-xs font-mono text-emerald-400">Hace 6h 20m</div>
                </div>
                {/* SVG Graph Emulation */}
                <div className="h-20 w-full mt-3 flex items-end gap-1.5 pt-2">
                  {[100, 96, 92, 88, 85, 80, 78, 72, 65, 58, 52, 45, 40].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-emerald-500/30 hover:bg-emerald-400 rounded-t transition-all"
                        style={{ height: `${val * 0.7}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                  <span>100% (6:00 AM)</span>
                  <span>{batteryLevel}% (Ahora)</span>
                </div>
              </div>

              {/* List of top consuming applications in Android Settings */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Uso de la batería por aplicación
                </div>

                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 divide-y divide-slate-800">
                  {INITIAL_APP_USAGE.map(app => (
                    <div key={app.id} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-slate-300">
                          {app.iconName === 'Tv' && <Tv className="w-4 h-4 text-emerald-400" />}
                          {app.iconName === 'Video' && <Video className="w-4 h-4 text-rose-400" />}
                          {app.iconName === 'Camera' && <Camera className="w-4 h-4 text-purple-400" />}
                          {app.iconName === 'PlaySquare' && <PlaySquare className="w-4 h-4 text-red-500" />}
                          {app.iconName === 'MessageSquare' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                          {app.iconName === 'Cpu' && <Cpu className="w-4 h-4 text-sky-400" />}
                          {app.iconName === 'Globe' && <Cpu className="w-4 h-4 text-blue-400" />}
                          {app.iconName === 'Music' && <Cpu className="w-4 h-4 text-emerald-300" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white text-xs truncate">
                            {app.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {app.foregroundTime}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-white text-xs tabular-nums">
                          {app.percentage}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {app.mah} mAh
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Battery Saver Screen */
            <div className="space-y-5">
              {/* Hero Switch Card */}
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/50 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-semibold text-white">Usar Ahorro de batería</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reduce el rendimiento, las actividades en segundo plano y las animaciones para que la batería dure más.
                  </p>
                </div>
                <button
                  onClick={onTogglePowerSaver}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    powerSaverActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      powerSaverActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Current battery status notice */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  {isCharging ? <BatteryCharging className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400">Estado actual del dispositivo</div>
                  <div className="text-sm font-semibold text-white">
                    {batteryLevel}% · {isCharging ? 'Cargando dispositivo' : powerSaverActive ? 'Modo ahorro activo' : 'Consumo normal'}
                  </div>
                </div>
              </div>

              {/* Schedule settings */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Programación
                </div>
                <div className="rounded-2xl bg-slate-800/40 border border-slate-800 divide-y divide-slate-800">
                  <button
                    onClick={() => setScheduleMode('percentage')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        Activar según el porcentaje
                      </div>
                      <div className="text-xs text-slate-400">Se activa automáticamente al alcanzar el 20%</div>
                    </div>
                    {scheduleMode === 'percentage' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  <button
                    onClick={() => setScheduleMode('routine')}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-slate-400" />
                        Activar según tus rutinas
                      </div>
                      <div className="text-xs text-slate-400">Aprende tus hábitos de carga y optimiza el consumo</div>
                    </div>
                    {scheduleMode === 'routine' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                </div>
              </div>

              {/* Adaptive Battery toggle */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Optimización Inteligente
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Batería Adaptativa
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Limita la energía consumida por las apps que casi nunca abres.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdaptiveBattery(!adaptiveBattery)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      adaptiveBattery ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        adaptiveBattery ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Simulador de Intent nativo de Android
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all"
          >
            Volver a la App
          </button>
        </div>
      </div>
    </div>
  );
};
