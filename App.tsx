import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Category } from './src/utils/conversions';
import HomeScreen from './src/screens/HomeScreen';
import ConverterScreen from './src/screens/ConverterScreen';

export default function App() {
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <>
      <StatusBar style="light" />
      {selected === null ? (
        <HomeScreen onSelect={setSelected} />
      ) : (
        <ConverterScreen category={selected} onBack={() => setSelected(null)} />
      )}
    </>
  );
}
