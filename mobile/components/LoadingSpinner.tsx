import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface Props {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', fullScreen = false }: Props) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size={size} color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
