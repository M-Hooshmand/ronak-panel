#!/usr/bin/env bash
# Builds a signed release APK without Gradle, using only the Android SDK
# build-tools (aapt2, d8, zipalign, apksigner) and a JDK 17.
#
#   ANDROID_HOME=/path/to/sdk ./build-apk.sh [output-dir]
#
# Signing: RONAK_KEYSTORE, RONAK_KEYSTORE_PASS, RONAK_KEY_ALIAS, RONAK_KEY_PASS.
# Without them the APK is produced unsigned.
set -euo pipefail

SDK="${ANDROID_HOME:?set ANDROID_HOME}"
BT="$SDK/build-tools/34.0.0"
PLATFORM="$SDK/platforms/android-34/android.jar"
JAVA_BIN="${JAVA_HOME:+$JAVA_HOME/bin/}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$ROOT/build}"
# Intermediate files live in a space-free temp dir: javac/d8 choke on @argfiles
# whose path contains spaces.
WORK="$(mktemp -d "${TMPDIR:-/tmp}/ronak-build.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

mkdir -p "$WORK/gen" "$WORK/classes" "$WORK/dex" "$OUT"

echo "==> aapt2 compile"
"$BT/aapt2" compile --dir "$ROOT/app/src/main/res" -o "$WORK/res.zip"

echo "==> aapt2 link"
# aapt2 (unlike AGP) wants the package in the manifest; inject it on a copy so the
# checked-in manifest stays namespace-driven for Gradle builds.
sed 's|<manifest xmlns:android="http://schemas.android.com/apk/res/android">|<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="ir.haiocloud.ronak">|' \
  "$ROOT/app/src/main/AndroidManifest.xml" > "$WORK/AndroidManifest.xml"
grep -q 'package="ir.haiocloud.ronak"' "$WORK/AndroidManifest.xml"

"$BT/aapt2" link \
  -o "$WORK/base.apk" \
  -I "$PLATFORM" \
  --manifest "$WORK/AndroidManifest.xml" \
  --java "$WORK/gen" \
  --min-sdk-version 26 \
  --target-sdk-version 34 \
  --version-code 1 --version-name 1.0.0 \
  --auto-add-overlay \
  "$WORK/res.zip"

echo "==> javac"
find "$ROOT/app/src/main/java" "$WORK/gen" -name '*.java' > "$WORK/sources.txt"
"${JAVA_BIN}javac" -source 17 -target 17 -encoding UTF-8 -nowarn \
  -classpath "$PLATFORM" -d "$WORK/classes" "@$WORK/sources.txt"

echo "==> d8"
find "$WORK/classes" -name '*.class' > "$WORK/classes.txt"
"$BT/d8" --release --lib "$PLATFORM" --min-api 26 --output "$WORK/dex" "@$WORK/classes.txt"

echo "==> package"
cp "$WORK/base.apk" "$WORK/unsigned.apk"
(cd "$WORK/dex" && zip -q -j "$WORK/unsigned.apk" classes.dex)

echo "==> align"
"$BT/zipalign" -f -p 4 "$WORK/unsigned.apk" "$WORK/aligned.apk"

if [[ -n "${RONAK_KEYSTORE:-}" && -n "${RONAK_KEYSTORE_PASS:-}" ]]; then
  echo "==> sign"
  "$BT/apksigner" sign \
    --ks "$RONAK_KEYSTORE" \
    --ks-key-alias "${RONAK_KEY_ALIAS:-ronak}" \
    --ks-pass "pass:$RONAK_KEYSTORE_PASS" \
    --key-pass "pass:${RONAK_KEY_PASS:-$RONAK_KEYSTORE_PASS}" \
    --out "$OUT/ronak-1.0.0.apk" \
    "$WORK/aligned.apk"
else
  echo "==> no keystore, output stays unsigned"
  cp "$WORK/aligned.apk" "$OUT/ronak-1.0.0-unsigned.apk"
fi

echo "done: $(ls -1 "$OUT"/*.apk)"
