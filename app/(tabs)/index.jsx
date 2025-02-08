import {View} from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import Header from '../../components/Header.jsx'
import Header2 from '../../components/Header2.jsx'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';


export default function HomeScreen(){
    return(
        <View style={{
            padding:25,
            backgroundColor:'white',
            height:'100%'
        }}>
            <Header/>
            <Header2/>

        </View>
    )
}