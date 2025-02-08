import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
// import { auth } from '/../login/signin'; 
import { getAuth } from 'firebase/auth';


export default function Header(){
    const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setUser(user); 
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <>
    <View>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#301934',
        borderRadius:30
        }}>
        <Image 
          source={require('./../assets/images/WhatsApp_Image_2025-01-20_at_19.53.23-removebg-preview (1).png')}
          style={{ width: 200, height: 200, top: -10, left: -40 }}
        />
        <Text style={{
            margin:0,
            top:-10,
            left: -60,
            fontSize:40,
            fontWeight:'bold',
            color:'#F2F0EF'
            

        }}>Hi {user?.username || 'User'}!</Text>
      </View>
      <View style={{}}>
        <Text style={{
            top:-40,
            left:90,
            fontSize:20,
            color:'#F2F0EF'
        }}>Welcome to SAHAJ</Text>
      </View>
    </View>
    </>
  );
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
        position:'absolute',
        marginLeft:'25%',
        marginTop:50,
        padding:10,
        left:40,
        height:100,
        backgroundColor:'grey',
        borderRadius:'50%',
        width:'230'
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