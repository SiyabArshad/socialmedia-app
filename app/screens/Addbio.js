import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable,ScrollView,TextInput } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Dialog from "react-native-dialog";
import Toast from 'react-native-root-toast'
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
import { doc, setDoc,getFirestore,collection,addDoc,getDocs,getDoc,updateDoc  } from "firebase/firestore"; 
import {getAuth,updateProfile} from "firebase/auth"
import app from "../config/firebase"
import { Authcontext } from '../config/authconetxt';
export default function Addbio(props) {
  const { user } = Authcontext();  
  const auth=getAuth(app)
    const db=getFirestore(app)
    const [indicator,showindicator]=React.useState(false)
    const[bio,setbio]=React.useState("")
    const updatedetails=async()=>{
      if(bio==='')
      {
        alert("Somefields are missing")
        return
      }
      try{
      showindicator(true)  
      
        const upDocRef = doc(db, "users", user.uid);
        const docRef = updateDoc(upDocRef, 
          {
            bio: bio
          }
          ).then(()=>{
            showindicator(false)
            let toast = Toast.show('Bio Added', {
              duration: Toast.durations.LONG,
            });
            setTimeout(function hideToast() {
              Toast.hide(toast);
            }, 1000);
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
    catch{
      let toast = Toast.show('Try again later', {
        duration: Toast.durations.LONG,
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1000);
    }
    }
  
  if(indicator)
  {
    return <LoadingModal></LoadingModal>
  }
  else{
    return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>  
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={35} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Add Bio</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
<View style={{minHeight:"100%",justifyContent:"center",alignItems:"center"}}>
<TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"90%",height:RFPercentage(10),borderRadius:RFPercentage(1),padding:RFPercentage(2)}} placeholder='Bio ....' onChangeText={(text)=>setbio(text)} value={bio} />
<TouchableOpacity onPress={updatedetails}  style={{backgroundColor:colors.pink,height:RFPercentage(7),width:"90%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}}>
    <Text style={{color:colors.white,textAlign:"center",fontWeight:"bold"}}>Add Bio</Text>
</TouchableOpacity>
</View>
</View>    
    </Screen>
  
    )}
}
