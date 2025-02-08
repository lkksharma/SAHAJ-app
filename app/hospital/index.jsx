import {View} from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import Header from '../../components/Header.jsx'
import PatientData from '../../components/PatientData.jsx'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';


export default function HospitalHome(){
    return(
        <View style={{
            padding:25,
            backgroundColor:'white',
            height:'100%'
        }}>
            <Header/>
            <PatientData/>

        </View>
    )
}