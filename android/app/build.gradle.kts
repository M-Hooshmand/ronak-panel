plugins {
    id("com.android.application")
}

android {
    namespace = "ir.haiocloud.ronak"
    compileSdk = 34

    defaultConfig {
        applicationId = "ir.haiocloud.ronak"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("RONAK_KEYSTORE") ?: "keystore/ronak-release.jks")
            storePassword = System.getenv("RONAK_KEYSTORE_PASS") ?: ""
            keyAlias = System.getenv("RONAK_KEY_ALIAS") ?: "ronak"
            keyPassword = System.getenv("RONAK_KEY_PASS") ?: (System.getenv("RONAK_KEYSTORE_PASS") ?: "")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    packaging {
        resources.excludes += setOf("META-INF/*.kotlin_module")
    }
}
