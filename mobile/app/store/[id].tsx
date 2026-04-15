/**
 * Store Detail Screen — uses static data, no API call required.
 */
import React from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { STATIC_STORES } from '@/constants/Stores';
import { useAppStore } from '@/store/useAppStore';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedStore, setSelectedStore } = useAppStore();

  const store = STATIC_STORES.find((s) => s.id === id);

  if (!store) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="storefront-outline" size={44} color={Colors.textMuted} />
        <Text style={styles.notFoundText}>Store not found</Text>
      </View>
    );
  }

  const isMyStore = selectedStore?.id === store.id;

  const openDirections = () => {
    const name = encodeURIComponent(store.name);
    const url =
      Platform.OS === 'ios'
        ? `maps:0,0?q=${name}@${store.lat},${store.lng}`
        : `geo:${store.lat},${store.lng}?q=${store.lat},${store.lng}(${name})`;
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`)
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* My Store banner */}
      {isMyStore && (
        <View style={styles.myStoreBanner}>
          <Ionicons name="location" size={14} color={Colors.textOnPrimary} />
          <Text style={styles.myStoreBannerText}>This is your selected store</Text>
        </View>
      )}

      {/* Name + province */}
      <View style={styles.nameSection}>
        <Text style={styles.storeName}>{store.name}</Text>
        <View style={styles.provincePill}>
          <Text style={styles.provinceText}>{store.province} Province</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <InfoRow icon="location-outline" label="Address" value={store.address} />
        <View style={styles.divider} />
        <InfoRow icon="time-outline" label="Hours" value={store.hours} />
        {store.phone ? (
          <>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${store.phone}`)}>
              <InfoRow icon="call-outline" label="Phone" value={store.phone} highlight />
            </TouchableOpacity>
          </>
        ) : null}
        {store.manager_name ? (
          <>
            <View style={styles.divider} />
            <InfoRow icon="person-outline" label="Manager" value={store.manager_name} />
          </>
        ) : null}
      </View>

      {/* Action buttons */}
      <TouchableOpacity style={styles.directionsBtn} onPress={openDirections} activeOpacity={0.85}>
        <Ionicons name="navigate" size={18} color={Colors.textOnPrimary} />
        <Text style={styles.directionsBtnText}>Get Directions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.myStoreBtn, isMyStore && styles.myStoreBtnActive]}
        onPress={() => setSelectedStore(store)}
        disabled={isMyStore}
        activeOpacity={0.85}
      >
        <Ionicons
          name={isMyStore ? 'checkmark-circle' : 'flag-outline'}
          size={18}
          color={isMyStore ? Colors.textOnPrimary : Colors.primary}
        />
        <Text style={[styles.myStoreBtnText, isMyStore && styles.myStoreBtnTextActive]}>
          {isMyStore ? 'My Store' : 'Set as My Store'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={Colors.primary} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, highlight && { color: Colors.primary }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.background },
  notFoundText: { fontFamily: 'Sora_600SemiBold', fontSize: 15, color: Colors.textSecondary },

  myStoreBanner: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  myStoreBannerText: { fontFamily: 'Sora_600SemiBold', fontSize: 13, color: Colors.textOnPrimary },

  nameSection: { gap: 6 },
  storeName: { fontFamily: 'Sora_700Bold', fontSize: 22, color: Colors.textPrimary, lineHeight: 28 },
  provincePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  provinceText: { fontFamily: 'Sora_400Regular', fontSize: 12, color: Colors.textSecondary },

  infoCard: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  infoLabel: { fontFamily: 'Sora_600SemiBold', fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 },
  infoValue: { fontFamily: 'Sora_400Regular', fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 44 },

  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  directionsBtnText: { fontFamily: 'Sora_700Bold', fontSize: 15, color: Colors.textOnPrimary },

  myStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  myStoreBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  myStoreBtnText: { fontFamily: 'Sora_700Bold', fontSize: 15, color: Colors.primary },
  myStoreBtnTextActive: { color: Colors.textOnPrimary },
});
