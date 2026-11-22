# Ronak Android app

Native shell (single `WebView`) for the Ronak panel. The app loads the live panel
from the same container the browser uses, so web and mobile always show the same
data — nothing is bundled, copied or cached as content:

```
https://managed-wordpress-9b7d03c4e5a5.sam.apps.haiocloud.com/
```

Session cookies persist between launches, so the login survives an app restart.

## Behaviour

- JavaScript, DOM storage and cookies enabled (the panel is a React SPA)
- Hardware back button walks the panel history, then leaves the app
- Links to other hosts (and downloads) open in the system browser
- File inputs open the Android file picker
- Full-screen offline/error state with «تلاش مجدد» when the container is unreachable
- Thin progress bar while a page loads
- Portrait-friendly RTL layout, brand colours (`#0C1420` / `#2FE0BE`)

## Identity

| | |
|---|---|
| Package | `ir.haiocloud.ronak` |
| Version | `1.0.0` (`versionCode` 1) |
| minSdk | 26 (Android 8) |
| targetSdk | 34 |
| Output | `app/build/outputs/apk/release/app-release.apk` |

## Build

Requires JDK 17 and Android SDK platform 34 + build-tools 34.0.0.

```bash
export JAVA_HOME=/path/to/jdk17
export ANDROID_HOME=/path/to/android-sdk
export RONAK_KEYSTORE=keystore/ronak-release.jks
export RONAK_KEYSTORE_PASS='…'
export RONAK_KEY_ALIAS=ronak
export RONAK_KEY_PASS='…'

gradle :app:assembleRelease --no-daemon
```

When the keystore is missing or the password is empty the release build still
runs but produces an unsigned APK, which cannot be installed. The signing key is
not committed (`keystore/` is ignored) — keep a backup, every future update must
be signed with the same key to install over the previous version.
