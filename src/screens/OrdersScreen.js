import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Download } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { apiRequest, API_BASE_URL, getUserToken } from '../api';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function OrdersScreen({ onNavigateBack }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiRequest('/orders/my-orders');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleDownloadOrderPDF = async (order) => {
    if (!order || !order.id) return;
    const token = getUserToken();
    const downloadUrl = `${API_BASE_URL}/orders/download-pdf/${order.id}`;
    const filename = `Quotation_${order.orderNo || 'PDF'}.pdf`;

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.document) {
        const res = await fetch(downloadUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('Failed to download PDF from server');
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (downloadRes.status === 200) {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(downloadRes.uri, {
            UTI: '.pdf',
            mimeType: 'application/pdf',
            dialogTitle: `Download ${filename}`
          });
        } else {
          Alert.alert('Download Complete', `PDF saved to ${downloadRes.uri}`);
        }
      } else {
        Alert.alert('Error', 'Failed to download PDF from server.');
      }
    } catch (err) {
      console.error('Download PDF error:', err);
      Alert.alert('Error', 'Failed to download PDF.');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'All') return true;
    return (o.status || '').toLowerCase() === activeTab.toLowerCase();
  });

  const renderStatusBadge = (status) => {
    if (status === 'Pending') {
      return (
        <View style={[styles.badge, styles.badgePending]}>
          <Clock size={12} color="#d97706" />
          <Text style={[styles.badgeText, { color: '#d97706' }]}>Pending</Text>
        </View>
      );
    }
    if (status === 'Dispatched') {
      return (
        <View style={[styles.badge, styles.badgeDispatched]}>
          <CheckCircle2 size={12} color="#059669" />
          <Text style={[styles.badgeText, { color: '#059669' }]}>Dispatched</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeCancelled]}>
        <XCircle size={12} color="#dc2626" />
        <Text style={[styles.badgeText, { color: '#dc2626' }]}>Cancelled</Text>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../../assets/splash_bg.png')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.topHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={onNavigateBack} style={{paddingRight: 12}}>
                   <ArrowLeft color="#27347a" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders</Text>
              </View>
              <TouchableOpacity onPress={handleRefresh} style={{padding: 8}}>
                <RefreshCw color="#27347a" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSub}>Track Status • Product Name & Qty Only</Text>
          </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['All', 'Pending', 'Dispatched', 'Cancelled'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#27347a" />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyBox}>
          <ClipboardList size={48} color="#334155" />
          <Text style={styles.emptyTitle}>No {activeTab} Orders Found</Text>
          <Text style={styles.emptySub}>Your quotation requests will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderNo}>{item.orderNo}</Text>
                  <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</Text>
                </View>
                {renderStatusBadge(item.status)}
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>REQUESTED ITEMS (NO PRICING)</Text>
              <View style={styles.itemsList}>
                {(item.items || []).map((prod, idx) => (
                  <View key={idx} style={[styles.itemRow, { flexDirection: 'column', alignItems: 'stretch', gap: 4 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.itemTitle}>{prod.productName}</Text>
                      <Text style={styles.itemQty}>× {prod.quantity} {prod.uom || 'Nos'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {prod.size ? (
                        <Text style={{ fontSize: 10, color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 }}>Size: {prod.size}</Text>
                      ) : null}
                      {prod.productCode ? (
                        <Text style={{ fontSize: 10, color: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 }}>Code: {prod.productCode}</Text>
                      ) : null}
                      {prod.packing ? (
                        <Text style={{ fontSize: 10, color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 }}>Packing: {prod.packing}</Text>
                      ) : null}
                      {prod.categoryName ? (
                        <Text style={{ fontSize: 10, color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 }}>{prod.categoryName}</Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />
              
              <TouchableOpacity 
                style={styles.downloadPdfBtn} 
                onPress={() => handleDownloadOrderPDF(item)}
              >
                <Download size={14} color="#0ea5e9" />
                <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      </View>
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
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#27347a',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    color: '#0891b2',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtnActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  tabText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 14,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNo: {
    color: '#0ea5e9',
    fontSize: 15,
    fontWeight: '800',
  },
  orderDate: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgePending: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
  },
  badgeDispatched: {
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
  },
  badgeCancelled: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  sectionLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
  },
  itemTitle: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  itemQty: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16,
  },
  emptySub: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    alignSelf: 'flex-end',
    gap: 6,
  },
  downloadPdfBtnText: {
    color: '#0ea5e9',
    fontSize: 12,
    fontWeight: '700',
  },
});
