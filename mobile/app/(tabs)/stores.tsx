/**
 * Stores Screen — iOS Contacts-style list
 */
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { StorePicker } from '@/components/StorePicker';
import { useAppStore } from '@/store/useAppStore';
import { STATIC_STORES, PROVINCES } from '@/constants/Stores';
import { Store } from '@/types';

function openDirections(lat: number, lng: number, name: string) {
  const encoded = encodeURIComponent(name);
  const url = Platform.OS === 'ios'
    ? `maps:0,0?q=${encoded}@${lat},${lng}`
    : `geo:${lat},${lng}?q=${lat},${lng}(${encoded})`;
  Linking.openURL(url).catch(() =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
  );
}

// Flat list item = province header OR store
type ListItem =
  | { kind: 'header'; province: string }
  | { kind: 'store'; store: Store };

export default function StoresScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [storePickerOpen, setStorePickerOpen] = useState(false);
  const { selectedStore, setSelectedStore } = useAppStore();

  const listData: ListItem[] = useMemo(() => {
    let stores = STATIC_STORES;
    if (selectedProvince) stores = stores.filter((s) => s.province === selectedProvince);
    if (search.trim()) {
      const q = search.toLowerCase();
      stores = stores.filter(
        (s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
      );
      return stores.map((store) => ({ kind: 'store' as const, store }));
    }

    // Group by province with section headers
    const provinces = selectedProvince
      ? [selectedProvince]
      : PROVINCES.filter((p) => stores.some((s) => s.province === p));

    const items: ListItem[] = [];
    provinces.forEach((prov) => {
      items.push({ kind: 'header', province: prov });
      stores.filter((s) => s.province === prov).forEach((store) => {
        items.push({ kind: 'store', store });
      });
    });
    return items;
  }, [search, selectedProvince]);

  const storeCount = listData.filter((i) => i.kind === 'store').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>28 LOCATIONS</Text>
        <Text style={[styles.headerTitle, isTablet && { fontSize: 28 }]}>Our Stores</Text>
        <Text style={styles.headerSub}>{storeCount} of {STATIC_STORES.length} shown</Text>
      </View>

      {/* My store bar */}
      {selectedStore && (
        <TouchableOpacity
          style={styles.myStoreBar}
          onPress={() => setStorePickerOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.myStoreLeft}>
            <View style={styles.myStoreDot} />
            <View>
              <Text style={styles.myStoreLabel}>MY STORE</Text>
              <Text style={styles.myStoreName}>{selectedStore.name}</Text>
            </View>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      )}

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores or city..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Province chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
      >
        <ProvinceChip label="All" active={!selectedProvince} onPress={() => setSelectedProvince(undefined)} />
        {PROVINCES.map((p) => (
          <ProvinceChip
            key={p}
            label={p}
            active={selectedProvince === p}
            onPress={() => setSelectedProvince(selectedProvince === p ? undefined : p)}
          />
        ))}
      </ScrollView>

      {/* List */}
      {listData.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="storefront-outline" size={48} color={Colors.borderLight} />
          <Text style={styles.emptyTitle}>No stores found</Text>
          <Text style={styles.emptySubtitle}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) =>
            item.kind === 'header' ? `h-${item.province}` : item.store.id
          }
          renderItem={({ item }) => {
            if (item.kind === 'header') {
              return (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{item.province}</Text>
                </View>
              );
            }
            return (
              <StoreRow
                store={item.store}
                isMyStore={selectedStore?.id === item.store.id}
                isTablet={isTablet}
                onPress={() => router.push(`/store/${item.store.id}`)}
                onSetMyStore={() => setSelectedStore(item.store)}
                onDirections={() => openDirections(item.store.lat, item.store.lng, item.store.name)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <StorePicker visible={storePickerOpen} onDismiss={() => setStorePickerOpen(false)} />
    </SafeAreaView>
  );
}

// ── Store Row ────────────────────────────────────────────────────────────

interface StoreRowProps {
  store: Store;
  isMyStore: boolean;
  isTablet: boolean;
  onPress: () => void;
  onSetMyStore: () => void;
  onDirections: () => void;
}

function StoreRow({ store, isMyStore, isTablet, onPress, onSetMyStore, onDirections }: StoreRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, isMyStore && styles.rowHighlight]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Left icon */}
      <View style={[styles.rowIcon, isMyStore && styles.rowIconActive]}>
        <Ionicons
          name={isMyStore ? 'location' : 'storefront-outline'}
          size={18}
          color={isMyStore ? Colors.primary : Colors.steelBlue}
        />
      </View>

      {/* Content */}
      <View style={styles.rowBody}>
        <Text style={[styles.rowName, isTablet && { fontSize: 16 }, isMyStore && styles.rowNameActive]} numberOfLines={1}>
          {store.name}
        </Text>
        <Text style={styles.rowAddress} numberOfLines={1}>{store.address}</Text>
        <Text style={styles.rowHours}>{store.hours}</Text>
      </View>

      {/* Actions */}
      <View style={styles.rowActions}>
        <TouchableOpacity style={styles.rowAction} onPress={onDirections} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="navigate-circle-outline" size={26} color={Colors.steelBlue} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowAction}
          onPress={onSetMyStore}
          disabled={isMyStore}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isMyStore ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={26}
            color={isMyStore ? Colors.primary : Colors.borderLight}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ── Province Chip ─────────────────────────────────────────────────────────

function ProvinceChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerLabel: {
    fontFamily: 'Sora_700Bold',
    fontSize: 10,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  headerTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 26,
    color: '#fff',
    letterSpacing: -0.44,
  },
  headerSub: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },

  myStoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  myStoreLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  myStoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  myStoreLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 9,
    color: Colors.primary,
    letterSpacing: 1,
  },
  myStoreName: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  changeText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },

  searchWrap: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sora_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },

  chipScroll: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    maxHeight: 54,
  },
  chipContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    backgroundColor: Colors.background,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: { fontFamily: 'Sora_600SemiBold', fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },

  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },

  sectionHeader: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: 'transparent',
  },
  sectionHeaderText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  rowHighlight: {
    backgroundColor: '#FFFAF7',
    borderWidth: 1.5,
    borderColor: Colors.primary + '33',
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: Colors.steelBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconActive: { backgroundColor: Colors.primaryLight },
  rowBody: { flex: 1, gap: 3 },
  rowName: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  rowNameActive: { color: Colors.primary },
  rowAddress: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  rowHours: {
    fontFamily: 'Sora_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  rowActions: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  rowAction: { padding: 2 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 60 },
  emptyTitle: { fontFamily: 'Sora_600SemiBold', fontSize: 16, color: Colors.textSecondary },
  emptySubtitle: { fontFamily: 'Sora_400Regular', fontSize: 13, color: Colors.textMuted },
});
