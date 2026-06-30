const { withProjectBuildGradle } = require('@expo/config-plugins');

// play-services-ads 25.x was compiled with Kotlin 2.3.0, but the EAS build
// environment for Expo SDK 57 provides Kotlin 2.1.0, causing metadata
// incompatibility. This plugin forces 24.4.0 (compiled with Kotlin ≤ 2.1.x).
// Remove this plugin once EAS updates its build environment to Kotlin 2.3.0+.
module.exports = function withPlayServicesAdsVersion(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.contents.includes('play-services-ads-version-override')) {
      return cfg;
    }
    cfg.modResults.contents += `
// play-services-ads-version-override
allprojects {
    configurations.all {
        resolutionStrategy {
            force 'com.google.android.gms:play-services-ads:24.4.0'
        }
    }
}
`;
    return cfg;
  });
};
