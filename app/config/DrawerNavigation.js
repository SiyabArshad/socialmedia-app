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
import Addtweet from '../screens/Addtweet';
import Tweets from '../screens/Tweets';
import Videos from '../screens/Videos';
import Addvideo from '../screens/Addvideo';
export default function DrawerNavigation() {
  return (
      <Drawer.Navigator initialRouteName='Discover' screenOptions={{headerShown:false}} drawerContent={props => <DrawerContent {...props}></DrawerContent>} >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="ContactScreen" component={Contact} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="UpdateProfile" component={UdateProfile} />
        <Drawer.Screen name="Addbio" component={Addbio} />
        <Drawer.Screen name="Discover" component={Discover} />
        <Drawer.Screen name="AddTweet" component={Addtweet} />
        <Drawer.Screen name="Tweets" component={Tweets} />
        <Drawer.Screen name="Videos" component={Videos} />
        <Drawer.Screen name="Addvideo" component={Addvideo} />
      </Drawer.Navigator>
  )
}