/**
 * PromotionCard — editorial-style tappable card.
 *
 * variant="featured" → full-bleed image + gradient overlay (Home carousel)
 * variant="grid"     → image on top + clean content below (Offers grid)
 *
 * Design: Apple App Store / Apple TV editorial card style.
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Promotion } from '@/types';

interface Props {
  promotion: Promotion;
  variant?: 'featured' | 'grid';
}

function formatCategory(cat: string | null): string {
  if (!cat) return '';
  return cat.split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatEndDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PromotionCard({ promotion, variant = 'grid' }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isFeatured = variant === 'featured';
  const isTablet = width >= 768;

  const featuredWidth = isTablet ? width * 0.46 : width * 0.80;
  const featuredHeight = isTablet ? 260 : 220;
  const gridImageHeight = isTablet ? 170 : Math.round(width * 0.31);

  const handlePress = () => router.push(`/promotion/${promotion.id}`);

  if (isFeatured) {
    // ── Featured: full-bleed image + gradient overlay ─────────────────────
    return (
      <TouchableOpacity
        style={[styles.featuredCard, { width: featuredWidth, height: featuredHeight }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Image */}
        {promotion.image_url ? (
          <Image source={{ uri: promotion.image_url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
            <Text style={styles.placeholderLogo}>BBSM</Text>
          </View>
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.78)']}
          locations={[0, 0.4, 1]}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        >
          {/* Category badge */}
          {promotion.category && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>{formatCategory(promotion.category)}</Text>
            </View>
          )}

          {/* Bottom text */}
          <View style={styles.featuredBottom}>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {promotion.title}
            </Text>
            {promotion.description && (
              <Text style={styles.featuredDesc} numberOfLines={1}>
                {promotion.description}
              </Text>
            )}
            <Text style={styles.featuredDate}>Until {formatEndDate(promotion.end_date)}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // ── Grid: image on top, clean white content below ────────────────────────
  return (
    <TouchableOpacity style={styles.gridCard} onPress={handlePress} activeOpacity={0.9}>
      {/* Image with subtle category badge */}
      <View style={[styles.gridImageWrap, { height: gridImageHeight }]}>
        {promotion.image_url ? (
          <Image source={{ uri: promotion.image_url }} style={styles.gridImage} resizeMode="cover" />
        ) : (
          <View style={styles.gridPlaceholder}>
            <Text style={styles.gridPlaceholderText}>BBSM</Text>
          </View>
        )}
        {promotion.category && (
          <View style={styles.gridBadge}>
            <Text style={styles.gridBadgeText}>{formatCategory(promotion.category)}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>{promotion.title}</Text>
        <Text style={styles.gridDate}>Ends {formatEndDate(promotion.end_date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ── Featured ─────────────────────────────────────────────────────────────
  featuredCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: Colors.orangeLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 8,
  },
  placeholder: {
    backgroundColor: Colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLogo: {
    fontFamily: 'Sora_700Bold',
    fontSize: 36,
    color: Colors.orange,
    opacity: 0.35,
    letterSpacing: 4,
  },
  gradient: {
    justifyContent: 'space-between',
    padding: 14,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  featuredBadgeText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 10,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  featuredBottom: {
    gap: 4,
  },
  featuredTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
    color: '#fff',
    lineHeight: 25,
    letterSpacing: -0.44,
  },
  featuredDesc: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 18,
  },
  featuredDate: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },

  // ── Grid ─────────────────────────────────────────────────────────────────
  gridCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 5,
  },
  gridImageWrap: {
    width: '100%',
    backgroundColor: Colors.orangeLight,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    flex: 1,
    backgroundColor: Colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridPlaceholderText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 20,
    color: Colors.orange,
    opacity: 0.35,
    letterSpacing: 3,
  },
  gridBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  gridBadgeText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 9,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridContent: {
    padding: 13,
    gap: 4,
  },
  gridTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  gridDate: {
    fontFamily: 'Sora_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
  },
});
