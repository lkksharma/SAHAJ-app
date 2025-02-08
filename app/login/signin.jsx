import {View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert} from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore"; 
import { db } from '../../config/FirebaseConfig'; 



export default function SignIn(){
    const router=useRouter();

    const [email, setEmail]=useState();
    const [password, setPassword]=useState();

    const auth = getAuth();
    const OnSignInClick=()=>{
        if(!email||!password){
            ToastAndroid.show('Please fill all the details', ToastAndroid.BOTTOM);
            Alert.alert('Please enter email and password');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => { 
                const user = userCredential.user;
                console.log(user);
                
                // Fetch the user's role from Firestore
                const userRef = doc(db, "users", user.uid); 
                const userSnap = await getDoc(userRef);
        
                if (userSnap.exists()) {
                    const role = userSnap.data().role;
                    console.log("User Role:", role);
        
                    // Redirect based on role
                    if (role === "client") {
                        router.push('(tabs)');
                    } else if (role === "hospital") {
                        router.push('hospital');
                    } else if (role === "doctor") {
                        router.push('doctor');
                    } else {
                        Alert.alert('Invalid Role');
                    }
                } else {
                    console.log("No such document!");
                    router.push('(tabs)'); // Handle case where role is missing
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode=='auth/invalid-credential'){
                    ToastAndroid.show('Invalid Email or Password', ToastAndroid.BOTTOM);
                    Alert.alert('Invalid Email or Password');
                }
            });
    }

    return(
        <View>
            <Text style={styles.textHeader}>Your first step towards transparency</Text>
            <Text style={styles.subText}>Let's Sign You In</Text>
            <View style={{padding:10, marginTop:25}}>
                <Text style={{padding:10, fontSize:20, color:'#00000', fontWeight:'bold'}}>Email Id</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type here..."
                    onChangeText={(value)=>setEmail(value)}
                />
                <Text style={{marginTop:30, padding:10, fontSize:19, color:'#00000', fontWeight:'bold'}}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    secureTextEntry={true}
                    placeholder="Your password"
                    onChangeText={(value)=>setPassword(value)}
                />
                <TouchableOpacity style={styles.button} onPress={OnSignInClick}>
                    <Text style={{
                        textAlign:'center',
                        color:'white',
                        fontSize:16
                    }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.regi_button} onPress={()=>router.push('login/signup')}>
                    <Text style={{
                        textAlign:'center',
                        color:'black',
                        fontSize:16
                    }}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    textHeader:{
        padding:10,
        fontSize:25,
        fontWeight:'bold',
        marginTop:15,
        color:'#949494'
    },
    subText:{
        padding:10,
        paddingTop:0,
        fontSize:30,
        fontWeight:'bold',
        marginTop:10,
    },
    textInput:{
        padding:10,
        borderWidth:1,
        borderColor:'black',
        borderRadius:10,
        backgroundColor:'white'

    },
    button:{
        marginLeft:'25%',
        marginTop:50,
        padding:10,
        backgroundColor:'grey',
        borderRadius:20,
        width:'50%'
    },
    regi_button:{
        marginLeft:'25%',
        marginTop:30,
        padding:10,
        backgroundColor:'white',
        borderRadius:20,
        width:'50%'
    }

})