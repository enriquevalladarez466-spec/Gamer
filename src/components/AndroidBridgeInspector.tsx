/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BridgeLog } from '../types/bridge';
import { Terminal, Trash2, Copy, Check, Play, AlertTriangle, Cpu, Radio } from 'lucide-react';

interface AndroidBridgeInspectorProps {
  logs: BridgeLog[];
  onClearLogs: () => void;
  onTriggerTestIntent: (action: string, method: string) => void;
  isNativeBridgeDetected: boolean;
}

export const AndroidBridgeInspector: React.FC<AndroidBridgeInspectorProps> = ({
  logs,
  onClearLogs,
  onTriggerTestIntent,
  isNativeBridgeDetected,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLogs = () => {
    const text = logs
      .map(
        l =>
          `[${l.timestamp}] [${l.source.toUpperCase()}] ${l.method} -> ${l.intentAction || 'N/A'}: ${l.details}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Consola del Puente JavaScript</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${isNativeBridgeDetected ? 'text-emerald-400' : 'text-amber-400'}`} />
                {isNativeBridgeDetected ? 'AndroidBridge Conectado' : 'Modo Simulador'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{logs.length} eventos registrados</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Copiar historial de eventos"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors"
            title="Limpiar consola"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Trigger Bar for Testing Intents */}
      <div className="py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 text-[11px] uppercase tracking-wider shrink-0 font-medium">
          Probar Métodos:
        </span>
        <button
          onClick={() =>
            onTriggerTestIntent(
              'android.provider.Settings.ACTION_BATTERY_SAVER_SETTINGS',
              'AndroidBridge.abrirAjustesBateria()'
            )
          }
          className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 shrink-0 transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          abrirAjustesBateria()
        </button>
        <button
          onClick={() =>
            onTriggerTestIntent(
              'android.provider.Settings.ACTION_SETTINGS',
              'AndroidBridge (Catch Fallback: ACTION_SETTINGS)'
            )
          }
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors flex items-center gap-1"
        >
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Simular Fallback Error
        </button>
        <button
          onClick={() =>
            onTriggerTestIntent(
              'android.content.Intent.ACTION_POWER_USAGE_SUMMARY',
              'AndroidBridge.abrirConsumoBateria()'
            )
          }
          className="px-2.5 py-1 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 shrink-0 transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          abrirConsumoBateria()
        </button>
        <button
          onClick={() =>
            onTriggerTestIntent(
              'android.app.ActivityManager.killBackgroundProcesses("com.zhiliaoapp.musically")',
              'AndroidBridge.detenerAplicacion("com.zhiliaoapp.musically")'
            )
          }
          className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 shrink-0 transition-colors flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          detenerAplicacion()
        </button>
        <button
          onClick={() =>
            onTriggerTestIntent(
              'android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
              'AndroidBridge.abrirOptimizacionBateriaApp()'
            )
          }
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition-colors flex items-center gap-1"
        >
          <Cpu className="w-3 h-3 text-sky-400" />
          Optimizador Doze
        </button>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2 font-mono text-xs max-h-72">
        {logs.length === 0 ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-slate-500 text-center p-4">
            <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-sans font-medium text-slate-400">Sin llamadas recientes</p>
            <p className="text-xs font-sans text-slate-500 max-w-xs mt-1">
              Presiona el botón &quot;Abrir Ajustes de Batería&quot; en la interfaz para ver la ejecución del puente en tiempo real.
            </p>
          </div>
        ) : (
          logs.map(log => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border transition-all ${
                log.type === 'error'
                  ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                  : log.source === 'native'
                  ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.type === 'error'
                        ? 'bg-rose-500'
                        : log.source === 'native'
                        ? 'bg-emerald-400'
                        : 'bg-sky-400'
                    }`}
                  />
                  {log.method}
                </span>
                <span className="text-[11px] text-slate-500 tabular-nums">{log.timestamp}</span>
              </div>
              <div className="text-xs text-slate-400 break-words leading-relaxed">
                {log.details}
              </div>
              {log.intentAction && (
                <div className="mt-1.5 text-[11px] text-emerald-400/90 font-medium">
                  Intent: {log.intentAction}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
