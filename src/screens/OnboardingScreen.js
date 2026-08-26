import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView, ImageBackground } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ onNavigateNext }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onNavigateNext();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/splash_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={onNavigateNext}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={step === 0 
              ? require('../../assets/icon.png') 
              : require('../../assets/icon.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Easily Accessible</Text>
          <Text style={styles.subtitle}>
            Access your account anytime anywhere,{"\n"}your account is in your fingertips.
          </Text>
        </View>

        {/* Stars Row (Indicators) */}
        <View style={styles.starsContainer}>
          <Image 
            source={step === 0 ? require('../../assets/star1.png') : require('../../assets/star2.png')} 
            style={styles.star}
            resizeMode="contain"
          />
          <Image 
            source={step === 0 ? require('../../assets/star2.png') : require('../../assets/star1.png')} 
            style={styles.star}
            resizeMode="contain"
          />
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.nextButton, { backgroundColor: '#27347a', borderRadius: 40 }]} onPress={handleNext}>
            <ArrowRight color="#ffffff" size={32} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 24,
    padding: 10,
  },
  skipText: {
    color: '#0f2b6e',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  illustration: {
    width: width * 0.9,
    height: height * 0.4,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f2b6e',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#0f2b6e',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  star: {
    width: 24,
    height: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextArrow: {
    width: '100%',
    height: '100%',
  }
});
