import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Category } from './src/utils/conversions';
import HomeScreen from './src/screens/HomeScreen';
import ConverterScreen from './src/screens/ConverterScreen';
import BannerPlaceholder from './src/components/BannerPlaceholder';

export default function App() {
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {selected === null ? (
        <HomeScreen onSelect={setSelected} />
      ) : (
        <ConverterScreen category={selected} onBack={() => setSelected(null)} />
      )}
      <BannerPlaceholder />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
