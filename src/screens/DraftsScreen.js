import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ImageBackground, SafeAreaView } from 'react-native';
import { ChevronRight, Trash2, Calendar, FileText, Menu, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';
import { apiRequest } from '../api';

export default function DraftsScreen({ onNavigateBack, onNavigateCart, onOpenMenu }) {
  const { loadDraft } = useContext(CartContext);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDrafts = async () => {
    try {
      const res = await apiRequest('/drafts/my-drafts', 'GET');
      if (res.success) {
        setDrafts(res.drafts || []);
      } else {
        console.error('Failed to fetch drafts:', res.message);
      }
    } catch (err) {
      console.error('Fetch drafts error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDrafts();
  };

  const handleContinueDraft = (draft) => {
    Alert.alert(
      'Continue Draft',
      'This will load draft items into your cart. Any existing items in the cart will be replaced.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            loadDraft(draft);
            onNavigateCart();
          } 
        }
      ]
    );
  };

  const handleDeleteDraft = (id, draftNo) => {
    Alert.alert(
      'Delete Draft',
      `Are you sure you want to delete draft ${draftNo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const res = await apiRequest(`/drafts/${id}`, 'DELETE');
            if (res.success) {
              fetchDrafts();
            } else {
              setLoading(false);
              Alert.alert('Error', res.message || 'Failed to delete draft');
            }
          } 
        }
      ]
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDraftItem = ({ item }) => {
    const totalItems = item.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.draftNo}>{item.draftNo || 'Draft Quotation'}</Text>
            <View style={styles.dateRow}>
              <Calendar size={12} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.dateText}>{formatDate(item.updatedAt || item.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>{item.items.length} {item.items.length === 1 ? 'Product' : 'Products'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.itemsHeading}>Items Preview:</Text>
          {item.items.slice(0, 3).map((subItem, index) => (
            <Text key={index} style={styles.previewItemText} numberOfLines={1}>
              • {subItem.productName} ({subItem.quantity} {subItem.uom || 'Nos'}{subItem.size ? `, Size: ${subItem.size}` : ''})
            </Text>
          ))}
          {item.items.length > 3 && (
            <Text style={styles.moreItemsText}>+ {item.items.length - 3} more items...</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => handleDeleteDraft(item.id, item.draftNo)}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueBtn} 
            onPress={() => handleContinueDraft(item)}
          >
            <ShoppingCart size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.continueBtnText}>Continue Quotation</Text>
            <ChevronRight size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../../assets/splash_bg.png')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
            <ArrowLeft color="#27347a" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SAVED DRAFTS</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
            <RefreshCw color="#27347a" size={20} />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#27347a" />
          </View>
        ) : drafts.length === 0 ? (
          <View style={styles.centerContainer}>
            <FileText size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No Saved Drafts</Text>
            <Text style={styles.emptySubtitle}>
              You can save quotations as drafts from your cart and finalize them later.
            </Text>
          </View>
        ) : (
          <FlatList
            data={drafts}
            keyExtractor={(item) => item.id}
            renderItem={renderDraftItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#27347a',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  refreshBtn: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#27347a',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  emptySubtitle: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafaf9',
  },
  draftNo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e3a8a',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  itemBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  itemBadgeText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  itemsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  previewItemText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 4,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafaf9',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  continueBtn: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  continueBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
