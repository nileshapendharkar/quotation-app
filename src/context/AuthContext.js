import React, { createContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setAuthToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId, password, otpToken = null) => {
    const payload = { userId, mobile: userId, password };
    if (otpToken) payload.otpToken = otpToken;
    const res = await apiRequest('/auth/login', 'POST', payload);

    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setAuthToken(res.token);
      AsyncStorage.setItem('user', JSON.stringify(res.user));
      AsyncStorage.setItem('token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const sendOtp = async (mobile) => {
    const res = await apiRequest('/auth/send-otp', 'POST', { mobile });
    return res;
  };

  const register = async (userData) => {
    const res = await apiRequest('/auth/register', 'POST', userData);

    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      setAuthToken(res.token);
      AsyncStorage.setItem('user', JSON.stringify(res.user));
      AsyncStorage.setItem('token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    const res = await apiRequest('/auth/profile', 'PUT', profileData);
    if (res.success) {
      setUser(res.user);
      AsyncStorage.setItem('user', JSON.stringify(res.user));
      return { success: true, message: 'Profile updated' };
    }
    return { success: false, message: res.message || 'Update failed' };
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await apiRequest('/auth/change-password', 'POST', { oldPassword, newPassword });
    return res;
  };

  const deleteAccount = async () => {
    const res = await apiRequest('/auth/delete-account', 'DELETE');
    if (res.success) {
      logout();
    }
    return res;
  };

  const updateProfileImage = async (imageUri) => {
    const updatedUser = { ...(user || {}), profileImage: imageUri };
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      sendOtp,
      register,
      logout,
      updateProfile,
      updateProfileImage,
      changePassword,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
