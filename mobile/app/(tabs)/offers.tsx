/**
 * Offers Screen — Apple editorial grid
 */
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { PromotionCard } from '@/components/PromotionCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { usePromotions, usePromotionCategories } from '@/hooks/usePromotions';
import { Promotion } from '@/types';

export default function OffersScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numCols = isTablet ? 3 : 2;
  const PADDING = isTablet ? 20 : 16;
  const GAP = 12;

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: catData } = usePromotionCategories();
  const categories = catData?.categories ?? [];

  const { data, isLoading, isError, refetch } = usePromotions(selectedCategory, 60);
  const promotions = data?.promotions ?? [];

  const itemWidth = (width - PADDING * 2 - GAP * (numCols - 1)) / numCols;

  const renderItem = ({ item, index }: { item: Promotion; index: number }) => (
    <View style={{ width: itemWidth, marginRight: (index + 1) % numCols === 0 ? 0 : GAP, marginBottom: GAP }}>
      <PromotionCard promotion={item} variant="grid" />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: PADDING }]}>
        <View>
          <Text style={styles.headerLabel}>THIS WEEK</Text>
          <Text style={[styles.headerTitle, isTablet && { fontSize: 30 }]}>Offers & Deals</Text>
          {data?.pagination && (
            <Text style={styles.headerCount}>
              {data.pagination.total} offer{data.pagination.total !== 1 ? 's' : ''} available
            </Text>
          )}
        </View>
      </View>

      {/* Category chips */}
      {categories.length > 0 && (
        <View style={styles.chipBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.chipContent, { paddingHorizontal: PADDING }]}
          >
            <Chip label="All" active={!selectedCategory} onPress={() => setSelectedCategory(undefined)} />
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={formatCategory(cat)}
                active={selectedCategory === cat}
                onPress={() => setSelectedCategory(selectedCategory === cat ? undefined : cat)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : isError ? (
        <View style={styles.center}>
          <EmptyState icon="wifi-outline" title="Could not load offers" subtitle="Check your connection and try again" />
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : promotions.length === 0 ? (
        <EmptyState
          icon="pricetag-outline"
          title={selectedCategory ? `No offers in "${formatCategory(selectedCategory)}"` : 'No active offers right now'}
          subtitle="Check back soon for the latest deals from BBSM"
        />
      ) : (
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id}
          numColumns={numCols}
          key={String(numCols)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: PADDING, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ── Chip ─────────────────────────────────────────────────────────────────

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatCategory(cat: string): string {
  return cat.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.textPrimary,
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
  headerCount: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
  },

  chipBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  chipContent: {
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: Colors.background,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontFamily: 'Sora_600SemiBold', fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  retryBtn: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
  },
  retryText: { fontFamily: 'Sora_600SemiBold', fontSize: 13, color: Colors.primary },
});
