import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ImageBackground } from 'react-native';
import { ArrowLeft, Trash2, Bell } from 'lucide-react-native';

const INITIAL_NOTIFICATIONS = [
  { id: 'h1', type: 'header', title: 'Today' },
  { id: '1', title: 'Newly launched product', time: '4 hours ago', unread: true },
  { id: '2', title: '10 layer Gold with special features', time: '10 hours ago', unread: true },
  { id: '3', title: '10 layer Gold with special features', time: '10 hours ago', unread: true },
  { id: 'h2', type: 'header', title: 'This Week' },
  { id: '4', title: 'Newly launched product', time: '19 August', unread: true },
  { id: '5', title: '10 layer Gold with special features', time: '17 August', unread: false },
  { id: '6', title: '10 layer Gold with special features', time: '16 August', unread: false },
  { id: '7', title: '14 layer Gold with special features', time: '14 August', unread: true },
  { id: '8', title: '10 layer Gold with special features', time: '12 August', unread: true },
];

export default function NotificationsScreen({ onNavigateBack }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const notificationCount = notifications.filter(item => item.type !== 'header').length;

  return (
    <ImageBackground source={require('../../assets/splash_bg.png')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onNavigateBack} style={styles.backBtn}>
            <ArrowLeft color="#27347a" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {notificationCount > 0 ? (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearHeaderBtn} activeOpacity={0.7}>
              <Text style={styles.clearHeaderBtnText}>Clear All</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 64 }} />
          )}
        </View>

        {/* Subheader */}
        <View style={styles.subheaderContainer}>
          <Text style={styles.subheaderText}>
            You have <Text style={styles.subheaderHighlight}>{notificationCount} {notificationCount === 1 ? 'Notification' : 'Notifications'}</Text>
          </Text>
          {notificationCount > 0 ? (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearSubheaderBtn} activeOpacity={0.7}>
              <Trash2 color="#ef4444" size={15} />
              <Text style={styles.clearSubheaderText}>Clear All</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Notifications List or Empty State */}
        {notificationCount > 0 ? (
          <FlatList 
            data={notifications}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return (
                  <Text style={styles.sectionHeader}>{item.title}</Text>
                );
              }

              return (
                <View style={styles.notificationRow}>
                  <View style={styles.indicatorContainer}>
                    {item.unread ? <View style={styles.unreadDot} /> : null}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Bell color="#27347a" size={44} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up! Check back later for new updates.</Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: '#27347a',
    fontSize: 24,
    fontWeight: '700',
  },
  clearHeaderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(39, 52, 122, 0.08)',
    borderRadius: 14,
  },
  clearHeaderBtnText: {
    color: '#27347a',
    fontSize: 13,
    fontWeight: '700',
  },
  subheaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  subheaderHighlight: {
    color: '#0891b2',
    fontWeight: '700',
    fontStyle: 'italic',
  },
  clearSubheaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearSubheaderText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorContainer: {
    width: 24,
    alignItems: 'center',
    paddingTop: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff0000',
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(39, 52, 122, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#27347a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
