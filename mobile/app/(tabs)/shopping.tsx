/**
 * Shopping / Products browse screen
 *
 * Features:
 * - Category chip filter
 * - Live search
 * - Responsive 2-col (phone) / 3-col (tablet) grid
 * - Featured badge + active filter strip
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

// ── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const PADDING = 16;
const GAP = 10;

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  name_ne: string | null;
  sku: string | null;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  price: number;
  unit: string;
  image_url: string | null;
  is_featured: boolean;
}

// ── Hooks ────────────────────────────────────────────────────────────────────
function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useProducts(category: string, search: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '80', offset: '0' });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`${API_BASE}/api/v1/products?${params}`);
      const json = await res.json();
      setProducts(json.data?.products ?? []);
    } catch {
      setError('Could not load products. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { products, loading, error, refetch: fetchProducts };
}

function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/products/categories`)
      .then((r) => r.json())
      .then((j) => setCategories(j.data?.categories ?? []))
      .catch(() => {});
  }, []);
  return categories;
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, width }: { product: Product; width: number }) {
  const router = useRouter();
  const imgHeight = Math.round(width * 0.82);
  return (
    <Pressable style={[cardStyles.card, { width }]} onPress={() => router.push(`/product/${product.id}`)} android_ripple={{ color: '#0001' }}>
      {/* Image */}
      <View style={[cardStyles.imgWrap, { height: imgHeight }]}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={cardStyles.img} resizeMode="cover" />
        ) : (
          <View style={cardStyles.imgPlaceholder}>
            <Ionicons name="image-outline" size={28} color={Colors.textMuted} />
          </View>
        )}
        {product.is_featured && (
          <View style={cardStyles.badge}>
            <Text style={cardStyles.badgeText}>Featured</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={cardStyles.info}>
        {product.category && (
          <Text style={cardStyles.category} numberOfLines={1}>{product.category}</Text>
        )}
        <Text style={cardStyles.name} numberOfLines={2}>{product.name}</Text>
        <View style={cardStyles.priceRow}>
          <Text style={cardStyles.price}>Rs {Number(product.price).toLocaleString()}</Text>
          <Text style={cardStyles.unit}>/{product.unit}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 5,
  },
  imgWrap: { backgroundColor: Colors.background, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 9,
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  info: { padding: 12, gap: 4 },
  category: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  name: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6, gap: 2 },
  price: { fontFamily: 'Sora_700Bold', fontSize: 15, color: Colors.primary, letterSpacing: -0.2 },
  unit: { fontFamily: 'Sora_400Regular', fontSize: 11, color: Colors.textSecondary },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ShoppingScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numCols = isTablet ? 3 : 2;
  const cardWidth = (width - PADDING * 2 - GAP * (numCols - 1)) / numCols;

  const [rawSearch, setRawSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const debouncedSearch = useDebounce(rawSearch, 400);

  const categories = useCategories();
  const { products, loading, error, refetch } = useProducts(activeCategory, debouncedSearch);

  const searchRef = useRef<TextInput>(null);

  const clearSearch = () => { setRawSearch(''); searchRef.current?.blur(); };
  const clearAll = () => { setRawSearch(''); setActiveCategory(''); };

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} width={cardWidth} />
    ),
    [cardWidth]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textSecondary} />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search products…"
            placeholderTextColor={Colors.textMuted}
            value={rawSearch}
            onChangeText={setRawSearch}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {rawSearch.length > 0 && (
            <Pressable onPress={clearSearch} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Category chips */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            <Pressable
              onPress={() => setActiveCategory('')}
              style={[styles.chip, !activeCategory && styles.chipActive]}
            >
              <Text style={[styles.chipText, !activeCategory && styles.chipTextActive]}>All</Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                style={[styles.chip, activeCategory === cat && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      {/* ── Active filter strip ── */}
      {(activeCategory || debouncedSearch) && !loading && (
        <View style={styles.filterStrip}>
          <Text style={styles.filterText}>
            {products.length} result{products.length !== 1 ? 's' : ''}
            {activeCategory ? ` in "${activeCategory}"` : ''}
            {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
          </Text>
          <Pressable onPress={clearAll} hitSlop={8}>
            <Text style={styles.filterClear}>Clear</Text>
          </Pressable>
        </View>
      )}

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="wifi-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refetch} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cube-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>
            {activeCategory || debouncedSearch ? 'Try a different search or category' : 'No products available yet'}
          </Text>
          {(activeCategory || debouncedSearch) && (
            <Pressable onPress={clearAll} style={styles.retryBtn}>
              <Text style={styles.retryText}>Clear Filters</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={numCols}
          key={String(numCols)}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={numCols > 1 ? { gap: GAP } : undefined}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.surface,
    paddingTop: 14,
    paddingBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerTitle: {
    fontFamily: 'Sora_700Bold',
    fontSize: 30,
    color: Colors.textPrimary,
    letterSpacing: -0.44,
    paddingHorizontal: PADDING,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: PADDING,
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Sora_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },

  chips: {
    paddingHorizontal: PADDING,
    paddingBottom: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
  },

  filterStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    paddingVertical: 10,
    backgroundColor: Colors.primaryLight,
  },
  filterText: {
    fontFamily: 'Sora_500Medium',
    fontSize: 12,
    color: Colors.primaryDark,
  },
  filterClear: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },

  grid: {
    padding: PADDING,
    gap: GAP,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  errorText: {
    fontFamily: 'Sora_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTitle: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 17,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  retryText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
});
