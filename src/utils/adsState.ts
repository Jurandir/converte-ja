import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { REWARD_DURATION_MS } from './adUnits';

const PREMIUM_KEY = '@converteja:isPremium';
const REWARD_EXPIRES_AT_KEY = '@converteja:rewardExpiresAt';

/**
 * Hook central de monetização. Controla se os anúncios devem ser exibidos,
 * considerando dois estados independentes:
 * - isPremium: compra única "remover anúncios" (ver scaffold de IAP em PremiumScreen)
 * - rewardExpiresAt: remoção temporária ganha assistindo um rewarded ad
 */
export function useAdsState() {
  const [isPremium, setIsPremium] = useState(false);
  const [rewardExpiresAt, setRewardExpiresAt] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [premiumValue, expiresValue] = await Promise.all([
        AsyncStorage.getItem(PREMIUM_KEY),
        AsyncStorage.getItem(REWARD_EXPIRES_AT_KEY),
      ]);
      setIsPremium(premiumValue === 'true');
      setRewardExpiresAt(expiresValue ? parseInt(expiresValue, 10) : null);
      setLoaded(true);
    })();
  }, []);

  const setPremium = useCallback(async (value: boolean) => {
    setIsPremium(value);
    await AsyncStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false');
  }, []);

  const grantTemporaryRemoval = useCallback(async () => {
    const expiresAt = Date.now() + REWARD_DURATION_MS;
    setRewardExpiresAt(expiresAt);
    await AsyncStorage.setItem(REWARD_EXPIRES_AT_KEY, String(expiresAt));
  }, []);

  const rewardActive = rewardExpiresAt !== null && rewardExpiresAt > Date.now();
  const adsEnabled = loaded && !isPremium && !rewardActive;

  return {
    loaded,
    isPremium,
    setPremium,
    rewardActive,
    rewardExpiresAt,
    grantTemporaryRemoval,
    adsEnabled,
  };
}
