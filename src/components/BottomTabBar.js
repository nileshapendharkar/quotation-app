import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Palette, Bookmark, ShoppingCart, PackageCheck } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

export default function BottomTabBar({ activeTab, onTabChange }) {
  const { cartItems } = useContext(CartContext);
  const cartCount = (cartItems && cartItems.length) || 0;

  const tabs = [
    { id: 'Home', label: 'HOME', icon: Home },
    { id: 'Product', label: '', icon: Palette },
    { id: 'Favorite', label: '', icon: Bookmark },
    { id: 'Cart', label: '', icon: ShoppingCart, showBadge: true },
    { id: 'Orders', label: '', icon: PackageCheck },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            {isActive ? (
              <View style={styles.activeTabWrapper}>
                <View style={styles.activeCircle}>
                  <IconComponent size={30} color="#27347a" fill="#27347a" />
                </View>
                {tab.label ? <Text style={styles.activeTabLabel}>{tab.label}</Text> : null}
              </View>
            ) : (
              <View style={styles.inactiveIconContainer}>
                <IconComponent size={26} color="#64748b" />
                {tab.showBadge && cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  activeTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
  },
  activeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#27347a', // The dark blue from screenshot
    shadowColor: '#27347a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 4,
  },
  activeTabLabel: {
    fontSize: 12,
    color: '#27347a',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  inactiveIconContainer: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
});
