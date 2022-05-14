import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
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
import { GiftedChat,Bubble,InputToolbar } from 'react-native-gifted-chat';
import { doc, setDoc,getFirestore,query,onSnapshot,orderBy,collection,addDoc,getDocs,getDoc,updateDoc,serverTimestamp  } from "firebase/firestore"; 
import {getAuth} from "firebase/auth"
import app from '../config/firebase'
export default function Chat({navigation,route}) {
    const chatuser=route.params.chatuser
    const auth=getAuth(app)
    const db=getFirestore(app)
    const [messages, setMessages] = React.useState([]);
    const [indicator,showindicator]=React.useState(false)
    React.useEffect(() => {
      const docid  = chatuser.userid > auth.currentUser.uid ? auth.currentUser.uid+ "-" + chatuser.userid : chatuser.userid+"-"+auth.currentUser.uid 
const messageref=collection(db,"chatrooms",docid,"messages")
const messagesQuery = query(messageref, orderBy('createdAt',"desc"));  
const unsubscribe=onSnapshot(messagesQuery, (snapshot) => {
    const allmsg=snapshot.docs.map((doc) =>{
        const data=doc.data()
        if(data.createdAt){
            return {
               ...doc.data(),
               createdAt:doc.data().createdAt.toDate()
           }
        }else {
           return {
               ...doc.data(),
               createdAt:new Date()
           }
        }
    }
 )
 setMessages(allmsg)
})

        return ()=>{
          unsubscribe()
        }

        
      }, [])

      const onSend =(messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy:auth.currentUser.uid,
            sentTo:chatuser.userid,
            createdAt:new Date()
        }
       setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
       const docid  = chatuser.userid > auth.currentUser.uid ? auth.currentUser.uid+ "-" + chatuser.userid : chatuser.userid+"-"+auth.currentUser.uid 
       const messageref=collection(db,"chatrooms",docid,"messages")
        addDoc(messageref,{...mymsg,createdAt:serverTimestamp()}).then(()=>{

        }).catch(()=>{

        })
      }
   
    return (
        <Screen style={{ flex: 1,backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
        <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
        <Ionicons name="chevron-back" size={30} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>{chatuser.username}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Profile",{userid:chatuser.userid})}>
            <Avatar.Image
                source={{uri:chatuser.profile}}
                size={40}
                >
                </Avatar.Image>
        </TouchableOpacity>
        </View>
        </View>
        <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: auth.currentUser.uid,
                }}
                renderBubble={(props)=>{
                    return <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor:colors.pink,
                      }
                      
                    }}
                  />
                }}

                renderInputToolbar={(props)=>{
                    return <InputToolbar {...props}
                     containerStyle={{borderTopWidth: 1.5, borderTopColor: colors.pink}} 
                     textInputStyle={{ color: "black" }}
                     />
                }}
                
                />
    
    </Screen>
  )
}