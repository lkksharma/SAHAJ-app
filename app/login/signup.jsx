import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './../../config/FirebaseConfig.jsx';
import { Picker } from '@react-native-picker/picker'
import { getFirestore, doc, setDoc } from "firebase/firestore";
const db = getFirestore();

export default function SignUp() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState('');
    const [id, setId] = useState();
    const [password, setPassword] = useState();
    const [username, setUsername] = useState();

    const OnCreateAccount = () => {
        if (!id || !password || !selectedOption) {
            ToastAndroid.show('Please fill all the details', ToastAndroid.BOTTOM);
            Alert.alert('Please enter email and password')
            return;
        }

        
        if (!id.includes('@') || !id.includes('.')) {
            ToastAndroid.show('Please enter a valid email address', ToastAndroid.BOTTOM);
            return;
        }

        createUserWithEmailAndPassword(auth, id, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            await updateProfile(user, {
                displayName: username
            });
            
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: id,
                role: selectedOption,
                dvit: "none",
            });

            console.log("User created:", user);
            console.log("Role stored in Firestore:", selectedOption);

            ToastAndroid.show('Account created successfully!', ToastAndroid.BOTTOM);
            router.push('login/signin');
        })
        .catch((error) => {
            console.log(error.code, error.message);
            if (error.code === 'auth/email-already-in-use') {
                ToastAndroid.show('Email already exists', ToastAndroid.BOTTOM);
            } else {
                ToastAndroid.show(error.message, ToastAndroid.BOTTOM);
            }
        });

    };

    return (
        <ScrollView scrollEnabled={true}>
            <View>
                <Text style={styles.textHeader}>Your first step towards Transparency</Text>
                <Text style={styles.subText}>Let's Register You</Text>
                <View style={{ padding: 10, marginTop: 25 }}>
                    <Text style={{ padding: 10, fontSize: 20, color: '#00000', fontWeight: 'bold' }}>Full Name (as on Aadhaar)</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type here..."
                    />
                    <Text style={{ padding: 10, fontSize: 20, color: '#00000', fontWeight: 'bold' }}>Username</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type here..."
                        onChangeText={(value)=>setUsername(value)}
                    />
                    <Text style={{ padding: 10, fontSize: 20, color: '#00000', fontWeight: 'bold' }}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        onChangeText={(value) => setId(value)}
                        keyboardType="email-address"
                    />
                    <Text style={{ padding: 10, fontSize: 20, color: '#00000', fontWeight: 'bold' }}>Mobile No. (registered with Aadhaar)</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type here..."
                        keyboardType="number-pad"
                    />
                    <Text style={{padding: 10, fontSize: 19, color: '#00000', fontWeight: 'bold' }}>Password</Text>
                    <TextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder="Your password"
                    />
                    <Text style={{padding: 10, fontSize: 19, color: '#00000', fontWeight: 'bold' }}>Re-confirm Password</Text>
                    <TextInput
                        style={styles.textInput}
                        secureTextEntry={true}
                        placeholder="Verify your password"
                        onChangeText={(value) => setPassword(value)}
                    />
                    <Text style={{ padding: 10, fontSize: 20, color: '#00000', fontWeight: 'bold' }}>Role</Text>
                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(itemValue) => setSelectedOption(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select..." value="" />
                        <Picker.Item label="Doctor" value="doctor" />
                        <Picker.Item label="Client" value="client" />
                        <Picker.Item label="Hospital" value="hospital" />
                    </Picker>
                    <Text style={styles.selectedText}>Selected: {selectedOption || 'None'}</Text>
                    <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.regi_button} onPress={() => router.push('login/signin')}>
                        <Text style={{ textAlign: 'center', color: 'black', fontSize: 16 }}>Already registered?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    textHeader: {
        padding: 10,
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#949494',
    },
    subText: {
        padding: 10,
        paddingTop: 0,
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom:10,
    },
    button: {
        marginLeft: '25%',
        marginTop: 50,
        padding: 10,
        backgroundColor: 'grey',
        borderRadius: 20,
        width: '50%',
    },
    regi_button: {
        marginLeft: '25%',
        marginTop: 30,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '50%',
    },
}); 