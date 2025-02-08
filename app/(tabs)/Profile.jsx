import {View, Text} from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/FirebaseConfig'
import { Button } from 'react-native'

export default function Profile(){
    return(
        <View>
            <Text>Profile</Text>
            <Button style={{
                color:'red',
                }} title='Logout' onPress={()=>signOut(auth)}/>
        </View>
    )
}