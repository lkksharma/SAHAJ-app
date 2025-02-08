import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/hope2.jpg')} 
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>SAHAJ</Text>
            <MaterialCommunityIcons name="heart-pulse" size={40} color="#fff" />
          </View>

          <View style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <Text style={styles.mainHeading}>
                Simplifying Healthcare with Transparency, Trust, and Tech
              </Text>
              <View style={styles.divider} />
            </View>

            <Text style={styles.subHeading}>
              Healthcare should be clear as day, not shrouded in mystery.
              Know your care, understand your costs, and feel empowered in your health journey.
            </Text>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('login/signin')}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Get Started</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms and Conditions of usage.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContainer: {
    marginTop: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 30,
    marginTop: 100,
    marginBottom: 40,
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentHeader: {
    marginBottom: 30,
  },
  mainHeading: {
    fontSize: 28,
    color: '#1e293b',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  divider: {
    height: 2,
    backgroundColor: '#6366f1',
    width: '40%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 1,
  },
  subHeading: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#4f46e5',
    elevation: 3,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 20,
    color: '#64748b',
    textAlign: 'center',
    fontSize: 12,
  },
});