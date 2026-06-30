import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, radius } from '../utils/theme';
import { Category, Unit } from '../utils/conversions';

type Props = {
  category: Category;
  onBack: () => void;
};

function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  if (value === 0) return '0';
  if (Math.abs(value) >= 1e9 || (Math.abs(value) < 0.0001 && value !== 0)) {
    return value.toExponential(6);
  }
  const fixed = parseFloat(value.toPrecision(10));
  return String(fixed);
}

export default function ConverterScreen({ category, onBack }: Props) {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>(category.units[0]);
  const [toUnit, setToUnit] = useState<Unit>(category.units[1]);
  const [pickingFor, setPickingFor] = useState<'from' | 'to' | null>(null);

  const numericValue = parseFloat(input.replace(',', '.'));
  const result =
    input !== '' && !isNaN(numericValue)
      ? category.convert(numericValue, fromUnit.value, toUnit.value)
      : null;

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null) setInput(formatResult(result));
  }

  if (pickingFor !== null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setPickingFor(null)} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {pickingFor === 'from' ? 'De' : 'Para'}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.unitList}>
          {category.units.map((unit) => {
            const selected =
              pickingFor === 'from'
                ? unit.value === fromUnit.value
                : unit.value === toUnit.value;
            return (
              <TouchableOpacity
                key={unit.value}
                style={[styles.unitItem, selected && styles.unitItemSelected]}
                onPress={() => {
                  if (pickingFor === 'from') setFromUnit(unit);
                  else setToUnit(unit);
                  setPickingFor(null);
                }}
              >
                <Text style={[styles.unitLabel, selected && styles.unitLabelSelected]}>
                  {unit.label}
                </Text>
                {selected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Início</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {category.icon}  {category.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* Input */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.unitSelector} onPress={() => setPickingFor('from')}>
            <Text style={styles.unitSelectorLabel}>{fromUnit.label}</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* Swap */}
        <TouchableOpacity style={styles.swapBtn} onPress={swap}>
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>

        {/* Result */}
        <View style={[styles.card, styles.resultCard]}>
          <TouchableOpacity style={styles.unitSelector} onPress={() => setPickingFor('to')}>
            <Text style={styles.unitSelectorLabel}>{toUnit.label}</Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>
          <Text style={styles.result}>
            {result !== null ? formatResult(result) : '—'}
          </Text>
        </View>

        {result !== null && (
          <Text style={styles.formula}>
            {input} {fromUnit.value} = {formatResult(result)} {toUnit.value}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  backBtn: { marginBottom: spacing.xs },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  body: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  resultCard: {
    backgroundColor: colors.primary + '0D',
    borderWidth: 1,
    borderColor: colors.primary + '33',
  },
  unitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  unitSelectorLabel: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  chevron: { color: colors.primary, fontSize: 16 },
  input: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.text,
    padding: 0,
  },
  result: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.primary,
  },
  swapBtn: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  swapIcon: { color: '#fff', fontSize: 20 },
  formula: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  unitList: { padding: spacing.md, gap: spacing.xs },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '0D',
  },
  unitLabel: { fontSize: 15, color: colors.text },
  unitLabelSelected: { color: colors.primary, fontWeight: '600' },
  check: { color: colors.primary, fontWeight: '700' },
});
