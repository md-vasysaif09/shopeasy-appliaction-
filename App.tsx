import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Product = {
  id: string;
  name: string;
  price: number;
  rating: number;
  emoji: string;
  category: string;
  color: string;
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Running Shoes', price: 2499, rating: 4.5, emoji: '👟', category: 'Fashion', color: '#fde2e4' },
  { id: '2', name: 'Smart Watch', price: 3999, rating: 4.3, emoji: '⌚', category: 'Electronics', color: '#e2ece9' },
  { id: '3', name: 'Headphones', price: 1799, rating: 4.6, emoji: '🎧', category: 'Electronics', color: '#dfe7fd' },
  { id: '4', name: 'Backpack', price: 1299, rating: 4.2, emoji: '🎒', category: 'Fashion', color: '#fff1e6' },
  { id: '5', name: 'Coffee Beans', price: 499, rating: 4.8, emoji: '☕', category: 'Grocery', color: '#f0efeb' },
  { id: '6', name: 'Fresh Apples', price: 199, rating: 4.4, emoji: '🍎', category: 'Grocery', color: '#ffe5ec' },
  { id: '7', name: 'Sunglasses', price: 999, rating: 4.1, emoji: '🕶️', category: 'Fashion', color: '#e9edc9' },
  { id: '8', name: 'Laptop', price: 54999, rating: 4.7, emoji: '💻', category: 'Electronics', color: '#cddafd' },
  { id: '9', name: 'Desk Plant', price: 349, rating: 4.5, emoji: '🪴', category: 'Home', color: '#d8f3dc' },
  { id: '10', name: 'Table Lamp', price: 899, rating: 4.0, emoji: '💡', category: 'Home', color: '#fefae0' },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Grocery', 'Home'];

const formatPrice = (amount: number) => `₹${amount}`;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ShopScreen />
    </SafeAreaProvider>
  );
}

function ShopScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const products = useMemo(
    () =>
      PRODUCTS.filter(
        p =>
          (category === 'All' || p.category === category) &&
          p.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [search, category],
  );

  const cartItems = PRODUCTS.filter(p => cart[p.id]);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);

  const changeQty = (id: string, delta: number) =>
    setCart(prev => {
      const qty = (prev[id] ?? 0) + delta;
      const next = { ...prev };
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });

  const checkout = () => {
    Alert.alert('Order placed! 🎉', `You paid ${formatPrice(cartTotal)}`);
    setCart({});
    setCartOpen(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.title}>ShopEasy</Text>
        </View>
        <Pressable style={styles.cartButton} onPress={() => setCartOpen(true)}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="🔍  Search products"
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}>
        {CATEGORIES.map(c => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.chip, category === c && styles.chipActive]}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Products */}
      <FlatList
        data={products}
        keyExtractor={p => p.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.banner}>
            <View>
              <Text style={styles.bannerTitle}>Mega Sale 🔥</Text>
              <Text style={styles.bannerText}>Up to 50% off on top picks</Text>
            </View>
            <Text style={styles.bannerEmoji}>🛍️</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No products found 😕</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.imageBox, { backgroundColor: item.color }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
              <Pressable
                style={[styles.addButton, cart[item.id] ? styles.addButtonActive : null]}
                onPress={() => changeQty(item.id, 1)}>
                <Text style={styles.addText}>{cart[item.id] ? `✓ ${cart[item.id]}` : '+'}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Cart */}
      <Modal
        visible={cartOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setCartOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>My Cart</Text>
              <Pressable onPress={() => setCartOpen(false)}>
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            {cartItems.length === 0 ? (
              <Text style={styles.empty}>Your cart is empty 🛍️</Text>
            ) : (
              <ScrollView style={styles.cartList}>
                {cartItems.map(item => (
                  <View key={item.id} style={styles.cartRow}>
                    <Text style={styles.cartEmoji}>{item.emoji}</Text>
                    <View style={styles.flex1}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    </View>
                    <View style={styles.qtyBox}>
                      <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.id, -1)}>
                        <Text style={styles.qtyText}>−</Text>
                      </Pressable>
                      <Text style={styles.qty}>{cart[item.id]}</Text>
                      <Pressable style={styles.qtyBtn} onPress={() => changeQty(item.id, 1)}>
                        <Text style={styles.qtyText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
            </View>
            <Pressable
              style={[styles.checkout, cartCount === 0 && styles.checkoutDisabled]}
              disabled={cartCount === 0}
              onPress={checkout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const PURPLE = '#5f27cd';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: { fontSize: 14, color: '#888' },
  title: { fontSize: 26, fontWeight: '800', color: '#1d1d1f' },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  cartIcon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  search: {
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1d1d1f',
    elevation: 1,
  },
  chipsScroll: { flexGrow: 0, flexShrink: 0 },
  chips: { paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff' },
  chipActive: { backgroundColor: PURPLE },
  chipText: { color: '#555', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PURPLE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerText: { color: '#e0d7ff', marginTop: 4 },
  bannerEmoji: { fontSize: 48 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, marginBottom: 20, fontSize: 16 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    elevation: 2,
  },
  imageBox: {
    height: 110,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: { fontSize: 52 },
  name: { fontSize: 15, fontWeight: '700', color: '#1d1d1f' },
  rating: { fontSize: 12, color: '#888', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: { fontSize: 15, fontWeight: '800', color: PURPLE },
  addButton: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonActive: { backgroundColor: '#10ac84' },
  addText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#1d1d1f' },
  close: { fontSize: 20, color: '#888', padding: 4 },
  cartList: { maxHeight: 360 },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartEmoji: { fontSize: 36, marginRight: 12 },
  flex1: { flex: 1 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0ebff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 18, color: PURPLE, fontWeight: '700' },
  qty: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center', color: '#1d1d1f' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  totalLabel: { fontSize: 16, color: '#888' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#1d1d1f' },
  checkout: {
    backgroundColor: PURPLE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutDisabled: { backgroundColor: '#c8c8d0' },
  checkoutText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});