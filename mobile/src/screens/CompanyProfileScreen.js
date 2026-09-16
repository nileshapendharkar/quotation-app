import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, ImageBackground, SafeAreaView } from 'react-native';
import { Building2, User, Phone, Mail, Save, ArrowLeft, Building } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

export default function CompanyProfileScreen({ onNavigateBack }) {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState(user ? user.name : 'Bunnny');
  const [email] = useState(user ? user.email : 'Bunnnyenterprices@gmail.com');
  const [mobile, setMobile] = useState(user ? user.mobile : '+91 98765 43210');
  const [companyName, setCompanyName] = useState(user ? user.companyName : 'Bunnny Enterprises');
  const [companyAddress, setCompanyAddress] = useState(user ? user.companyAddress : 'Building No 165, Jaripatka, Main Bazar Road,\nNagpur, Maharashtra, 440005');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await updateProfile({
      name,
      mobile,
      companyName,
      companyAddress
    });
    setLoading(false);
    if (res.success) {
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', res.message || 'Update failed');
    }
  };

  return (
    <ImageBackground source={require('../../assets/splash_bg.png')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          
          <TouchableOpacity onPress={onNavigateBack} style={styles.backBtn}>
            <ArrowLeft size={22} color="#27347a" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Building2 size={36} color="#27347a" style={{ marginBottom: 12 }} />
            <Text style={styles.title}>Company & Profile Details</Text>
            <Text style={styles.subtitle}>This information appears on generated PDF quotations.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Person Name</Text>
              <View style={styles.inputBox}>
                <User size={18} color="#000000" style={styles.icon} fill="#000000" />
                <TextInput style={styles.input} value={name} onChangeText={setName} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address (Read-only)</Text>
              <View style={styles.inputBox}>
                <Mail size={18} color="#000000" style={styles.icon} fill="#000000" />
                <TextInput style={styles.input} value={email} editable={false} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputBox}>
                <Phone size={18} color="#000000" style={styles.icon} fill="#000000" />
                <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company / Business Name</Text>
              <View style={styles.inputBox}>
                <Building size={18} color="#000000" style={styles.icon} fill="#000000" />
                <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company / Business Address</Text>
              <View style={[styles.inputBox, { height: 90, alignItems: 'flex-start', paddingTop: 12 }]}>
                <Building size={18} color="#000000" style={styles.icon} fill="#000000" />
                <TextInput 
                  style={[styles.input, { textAlignVertical: 'top' }]} 
                  value={companyAddress} 
                  onChangeText={setCompanyAddress}
                  multiline
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <React.Fragment>
                  <Save size={20} color="#ffffff" />
                  <Text style={styles.saveText}>Save Profile Changes</Text>
                </React.Fragment>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backText: {
    color: '#27347a',
    fontSize: 22,
    fontWeight: '400',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '400',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
  },
  form: {
    gap: 16,
  },
  inputGroup: {},
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#94a3b8', // Match the grey text from the screenshot
    fontSize: 14,
    fontWeight: '400',
  },
  saveBtn: {
    backgroundColor: '#27347a',
    height: 52,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
