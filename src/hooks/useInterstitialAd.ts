import { useCallback, useEffect, useRef, useState } from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_FREQUENCY, interstitialAdUnitId } from '../utils/adUnits';

/**
 * Carrega um interstitial e expõe `registerCategorySwitch()`, que conta as
 * trocas de categoria e exibe o anúncio a cada INTERSTITIAL_FREQUENCY trocas
 * (moderação — ver Fase 4 do roadmap). Recarrega automaticamente após cada
 * exibição.
 */
export function useInterstitialAd(enabled: boolean) {
  const adRef = useRef(InterstitialAd.createForAdRequest(interstitialAdUnitId));
  const [loaded, setLoaded] = useState(false);
  const switchCount = useRef(0);

  useEffect(() => {
    const ad = adRef.current;

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      ad.load();
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, []);

  const registerCategorySwitch = useCallback(() => {
    if (!enabled) return;
    switchCount.current += 1;
    if (switchCount.current >= INTERSTITIAL_FREQUENCY) {
      switchCount.current = 0;
      if (loaded) {
        adRef.current.show();
      }
    }
  }, [enabled, loaded]);

  return { registerCategorySwitch };
}
