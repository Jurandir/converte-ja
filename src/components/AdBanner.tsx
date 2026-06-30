import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerAdUnitId } from '../utils/adUnits';

type Props = {
  visible: boolean;
};

/** Banner fixo de rodapé. Renderiza vazio quando o usuário é premium ou tem remoção temporária ativa. */
export default function AdBanner({ visible }: Props) {
  if (!visible) return null;

  return (
    <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
