/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getStandaloneHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Optimizador de Batería Android</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --accent: #10b981;
      --accent-hover: #059669;
      --danger: #f43f5e;
      --danger-hover: #e11d48;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.08);
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-family);
      padding: 24px 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .container {
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .header {
      margin-bottom: 20px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #f59e0b;
    }

    .status-dot.active {
      background-color: #10b981;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin-bottom: 6px;
    }

    p.subtitle {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .battery-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 16px;
      text-align: center;
    }

    .battery-gauge {
      font-size: 52px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin: 8px 0 2px 0;
      display: flex;
      align-items: baseline;
      justify-content: center;
    }

    .battery-gauge span {
      font-size: 22px;
      color: var(--text-muted);
      font-weight: 500;
      margin-left: 2px;
    }

    .battery-state {
      font-size: 13px;
      color: var(--accent);
      font-weight: 500;
      margin-bottom: 8px;
    }

    /* Apps drain card with stop button */
    .apps-drain-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 18px;
      margin-bottom: 18px;
    }

    .card-title {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .app-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 13px;
    }

    .app-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .app-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .app-name {
      font-weight: 600;
      color: #ffffff;
    }

    .app-desc {
      font-size: 11px;
      color: var(--text-muted);
    }

    .app-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-percent {
      font-family: monospace;
      font-weight: 700;
      font-size: 13px;
      color: var(--danger);
    }

    .btn-stop-mini {
      background: rgba(244, 63, 94, 0.15);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-stop-mini.stopped {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.3);
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .danger-btn {
      width: 100%;
      height: 48px;
      background: var(--danger);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s ease, transform 0.05s ease;
      box-shadow: 0 4px 14px rgba(244, 63, 94, 0.25);
    }

    .primary-btn {
      width: 100%;
      height: 48px;
      background: var(--accent);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s ease, transform 0.05s ease;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
    }

    .secondary-btn {
      width: 100%;
      height: 44px;
      background: rgba(255, 255, 255, 0.06);
      color: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.15s ease;
    }

    .danger-btn:active, .primary-btn:active, .secondary-btn:active {
      transform: scale(0.98);
    }

    .log-box {
      margin-top: 14px;
      font-size: 11px;
      font-family: monospace;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="status-badge">
        <span id="bridgeDot" class="status-dot"></span>
        <span id="bridgeStatusText">Detectando puente AndroidBridge...</span>
      </div>
      <h1>Gestión y Cierre de Apps</h1>
      <p class="subtitle">Detén procesos que consumen batería en segundo plano mediante el puente nativo.</p>
    </div>

    <div class="battery-card">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
        Nivel Estimado
      </div>
      <div class="battery-gauge" id="batteryLevelDisplay">
        78<span>%</span>
      </div>
      <div class="battery-state" id="batteryStatusDesc">
        Listo para optimizar consumo
      </div>
    </div>

    <!-- Mayor Consumo Card con opción para detener -->
    <div class="apps-drain-card">
      <div class="card-title">
        <span>Apps con Mayor Gasto</span>
        <span style="color: #f43f5e; font-size: 11px; text-transform: none;">Top 2º Plano</span>
      </div>
      
      <div class="app-row">
        <div class="app-info">
          <span class="app-name">TikTok</span>
          <span class="app-desc">com.zhiliaoapp.musically · 2h 45m en 2º plano</span>
        </div>
        <div class="app-actions">
          <span class="app-percent">18.2%</span>
          <button class="btn-stop-mini" id="btnStopTikTok" onclick="ejecutarDetenerApp('com.zhiliaoapp.musically', 'TikTok', this)">
            Detener
          </button>
        </div>
      </div>

      <div class="app-row">
        <div class="app-info">
          <span class="app-name">Instagram</span>
          <span class="app-desc">com.instagram.android · 1h 50m en 2º plano</span>
        </div>
        <div class="app-actions">
          <span class="app-percent">14.6%</span>
          <button class="btn-stop-mini" id="btnStopInstagram" onclick="ejecutarDetenerApp('com.instagram.android', 'Instagram', this)">
            Detener
          </button>
        </div>
      </div>

      <div class="app-row">
        <div class="app-info">
          <span class="app-name">WhatsApp</span>
          <span class="app-desc">com.whatsapp · 3h 10m en 2º plano</span>
        </div>
        <div class="app-actions">
          <span class="app-percent" style="color: #eab308;">9.5%</span>
          <button class="btn-stop-mini" id="btnStopWhatsApp" onclick="ejecutarDetenerApp('com.whatsapp', 'WhatsApp', this)">
            Detener
          </button>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <button class="danger-btn" id="btnDetenerTodas" onclick="ejecutarDetenerTodas()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
          <line x1="12" y1="2" x2="12" y2="12"/>
        </svg>
        Detener Todas en Segundo Plano
      </button>

      <button class="primary-btn" id="btnAjustes" onclick="ejecutarAbrirAjustes()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="16" height="10" x="2" y="7" rx="2" ry="2"/>
          <line x1="22" x2="22" y1="11" y2="13"/>
        </svg>
        Abrir Ahorro de Batería
      </button>

      <button class="secondary-btn" id="btnConsumo" onclick="ejecutarAbrirConsumo()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Ver Consumo en Ajustes de Android
      </button>
    </div>

    <div class="log-box" id="logBox">
      Esperando acción del usuario...
    </div>
  </div>

  <script>
    function verificarPuente() {
      const dot = document.getElementById('bridgeDot');
      const text = document.getElementById('bridgeStatusText');

      if (window.AndroidBridge && typeof window.AndroidBridge.abrirAjustesBateria === 'function') {
        dot.classList.add('active');
        text.innerText = 'Puente AndroidBridge: Conectado';
        logMsg('Puente nativo disponible');
      } else {
        dot.classList.remove('active');
        text.innerText = 'Navegador estándar (AndroidBridge ausente)';
        logMsg('Modo navegador: simulador activo');
      }
    }

    // Detener app específica
    function ejecutarDetenerApp(packageName, appName, btnElement) {
      logMsg('Deteniendo procesos de: ' + appName + ' (' + packageName + ')...');

      if (window.AndroidBridge && typeof window.AndroidBridge.detenerAplicacion === 'function') {
        try {
          window.AndroidBridge.detenerAplicacion(packageName);
          btnElement.innerText = 'Detenida';
          btnElement.classList.add('stopped');
          logMsg('Proceso de ' + appName + ' detenido.');
        } catch (error) {
          logMsg('Error: ' + error.message);
        }
      } else {
        btnElement.innerText = 'Detenida';
        btnElement.classList.add('stopped');
        logMsg('Simulado: killBackgroundProcesses("' + packageName + '")');
        alert('Simulación: Se han finalizado los procesos en segundo plano de ' + appName + '.');
      }
    }

    // Detener todas las apps en 2º plano
    function ejecutarDetenerTodas() {
      logMsg('Deteniendo todas las aplicaciones en segundo plano...');

      if (window.AndroidBridge && typeof window.AndroidBridge.detenerTodasLasApps === 'function') {
        try {
          window.AndroidBridge.detenerTodasLasApps();
          document.querySelectorAll('.btn-stop-mini').forEach(b => {
            b.innerText = 'Detenida';
            b.classList.add('stopped');
          });
          logMsg('Todas las apps en 2º plano han sido detenidas.');
        } catch (error) {
          logMsg('Error: ' + error.message);
        }
      } else {
        document.querySelectorAll('.btn-stop-mini').forEach(b => {
          b.innerText = 'Detenida';
          b.classList.add('stopped');
        });
        logMsg('Simulado: killBackgroundProcesses en lote ejecutado.');
        alert('Simulación: Se han detenido todas las aplicaciones secundarias. Se recuperaron ~480 mAh.');
      }
    }

    function ejecutarAbrirAjustes() {
      if (window.AndroidBridge && typeof window.AndroidBridge.abrirAjustesBateria === 'function') {
        window.AndroidBridge.abrirAjustesBateria();
      } else {
        alert('Abriendo Ahorro de Batería');
      }
    }

    function ejecutarAbrirConsumo() {
      if (window.AndroidBridge && typeof window.AndroidBridge.abrirConsumoBateria === 'function') {
        window.AndroidBridge.abrirConsumoBateria();
      } else {
        alert('Abriendo Uso de Batería de Android');
      }
    }

    function logMsg(msg) {
      const box = document.getElementById('logBox');
      const time = new Date().toLocaleTimeString();
      box.innerText = '[' + time + '] ' + msg;
    }

    window.addEventListener('DOMContentLoaded', () => {
      verificarPuente();
    });
  </script>
</body>
</html>`;
}

export function getFullKotlinCode(): string {
  return `package com.example.webviewbridge

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)
        
        // 1. Habilitar JavaScript (necesario para el puente)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        
        // Permitir depuración remota desde Chrome (chrome://inspect) en desarrollo
        WebView.setWebContentsDebuggingEnabled(true)
        
        // 2. Añadir el puente de JavaScript
        // "AndroidBridge" será el nombre del objeto accesible en window.AndroidBridge
        webView.addJavascriptInterface(WebAppInterface(), "AndroidBridge")
        
        // 3. Manejar navegación y alertas JS con WebChromeClient
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()
        
        // 4. Cargar el HTML local desde assets
        // Asegúrate de que el archivo esté en: app/src/main/assets/mi_pagina.html
        webView.loadUrl("file:///android_asset/mi_pagina.html")
    }

    // Permitir botón "Atrás" en WebView en vez de cerrar la app inmediatamente
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    // Clase interna que actúa como puente bidireccional
    inner class WebAppInterface {
        
        // 1. Abrir pantalla nativa de Ahorro de Batería
        @JavascriptInterface
        fun abrirAjustesBateria() {
            runOnUiThread {
                try {
                    val intent = Intent(Settings.ACTION_BATTERY_SAVER_SETTINGS)
                    startActivity(intent)
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "No se pudo abrir la pantalla específica, abriendo Ajustes...", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                }
            }
        }

        // 2. Abrir pantalla nativa de Uso de Batería por Aplicaciones (Consumo por app)
        @JavascriptInterface
        fun abrirConsumoBateria() {
            runOnUiThread {
                try {
                    val intent = Intent(Intent.ACTION_POWER_USAGE_SUMMARY)
                    startActivity(intent)
                } catch (e: Exception) {
                    startActivity(Intent(Settings.ACTION_BATTERY_SAVER_SETTINGS))
                }
            }
        }

        // 3. NUEVO: Detener procesos en segundo plano de una aplicación específica
        @JavascriptInterface
        fun detenerAplicacion(packageName: String) {
            runOnUiThread {
                try {
                    val am = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
                    // Requiere el permiso android.permission.KILL_BACKGROUND_PROCESSES
                    am.killBackgroundProcesses(packageName)
                    Toast.makeText(this@MainActivity, "Procesos en 2º plano de $packageName detenidos", Toast.LENGTH_SHORT).show()
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Error al detener: \${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        // 4. NUEVO: Detener procesos de todas las apps que más consumen en segundo plano
        @JavascriptInterface
        fun detenerTodasLasApps() {
            runOnUiThread {
                try {
                    val am = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
                    // Lista de paquetes conocidos con alto consumo en segundo plano
                    val topDrainers = listOf(
                        "com.zhiliaoapp.musically", // TikTok
                        "com.instagram.android",    // Instagram
                        "com.whatsapp",             // WhatsApp
                        "com.spotify.music"         // Spotify
                    )
                    var detenidas = 0
                    for (pkg in topDrainers) {
                        am.killBackgroundProcesses(pkg)
                        detenidas++
                    }
                    Toast.makeText(this@MainActivity, "$detenidas apps en segundo plano detenidas con éxito", Toast.LENGTH_LONG).show()
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Error al detener apps: \${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        // 5. NUEVO: Abrir la pantalla de Forzar Cierre nativo de Android
        @JavascriptInterface
        fun forzarDetencionApp(packageName: String) {
            runOnUiThread {
                try {
                    val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                        data = Uri.fromParts("package", packageName, null)
                    }
                    startActivity(intent)
                } catch (e: Exception) {
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                }
            }
        }

        // 6. Abrir detalles de app
        @JavascriptInterface
        fun abrirDetallesApp(packageName: String) {
            forzarDetencionApp(packageName)
        }

        // 7. Mostrar un Toast nativo de Android desde JavaScript
        @JavascriptInterface
        fun mostrarToast(mensaje: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, mensaje, Toast.LENGTH_SHORT).show()
            }
        }

        // 8. Abrir ajustes de optimización de batería (Doze)
        @JavascriptInterface
        fun abrirOptimizacionBateriaApp() {
            runOnUiThread {
                try {
                    val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                    startActivity(intent)
                } catch (e: Exception) {
                    startActivity(Intent(Settings.ACTION_SETTINGS))
                }
            }
        }
    }
}`;
}

export function getAndroidManifestSnippet(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.webviewbridge">

    <!-- Permiso de Internet si cargas una URL web remota -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Permiso necesario para detener procesos en segundo plano con killBackgroundProcesses() -->
    <uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Optimizador Batería"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;
}
