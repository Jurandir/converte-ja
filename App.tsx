import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { Category } from './src/utils/conversions';
import { useAdsState } from './src/utils/adsState';
import { useInterstitialAd } from './src/hooks/useInterstitialAd';
import { useRewardedAd } from './src/hooks/useRewardedAd';
import HomeScreen from './src/screens/HomeScreen';
import ConverterScreen from './src/screens/ConverterScreen';
import AdBanner from './src/components/AdBanner';

export default function App() {
  const [selected, setSelected] = useState<Category | null>(null);
  const { loaded, adsEnabled, rewardActive, setPremium, grantTemporaryRemoval } =
    useAdsState();

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  const { registerCategorySwitch } = useInterstitialAd(adsEnabled);

  const handleEarnedReward = useCallback(() => {
    grantTemporaryRemoval();
    Alert.alert('Anúncios removidos!', 'Você ficará sem anúncios pela próxima hora.');
  }, [grantTemporaryRemoval]);

  const { loaded: rewardedLoaded, show: showRewarded } = useRewardedAd(handleEarnedReward);

  function handleSelect(category: Category) {
    setSelected(category);
    registerCategorySwitch();
  }

  function handleGoPremium() {
    Alert.alert(
      'Versão Premium',
      'Remova os anúncios para sempre por um valor único.\n\n(Compra via loja ainda não configurada — pendente de produto no Play Console, ver Fase 6 do roadmap.)',
      __DEV__
        ? [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Simular compra (dev)',
              onPress: () => setPremium(true),
            },
          ]
        : [{ text: 'OK' }]
    );
  }

  if (!loaded) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {selected === null ? (
        <HomeScreen
          onSelect={handleSelect}
          adsEnabled={adsEnabled}
          rewardActive={rewardActive}
          rewardedLoaded={rewardedLoaded}
          onWatchRewarded={showRewarded}
          onGoPremium={handleGoPremium}
        />
      ) : (
        <ConverterScreen category={selected} onBack={() => setSelected(null)} />
      )}
      <AdBanner visible={adsEnabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
