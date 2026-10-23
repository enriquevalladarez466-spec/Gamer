/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    AndroidBridge?: {
      abrirAjustesBateria?: () => void;
      abrirConsumoBateria?: () => void;
      abrirAjustesGenerales?: () => void;
      abrirOptimizacionBateriaApp?: () => void;
      abrirDetallesApp?: (packageName?: string) => void;
      detenerAplicacion?: (packageName: string) => void;
      detenerTodasLasApps?: () => void;
      forzarDetencionApp?: (packageName: string) => void;
      mostrarToast?: (mensaje: string) => void;
      obtenerNivelBateriaNativo?: () => number;
      [key: string]: unknown;
    };
  }
}

export interface AppBatteryUsageItem {
  id: string;
  name: string;
  packageName: string;
  category: 'social' | 'multimedia' | 'sistema' | 'juegos' | 'herramientas';
  percentage: number; // e.g. 24.5%
  mah: number; // e.g. 780 mAh
  foregroundTime: string; // e.g. "1h 45m"
  backgroundTime: string; // e.g. "3h 12m"
  isHighDrain: boolean;
  isBackgroundRestricted: boolean;
  isStopped?: boolean;
  recommendation: string;
  iconName: string;
}



export interface BatteryInfo {
  level: number; // 0 to 100
  charging: boolean;
  chargingTime: number; // seconds or Infinity
  dischargingTime: number; // seconds or Infinity
  temperature: number; // in Celsius e.g. 31.4°C
  health: 'Buena' | 'Sobrecalentada' | 'Degradada' | 'Normal';
  voltage: number; // e.g. 4.1V
  isRealApi: boolean;
  powerSaverActive: boolean;
}

export interface BridgeLog {
  id: string;
  timestamp: string;
  method: string;
  type: 'call' | 'response' | 'error' | 'info';
  source: 'native' | 'simulation';
  intentAction?: string;
  details: string;
  success: boolean;
}

export interface AndroidIntentItem {
  id: string;
  name: string;
  description: string;
  intentAction: string;
  methodName: string;
  category: 'bateria' | 'sistema' | 'aplicacion';
  kotlinCode: string;
  isImplementedInUserCode: boolean;
}
