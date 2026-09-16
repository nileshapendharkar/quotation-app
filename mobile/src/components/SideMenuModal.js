import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Image, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  Home, 
  Bookmark, 
  ShoppingCart, 
  PackageCheck, 
  Building2, 
  LogOut, 
  Trash2, 
  X,
  Camera,
  FileText
} from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function SideMenuModal({ visible, onClose, onNavigate }) {
  const { user, logout, deleteAccount, updateProfileImage } = useContext(AuthContext);

  const menuItems = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Favorite', label: 'Saved', icon: Bookmark },
    { id: 'Cart', label: 'Cart', icon: ShoppingCart },
    { id: 'Orders', label: 'My Orders', icon: PackageCheck },
    { id: 'Drafts', label: 'Saved Drafts', icon: FileText },
    { id: 'CompanyProfile', label: 'Company Profile', icon: Building2 },
  ];

  const handleLogout = () => {
    onClose();
    logout();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            onClose();
            await deleteAccount();
          } 
        }
      ]
    );
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo gallery to select a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (updateProfileImage) {
          await updateProfileImage(selectedUri);
        }
      }
    } catch (e) {
      console.error('Image selection error:', e);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  // Safe fallback for user info & profile picture
  const companyName = (user && user.companyName) || 'Gouri Aqua Plast';
  const mobileNumber = (user && user.mobile) || '+91 92250 87140';
  const profileAvatar = (user && user.profileImage) 
    ? { uri: user.profileImage } 
    : require('../../assets/icon.png');

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        {/* Click outside to close */}
        <TouchableOpacity style={styles.overlayBackground} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.menuContainer}>
          {/* Header Profile Section */}
          <ImageBackground 
            source={require('../../assets/splash_bg.png')} 
            style={styles.headerBackground} 
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#1e3a8a" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} activeOpacity={0.8}>
                <Image source={profileAvatar} style={styles.avatarImage} />
                <View style={styles.editBadge}>
                  <Camera size={14} color="#1e3a8a" />
                </View>
              </TouchableOpacity>

              <Text style={styles.userName} numberOfLines={1}>{companyName}</Text>
              <Text style={styles.userMobile}>{mobileNumber}</Text>
            </View>
          </ImageBackground>

          {/* Menu Options */}
          <ScrollView style={styles.menuList} contentContainerStyle={styles.menuListContent}>
            {menuItems.map((item) => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    onNavigate(item.id);
                  }}
                >
                  <IconComp size={24} color="#27347a" />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <LogOut size={22} color="#f59e0b" />
              <Text style={[styles.menuLabel, { color: '#f59e0b' }]}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
              <Trash2 size={22} color="#ef4444" />
              <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Delete Account</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Gouri Aqua Plast v2.0</Text>
            <Text style={styles.footerSub}>Ganesh Gouri Industries - Quotation Only</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '85%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  headerBackground: {
    width: '100%',
    height: 220,
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: 20,
    paddingTop: 45,
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    padding: 8,
  },
  avatarWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userName: {
    color: '#1e3a8a',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  userMobile: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  menuLabel: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  footerSub: {
    color: '#0891b2',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
