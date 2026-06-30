const { withGradleProperties } = require('@expo/config-plugins');

// The EAS SDK 57 build environment defaults to Kotlin 2.1.0.
// react-native-google-mobile-ads v16+ depends on play-services-ads 25.x,
// which was compiled with Kotlin 2.3.0 (metadata binary version 2.3.0).
// Kotlin 2.1.0 cannot read that metadata → "incompatible version" error.
// Setting android.kotlinVersion overrides the default in Expo's generated build.gradle.
module.exports = function withKotlinVersion(config) {
  return withGradleProperties(config, (cfg) => {
    const key = 'android.kotlinVersion';
    const idx = cfg.modResults.findIndex(
      item => item.type === 'property' && item.key === key
    );
    if (idx >= 0) {
      cfg.modResults[idx].value = '2.3.0';
    } else {
      cfg.modResults.push({ type: 'property', key, value: '2.3.0' });
    }
    return cfg;
  });
};
