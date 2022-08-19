import { View, ImageBackground,Text,StyleSheet,Image,TouchableOpacity,FlatList,ScrollView,RefreshControl,Dimensions } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { collection,  setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where ,orderBy} from "firebase/firestore";
import app from '../config/firebase'
import { getAuth } from 'firebase/auth'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useIsFocused } from "@react-navigation/native";
import Bottomtab from "../components/Bottomtab"
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const width=Dimensions.get("screen").width;
  const height=Dimensions.get("screen").height;
  
export default function Home(props) {
  const isFocused = useIsFocused();
    const auth=getAuth(app)
    const db=getFirestore(app)
    const [indicator,showindicator]=React.useState(false)
   const[allfeeds,setallfeeds]=React.useState([])
    const [allposts,setallposts]=React.useState([])
    const [refreshing, setRefreshing] = React.useState(false);
    const [users,setusers]=React.useState([])
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);
  
    const readingdata=()=>{
        showindicator(true)
        //readinguserdata()
      //console.log("start position")
        const docRef = doc(db, "users", auth.currentUser.uid);
        getDoc(docRef).then((docSnap)=>{
          //console.log("inside current user position") 
          const nu=docSnap.data()
            getDocs(collection(db, "users")).then((res)=>{
            //  console.log("inside all user position")
              const quests=res.docs.map(doc=>({
                data:doc.data(),
                id:doc.id
              }))
              const tempusers=[]
              quests.map((item,i)=>{
                let flagv=false
                for(let k=0;k<nu.following.length;k++)
                {
                  if(nu.following[k].userid==item.data.userid)
                  {
                    flagv=true
                    break
                  }
                }
                if(flagv)
                {
                  tempusers.push({
                    data:item.data,
                    id:item.id
                })
                }
              })
                setusers(tempusers)
                            //code for posts
//particular code to get all posts data
//showindicator(true)
//console.log("inside first then position")
const q=query(collection(db, "allposts"),orderBy('time','desc'))
getDocs(q).then((res)=>{
  const quests=res.docs.map(doc=>({
    data:doc.data(),
    id:doc.id
  }))
  //code for randomizing posts
/*   for (let i =quests.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quests[i], quests[j]] = [quests[j], quests[i]];
}*/
  setallposts(quests)
  const tempdata=[]
  allposts.map((item,j)=>{
      for(let i=0;i<tempusers.length;i++)
      {

        if(item.data.userid==tempusers[i].data.userid)
        {
          const postfeed={
            post:item.data.post,
            caption:item.data.caption,
            time:item.data.time,
            username:tempusers[i].data.username,
            profile:tempusers[i].data.profile,
            userid:item.data.userid,
            likes:item.data.likes,
            comments:item.data.comments,
            id:item.id      
          }
        tempdata.push(postfeed) 
        break
        } 
      }
  })  
  setallfeeds(tempdata)
  showindicator(false)      
}).catch((e)=>{
    showindicator(false)
})
            //end

               showindicator(false)
            }).catch((e)=>{
                showindicator(false)
            })
          }).catch(()=>{
            showindicator(false)
            })



        
    }

    /*const readinguserdata=()=>{
      showindicator(true)
      setusers([])
      const docRef = doc(db, "users", auth.currentUser.uid);
    getDoc(docRef).then((docSnap)=>{
        const nu=docSnap.data()
        getDocs(collection(db, "users")).then((res)=>{
          const quests=res.docs.map(doc=>({
            data:doc.data(),
            id:doc.id
          }))
          const tempusers=[]
          quests.map((item,i)=>{
            let flagv=false
            for(let k=0;k<nu.following.length;k++)
            {
              if(nu.following[k].userid==item.data.userid)
              {
                flagv=true
                break
              }
            }
            if(flagv)
            {
              tempusers.push({
                data:item.data,
                id:item.id
            })
            }
          })
            setusers(tempusers)
            showindicator(false)
        }).catch((e)=>{
            showindicator(false)
        })
        
      }).catch(()=>{
        showindicator(false)
        })
  }*/
//push notification function
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
if(token)
{
  await setDoc(doc(db, "users", auth.currentUser.uid), {
    token
  },{merge:true});
  
}
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
//end push notification function
React.useEffect(()=>{
  if(isFocused)
  {
 //   readinguserdata()
    readingdata()
  }
},[isFocused,refreshing,props])
    React.useEffect(()=>{
      (()=>registerForPushNotificationsAsync())()
    },[])
    if(indicator)
    {
      return(
<LoadingModal></LoadingModal>
      )
    }
    /*
    else if(allfeeds.length==0)
    {
      return(
        <View style={{display:"flex",justifyContent:"center",alignItems:"center",flex:1,backgroundColor:colors.white}}>
          <Text style={{color:colors.mblack}}>Please wait</Text>
          <TouchableOpacity onPress={()=>props.navigation.navigate("AddpostScreen")}  style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5),display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:colors.pink,position:"absolute",top:"80%",right:"5%"}}>
      <Ionicons name="add" size={30} color="white"  />
      </TouchableOpacity>
      <Bottomtab props={props}></Bottomtab>
        </View>
      )
    }*/
    else
    {
    return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>
    <View style={{display:"flex",justifyContent:"center"}}>
        <View style={{display:"flex",padding:RFPercentage(2),flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={35} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>My Feed</Text>
            <TouchableOpacity onPress={()=>props.navigation.navigate('SearchScreen',{usersinfo:users})}>
            <AntDesign name="search1" size={25} color={colors.mblack} />
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
        {
            allfeeds?.map((item,i)=>{                    
                return(
            <View key={i} style={{flex:1,marginVertical:RFPercentage(2)}}>
            <TouchableOpacity style={{padding:RFPercentage(2)}} onPress={()=>props.navigation.navigate("Profile",{userid:item.userid})}><Image style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5)}} source={item.profile?{uri:item.profile}:require("../../images/user.png")}></Image></TouchableOpacity>
            <Text style={{paddingHorizontal:RFPercentage(2),marginTop:RFPercentage(1),color:colors.mblack}}>{item.caption&&item.caption}</Text>
            <Text style={{paddingHorizontal:RFPercentage(2),marginTop:RFPercentage(1),color:colors.mblack,fontWeight:"bold"}}>{item.username&&item.username}</Text>
            <Text style={{paddingHorizontal:RFPercentage(2),marginVertical:RFPercentage(1),color:colors.mblack}}>{item.time&&new Date(item.time.seconds*1000).toLocaleDateString()
}</Text>
         <TouchableOpacity  onPress={()=>props.navigation.navigate("PostScreen",{content:item,screenname:"Home",userid:""})}>           
        <Image  resizeMode="contain" style={{width:width<450?width:width/1.3,marginVertical:RFPercentage(1),minHeight:height<980?height/1.9:height/2.1}} source={item.post?{uri:item.post}:require("../../images/nav.png")}></Image>
        </TouchableOpacity>
        </View>
        )
            })
        }
    </ScrollView>
      <TouchableOpacity onPress={()=>props.navigation.navigate("AddpostScreen")}  style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5),display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:colors.pink,position:"absolute",top:"80%",right:"5%"}}>
      <Ionicons name="add" size={30} color="white"  />
      </TouchableOpacity>
    </View>
   <Bottomtab props={props}></Bottomtab> 
    </Screen>
  )
    }
  }