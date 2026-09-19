#!/usr/bin/env bash
set -e

echo "=== Smriti Sathi: Native Android APK Builder ==="

echo "1. Building Web Assets with Vite..."
npm run build

echo "2. Syncing with Capacitor Android..."
npx cap sync android

echo "3. Compiling Android Debug APK with Gradle..."
cd android
chmod +x gradlew
./gradlew assembleDebug

cd ..

APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
APK_TARGET="SmritiSathi-latest.apk"
DESKTOP_TARGET="/Users/krishnajangid/Desktop/SmritiSathi-latest.apk"

if [ -f "$APK_SOURCE" ]; then
  cp "$APK_SOURCE" "$APK_TARGET"
  cp "$APK_SOURCE" "SmritiSathi-v2.2.0.apk"
  echo "✓ Created $APK_TARGET and SmritiSathi-v2.2.0.apk ($(du -h "$APK_TARGET" | cut -f1))"
  
  if [ -d "/Users/krishnajangid/Desktop" ]; then
    cp "$APK_SOURCE" "$DESKTOP_TARGET"
    cp "$APK_SOURCE" "/Users/krishnajangid/Desktop/SmritiSathi-v2.2.0.apk"
    echo "✓ Copied fresh APK to $DESKTOP_TARGET and Desktop/SmritiSathi-v2.2.0.apk"
  fi
  echo "=== Build Successful! ==="
else
  echo "❌ Error: APK not found at $APK_SOURCE"
  exit 1
fi
