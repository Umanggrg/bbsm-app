import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({
  icon = 'alert-circle-outline',
  title,
  subtitle,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={Colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 10,
  },
  title: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
