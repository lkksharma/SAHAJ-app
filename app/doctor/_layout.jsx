import {View, Text} from 'react-native'
import { router, Tabs, useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';
export default function TabLayout(){
    const auth = getAuth();
    const router = useRouter();
    const [authenticated, setAuthenticated]=useState(null);

    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setAuthenticated(true);
        // ...
    } else {
        // User is signed out
        // ...
        setAuthenticated(false);
        
    }
    });
    useEffect(()=>{  //this is not really required since the else part would also have done the job
        if(authenticated==false){
            router.push('/login');
        }
    },[authenticated])

    return(
        
        <Tabs screenOptions={{headerShown:false}}>
            <Tabs.Screen name = "home"
                options={{
                    tabBarLabel:'Home',
                    tabBarIcon:({colour,size})=>(
                        <AntDesign name="home" size={size} color="colour" />
                    )
                } }
            />
            <Tabs.Screen name = "Patients"
                options={{
                    tabBarLabel:'Patients',
                    tabBarIcon:({colour,size})=>(
                        <Feather name="profile" size={size} color="black" />
                    )
                } }
            />
        </Tabs>
        
    )
}