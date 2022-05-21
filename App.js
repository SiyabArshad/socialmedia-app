import { useEffect,useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoadingModal from "./app/components/LoadingModal"
import Signin from './app/screens/Signin';
import Login from './app/screens/Login';
import ResetPassword from './app/screens/ResetPassword';
import NewPassword from "./app/screens/NewPassword"
import Signup from './app/screens/Signup';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import 'react-native-gesture-handler';
import DrawerNavigation from './app/config/DrawerNavigation';
import Search from './app/screens/Search';
import Chat from './app/screens/Chat';
import Addpost from './app/screens/Addpost';
import Post from './app/screens/Post';
import Following from './app/screens/Following';
import { Authcontext } from './app/config/authconetxt';
import { RootSiblingParent } from 'react-native-root-siblings';
import Singletweet from './app/screens/Singletweet';
import Singlevideo from './app/screens/Singlevideo';
export default function App() {
  const[load,setload]=useState(false)
  useEffect(()=>{
   
    setload(true)
    setTimeout(() => {
      setload(false)
    }, 2000);
  },[])
  const { user } = Authcontext();
  if(load)
  {
    return <LoadingModal></LoadingModal>
  }
  else
  {
    return user ? <RootSiblingParent><Protected></Protected></RootSiblingParent> : <RootSiblingParent><Base></Base></RootSiblingParent>
  }
  
}


const Base=()=>{
  return(
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{
  headerShown: false
}}>
      <Stack.Screen name="SigninScreen" component={Signin} />
      <Stack.Screen name="LoginScreen" component={Login} />
      <Stack.Screen name="SignupScreen" component={Signup} />
      <Stack.Screen name="ResetScreen" component={ResetPassword} />
      <Stack.Screen name="NewpasswordScreen" component={NewPassword} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
const Protected=()=>{
  return(
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{
  headerShown: false
}}>
      <Stack.Screen  name="HomeScreen" component={DrawerNavigation} />
      <Stack.Screen  name="SearchScreen" component={Search} />
      <Stack.Screen  name="FollowingScreen" component={Following} />
      <Stack.Screen  name="ChatScreen" component={Chat} />
      <Stack.Screen  name="AddpostScreen" component={Addpost} />
      <Stack.Screen  name="PostScreen" component={Post} />
      <Stack.Screen  name="Singletweet" component={Singletweet} />
      <Stack.Screen  name="Singlevideo" component={Singlevideo} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}