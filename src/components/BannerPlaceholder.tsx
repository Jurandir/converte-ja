import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

/**
 * Placeholder visual para o banner do AdMob (Fase 4 do roadmap).
 * Reserva a altura padrão de um banner adaptativo (50dp) para o layout
 * já nascer com o espaço correto. Trocar por <BannerAd> do
 * react-native-google-mobile-ads quando o AdMob for integrado.
 */
export default function BannerPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Espaço reservado para anúncio (AdMob)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.textMuted + '33',
  },
  text: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
