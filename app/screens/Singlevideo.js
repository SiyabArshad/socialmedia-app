import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable,TextInput,ScrollView } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Dialog from "react-native-dialog";
import Toast from 'react-native-root-toast'
import Bottomtab from "../components/Bottomtab"
import { Video, AVPlaybackStatus } from 'expo-av';
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
import { collection,  deleteDoc,setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where } from "firebase/firestore";
import app from '../config/firebase'
import { getAuth } from 'firebase/auth'
export default function Singlevideo(props) {
    const [indicator,showindicator]=React.useState(false)
    const content=props.route.params.content//posts person data
    const[cmt,setcmt]=React.useState("")
    const[isliked,setisliked]=React.useState(false)
    const[iscmtshown,setiscmtshown]=React.useState(false)
    const [visible, setVisible] = React.useState(false);
    const[tnl,settnl]=React.useState(content.likes.length)
    const auth=getAuth(app)
    const db=getFirestore(app)
    const commentfunctionality=()=>{
        showindicator(true)
        let newcomment=[]
        newcomment=content.comments
        newcomment.push({
          userid:auth.currentUser.uid,
          comment:cmt,
          profile:auth.currentUser.photoURL,
          username:auth.currentUser.displayName
        })
        const upDocRef = doc(db, "videos", content.id);    
        updateDoc(upDocRef,{comments:newcomment}).then(()=>{
          showindicator(false)
            let toast = Toast.show('Comment added', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
              const docRef = doc(db, "users", content.userid);
              getDoc(docRef).then((docSnap)=>{
                  const nu=docSnap.data()
                  let stringnotify=auth.currentUser.displayName+" "+"commented on your video"
                  sendPushNotification(nu.token,stringnotify)
                }).catch(()=>{
              })
              showindicator(false)
        }).catch(()=>{
          setisliked(false)
            let toast = Toast.show('Try again later', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
              showindicator(false)
        })  
        
    }
    const likefunctionality=()=>{
      setisliked(true)
      settnl(tnl+1)
      let newlikes=[]
      newlikes=content.likes
      newlikes.push({userid:auth.currentUser.uid})
      const upDocRef = doc(db, "videos", content.id);    
      updateDoc(upDocRef,{likes:newlikes}).then(()=>{
        setisliked(true)
          let toast = Toast.show('Liked', {
              duration: Toast.durations.LONG,
            });
            setTimeout(function hideToast() {
              Toast.hide(toast);
            }, 1000);
            const docRef = doc(db, "users", content.userid);
            getDoc(docRef).then((docSnap)=>{
                const nu=docSnap.data()
                let stringnotify=auth.currentUser.displayName+" "+"likes your video"
                sendPushNotification(nu.token,stringnotify)
              }).catch(()=>{
            })
            
      }).catch(()=>{
        setisliked(false)
          let toast = Toast.show('Try again later', {
              duration: Toast.durations.LONG,
            });
            setTimeout(function hideToast() {
              Toast.hide(toast);
            }, 1000);
      })
    }
    const likestatus=()=>{
      showindicator(true)
      content.likes.map((id)=>{
        if(id.userid===auth.currentUser.uid)
        {
          setisliked(true)
          showindicator(false) 
        }
      })
      showindicator(false)
    }
    const handeldeletepost=()=>{
        showindicator(true)
        const upDocRef = doc(db, "videos", content.id);    
        deleteDoc(upDocRef).then(()=>{
            showindicator(false)
            let toast = Toast.show('video deleted', {
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
        
    }
    const showDialog = () => {
        setVisible(true);
      };
    
      const handleCancle = () => {
        setVisible(false);
      };
    
      const handledelete = () => {
        setVisible(false);
        handeldeletepost()
      };
      React.useEffect(()=>{
        likestatus()
      },[props.route.params])

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
  const reportuser=()=>{
    showindicator(true)
    let bcku=[]
    const docRef = doc(db, "users", auth.currentUser.uid);
    getDoc(docRef).then((docSnap)=>{
        const nu=docSnap.data()
        bcku=nu.blockusers
        bcku.push({userid:content.userid})
        const upDocRef = doc(db, "users", auth.currentUser.uid);    
        updateDoc(upDocRef,{blockusers:bcku}).then(()=>{
          showindicator(false)
          alert(`Thanks for reporting you no longer see the post or profile of ${content.username}`)
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
      return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
        <Dialog.Container visible={visible}>
        <Dialog.Title>Image Options</Dialog.Title>
        <Dialog.Description>
          Are You sure You want to delete this post this action cannot be Revert.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancle} />
        <Dialog.Button label="Delete" onPress={handledelete} />
      </Dialog.Container>
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.navigate("Videos")}>
        <Ionicons name="chevron-back" size={30} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>{content.username} Video</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:RFPercentage(5)}}> 
           <View style={{marginTop:RFPercentage(5),flexDirection:"row",justifyContent:"space-between" ,paddingHorizontal:RFPercentage(1)}}> 
        <Avatar.Image source={content.profile?{uri:content.profile}:require("../../images/user.png")} size={50}></Avatar.Image>
        <View>
        <TouchableOpacity onPress={reportuser} style={{display:auth.currentUser.uid==content.userid ?"none":"flex",justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:"red"}}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display:auth.currentUser.uid!=content.userid ?"none":"flex"}} onPress={()=>showDialog()}>
        <Entypo name="dots-three-horizontal" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
    </View>
        <View>
        <Video
        style={{width:"100%",height:RFPercentage(40),borderRadius:RFPercentage(1),marginVertical:RFPercentage(2)}}
        source={{
          uri: content.video,
        }}
        useNativeControls
        resizeMode="stretch"
        isLooping
      />
</View>
     <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:RFPercentage(1)}}> 
        <View>
        <TouchableOpacity disabled={isliked} onPress={likefunctionality}>
        <AntDesign name={isliked?"heart":"hearto"} size={35} color="black" />
        </TouchableOpacity>
        <Caption>{tnl} likes</Caption>
        </View>
        <TouchableOpacity onPress={()=>setiscmtshown(!iscmtshown)}>
        <FontAwesome5 name="comment-alt" size={35} color={colors.mblack} />
        </TouchableOpacity>
    </View>
    <View style={{display:iscmtshown?"flex" :"none",alignItems:"center",flexDirection:"row"}}>
    <TextInput style={{borderBottomColor:colors.grey,borderBottomWidth:1,color:colors.mblack,height:RFPercentage(7),width:"85%",padding:RFPercentage(2),marginVertical:RFPercentage(2)}} placeholder='Add Comment' onChangeText={(text)=>setcmt(text)} value={cmt}  />
    <TouchableOpacity onPress={commentfunctionality} style={{display:'flex',justifyContent:"center",alignItems:"center",padding:RFPercentage(1)}}>
    <FontAwesome5 name="telegram-plane" size={30} color={colors.pink} />
    </TouchableOpacity>
    </View>
 {
     content.comments.map((item,i)=>{
         return(
            <View key={i}>
        <View style={{display:"flex",flexDirection:"row",marginVertical:RFPercentage(1)}}>
            <Avatar.Image source={item.profile?{uri:item.profile}:require("../../images/user.png")} size={40}></Avatar.Image>
            <View style={{display:"flex",justifyContent:"center",alignItems:"center",marginHorizontal:RFPercentage(2)}}>
            <Paragraph>{item.comment}</Paragraph>
            </View>
        </View>
    </View>

         )
     })
 }
     </ScrollView>
        </View>    
        <Bottomtab props={props}></Bottomtab>
    </Screen>
  )
}