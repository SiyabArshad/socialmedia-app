import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable,ScrollView,RefreshControl } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
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
    Searchbar,
    Colors
} from 'react-native-paper';
import { collection,  setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where } from "firebase/firestore";
import app from '../config/firebase'
import { getAuth } from 'firebase/auth'
import Toast from 'react-native-root-toast'
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
export default function Profile(props) {
    const isFocused = useIsFocused(); 
      const [refreshing, setRefreshing] = React.useState(false);
    const [indicator,showindicator]=React.useState(false)
    const iduser=props.route.params.userid
    
    const auth=getAuth(app)
    const db=getFirestore(app)
    const [singleuser,setsingetuser]=React.useState({})
    const[userfeeds,setuserfeeds]=React.useState([])
    const[allfeeds,setallfeeds]=React.useState([])
    const[ftr,setftr]=React.useState(false)
    const[ft,setft]=React.useState(false)
    const[forfo,setforfo]=React.useState(false)
    const[followerlist,setfollowerlist]=React.useState([])
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);
    const followerfunctionality=async()=>{
        showindicator(true)
        try{
            setft(true)
        let newfollowers=singleuser.followers
        newfollowers.push({
            userid:auth.currentUser.uid
        })
        const upDocRef = doc(db, "users", iduser);
        await updateDoc(upDocRef, 
            {
              followers:newfollowers,
            }
            )
            setforfo(true)
            let nameoffollower='Followed '+singleuser.username
            let toast = Toast.show(nameoffollower, {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            showindicator(false)
        }
        catch{
            setft(false)
            showindicator(false)
        }
    }
    const getuserfeeds2=()=>{
        showindicator(true)
        const q = query(collection(db, "allposts"), where("userid", "==",iduser));
        getDocs(q).then((res)=>{
            const quests=res.docs.map(doc=>({
              data:doc.data(),
              id:doc.id
            }))
                setallfeeds(quests)
              showindicator(false)
          }).catch((e)=>{
              showindicator(false)
          })
        
    }
    const getuserinfo=async()=>{
        showindicator(true)
        const docRef = doc(db, "users", iduser);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
  setsingetuser(docSnap.data())
    followingpage(docSnap.data())
} else {
    showindicator(false)
    props.navigation.navigate("Home")
}
    }

    const followingpage=(suser)=>
    {
        let tempdata=[]
        setftr(false)
        suser.followers.map((item)=>{
            showindicator(true)
            if(item.userid===auth.currentUser.uid)
            {
                setftr(true)

            }
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
        if(isFocused)
        {
            getuserinfo()
            getuserfeeds2()
        }          
    },[props,refreshing,isFocused])    
    if(auth.currentUser.uid===iduser)
    {
        return(
            <Screen style={{ flex: 1,backgroundColor: colors.white }}>
                <LoadingModal show={indicator}></LoadingModal>
            <View style={{padding:RFPercentage(2)}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={35} color={colors.mblack} />
                </TouchableOpacity>
                    <Text style={{fontSize:RFPercentage(2.5)}}>{singleuser.username} Profile</Text>
                    <TouchableOpacity>
                    <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
                </TouchableOpacity>
                </View>
        <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
            }
        >
                <View >
                    <View style={{padding:RFPercentage(1),display:"flex",flexDirection:"row",borderBottomWidth:3
                    ,borderBottomColor:colors.grey,marginVertical:RFPercentage(5)}}>
                    <Avatar.Image source={singleuser.profile?{uri:singleuser.profile}:require("../../images/user.png")} size={70}>
                    </Avatar.Image>
                    <View style={{padding:RFPercentage(1)}}>
                        <Title color={colors.mblack}>{singleuser.username}</Title>
                        <Caption>{singleuser.location}</Caption>
                    </View>
                    </View>
                    <View style={{display:singleuser.bio?"flex":"none",borderBottomWidth:3
                    ,borderBottomColor:colors.grey,marginBottom:RFPercentage(5),paddingBottom:RFPercentage(2)}}>
                    <Title style={{fontWeight:"bold"}} color={colors.mblack}>About</Title>
                    <Paragraph>
                       {singleuser.bio}
                    </Paragraph>
                    </View>
                    <View style={{borderBottomWidth:3,display:"flex",justifyContent:"space-between",flexDirection:"row"
                    ,borderBottomColor:colors.grey,marginBottom:RFPercentage(1),paddingBottom:RFPercentage(2)}}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title style={{color:colors.pink}}>
                            Moments
                        </Title>
                        <Caption>
                           {allfeeds.length>0?allfeeds.length:"0"}
                        </Caption>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title style={{color:colors.pink}} onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followerlist})}>
                            Contacts
                        </Title>
                        <Caption>
                        {singleuser.followers?singleuser.followers.length:0}
                        </Caption>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followerlist})} style={{color:colors.pink}}>
                            Followers
                        </Title>
                        <Caption>
                        {singleuser.followers?singleuser.followers.length:0}
                        </Caption>
                    </View>
                    </View>
                </View>
                <View style={{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                {
                    allfeeds.length>0&&allfeeds.map((item,i)=>{
                        return(
                            <View key={i}  style={{width:"45%",margin:RFPercentage(1)}}>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("PostScreen",{content:{
                        post:item.data.post,
                      caption:item.data.caption,
                      time:item.data.time,
                      username:singleuser.username,
                      profile:singleuser.profile,
                      userid:item.data.userid,
                      likes:item.data.likes,
                      comments:item.data.comments,
                      id:item.id   
                    }})}>
                <Image resizeMode= 'stretch' style={{width:"100%",height:RFPercentage(25),borderRadius:RFPercentage(1)}} source={item.data.post?{uri:item.data.post}:require("../../images/nav.png")}></Image>
                </TouchableOpacity>
                </View>
                        )
                    })
                }      
                </View>
                </ScrollView>     
                </View>    
                
            </Screen>
        )
    }
    else
    {
        return (
            <Screen style={{ flex: 1,backgroundColor: colors.white }}>
                <LoadingModal show={indicator}></LoadingModal>
            <View style={{padding:RFPercentage(2)}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={35} color={colors.mblack} />
                </TouchableOpacity>
                    <Text style={{fontSize:RFPercentage(2.5)}}>{singleuser.username} Profile</Text>
                    <TouchableOpacity>
                    <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
                </TouchableOpacity>
                </View>
        <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
            }
        >
                <View >
                    <View style={{padding:RFPercentage(1),display:"flex",flexDirection:"row",borderBottomWidth:3
                    ,borderBottomColor:colors.grey,marginVertical:RFPercentage(5)}}>
                    <Avatar.Image source={singleuser.profile?{uri:singleuser.profile}:require("../../images/user.png")} size={70}>
                    </Avatar.Image>
                    <View style={{padding:RFPercentage(1)}}>
                        <Title color={colors.mblack}>{singleuser.username}</Title>
                        <Caption>{singleuser.location}</Caption>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                    {
                        ftr?
                        <TouchableOpacity disabled={ftr} style={{backgroundColor:colors.pink,borderRadius:RFPercentage(1)}} >
                        <Text style={{textAlign:"center",padding:RFPercentage(1),color:colors.white,display:auth.currentUser.uid===iduser?"none":"flex"}}>Following</Text>
                    </TouchableOpacity>
                        :
                    <TouchableOpacity disabled={ftr} style={{backgroundColor:colors.pink,borderRadius:RFPercentage(1)}} onPress={followerfunctionality}>
                        <Text style={{textAlign:"center",padding:RFPercentage(1),color:colors.white,display:auth.currentUser.uid===iduser?"none":"flex"}}>Follow</Text>
                    </TouchableOpacity>
                    }
                    </View>
                    </View>
                    <View style={{display:singleuser.bio?"flex":"none",borderBottomWidth:3
                    ,borderBottomColor:colors.grey,marginBottom:RFPercentage(5),paddingBottom:RFPercentage(2)}}>
                    <Title style={{fontWeight:"bold"}} color={colors.mblack}>About</Title>
                    <Paragraph>
                       {singleuser.bio}
                    </Paragraph>
                    </View>
                    <View style={{borderBottomWidth:3,display:"flex",justifyContent:"space-between",flexDirection:"row"
                    ,borderBottomColor:colors.grey,marginBottom:RFPercentage(1),paddingBottom:RFPercentage(2)}}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title style={{color:colors.pink}}>
                            Moments
                        </Title>
                        <Caption>
                           {allfeeds.length>0?allfeeds.length:"0"}
                        </Caption>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title style={{color:colors.pink}} onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followerlist})}>
                            Contacts
                        </Title>
                        <Caption>
                        {singleuser.followers?singleuser.followers.length:0}
                        </Caption>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <Title onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followerlist})} style={{color:colors.pink}}>
                            Followers
                        </Title>
                        <Caption>
                        {singleuser.followers?singleuser.followers.length:0}
                        </Caption>
                    </View>
                    </View>
                </View>
                <View style={{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                {
                    allfeeds.length>0&&allfeeds.map((item,i)=>{
                        return(
                            <View key={i}  style={{width:"45%",margin:RFPercentage(1)}}>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("PostScreen",{content:{
                        post:item.data.post,
                      caption:item.data.caption,
                      time:item.data.time,
                      username:singleuser.username,
                      profile:singleuser.profile,
                      userid:item.data.userid,
                      likes:item.data.likes,
                      comments:item.data.comments,
                      id:item.id   
                    }})}>
                <Image resizeMode= 'stretch' style={{width:"100%",height:RFPercentage(25),borderRadius:RFPercentage(1)}} source={item.data.post?{uri:item.data.post}:require("../../images/nav.png")}></Image>
                </TouchableOpacity>
                </View>
                        )
                    })
                }      
                </View>
                </ScrollView>     
                </View>    
                
            </Screen>
          )
    }
   
}
