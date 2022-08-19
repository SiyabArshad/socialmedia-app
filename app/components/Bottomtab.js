import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
//config
import colors from '../config/colors';
import {getAuth} from "firebase/auth"
import app from '../config/firebase';
function Bottomtab({props}) {
    const auth=getAuth(app)
    return (
        <View style={{ borderColor: colors.grey, borderWidth: RFPercentage(0.1), flexDirection: 'row', alignItems: 'center', position: 'absolute', justifyContent: 'center', bottom: 0, width: "100%", height: RFPercentage(8), backgroundColor: colors.white }}>
            <View style={{ width: "80%", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', }} >

                <TouchableOpacity onPress={() => props.navigation.navigate("Home")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={require('../../assets/home.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("Discover")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={require('../../assets/discover.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("Videos")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={require('../../assets/film.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("Tweets")} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={require('../../assets/arrow.png')} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("Profile",{userid:auth.currentUser.uid})} activeOpacity={0.8} style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <Image style={{ width: RFPercentage(3.4), height: RFPercentage(3.4) }} source={require('../../assets/user.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Bottomtab;