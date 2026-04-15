/**
 * Home Screen — Apple-style clean layout
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { PromotionCard } from '@/components/PromotionCard';
import { StorePicker } from '@/components/StorePicker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { usePromotions } from '@/hooks/usePromotions';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const hp = isTablet ? 28 : 20;

  const { selectedStore, hasSeenStorePicker } = useAppStore();
  const [storePickerOpen, setStorePickerOpen] = useState(!hasSeenStorePicker);

  const { data, isLoading, isError, refetch } = usePromotions(undefined, 10);
  const promotions = data?.promotions ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingHorizontal: hp }]}>
        <View>
          <Text style={[styles.logoText, isTablet && { fontSize: 30 }]}>BBSM</Text>
          <Text style={styles.logoSub}>Bhat-Bhateni</Text>
        </View>

        <TouchableOpacity
          style={styles.storePill}
          onPress={() => setStorePickerOpen(true)}
          activeOpacity={0.75}
        >
          <Ionicons name="location-sharp" size={13} color="#fff" />
          <Text style={styles.storePillText} numberOfLines={1}>
            {selectedStore ? selectedStore.name : 'Choose store'}
          </Text>
          <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: hp }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ──────────────────────────────────────────────── */}
        <View style={styles.greetSection}>
          <Text style={[styles.greetLine, isTablet && { fontSize: 32 }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.greetSub, isTablet && { fontSize: 16 }]}>
            Nepal's largest supermarket chain
          </Text>
        </View>

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <View style={[styles.actionsRow, isTablet && styles.actionsRowTablet]}>
          <QuickAction
            icon="storefront-outline"
            label="Find Store"
            color={Colors.steelBlue}
            bg={Colors.steelBlueLight}
            isTablet={isTablet}
            onPress={() => router.push('/(tabs)/stores')}
          />
          <QuickAction
            icon="pricetag-outline"
            label="All Offers"
            color={Colors.primary}
            bg={Colors.primaryLight}
            isTablet={isTablet}
            onPress={() => router.push('/(tabs)/offers')}
          />
          <QuickAction
            icon="cart-outline"
            label="Shop"
            color={Colors.orange}
            bg={Colors.orangeLight}
            isTablet={isTablet}
            onPress={() => router.push('/(tabs)/shopping')}
          />
        </View>

        {/* ── Latest Offers ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isTablet && { fontSize: 22 }]}>Latest Offers</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/offers')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.carouselLoader}>
              <LoadingSpinner />
            </View>
          ) : isError ? (
            <View style={styles.carouselError}>
              <EmptyState icon="wifi-outline" title="Could not load offers" subtitle="Tap to retry" />
              <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : promotions.length === 0 ? (
            <EmptyState
              icon="pricetag-outline"
              title="No offers right now"
              subtitle="Check back soon for the latest deals"
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8 }}
              decelerationRate="fast"
              snapToInterval={width * 0.80 + 14}
              snapToAlignment="start"
            >
              {promotions.map((p) => (
                <PromotionCard key={p.id} promotion={p} variant="featured" />
              ))}
            </ScrollView>
          )}
        </View>

        {/* ── My Store card ─────────────────────────────────────────── */}
        {selectedStore && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isTablet && { fontSize: 22 }, { marginBottom: 12 }]}>
              My Store
            </Text>
            <TouchableOpacity
              style={styles.storeCard}
              onPress={() => router.push(`/store/${selectedStore.id}`)}
              activeOpacity={0.85}
            >
              <View style={[styles.storeIconBox, isTablet && { width: 52, height: 52, borderRadius: 14 }]}>
                <Ionicons name="storefront" size={isTablet ? 24 : 20} color={Colors.primary} />
              </View>
              <View style={styles.storeCardBody}>
                <Text style={[styles.storeCardName, isTablet && { fontSize: 17 }]} numberOfLines={1}>
                  {selectedStore.name}
                </Text>
                <Text style={styles.storeCardAddress} numberOfLines={1}>
                  {selectedStore.address}
                </Text>
                <View style={styles.storeCardHoursRow}>
                  <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.storeCardHours}>{selectedStore.hours}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom breathing room */}
        <View style={{ height: 16 }} />
      </ScrollView>

      <StorePicker visible={storePickerOpen} onDismiss={() => setStorePickerOpen(false)} />
    </SafeAreaView>
  );
}

// ── Quick action button ──────────────────────────────────────────────────

interface QuickActionProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  bg: string;
  isTablet: boolean;
  onPress: () => void;
}

function QuickAction({ icon, label, color, bg, isTablet, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.78}>
      <View style={[styles.actionIcon, { backgroundColor: bg }, isTablet && styles.actionIconTablet]}>
        <Ionicons name={icon} size={isTablet ? 28 : 22} color={color} />
      </View>
      <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 24,
    color: '#fff',
    letterSpacing: 2,
  },
  logoSub: {
    fontFamily: 'Sora_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 22,
    paddingHorizontal: 13,
    paddingVertical: 8,
    maxWidth: 190,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  storePillText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: '#fff',
    flex: 1,
  },

  // Scroll
  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 24, paddingBottom: 32 },

  // Greeting
  greetSection: { marginBottom: 24 },
  greetLine: {
    fontFamily: 'Sora_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  greetSub: {
    fontFamily: 'Sora_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Quick actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  actionsRowTablet: { gap: 16 },
  actionBtn: { flex: 1, alignItems: 'center', gap: 8 },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconTablet: { width: 76, height: 76, borderRadius: 22 },
  actionLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionLabelTablet: { fontSize: 14 },

  // Sections
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 19,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 14,
    color: Colors.primary,
  },

  // Carousel states
  carouselLoader: { height: 220, alignItems: 'center', justifyContent: 'center' },
  carouselError: { alignItems: 'center' },
  retryBtn: {
    marginTop: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
  },
  retryText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },

  // My Store card
  storeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  storeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCardBody: { flex: 1, gap: 3 },
  storeCardName: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  storeCardAddress: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  storeCardHoursRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  storeCardHours: {
    fontFamily: 'Sora_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
});
