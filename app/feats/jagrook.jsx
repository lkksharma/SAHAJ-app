import {View, Text} from 'react-native'
import React from 'react'
import { Appbar } from 'react-native-paper'
import { router } from 'expo-router'
import MedicalReport from './dhancha';

// In your screen component


export default function Jagrook(){
    return(
        <>
        <Appbar.Header>
            <Appbar.BackAction onPress={() => router.push('(tabs)')} />
                <Text style={{fontSize:20}}>Jagrook</Text>
        </Appbar.Header>
        </>
    )
}