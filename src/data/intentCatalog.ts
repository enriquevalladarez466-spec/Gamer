/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AndroidIntentItem } from '../types/bridge';

export const INTENT_CATALOG: AndroidIntentItem[] = [
  {
    id: 'battery-saver',
    name: 'Ahorro de Batería (Battery Saver)',
    description: 'Abre la pantalla oficial de Android para activar el Ahorro de batería y configurar la programación automática.',
    intentAction: 'android.provider.Settings.ACTION_BATTERY_SAVER_SETTINGS',
    methodName: 'abrirAjustesBateria()',
    category: 'bateria',
    isImplementedInUserCode: true,
    kotlinCode: `val intent = Intent(Settings.ACTION_BATTERY_SAVER_SETTINGS)
startActivity(intent)`,
  },
  {
    id: 'battery-usage-summary',
    name: 'Uso de Batería por Aplicaciones',
    description: 'Muestra el gráfico de consumo de energía, porcentaje gastado por la pantalla y aplicaciones en segundo plano.',
    intentAction: 'android.content.Intent.ACTION_POWER_USAGE_SUMMARY',
    methodName: 'abrirConsumoBateria()',
    category: 'bateria',
    isImplementedInUserCode: false,
    kotlinCode: `val intent = Intent(Intent.ACTION_POWER_USAGE_SUMMARY)
startActivity(intent)`,
  },
  {
    id: 'ignore-battery-opt',
    name: 'Lista de Optimización de Batería (Doze)',
    description: 'Permite al usuario desactivar la optimización de batería agresiva para que la aplicación no sea cerrada en segundo plano.',
    intentAction: 'android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS',
    methodName: 'abrirOptimizacionBateriaApp()',
    category: 'bateria',
    isImplementedInUserCode: false,
    kotlinCode: `val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
startActivity(intent)`,
  },
  {
    id: 'app-details',
    name: 'Información de la Aplicación',
    description: 'Abre los ajustes específicos de esta app para gestionar permisos, almacenamiento y restricciones de segundo plano.',
    intentAction: 'android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS',
    methodName: 'abrirDetallesApp()',
    category: 'aplicacion',
    isImplementedInUserCode: false,
    kotlinCode: `val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
    data = android.net.Uri.fromParts("package", packageName, null)
}
startActivity(intent)`,
  },
  {
    id: 'kill-background-processes',
    name: 'Detener Procesos en Segundo Plano',
    description: 'Invoca ActivityManager.killBackgroundProcesses() para liberar memoria RAM y detener procesos activos en segundo plano.',
    intentAction: 'android.app.ActivityManager.killBackgroundProcesses(packageName)',
    methodName: 'detenerAplicacion(packageName)',
    category: 'aplicacion',
    isImplementedInUserCode: true,
    kotlinCode: `val am = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
am.killBackgroundProcesses(packageName)
Toast.makeText(this, "Proceso en segundo plano detenido", Toast.LENGTH_SHORT).show()`,
  },
  {
    id: 'force-stop-intent',
    name: 'Forzar Cierre Completo de App',
    description: 'Abre la pantalla de ajustes de la app para que el usuario presione el botón nativo Forzar detención.',
    intentAction: 'android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS',
    methodName: 'forzarDetencionApp(packageName)',
    category: 'aplicacion',
    isImplementedInUserCode: true,
    kotlinCode: `val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
    data = Uri.fromParts("package", packageName, null)
}
startActivity(intent)`,
  },
  {
    id: 'general-settings',
    name: 'Ajustes Generales del Sistema',
    description: 'Fallback implementado en tu código cuando el dispositivo o fabricante no expone la pantalla de batería.',
    intentAction: 'android.provider.Settings.ACTION_SETTINGS',
    methodName: 'abrirAjustesGenerales()',
    category: 'sistema',
    isImplementedInUserCode: true,
    kotlinCode: `// Utilizado en el bloque catch como respaldo:
val intent = Intent(Settings.ACTION_SETTINGS)
startActivity(intent)`,
  },
];
