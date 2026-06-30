import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, radius } from '../utils/theme';
import { categories, Category } from '../utils/conversions';

type Props = {
  onSelect: (category: Category) => void;
  adsEnabled: boolean;
  rewardActive: boolean;
  rewardedLoaded: boolean;
  onWatchRewarded: () => void;
  onGoPremium: () => void;
};

export default function HomeScreen({
  onSelect,
  adsEnabled,
  rewardActive,
  rewardedLoaded,
  onWatchRewarded,
  onGoPremium,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Converte Já</Text>
        <Text style={styles.subtitle}>Selecione uma categoria</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.monetizationBox}>
            {!adsEnabled ? (
              <Text style={styles.adsOffText}>
                {rewardActive
                  ? '✓ Anúncios desativados temporariamente'
                  : '✓ Versão Premium — sem anúncios'}
              </Text>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.monetizationBtn, !rewardedLoaded && styles.btnDisabled]}
                  onPress={onWatchRewarded}
                  disabled={!rewardedLoaded}
                >
                  <Text style={styles.monetizationBtnText}>
                    📺 Assistir vídeo e remover anúncios por 1h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.monetizationBtn, styles.premiumBtn]}
                  onPress={onGoPremium}
                >
                  <Text style={[styles.monetizationBtnText, styles.premiumBtnText]}>
                    ⭐ Remover anúncios para sempre
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  monetizationBox: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  monetizationBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  monetizationBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  premiumBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  premiumBtnText: {
    color: '#fff',
  },
  adsOffText: {
    textAlign: 'center',
    color: colors.success,
    fontWeight: '600',
    fontSize: 13,
    padding: spacing.md,
  },
});
