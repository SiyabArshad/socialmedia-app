import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable,ScrollView } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { doc, setDoc,getFirestore,collection,addDoc,getDocs,getDoc,updateDoc,serverTimestamp  } from "firebase/firestore"; 
import {getAuth} from "firebase/auth"
import app from '../config/firebase'
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    Searchbar
} from 'react-native-paper';

export default function Search(props) {
    const auth=getAuth(app)
    const db=getFirestore(app)
    const userinfo=props.route.params.usersinfo
    const [indicator,showindicator]=React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searched,setsearched]=React.useState(userinfo)
    const onChangeSearch = (query) => {
    setSearchQuery(query)
    let suser=[]
    if(query==="")
    {
        setsearched(userinfo)
    }
    userinfo.map((item)=>{
        if(query===item.data.username)
        {
        suser.push(item)
        setsearched(suser)
        }
    })
  };
  
  return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.navigate("Home")}>
        <Ionicons name="chevron-back" size={30} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Search</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
        <View style={{marginVertical:RFPercentage(2)}}> 
        <Searchbar
      placeholder="Search"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
    </View>
        
      <ScrollView showsVerticalScrollIndicator={false}>
    {
        searched.length>0&&searched.map((item,i)=>{
            return(
            <TouchableOpacity onPress={()=>props.navigation.navigate("Profile",{userid:item.id})} key={i}>
            <View style={{display:"flex",flexDirection:"row",marginVertical:RFPercentage(2)}}>
                <Avatar.Image
                source={item.data.profile?{uri:item.data.profile}:require("../../images/user.png")}
                size={60}
                >
                </Avatar.Image>
                <View style={{padding:RFPercentage(1)}}>
                <Title style={{fontWeight:"bold",color:colors.mblack}}>
                    {item.data.username}
                </Title>
                <Text style={{color:colors.darkGrey}}>
                    {item.data.email}
                </Text>
                </View>
            </View>
            </TouchableOpacity>
        )
        })
    }
      </ScrollView>           
        </View>    
    </Screen>
  )
}

