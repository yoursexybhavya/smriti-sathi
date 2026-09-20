#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " Smriti Sathi — Native Android APK Builder v2.5.2"
echo "=========================================================="

export JAVA_HOME="/Users/krishnajangid/Library/Java/JavaVirtualMachines/jbr-21.0.11/Contents/Home"
export ANDROID_HOME="/Users/krishnajangid/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$PATH"

ROOT_DIR="/Users/krishnajangid/Documents/antigravity/peaceful-hertz"
APP_DIR="$ROOT_DIR/smriti-sathi"

echo "🔨 [1/3] Building Web Application..."
cd "$APP_DIR"
npm run build

echo "🔄 [2/3] Synchronizing Native Android Assets..."
npx cap sync android

echo "🚀 [3/3] Compiling Native Android APK..."
cd "$APP_DIR/android"
./gradlew assembleDebug

cp app/build/outputs/apk/debug/app-debug.apk "$ROOT_DIR/SmritiSathi-v2.5.2.apk"
cp app/build/outputs/apk/debug/app-debug.apk "$APP_DIR/SmritiSathi-v2.5.2.apk"
cp app/build/outputs/apk/debug/app-debug.apk "/Users/krishnajangid/Desktop/SmritiSathi-v2.5.2.apk"
echo ""
echo "=========================================================="
echo " ✅ Build Complete!"
echo " 📱 Native APK saved to:"
echo "    $ROOT_DIR/SmritiSathi-v2.5.2.apk"
echo "    /Users/krishnajangid/Desktop/SmritiSathi-v2.5.2.apk"
echo "=========================================================="
