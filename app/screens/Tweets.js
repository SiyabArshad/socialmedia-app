import { View, ImageBackground,Text,StyleSheet,Image,TouchableOpacity,FlatList,ScrollView,RefreshControl } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { collection,  setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where,orderBy } from "firebase/firestore";
import app from '../config/firebase'
import { getAuth } from 'firebase/auth'
import { useIsFocused } from "@react-navigation/native";
import Bottomtab from "../components/Bottomtab"
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
export default function Tweets(props) {
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
        readinguserdata()
        const q=query(collection(db, "tweets"),orderBy('time','desc'))
        getDocs(q).then((res)=>{
          const quests=res.docs.map(doc=>({
            data:doc.data(),
            id:doc.id
          }))
          /*for (let i =quests.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quests[i], quests[j]] = [quests[j], quests[i]];
        }*/
          setallposts(quests)
          const tempdata=[]
          allposts.map((item,j)=>{
              for(let i=0;i<users.length;i++)
              {
  
                if(item.data.userid==users[i].data.userid)
                {
                  const postfeed={
                    tweet:item.data.tweet,
                    tag:item.data.tag,
                    time:item.data.time,
                    username:users[i].data.username,
                    profile:users[i].data.profile,
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
    }

    const readinguserdata=()=>{
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
            for(let k=0;k<nu.blockusers.length;k++)
            {
              if(nu.blockusers[k].userid==item.data.userid)
              {
                flagv=true
                break
              }
            }
            if(!flagv)
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
      
  }
    React.useEffect(()=>{
      if(isFocused)
      {
        readinguserdata()
        readingdata()
      }
    },[isFocused])

    React.useEffect(()=>{
      readinguserdata()
      readingdata()
    },[refreshing,props])

    React.useEffect(()=>{
      onRefresh()
      readinguserdata()
      readingdata()
    },[])
    if(indicator||allfeeds.length==0)
    {
      return(
<LoadingModal></LoadingModal>
      )
    }
    else
    {
    return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>
        
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={35} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Fleets</Text>
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
    style={{marginBottom:RFPercentage(2)}}
    >
        {
            allfeeds&&allfeeds.map((item,i)=>{                    
                return(
            <View key={i} style={{flex:1,marginVertical:RFPercentage(2)}}>
            <TouchableOpacity onPress={()=>props.navigation.navigate("Profile",{userid:item.userid})}><Image style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5)}} source={item.profile?{uri:item.profile}:require("../../images/user.png")}></Image></TouchableOpacity>
            <Text style={{marginTop:RFPercentage(1),color:colors.darkGrey}}>{item.username&&item.username}</Text>
            <Text style={{marginVertical:RFPercentage(1),color:colors.darkGrey}}>{item.time&&new Date(item.time.seconds*1000).toLocaleDateString()
}</Text>
<Text style={{marginTop:RFPercentage(1),color:colors.mblack,fontSize:RFPercentage(3)}}>{item.tweet&&item.tweet}</Text>
<Text style={{marginTop:RFPercentage(1),color:colors.mblack,fontSize:RFPercentage(2.5),fontWeight:'bold'}}>{item.tag&&item.tag}</Text>
        <TouchableOpacity onPress={()=>props.navigation.navigate("Singletweet",{content:item})} style={{marginVertical:RFPercentage(2),backgroundColor:colors.pink,padding:RFPercentage(1),width:"40%",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:RFPercentage(1)}}>
            <Text style={{color:colors.white,fontSize:RFPercentage(2)}}>Add Comments</Text>
        </TouchableOpacity>
        </View>

        )
            })
        }
    </ScrollView>
      <TouchableOpacity onPress={()=>props.navigation.navigate("AddTweet")}  style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5),display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:colors.pink,position:"absolute",top:"80%",right:"5%"}}>
      <Ionicons name="add" size={30} color="white"  />
      </TouchableOpacity>
    </View>   
<Bottomtab props={props}></Bottomtab>   
    </Screen>
  )
    }
  }
