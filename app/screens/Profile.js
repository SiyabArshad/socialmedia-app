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
import Bottomtab from "../components/Bottomtab"
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
    const [existuser,setexistuser]=React.useState({})
    const[allfeeds,setallfeeds]=React.useState([])
    const[ftr,setftr]=React.useState(false)
    const[followerlist,setfollowerlist]=React.useState([])
    const[followinglist,setfollowinglist]=React.useState([])
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);
      const followerfunctionality=async()=>{
        showindicator(true)
        try{
        let newfollowers=singleuser.followers
        let newfollowing=existuser.following

        newfollowers.push({
            userid:auth.currentUser.uid
        })
        newfollowing.push({
            userid:iduser
        })
        const upDocRef = doc(db, "users", iduser);
        const upprofileRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(upDocRef, 
            {
              followers:newfollowers,
            }
            )
        await updateDoc(upprofileRef, 
                {
                  following:newfollowing,
                }
                )   
                let stringnotify=auth.currentUser.displayName+" "+"started following you"
                sendPushNotification(singleuser.token,stringnotify)
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
            
            showindicator(false)
        }
    }
    function arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
            return ele.userid != value; 
        });
    }
    
    
    const unfollowerfunctionality=async()=>{
        showindicator(true)
        try{
        let newfollowers= arrayRemove(singleuser.followers, auth.currentUser.uid);
        let newfollowing= arrayRemove(existuser.following, iduser);
        const upDocRef = doc(db, "users", iduser);
        const upprofileRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(upDocRef, 
            {
              followers:newfollowers,
            }
            )
        await updateDoc(upprofileRef, 
                {
                  following:newfollowing,
                }
                )   
            
            let nameoffollower='UnFollowed '+singleuser.username
            let toast = Toast.show(nameoffollower, {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            showindicator(false)
        }
        catch{
            
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
    const getloginuserinfo=async()=>{
        showindicator(true)
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
  setexistuser(docSnap.data())
} else {
    showindicator(false)
    props.navigation.navigate("Home")
}
    }
    const followingpage=(suser)=>
    {
        let tempdata=[]
        let tempdata1=[]
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

        suser.following?.map((item)=>{
            showindicator(true)
            const docRef = doc(db, "users", item.userid);
            getDoc(docRef).then((docSnap)=>{
                tempdata1.push(docSnap.data())
            }).catch(()=>{
            })
    
        })
        
        setfollowerlist(tempdata)
        setfollowinglist(tempdata1)
        showindicator(false)
    }

      //send notification
      async function sendPushNotification(expoPushToken,data) {
        const message = {
          to: expoPushToken,
          sound: 'default',
          title: 'FIYR Notification',
          body: data,
          data: { someData: 'goes here' },
        };
      
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
      }
      
      //end
    React.useEffect(()=>{
        if(isFocused)
        {
            getloginuserinfo()
            getuserinfo()
            getuserfeeds2()
        }          
    },[props,refreshing,isFocused])
    
    const reportuser=()=>{
        showindicator(true)
        let bcku=[]
        
        const docRef = doc(db, "users", auth.currentUser.uid);
        getDoc(docRef).then((docSnap)=>{
            const nu=docSnap.data()
            bcku=nu.blockusers
            bcku.push({userid:iduser})
            const upDocRef = doc(db, "users", auth.currentUser.uid);    
            updateDoc(upDocRef,{blockusers:bcku}).then(()=>{
              showindicator(false)
              alert(`Thanks for reporting you no longer see the post or profile of ${singleuser.username}`)
              let toast = Toast.show('blocked', {
                    duration: Toast.durations.LONG,
                  });
                  setTimeout(function hideToast() {
                    Toast.hide(toast);
                  }, 1000);          
            props.navigation.navigate("Home")
                }).catch(()=>{
              showindicator(false)
                let toast = Toast.show('Try again later', {
                    duration: Toast.durations.LONG,
                  });
                  setTimeout(function hideToast() {
                    Toast.hide(toast);
                  }, 1000);
            })
    
          }).catch(()=>{
            showindicator(false)
        })
      }
      
    
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
                    <TouchableOpacity onPress={()=>props.navigation.navigate("Profile",{userid:iduser})}>
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
                    <TouchableOpacity style={{backgroundColor:colors.pink,borderRadius:RFPercentage(1)}} onPress={() =>props.navigation.navigate("Addbio")}>
                        <Text style={{textAlign:"center",padding:RFPercentage(1),color:colors.white}}>Add bio</Text>
                    </TouchableOpacity>
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
                        <Title style={{color:colors.pink}} onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followinglist})}>
                            Following
                        </Title>
                        <Caption>
                        {singleuser.following?singleuser.following.length:0}
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
                    },screenname:"Profile",userid:iduser})}>
                <Image resizeMode= 'stretch' style={{width:"100%",height:RFPercentage(25),borderRadius:RFPercentage(1)}} source={item.data.post?{uri:item.data.post}:require("../../images/nav.png")}></Image>
                </TouchableOpacity>
                </View>
                        )
                    })
                }      
                </View>
                </ScrollView>     
                </View>    
                <Bottomtab props={props}></Bottomtab>
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
                    <TouchableOpacity onPress={()=>props.navigation.navigate("Profile",{userid:iduser})}>
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
                    <View style={{justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                    {
                        ftr?
                        <TouchableOpacity style={{backgroundColor:colors.pink,borderRadius:RFPercentage(1)}} onPress={unfollowerfunctionality} >
                        <Text style={{textAlign:"center",padding:RFPercentage(1),color:colors.white,display:auth.currentUser.uid===iduser?"none":"flex"}}>Unfollow</Text>
                    </TouchableOpacity>
                        :
                    <TouchableOpacity disabled={ftr} style={{backgroundColor:colors.pink,borderRadius:RFPercentage(1)}} onPress={followerfunctionality}>
                        <Text style={{textAlign:"center",padding:RFPercentage(1),color:colors.white,display:auth.currentUser.uid===iduser?"none":"flex"}}>Follow</Text>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={reportuser} style={{marginLeft:RFPercentage(1),justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:"red"}}>Report</Text>
        </TouchableOpacity>
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
                        <Title style={{color:colors.pink}} onPress={()=>props.navigation.navigate("FollowingScreen",{usersfollower:followinglist})}>
                        Following
                        </Title>
                        <Caption>
                        {singleuser.following?singleuser.following.length:0}
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
                    },screenname:"Profile",userid:iduser})}>
                <Image resizeMode= 'stretch' style={{width:"100%",height:RFPercentage(25),borderRadius:RFPercentage(1)}} source={item.data.post?{uri:item.data.post}:require("../../images/nav.png")}></Image>
                </TouchableOpacity>
                </View>
                        )
                    })
                }      
                </View>
                </ScrollView>     
                </View>    
<Bottomtab props={props}></Bottomtab>                
            </Screen>
          )
    }
   
}
