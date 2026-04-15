/**
 * StoreCard — displays a single store with actions.
 *
 * "Get Directions" → opens native Maps app (Google Maps on Android, Apple Maps on iOS)
 * "Set as My Store" → saves to Zustand + AsyncStorage via useAppStore
 */
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { Store } from '@/types';

interface Props {
  store: Store;
  /** When true, hides the "Set as My Store" button (used on the detail screen) */
  compact?: boolean;
}

function openDirections(lat: number, lng: number, name: string) {
  const encodedName = encodeURIComponent(name);
  const url =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${encodedName}@${lat},${lng}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${encodedName})`;

  Linking.openURL(url).catch(() => {
    // Fallback to Google Maps web URL if native maps fails
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    );
  });
}

function callStore(phone: string) {
  Linking.openURL(`tel:${phone}`);
}

export function StoreCard({ store, compact = false }: Props) {
  const router = useRouter();
  const { selectedStore, setSelectedStore } = useAppStore();
  const isMyStore = selectedStore?.id === store.id;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/store/${store.id}`)}
      activeOpacity={0.88}
    >
      {/* My Store indicator */}
      {isMyStore && (
        <View style={styles.myStoreBanner}>
          <Ionicons name="location" size={12} color={Colors.textOnPrimary} />
          <Text style={styles.myStoreBannerText}>My Store</Text>
        </View>
      )}

      <View style={styles.body}>
        {/* Store name + province */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {store.name}
          </Text>
          <View style={styles.provincePill}>
            <Text style={styles.provinceText}>{store.province}</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText} numberOfLines={2}>
            {store.address}
          </Text>
        </View>

        {/* Hours */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{store.hours}</Text>
        </View>

        {/* Phone */}
        {store.phone ? (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => callStore(store.phone)}
            hitSlop={{ top: 8, bottom: 8, left: 0, right: 0 }}
          >
            <Ionicons name="call-outline" size={14} color={Colors.primary} />
            <Text style={[styles.infoText, styles.phoneText]}>{store.phone}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.directionsBtn}
          onPress={() => openDirections(store.lat, store.lng, store.name)}
        >
          <Ionicons name="navigate-outline" size={14} color={Colors.primary} />
          <Text style={styles.directionsBtnText}>Directions</Text>
        </TouchableOpacity>

        {!compact && (
          <TouchableOpacity
            style={[styles.myStoreBtn, isMyStore && styles.myStoreBtnActive]}
            onPress={() => setSelectedStore(store)}
            disabled={isMyStore}
          >
            <Ionicons
              name={isMyStore ? 'checkmark-circle' : 'flag-outline'}
              size={14}
              color={isMyStore ? Colors.textOnPrimary : Colors.primary}
            />
            <Text
              style={[styles.myStoreBtnText, isMyStore && styles.myStoreBtnTextActive]}
            >
              {isMyStore ? 'My Store' : 'Set as My Store'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  myStoreBanner: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  myStoreBannerText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: Colors.textOnPrimary,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  provincePill: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  provinceText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  infoText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  phoneText: {
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 1,
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  directionsBtnText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  myStoreBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 11,
    backgroundColor: Colors.surface,
  },
  myStoreBtnActive: {
    backgroundColor: Colors.primary,
  },
  myStoreBtnText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  myStoreBtnTextActive: {
    color: Colors.textOnPrimary,
  },
});
