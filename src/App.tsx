/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useBattery } from './utils/battery';
import { BridgeLog } from './types/bridge';
import { TopBar } from './components/TopBar';
import { BatteryDashboard } from './components/BatteryDashboard';
import { AppBatteryUsage } from './components/AppBatteryUsage';
import { AndroidBridgeInspector } from './components/AndroidBridgeInspector';
import { AndroidStudioGuide } from './components/AndroidStudioGuide';
import { SimulatedSettingsModal } from './components/SimulatedSettingsModal';
import { AndroidToast } from './components/AndroidToast';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { Smartphone, Monitor, Terminal, Battery as BatteryIcon, Code2, BarChart3 } from 'lucide-react';

export default function App() {
  const {
    battery,
    setManualBatteryLevel,
    toggleManualCharging,
    togglePowerSaver,
    isOverridden,
  } = useBattery();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'apps' | 'inspector' | 'guide'>('dashboard');
  const [displayMode, setDisplayMode] = useState<'phone' | 'full'>('full');
  const [phoneInnerTab, setPhoneInnerTab] = useState<'dashboard' | 'apps'>('dashboard');
  const [logs, setLogs] = useState<BridgeLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSimulatedSettingsOpen, setIsSimulatedSettingsOpen] = useState(false);
  const [activeIntentAction, setActiveIntentAction] = useState<string>(
    'android.provider.Settings.ACTION_BATTERY_SAVER_SETTINGS'
  );

  // Check if native AndroidBridge is injected into the window
  const isNativeBridgeDetected =
    typeof window !== 'undefined' &&
    typeof window.AndroidBridge !== 'undefined' &&
    typeof window.AndroidBridge.abrirAjustesBateria === 'function';

  // Helper to trigger Android-style toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3200);
  }, []);

  // Log an event to inspector
  const addLog = useCallback(
    (
      method: string,
      details: string,
      options?: {
        source?: 'native' | 'simulation';
        type?: 'call' | 'response' | 'error' | 'info';
        intentAction?: string;
        success?: boolean;
      }
    ) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const newLog: BridgeLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        method,
        details,
        source: options?.source ?? (isNativeBridgeDetected ? 'native' : 'simulation'),
        type: options?.type ?? 'call',
        intentAction: options?.intentAction,
        success: options?.success ?? true,
      };
      setLogs(prev => [newLog, ...prev.slice(0, 99)]);
    },
    [isNativeBridgeDetected]
  );

  // Initial greeting log
  useEffect(() => {
    if (isNativeBridgeDetected) {
      addLog(
        'window.AndroidBridge',
        'Puente nativo de Android detectado correctamente en el WebView. Métodos listos.',
        { source: 'native', type: 'info', success: true }
      );
    } else {
      addLog(
        'window.AndroidBridge',
        'AndroidBridge no detectado en este navegador. El simulador de Android se encuentra activo.',
        { source: 'simulation', type: 'info', success: true }
      );
    }
  }, [isNativeBridgeDetected, addLog]);

  // PRIMARY ACTION 1: Battery Saver Settings Intent
  const handleAbrirAjustesBateria = useCallback(() => {
    const intentAction = 'android.provider.Settings.ACTION_BATTERY_SAVER_SETTINGS';
    setActiveIntentAction(intentAction);

    if (isNativeBridgeDetected) {
      try {
        addLog(
          'AndroidBridge.abrirAjustesBateria()',
          'Invocando método anotado con @JavascriptInterface en hilo nativo...',
          { source: 'native', type: 'call', intentAction, success: true }
        );
        window.AndroidBridge!.abrirAjustesBateria!();
        addLog(
          'startActivity(Intent(ACTION_BATTERY_SAVER_SETTINGS))',
          'Actividad nativa iniciada en UI Thread.',
          { source: 'native', type: 'response', intentAction, success: true }
        );
        showToast('Abriendo Ajustes de Ahorro de Batería...');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        addLog(
          'AndroidBridge.abrirAjustesBateria()',
          `Error en llamada nativa: ${errorMsg}`,
          { source: 'native', type: 'error', intentAction, success: false }
        );
        showToast('Error al llamar al puente nativo.');
      }
    } else {
      // Browser Simulation Mode
      addLog(
        'AndroidBridge.abrirAjustesBateria()',
        'Simulador: Despachando Intent hacia Settings.ACTION_BATTERY_SAVER_SETTINGS',
        { source: 'simulation', type: 'call', intentAction, success: true }
      );
      showToast('Abriendo Ajustes de Ahorro de Batería...');
      setIsSimulatedSettingsOpen(true);
    }
  }, [isNativeBridgeDetected, addLog, showToast]);

  // PRIMARY ACTION 2: Battery Usage by App Intent (Intent.ACTION_POWER_USAGE_SUMMARY)
  const handleAbrirConsumoBateria = useCallback(() => {
    const intentAction = 'android.content.Intent.ACTION_POWER_USAGE_SUMMARY';
    setActiveIntentAction(intentAction);

    if (isNativeBridgeDetected && typeof window.AndroidBridge?.abrirConsumoBateria === 'function') {
      try {
        addLog(
          'AndroidBridge.abrirConsumoBateria()',
          'Invocando método nativo para abrir pantalla de consumo por aplicación...',
          { source: 'native', type: 'call', intentAction, success: true }
        );
        window.AndroidBridge.abrirConsumoBateria();
        addLog(
          'startActivity(Intent(ACTION_POWER_USAGE_SUMMARY))',
          'Pantalla nativa de consumo por app lanzada con éxito.',
          { source: 'native', type: 'response', intentAction, success: true }
        );
        showToast('Abriendo Uso de Batería por Aplicaciones...');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        addLog('AndroidBridge.abrirConsumoBateria()', `Error: ${errorMsg}`, {
          source: 'native',
          type: 'error',
          intentAction,
          success: false,
        });
        showToast('Error al abrir pantalla de consumo.');
      }
    } else {
      // Browser Simulation Mode
      addLog(
        'AndroidBridge.abrirConsumoBateria()',
        'Simulador: Despachando Intent hacia Intent.ACTION_POWER_USAGE_SUMMARY (Desglose por Apps)',
        { source: 'simulation', type: 'call', intentAction, success: true }
      );
      showToast('Abriendo Uso de Batería por Apps de Android...');
      setIsSimulatedSettingsOpen(true);
    }
  }, [isNativeBridgeDetected, addLog, showToast]);

  // Action: Stop background processes for a single app
  const handleDetenerApp = useCallback(
    (packageName: string, appName: string) => {
      const intentAction = `android.app.ActivityManager.killBackgroundProcesses("${packageName}")`;
      setActiveIntentAction(intentAction);

      if (isNativeBridgeDetected && typeof window.AndroidBridge?.detenerAplicacion === 'function') {
        window.AndroidBridge.detenerAplicacion(packageName);
        addLog(
          `AndroidBridge.detenerAplicacion("${packageName}")`,
          `Llamando a am.killBackgroundProcesses para ${appName}. Procesos secundarios finalizados.`,
          { source: 'native', type: 'call', intentAction, success: true }
        );
        showToast(`Procesos en 2º plano de ${appName} detenidos`);
      } else {
        addLog(
          `AndroidBridge.detenerAplicacion("${packageName}")`,
          `Simulador: am.killBackgroundProcesses("${packageName}"). Memoria RAM liberada y procesos finalizados.`,
          { source: 'simulation', type: 'call', intentAction, success: true }
        );
        showToast(`Proceso de ${appName} detenido en segundo plano`);
      }
    },
    [isNativeBridgeDetected, addLog, showToast]
  );

  // Action: Stop all background applications in batch
  const handleDetenerTodasApps = useCallback(
    (appsToStop: { packageName: string; name: string }[]) => {
      const intentAction = 'android.app.ActivityManager.killBackgroundProcesses(batch)';
      setActiveIntentAction(intentAction);

      if (isNativeBridgeDetected && typeof window.AndroidBridge?.detenerTodasLasApps === 'function') {
        window.AndroidBridge.detenerTodasLasApps();
        addLog(
          'AndroidBridge.detenerTodasLasApps()',
          `Ejecutada detención en lote de ${appsToStop.length} aplicaciones en segundo plano.`,
          { source: 'native', type: 'call', intentAction, success: true }
        );
        showToast(`${appsToStop.length} aplicaciones detenidas. Batería optimizada.`);
      } else {
        addLog(
          'AndroidBridge.detenerTodasLasApps()',
          `Simulador: Detención de ${appsToStop.length} aplicaciones secundarias (TikTok, Instagram, WhatsApp). Se liberaron ~480 mAh.`,
          { source: 'simulation', type: 'call', intentAction, success: true }
        );
        showToast(`${appsToStop.length} apps en segundo plano detenidas. Se recuperaron ~480 mAh.`);
      }
    },
    [isNativeBridgeDetected, addLog, showToast]
  );

  // Action: Force Stop app screen via Settings
  const handleForzarDetencionApp = useCallback(
    (packageName: string) => {
      const intentAction = `android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS (${packageName})`;
      setActiveIntentAction(intentAction);

      if (isNativeBridgeDetected && typeof window.AndroidBridge?.forzarDetencionApp === 'function') {
        window.AndroidBridge.forzarDetencionApp(packageName);
        addLog(
          `AndroidBridge.forzarDetencionApp("${packageName}")`,
          `Abriendo pantalla de ajustes del sistema para Forzar Cierre de ${packageName}`,
          { source: 'native', type: 'call', intentAction, success: true }
        );
        showToast(`Abriendo pantalla de Forzar Cierre para ${packageName}`);
      } else {
        addLog(
          `AndroidBridge.forzarDetencionApp("${packageName}")`,
          `Simulador: Abriendo pantalla de detalles con botón "Forzar Detención" para ${packageName}`,
          { source: 'simulation', type: 'call', intentAction, success: true }
        );
        showToast(`Abriendo pantalla para Forzar Cierre de ${packageName}`);
        setIsSimulatedSettingsOpen(true);
      }
    },
    [isNativeBridgeDetected, addLog, showToast]
  );

  // Action: Open app specific details settings
  const handleAbrirDetallesApp = useCallback(
    (packageName: string) => {
      handleForzarDetencionApp(packageName);
    },
    [handleForzarDetencionApp]
  );

  // Secondary Action: Fallback general settings (matches catch block in Kotlin)
  const handleAbrirAjustesGenerales = useCallback(() => {
    const intentAction = 'android.provider.Settings.ACTION_SETTINGS';
    setActiveIntentAction(intentAction);

    addLog(
      'Settings.ACTION_SETTINGS',
      'Ejecutando fallback de excepción: Abriendo pantalla de Ajustes Generales de Android.',
      {
        source: isNativeBridgeDetected ? 'native' : 'simulation',
        type: 'info',
        intentAction,
        success: true,
      }
    );
    showToast('No se pudo abrir la pantalla específica, abriendo Ajustes...');
    setIsSimulatedSettingsOpen(true);
  }, [isNativeBridgeDetected, addLog, showToast]);

  // Secondary Action: Ignore battery optimization
  const handleAbrirOptimizacionDoze = useCallback(() => {
    const intentAction = 'android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS';
    setActiveIntentAction(intentAction);

    addLog(
      'Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
      'Solicitando lista de optimizaciones de batería en segundo plano (Doze Mode).',
      {
        source: isNativeBridgeDetected ? 'native' : 'simulation',
        type: 'info',
        intentAction,
        success: true,
      }
    );
    showToast('Abriendo optimizaciones en segundo plano...');
    setIsSimulatedSettingsOpen(true);
  }, [isNativeBridgeDetected, addLog, showToast]);

  // Trigger test intent from inspector
  const handleTriggerTestIntent = (action: string, method: string) => {
    setActiveIntentAction(action);
    addLog(method, `Disparo de prueba manual para: ${action}`, {
      source: 'simulation',
      type: 'call',
      intentAction: action,
      success: true,
    });
    showToast(`Ejecutando: ${action.split('.').pop()}`);
    setIsSimulatedSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar complying with Top Bar Contract */}
      <TopBar
        activeView={activeTab}
        onSelectView={view => setActiveTab(view)}
        onOpenExport={() => setActiveTab('guide')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Workspace Sub-Bar: View Toggle & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Optimizador de Batería con Android WebView
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Puente bidireccional JavaScript &lt;-&gt; Android nativo (<code className="text-emerald-400 font-mono">AndroidBridge.abrirAjustesBateria</code> y <code className="text-emerald-400 font-mono">abrirConsumoBateria</code>)
            </p>
          </div>

          {/* View Mode Switcher (Phone Frame vs Expanded View) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setDisplayMode('full')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'full'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Vista Expandida</span>
            </button>
            <button
              onClick={() => setDisplayMode('phone')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'phone'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Marco Móvil</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Content */}
        {displayMode === 'phone' ? (
          /* Phone Emulation View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex justify-center">
              <AndroidPhoneFrame
                batteryLevel={battery.level}
                isCharging={battery.charging}
                onRefresh={() => {
                  showToast('WebView recargado');
                  addLog('WebView.reload()', 'Página recargada dentro del frame móvil.', {
                    source: 'simulation',
                    type: 'info',
                    success: true,
                  });
                }}
              >
                <div className="space-y-4">
                  {/* Phone sub-tabs */}
                  <div className="grid grid-cols-2 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                    <button
                      onClick={() => setPhoneInnerTab('dashboard')}
                      className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        phoneInnerTab === 'dashboard'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Batería
                    </button>
                    <button
                      onClick={() => setPhoneInnerTab('apps')}
                      className={`py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        phoneInnerTab === 'apps'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Apps
                    </button>
                  </div>

                  {phoneInnerTab === 'dashboard' ? (
                    <div className="space-y-4">
                      {/* Battery display */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                        <div className="text-3xl font-bold font-mono text-white tabular-nums">
                          {battery.level}%
                        </div>
                        <div className="text-xs text-emerald-400 font-medium">
                          {battery.charging ? 'Cargando dispositivo' : 'Consumo normal'}
                        </div>
                      </div>

                      {/* Primary Trigger */}
                      <button
                        onClick={handleAbrirAjustesBateria}
                        className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BatteryIcon className="w-4 h-4 fill-current" />
                        Abrir Ajustes de Batería
                      </button>

                      {/* Second Trigger: Open App Consumption */}
                      <button
                        onClick={handleAbrirConsumoBateria}
                        className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white border border-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BarChart3 className="w-4 h-4 text-emerald-400" />
                        Ver Apps que Más Consumen
                      </button>

                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                        Ejecuta <code className="text-emerald-400 font-mono">AndroidBridge.abrirAjustesBateria()</code> y <code className="text-emerald-400 font-mono">AndroidBridge.abrirConsumoBateria()</code>.
                      </div>
                    </div>
                  ) : (
                    <AppBatteryUsage
                      onAbrirConsumoNativo={handleAbrirConsumoBateria}
                      onAbrirDetallesApp={handleAbrirDetallesApp}
                      onDetenerApp={handleDetenerApp}
                      onDetenerTodas={handleDetenerTodasApps}
                      onForzarDetencionApp={handleForzarDetencionApp}
                      isNativeBridge={isNativeBridgeDetected}
                    />
                  )}
                </div>
              </AndroidPhoneFrame>
            </div>

            {/* Side Console for Phone Mode */}
            <div className="lg:col-span-6 space-y-6">
              <AndroidBridgeInspector
                logs={logs}
                onClearLogs={() => setLogs([])}
                onTriggerTestIntent={handleTriggerTestIntent}
                isNativeBridgeDetected={isNativeBridgeDetected}
              />
              <AndroidStudioGuide />
            </div>
          </div>
        ) : (
          /* Expanded Full View */
          <div className="space-y-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <BatteryDashboard
                  battery={battery}
                  isNativeBridge={isNativeBridgeDetected}
                  onAbrirAjustesBateria={handleAbrirAjustesBateria}
                  onAbrirConsumoBateria={handleAbrirConsumoBateria}
                  onAbrirAjustesGenerales={handleAbrirAjustesGenerales}
                  onAbrirOptimizacionDoze={handleAbrirOptimizacionDoze}
                  onVerConsumoApps={() => setActiveTab('apps')}
                  onSetBatteryLevel={setManualBatteryLevel}
                  onToggleCharging={toggleManualCharging}
                  onTogglePowerSaver={togglePowerSaver}
                  isOverridden={isOverridden}
                />

                {/* Direct preview of the Top Apps within the main dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Top Apps con Mayor Consumo</h3>
                    <button
                      onClick={() => setActiveTab('apps')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                    >
                      Ver diagnóstico completo &rarr;
                    </button>
                  </div>
                  <AppBatteryUsage
                    onAbrirConsumoNativo={handleAbrirConsumoBateria}
                    onAbrirDetallesApp={handleAbrirDetallesApp}
                    onDetenerApp={handleDetenerApp}
                    onDetenerTodas={handleDetenerTodasApps}
                    onForzarDetencionApp={handleForzarDetencionApp}
                    isNativeBridge={isNativeBridgeDetected}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6">
                    <AndroidBridgeInspector
                      logs={logs}
                      onClearLogs={() => setLogs([])}
                      onTriggerTestIntent={handleTriggerTestIntent}
                      isNativeBridgeDetected={isNativeBridgeDetected}
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <AndroidStudioGuide />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'apps' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <AppBatteryUsage
                  onAbrirConsumoNativo={handleAbrirConsumoBateria}
                  onAbrirDetallesApp={handleAbrirDetallesApp}
                  onDetenerApp={handleDetenerApp}
                  onDetenerTodas={handleDetenerTodasApps}
                  onForzarDetencionApp={handleForzarDetencionApp}
                  isNativeBridge={isNativeBridgeDetected}
                />
              </div>
            )}

            {activeTab === 'inspector' && (
              <div className="max-w-4xl mx-auto">
                <AndroidBridgeInspector
                  logs={logs}
                  onClearLogs={() => setLogs([])}
                  onTriggerTestIntent={handleTriggerTestIntent}
                  isNativeBridgeDetected={isNativeBridgeDetected}
                />
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="max-w-4xl mx-auto">
                <AndroidStudioGuide />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Simulated Android Battery Saver & App Usage Settings Screen Modal */}
      <SimulatedSettingsModal
        isOpen={isSimulatedSettingsOpen}
        onClose={() => setIsSimulatedSettingsOpen(false)}
        batteryLevel={battery.level}
        isCharging={battery.charging}
        powerSaverActive={battery.powerSaverActive}
        onTogglePowerSaver={togglePowerSaver}
        intentAction={activeIntentAction}
      />

      {/* Android Toast Notification */}
      <AndroidToast message={toastMessage} visible={isToastVisible} />

      {/* Mobile Bottom Thumb Bar (under 15% viewport height) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 grid grid-cols-4 items-center h-14 pb-safe">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BatteryIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Batería</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
            activeTab === 'apps' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Apps</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
            activeTab === 'inspector' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Consola</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer ${
            activeTab === 'guide' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Código</span>
        </button>
      </div>
    </div>
  );
}
