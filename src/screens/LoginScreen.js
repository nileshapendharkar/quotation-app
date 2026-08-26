import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, Image, SafeAreaView, Dimensions, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Smartphone, ChevronDown } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ onNavigateRegister, onNavigateForgot }) {
  const { login, sendOtp: loginContextSendOtp } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = Phone input, 2 = OTP input
  const [otpToken, setOtpToken] = useState(null);

  const otpRefs = useRef([]);

  const handleSendOTP = async () => {
    setError('');
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    setLoading(true);
    const res = await login.sendOtp ? await login.sendOtp(phone) : await loginContextSendOtp(phone);
    setLoading(false);

    if (res.success) {
      setOtpToken(res.otpToken);
      setStep(2);
      
      // Auto-fill OTP for development/testing
      if (res.mockOtp) {
        console.log('Mock OTP Auto-filled:', res.mockOtp);
        setOtp(res.mockOtp.toString());
      } else {
        setOtp('');
      }
    } else {
      setError(res.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!phone || otp.length === 0) {
      setError('Please enter your complete OTP / Password');
      return;
    }
    setLoading(true);
    // Pass phone as userId, otp as password, and otpToken
    const res = await login(phone, otp, otpToken);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleOtpChange = (val, index) => {
    let newOtp = otp.split('');
    newOtp[index] = val;
    setOtp(newOtp.join(''));

    if (val && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/splash_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollGrow} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {/* Logo Section */}
              <View style={styles.brandBox}>
                <Image
                  source={require('../../assets/splash_logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.brandTitle}>Login</Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Form Section */}
              <View style={styles.form}>
                {step === 1 ? (
                  <View>
                    <Text style={styles.inputLabel}>Phone Number:</Text>
                    <View style={styles.inputContainer}>
                      <Smartphone size={22} color="#000" style={styles.icon} />
                      <View style={styles.countryCodeContainer}>
                        <Text style={styles.countryCodeText}>+91</Text>
                        <ChevronDown size={14} color="#000" />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="98765 43210"
                        placeholderTextColor="#94a3b8"
                        value={phone}
                        onChangeText={setPhone}
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                      />
                    </View>
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSendOTP} disabled={loading}>
                      <Text style={styles.submitText}>Send OTP</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.otpLabelTop}>OTP Send to</Text>
                    <View style={styles.otpPhoneRow}>
                      <Text style={styles.otpPhoneText}>+91 {phone || '98765 43210'}</Text>
                      <TouchableOpacity onPress={() => setStep(1)}>
                        <Text style={styles.editNumberText}>Edit Number</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.otpBoxesContainer}>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => (otpRefs.current[index] = ref)}
                          style={styles.otpBox}
                          placeholder="0"
                          placeholderTextColor="#f1f5f9"
                          keyboardType="number-pad"
                          maxLength={1}
                          secureTextEntry={false}
                          value={otp[index] || ''}
                          onChangeText={(val) => handleOtpChange(val, index)}
                          onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        />
                      ))}
                    </View>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
                      {loading ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text style={styles.submitText}>Verify & Continue</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  scrollGrow: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 13,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  icon: {
    marginRight: 10,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#27347a',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#27347a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  otpLabelTop: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 4,
    marginLeft: 5,
  },
  otpPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 5,
  },
  otpPhoneText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginRight: 12,
  },
  editNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27347a',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 2,
  },
  otpBox: {
    width: 45,
    height: 55,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  }
});
