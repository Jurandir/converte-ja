import { TestIds } from 'react-native-google-mobile-ads';


const PRODUCTION_BANNER_ID = 'ca-app-pub-2844165862251362/6864669080';
const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-2844165862251362/2410418758';
const PRODUCTION_REWARDED_ID = 'ca-app-pub-2844165862251362/3855362360';

export const bannerAdUnitId = __DEV__ ? TestIds.BANNER : PRODUCTION_BANNER_ID;
export const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : PRODUCTION_INTERSTITIAL_ID;
export const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : PRODUCTION_REWARDED_ID;

/** Mostra 1 interstitial a cada N trocas de categoria. */
export const INTERSTITIAL_FREQUENCY = 4;

/** Duração da remoção temporária de anúncios via rewarded ad. */
export const REWARD_DURATION_MS = 60 * 60 * 1000; // 1 hora
