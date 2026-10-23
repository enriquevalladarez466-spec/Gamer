/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getAppBuildGradle(): string {
  return `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.webviewbridge"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.webviewbridge"
        minSdk = 24
        targetSdk = 34 // Requerido por Google Play Console para 2024-2026
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            // Configura estos valores con tu keystore generado
            storeFile = file("my-release-key.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "miClaveSegura123"
            keyAlias = "my-alias"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "miClaveSegura123"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
}`;
}

export function getKeystoreGenerationCode(): string {
  return `# 1. Generar tu clave de firma privada (Keystore) para Google Play:
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias

# 2. Generar el Android App Bundle (.aab) para subir a Google Play Console:
./gradlew bundleRelease

# El archivo listo para subir se generará en:
# app/build/outputs/bundle/release/app-release.aab`;
}

export function getPrivacyPolicyTemplate(): string {
  return `POLÍTICA DE PRIVACIDAD - OPTIMIZADOR DE BATERÍA ANDROID

Última actualización: Octubre 2026

1. Información que recopilamos
Nuestra aplicación NO recopila, transmite ni almacena datos personales de los usuarios en servidores externos. Toda la información de consumo de batería y procesos del sistema se consulta localmente en el dispositivo mediante las APIs nativas de Android.

2. Uso de Permisos
- KILL_BACKGROUND_PROCESSES: Se utiliza exclusivamente cuando el usuario solicita finalizar aplicaciones en segundo plano para optimizar el consumo de batería y memoria RAM.
- INTERNET: Necesario para la carga y renderizado de componentes web dentro del WebView.

3. Seguridad de los Datos
No compartimos ninguna información con terceros ni redes publicitarias. Todos los datos permanecen estrictamente en la memoria local de tu dispositivo Android.

4. Contacto
Si tienes preguntas sobre esta política, puedes contactarnos a través de los datos de soporte en la ficha de Google Play Store.`;
}

export function getBubblewrapTwaCommands(): string {
  return `# Alternativa oficial de Google para publicar tu Web App en Play Store sin Android Studio:

# 1. Instalar la herramienta oficial de Google:
npm i -g @bubblewrap/cli

# 2. Inicializar el proyecto con la URL de tu aplicación:
bubblewrap init --manifest="https://ais-dev-54jwuzgnce6hd6qagozowu-328301033079.us-west2.run.app/manifest.webmanifest"

# 3. Compilar el App Bundle (.aab) firmado:
bubblewrap build

# ¡Listo! El archivo app-release-signed.aab está preparado para arrastrar a Google Play Console.`;
}
