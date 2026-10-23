/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  getStandaloneHtmlCode,
  getFullKotlinCode,
  getAndroidManifestSnippet,
} from '../utils/generateAssetHtml';
import {
  getAppBuildGradle,
  getKeystoreGenerationCode,
  getPrivacyPolicyTemplate,
  getBubblewrapTwaCommands,
} from '../utils/playStoreConfig';
import { INTENT_CATALOG } from '../data/intentCatalog';
import {
  Copy,
  Check,
  Download,
  FileCode,
  FolderGit2,
  BookOpen,
  Layers,
  UploadCloud,
  ShieldCheck,
  Terminal,
  Sparkles,
} from 'lucide-react';

export const AndroidStudioGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'html' | 'kotlin' | 'gradle' | 'manifest' | 'playstore' | 'twa' | 'guide' | 'catalog'
  >('playstore');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const htmlCode = getStandaloneHtmlCode();
  const kotlinCode = getFullKotlinCode();
  const gradleCode = getAppBuildGradle();
  const manifestCode = getAndroidManifestSnippet();
  const keystoreCode = getKeystoreGenerationCode();
  const privacyCode = getPrivacyPolicyTemplate();
  const bubblewrapCode = getBubblewrapTwaCommands();

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mi_pagina.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4" />
            <span>Publicación y Empaquetado</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Preparar y Subir a Google Play Store
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Todo lo necesario para compilar el <strong>Android App Bundle (.aab)</strong> firmado o instalar como PWA nativa y subir a Google Play Console.
          </p>
        </div>

        {activeTab === 'html' ? (
          <button
            onClick={handleDownloadHtml}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar mi_pagina.html
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('playstore')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            Guía Google Play (.aab)
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('playstore')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'playstore'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Subir a Google Play (.aab)
        </button>

        <button
          onClick={() => setActiveTab('gradle')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'gradle'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          build.gradle.kts
        </button>

        <button
          onClick={() => setActiveTab('kotlin')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'kotlin'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
          MainActivity.kt
        </button>

        <button
          onClick={() => setActiveTab('html')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'html'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          mi_pagina.html
        </button>

        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'manifest'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          AndroidManifest.xml
        </button>

        <button
          onClick={() => setActiveTab('twa')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'twa'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Publicar Web como App (Bubblewrap)
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          Paso a Paso
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3.5 py-2 font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          Catálogo Intents
        </button>
      </div>

      {/* Tab: Play Store Master Guide */}
      {activeTab === 'playstore' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <strong className="text-white text-sm">Requisitos Obligatorios de Google Play Console (2024–2026):</strong>
              <p>
                Google Play ya no acepta archivos <code className="text-rose-300 font-mono">.apk</code> para nuevas apps; exige el formato <strong>Android App Bundle (.aab)</strong> con <code className="text-emerald-300 font-mono">targetSdk = 34 o 35</code> y una clave de firma privada (Keystore).
              </p>
            </div>
          </div>

          {/* Step 1: Keystore */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                Generar tu clave de firma privada (Keystore)
              </div>
              <button
                onClick={() => handleCopy(keystoreCode, 'keystore')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'keystore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'keystore' ? 'Copiado' : 'Copiar Comandos'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Ejecuta este comando en la terminal dentro de la raíz de tu proyecto Android en Android Studio:
            </p>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{keystoreCode}</pre>
            </div>
          </div>

          {/* Step 2: Build with Android Studio UI */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
              Generar el .aab desde el menú de Android Studio
            </div>
            <ol className="list-decimal pl-9 space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <li>Abre tu proyecto en <strong>Android Studio</strong>.</li>
              <li>En el menú superior ve a: <strong>Build</strong> &gt; <strong>Generate Signed Bundle / APK...</strong></li>
              <li>Selecciona <strong>Android App Bundle (.aab)</strong> y haz clic en <em>Next</em>.</li>
              <li>Selecciona tu archivo de claves (<code className="text-sky-300 font-mono">my-release-key.jks</code>), escribe tu contraseña y el alias.</li>
              <li>Selecciona el tipo de compilación: <strong>release</strong>.</li>
              <li>Haz clic en <strong>Create</strong>. En 1-2 minutos Android Studio generará el archivo en: <code className="text-emerald-400 font-mono">app/release/app-release.aab</code>.</li>
            </ol>
          </div>

          {/* Step 3: Google Play Console Upload */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="font-semibold text-white text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
              Subir a Google Play Console
            </div>
            <ol className="list-decimal pl-9 space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <li>Entra en <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">play.google.com/console</a> con tu cuenta de desarrollador de Google.</li>
              <li>Haz clic en <strong>Crear aplicación</strong> &gt; Asigna el nombre <em>&quot;Optimizador de Batería&quot;</em> &gt; Tipo: <em>Aplicación</em> &gt; Gratuita.</li>
              <li>En el menú izquierdo ve a: <strong>Lanzamiento</strong> &gt; <strong>Producción</strong> (o Prueba interna) &gt; <strong>Crear nueva versión</strong>.</li>
              <li>Arrastra y suelta tu archivo <code className="text-emerald-400 font-mono">app-release.aab</code>.</li>
              <li>Completa la ficha de Play Store (título, descripción, capturas de pantalla de la app e icono de 512x512).</li>
              <li>Pega el enlace de la <strong>Política de Privacidad</strong> (plantilla abajo).</li>
              <li>Haz clic en <strong>Enviar para revisión</strong>.</li>
            </ol>
          </div>

          {/* Step 4: Privacy Policy Template */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">4</span>
                Plantilla de Política de Privacidad (Obligatoria para Play Store)
              </div>
              <button
                onClick={() => handleCopy(privacyCode, 'privacy')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'privacy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'privacy' ? 'Copiada' : 'Copiar Política'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Google Play rechaza apps que usen permisos como <code className="text-slate-300 font-mono">KILL_BACKGROUND_PROCESSES</code> si no tienen una política de privacidad pública:
            </p>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
              <pre>{privacyCode}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: build.gradle.kts */}
      {activeTab === 'gradle' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ruta en Android Studio: <code className="text-amber-400 font-mono">app/build.gradle.kts</code> (Configurado con targetSdk 34 y firma de release)</span>
            <button
              onClick={() => handleCopy(gradleCode, 'gradle')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === 'gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'gradle' ? 'Copiado' : 'Copiar build.gradle.kts'}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[460px]">
            <pre className="text-slate-300 leading-relaxed">{gradleCode}</pre>
          </div>
        </div>
      )}

      {/* Tab: Kotlin */}
      {activeTab === 'kotlin' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ruta: <code className="text-sky-400 font-mono">app/src/main/java/com/example/webviewbridge/MainActivity.kt</code></span>
            <button
              onClick={() => handleCopy(kotlinCode, 'kotlin')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === 'kotlin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'kotlin' ? 'Copiado' : 'Copiar Kotlin'}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[460px]">
            <pre className="text-slate-300 leading-relaxed">{kotlinCode}</pre>
          </div>
        </div>
      )}

      {/* Tab: HTML */}
      {activeTab === 'html' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ruta: <code className="text-emerald-400 font-mono">app/src/main/assets/mi_pagina.html</code></span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadHtml}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
              <button
                onClick={() => handleCopy(htmlCode, 'html')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'html' ? 'Copiado' : 'Copiar HTML'}</span>
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[460px]">
            <pre className="text-slate-300 leading-relaxed">{htmlCode}</pre>
          </div>
        </div>
      )}

      {/* Tab: Manifest */}
      {activeTab === 'manifest' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ruta: <code className="text-indigo-400 font-mono">app/src/main/AndroidManifest.xml</code></span>
            <button
              onClick={() => handleCopy(manifestCode, 'manifest')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSection === 'manifest' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'manifest' ? 'Copiado' : 'Copiar Manifest'}</span>
            </button>
          </div>
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto max-h-[460px]">
            <pre className="text-slate-300 leading-relaxed">{manifestCode}</pre>
          </div>
        </div>
      )}

      {/* Tab: TWA Bubblewrap (Google official tool to turn web to .aab) */}
      {activeTab === 'twa' && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white text-sm">Método Rápido: Bubblewrap (TWA) de Google</strong>
              <p className="leading-relaxed">
                Si no deseas usar Android Studio manualmente, Google desarrolló <strong>Bubblewrap</strong>. Toma esta misma aplicación web con su archivo PWA manifest y genera directamente un archivo <code className="text-emerald-300 font-mono">.aab</code> firmado listo para la Play Store en 3 comandos.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Comandos en tu computadora:</span>
              <button
                onClick={() => handleCopy(bubblewrapCode, 'bubblewrap')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSection === 'bubblewrap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'bubblewrap' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{bubblewrapCode}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Step by Step */}
      {activeTab === 'guide' && (
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
              Crear la carpeta de assets
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed pl-8">
              En Android Studio, clic derecho en <code className="text-slate-300 font-mono">app</code> &gt; <strong>New</strong> &gt; <strong>Folder</strong> &gt; <strong>Assets Folder</strong>. Coloca dentro <code className="text-emerald-400 font-mono">mi_pagina.html</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
              Configurar Manifest y Permisos
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed pl-8">
              Copia el <code className="text-indigo-400 font-mono">AndroidManifest.xml</code> asegurando incluir <code className="text-emerald-300 font-mono">KILL_BACKGROUND_PROCESSES</code> e <code className="text-emerald-300 font-mono">INTERNET</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
              Probar en tu teléfono
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed pl-8">
              Conecta tu teléfono Android por USB, activa <em>Depuración por USB</em> y presiona el botón verde <strong>Run &apos;app&apos;</strong> en Android Studio.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Intents estándar de Android implementados en el puente:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTENT_CATALOG.map(intent => (
              <div
                key={intent.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-white text-sm">{intent.name}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      intent.isImplementedInUserCode
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {intent.isImplementedInUserCode ? 'En tu código' : 'Disponible'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{intent.description}</p>
                <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-emerald-400">
                  JS: window.AndroidBridge.{intent.methodName}
                </div>
                <div className="bg-slate-900 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{intent.kotlinCode}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
