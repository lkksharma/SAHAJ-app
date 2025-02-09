import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Image,
  } from 'react-native';
  import React, { useState } from 'react';
  import { TextInput } from 'react-native';
  import { useRouter } from 'expo-router';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { doc, getDoc } from "firebase/firestore";
  import { db } from '../../config/FirebaseConfig';
  
  export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const auth = getAuth();
  
    const OnSignInClick = async () => {
      if (!email || !password) {
        ToastAndroid.show('Please fill all the details', ToastAndroid.BOTTOM);
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
  
      setLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (userSnap.exists()) {
          const role = userSnap.data().role;
          switch (role) {
            case "client":
              router.push('(tabs)');
              break;
            case "hospital":
              router.push('hospital');
              break;
            case "doctor":
              router.push('doctor');
              break;
            default:
              Alert.alert('Error', 'Invalid Role');
          }
        } else {
          router.push('(tabs)');
        }
      } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          Alert.alert('Error', 'Invalid Email or Password');
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>

        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: '/api/placeholder/100/100' }}
              style={styles.logo}
            />
            <Text style={styles.textHeader}>Welcome Back</Text>
            <Text style={styles.subText}>Your first step towards transparency</Text>
          </View>
  
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
            </View>
  
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
              />
            </View>
  
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={OnSignInClick}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => router.push('login/signup')}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    content: {
      flex: 1,
      padding: 24,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
      borderRadius: 50,
    },
    textHeader: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    subText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    form: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 16,
      fontSize: 16,
      color: '#333',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 32,
    },
    forgotPasswordText: {
      color: '#8b5cf6',
      fontSize: 14,
      fontWeight: '600',
    },
    button: {
      backgroundColor: '#4f46e5',
      borderRadius: 25,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
      elevation: 4,
      shadowColor: '#8b5cf6',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    buttonDisabled: {
      backgroundColor: '#c4b5fd',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    registerButton: {
      backgroundColor: '#fff',
      borderRadius: 25,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#8b5cf6',
      marginTop: 8,
    },
    registerButtonText: {
      color: '#8b5cf6',
      fontSize: 18,
      fontWeight: '600',
    },
  });