/**
 * Promotion Detail Screen
 *
 * Full-page view of a single promotion.
 * Navigated to by tapping a PromotionCard anywhere in the app.
 */
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { usePromotion } from '@/hooks/usePromotions';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NP', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCategory(category: string): string {
  return category
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function PromotionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError } = usePromotion(id);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !data?.promotion) {
    return (
      <EmptyState
        icon="pricetag-outline"
        title="Offer not found"
        subtitle="This offer may have expired or been removed"
      />
    );
  }

  const promo = data.promotion;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Promotion image */}
      {promo.image_url ? (
        <Image
          source={{ uri: promo.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>BBSM</Text>
        </View>
      )}

      <View style={styles.body}>
        {/* Category badge */}
        {promo.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {formatCategory(promo.category)}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{promo.title}</Text>

        {/* Validity dates */}
        <View style={styles.dateRow}>
          <View style={styles.datePill}>
            <Text style={styles.datePillLabel}>Valid until</Text>
            <Text style={styles.datePillValue}>{formatDate(promo.end_date)}</Text>
          </View>
        </View>

        {/* Description */}
        {promo.description ? (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Details</Text>
            <Text style={styles.description}>{promo.description}</Text>
          </View>
        ) : null}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Valid at all 28 BBSM locations across Nepal. While stocks last.
            BBSM reserves the right to modify or withdraw this offer at any time.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: Colors.primaryLight,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 40,
    color: Colors.primary,
    opacity: 0.3,
    letterSpacing: 4,
  },
  body: {
    padding: 20,
    gap: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: Colors.textOnPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'Sora_700Bold',
    fontSize: 22,
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  dateRow: {
    flexDirection: 'row',
  },
  datePill: {
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.accent,
    gap: 2,
  },
  datePillLabel: {
    fontFamily: 'Sora_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  datePillValue: {
    fontFamily: 'Sora_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  descriptionSection: {
    gap: 6,
  },
  descriptionLabel: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  description: {
    fontFamily: 'Sora_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  disclaimer: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  disclaimerText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
