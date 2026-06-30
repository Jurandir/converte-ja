import { TestIds } from 'react-native-google-mobile-ads';

/**
 * IDs de anúncio. Usa os IDs de teste oficiais do Google em desenvolvimento
 * (__DEV__) e os IDs reais em produção. Substituir os valores de produção
 * pelos gerados no painel do AdMob (admob.google.com) quando a conta for
 * criada — ver Fase 4 do roadmap.
 */

const PRODUCTION_BANNER_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';
const PRODUCTION_REWARDED_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX';

export const bannerAdUnitId = __DEV__ ? TestIds.BANNER : PRODUCTION_BANNER_ID;
export const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : PRODUCTION_INTERSTITIAL_ID;
export const rewardedAdUnitId = __DEV__ ? TestIds.REWARDED : PRODUCTION_REWARDED_ID;

/** Mostra 1 interstitial a cada N trocas de categoria. */
export const INTERSTITIAL_FREQUENCY = 4;

/** Duração da remoção temporária de anúncios via rewarded ad. */
export const REWARD_DURATION_MS = 60 * 60 * 1000; // 1 hora
