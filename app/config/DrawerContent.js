import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {RFPercentage} from "react-native-responsive-fontsize"
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
    Colors
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import colors from "../config/colors"
import { collection,  setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where } from "firebase/firestore";
import app from './firebase';
import {signOut,getAuth} from "firebase/auth"
import Toast from 'react-native-root-toast';
import LoadingModal from '../components/LoadingModal';

export function DrawerContent(props) {
const auth=getAuth(app)
const db=getFirestore(app)
const [indicator,showindicator]=React.useState(false)
//const [singleuser,setsingetuser]=React.useState({})
const[followerlist,setfollowerlist]=React.useState([])
const logoutops=()=>{
    signOut(auth).then(()=>{
        let toast = Toast.show('Logged out', {
            duration: Toast.durations.LONG,
          });
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 1000);
    }).catch(()=>{
        alert("Try again later")
    })
}
const getuserinfo=async()=>{
    showindicator(true)
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
//setsingetuser(docSnap.data())
followingpage(docSnap.data())
showindicator(false)
} else {
    showindicator(false)
props.navigation.navigate("Home")
}
}

const followingpage=(suser)=>
    {
        showindicator(true)
        let tempdata=[]
        suser.following.map((item)=>{
            showindicator(true)
            const docRef = doc(db, "users", item.userid);
            getDoc(docRef).then((docSnap)=>{
                tempdata.push(docSnap.data())
            }).catch(()=>{
            })
    
        })
        setfollowerlist(tempdata)
        showindicator(false)
    }
React.useEffect(()=>{
    getuserinfo()
},[])
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <LoadingModal show={indicator}></LoadingModal>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: RFPercentage(3.5)}}>
                            <Avatar.Image 
                                source={auth.currentUser.photoURL?{uri:auth.currentUser.photoURL}:require("../../images/user.png")}
                                size={50}
                            />
                            <View style={{marginLeft:RFPercentage(3), flexDirection:'column'}}>
                                <Title style={styles.title}>{auth.currentUser.displayName}</Title>
                                <Caption style={styles.caption}>@_{auth.currentUser.displayName}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Paragraph>{auth.currentUser.displayName}</Paragraph>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => props.navigation.navigate("Home")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() =>props.navigation.navigate("Profile",{userid:auth.currentUser.uid})}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Feather name="settings" size={24} color={colors.mblack}/>
                            )}
                            label="Update"
                            onPress={() =>props.navigation.navigate("UpdateProfile")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="chat-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Chat"
                            onPress={() =>props.navigation.navigate("ContactScreen",{usersfollower:followerlist})}
                        />
                    <DrawerItem 
                            icon={({color, size}) => (
                                <FontAwesome name="safari" size={size} color={colors.mblack} />
                            )}
                            label="Discover"
                            onPress={() =>props.navigation.navigate("Discover")}
                        />
                <DrawerItem 
                    icon={({color, size}) => (
                        <AntDesign name="retweet" size={size} color={colors.mblack} />
                            )}
                            label="Fleet"
                            onPress={() =>props.navigation.navigate("Tweets")}
                        />
                        <DrawerItem 
                    icon={({color, size}) => (
                        <Entypo name="video" size={size} color={colors.mblack} />
                            )}
                            label="Videos"
                            onPress={() =>props.navigation.navigate("Videos")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="close-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Close Menu"
                            onPress={() => props.navigation.closeDrawer()}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={colors.mblack}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={logoutops}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    caption1: {
        fontSize: 14,
        lineHeight: RFPercentage(3),
      }
    
    ,
    row: {
      marginTop: RFPercentage(4),
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });