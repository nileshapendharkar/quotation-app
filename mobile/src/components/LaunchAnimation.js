import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, StatusBar, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LaunchAnimation({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo scale and opacity fade in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Wait a little and then Fade out entire screen
      setTimeout(() => {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) onFinish();
        });
      }, 1500); // Wait 1.5 seconds before fading out
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Background Image */}
      <Image
        source={require('../../assets/splash_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/splash_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 99999,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
