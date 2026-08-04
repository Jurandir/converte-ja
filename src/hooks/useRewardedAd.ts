import { useCallback, useEffect, useRef, useState } from 'react';
import { AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { rewardedAdUnitId } from '../utils/adUnits';

/**
 * Carrega um rewarded ad e expõe `show()`. Chama `onEarnedReward` apenas
 * quando o usuário assiste o anúncio até o fim (evento EARNED_REWARD).
 */
export function useRewardedAd(onEarnedReward: () => void) {
  const adRef = useRef(RewardedAd.createForAdRequest(rewardedAdUnitId));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = adRef.current;

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onEarnedReward();
      }
    );
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
      unsubEarned();
      unsubClosed();
      unsubError();
    };
  }, [onEarnedReward]);

  const show = useCallback(() => {
    if (loaded) {
      adRef.current.show();
    }
  }, [loaded]);

  return { loaded, show };
}
