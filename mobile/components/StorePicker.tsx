/**
 * StorePicker — Apple sheet-style modal for choosing "My Store".
 * Grouped by province, searchable. No network call required.
 */
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { STATIC_STORES } from '@/constants/Stores';
import { useAppStore } from '@/store/useAppStore';
import { Store } from '@/types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

type ListItem =
  | { type: 'header'; province: string }
  | { type: 'store'; store: Store };

export function StorePicker({ visible, onDismiss }: Props) {
  const [search, setSearch] = useState('');
  const { selectedStore, setSelectedStore } = useAppStore();

  const filtered = search.trim()
    ? STATIC_STORES.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.address.toLowerCase().includes(search.toLowerCase()) ||
          s.province.toLowerCase().includes(search.toLowerCase())
      )
    : STATIC_STORES;

  const grouped = filtered.reduce<Record<string, Store[]>>((acc, store) => {
    if (!acc[store.province]) acc[store.province] = [];
    acc[store.province].push(store);
    return acc;
  }, {});

  const listData: ListItem[] = [];
  Object.entries(grouped)
    .sort(([a], [b]) => {
      if (a === 'Bagmati') return -1;
      if (b === 'Bagmati') return 1;
      return a.localeCompare(b);
    })
    .forEach(([province, stores]) => {
      listData.push({ type: 'header', province });
      stores.forEach((s) => listData.push({ type: 'store', store: s }));
    });

  const handleSelect = (store: Store) => {
    setSelectedStore(store);
    setSearch('');
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Choose Your Store</Text>
            <Text style={styles.headerSub}>{STATIC_STORES.length} stores across Nepal</Text>
          </View>
          {selectedStore && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onDismiss} activeOpacity={0.75}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city or store name..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
              autoFocus={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List */}
        {listData.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={44} color={Colors.borderLight} />
            <Text style={styles.emptyTitle}>No stores found</Text>
            <Text style={styles.emptySub}>Try "{search.slice(0, 10)}..." with a different term</Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) =>
              item.type === 'header' ? `h-${item.province}` : item.store.id
            }
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>{item.province}</Text>
                  </View>
                );
              }

              const isSelected = selectedStore?.id === item.store.id;
              return (
                <TouchableOpacity
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => handleSelect(item.store)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.rowIcon, isSelected && styles.rowIconSelected]}>
                    <Ionicons
                      name={isSelected ? 'location' : 'storefront-outline'}
                      size={16}
                      color={isSelected ? Colors.primary : Colors.steelBlue}
                    />
                  </View>
                  <View style={styles.rowBody}>
                    <Text style={[styles.rowName, isSelected && styles.rowNameSelected]} numberOfLines={1}>
                      {item.store.name}
                    </Text>
                    <Text style={styles.rowAddress} numberOfLines={1}>{item.store.address}</Text>
                    <Text style={styles.rowHours}>{item.store.hours}</Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerLeft: { gap: 2 },
  headerTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
  },
  cancelText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: '#fff',
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sora_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: Colors.background,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  rowSelected: { backgroundColor: '#FFF5F6' },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.steelBlueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconSelected: { backgroundColor: Colors.primaryLight },
  rowBody: { flex: 1, gap: 2 },
  rowName: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
  },
  rowNameSelected: { color: Colors.primary },
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

  listContent: { paddingBottom: 48 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySub: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
