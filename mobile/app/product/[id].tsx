import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !data?.product) {
    return (
      <EmptyState
        icon="cube-outline"
        title="Product not found"
        subtitle="This product may no longer be available"
      />
    );
  }

  const p = data.product;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Image */}
      {p.image_url ? (
        <Image source={{ uri: p.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={64} color={Colors.border} />
        </View>
      )}

      <View style={styles.body}>
        {/* Category breadcrumb */}
        {(p.category || p.subcategory) && (
          <View style={styles.breadcrumb}>
            {p.category && <Text style={styles.breadcrumbText}>{p.category}</Text>}
            {p.category && p.subcategory && (
              <Ionicons name="chevron-forward" size={12} color={Colors.textMuted} />
            )}
            {p.subcategory && <Text style={styles.breadcrumbText}>{p.subcategory}</Text>}
          </View>
        )}

        {/* Name */}
        <Text style={styles.name}>{p.name}</Text>
        {p.name_ne && <Text style={styles.nameNe}>{p.name_ne}</Text>}

        {/* Featured badge */}
        {p.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color="#fff" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs {Number(p.price).toLocaleString()}</Text>
          <Text style={styles.unit}>/ {p.unit}</Text>
        </View>

        {/* Description */}
        {p.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Details</Text>
            <Text style={styles.description}>{p.description}</Text>
          </View>
        )}

        {/* SKU */}
        {p.sku && (
          <View style={styles.skuRow}>
            <Ionicons name="pricetag-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.skuLabel}>SKU</Text>
            <Text style={styles.skuValue}>{p.sku}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Available at all 28 BBSM stores across Nepal. While stocks last.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMG_HEIGHT = Math.round(SCREEN_HEIGHT * 0.38);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 56,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMG_HEIGHT,
    backgroundColor: Colors.surfaceAlt,
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: IMG_HEIGHT,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 22,
    gap: 14,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: 'Sora_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.44,
  },
  nameNe: {
    fontFamily: 'Sora_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -6,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginVertical: 4,
  },
  price: {
    fontFamily: 'Sora_700Bold',
    fontSize: 34,
    color: Colors.primary,
    letterSpacing: -0.44,
  },
  unit: {
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    color: Colors.textMuted,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  description: {
    fontFamily: 'Sora_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  skuLabel: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  skuValue: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  disclaimer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    marginTop: 4,
  },
  disclaimerText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
