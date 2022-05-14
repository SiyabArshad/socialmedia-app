import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from './DrawerContent';
import Addbio from '../screens/Addbio';
const Drawer = createDrawerNavigator();
import Home from '../screens/Home';
import Contact from '../screens/Contacts';
import Profile from '../screens/Profile';
import Discover from '../screens/Discover';
import UdateProfile from "../screens/UdateProfile"
export default function DrawerNavigation() {
  return (
      <Drawer.Navigator initialRouteName='Home' screenOptions={{headerShown:false}} drawerContent={props => <DrawerContent {...props}></DrawerContent>} >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="ContactScreen" component={Contact} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="UpdateProfile" component={UdateProfile} />
        <Drawer.Screen name="Addbio" component={Addbio} />
        <Drawer.Screen name="Discover" component={Discover} />
      </Drawer.Navigator>
  )
}