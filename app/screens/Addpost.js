import { View,StyleSheet,Image,TouchableOpacity,FlatList,Pressable,TextInput,ScrollView } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
import Dialog from "react-native-dialog";
import { doc, setDoc,getFirestore,collection,addDoc,getDocs,getDoc,updateDoc,serverTimestamp  } from "firebase/firestore"; 
import {getAuth,updateProfile} from "firebase/auth"
import { ref,getDownloadURL,getStorage, uploadBytes  } from "firebase/storage"
import app from '../config/firebase'
import { Authcontext } from '../config/authconetxt';
import Toast from 'react-native-root-toast'
export default function Addpost(props) {
  const { user } = Authcontext();  
    const auth=getAuth(app)
    const db=getFirestore(app)
    const storage=getStorage(app)
    const [indicator,showindicator]=React.useState(false)
    const[capt,setcapt]=React.useState("")
    const[loca,setloca]=React.useState("")
    const[momentpic,setmomentpic]=React.useState("")
    const [visible, setVisible] = React.useState(false);
    
  const showDialog = () => {
    setVisible(true);
  };

  const handleCamera = () => {
    setVisible(false);
    openCamera()
  };

  const handleGallery = () => {
    setVisible(false);
    showImagePicker()
  };
    //camera open and gallery
    const openCamera = async () => {
      // Ask the user for the permission to access the camera
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) {
        setmomentpic(result.uri);
       
      }
    }

    const showImagePicker = async () => {
      // Ask the user for the permission to access the media library 
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your photos!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        setmomentpic(result.uri);
      }
    }
    //end
const addpost=()=>{
 showindicator(true)
  updatepost()
}
    const updatepost=async()=>{
      try{
        showindicator(true)  
        const storageRef = ref(storage,'posts/' + user.email + "post"+new Date().toLocaleString());
        const img = await fetch(momentpic);
        const bytes = await img.blob();
        uploadBytes(storageRef, bytes)
        .then(snapshot => {
          return getDownloadURL(snapshot.ref)
          showindicator(false)
        })
        .then(downloadURL => {
          setmomentpic(downloadURL)
          setTimeout(() => {
            addDoc(collection(db, "allposts"), {
              post:downloadURL,
              caption:capt,
              location:loca,
              time:serverTimestamp(),
              userid:auth.currentUser.uid,
              likes:[],
              comments:[]
            }).then(()=>{
              showindicator(false)
              let toast = Toast.show('Post added', {
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
           }, 3000); 
          showindicator(false)
              
        })
      }
      catch{
        showindicator(false)
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
        <Dialog.Container visible={visible}>
        <Dialog.Title>Image Options</Dialog.Title>
        <Dialog.Description>
          Select camera for live image and gallery for existing one.
        </Dialog.Description>
        <Dialog.Button label="Camera" onPress={handleCamera} />
        <Dialog.Button label="Gallery" onPress={handleGallery} />
      </Dialog.Container>
      <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.navigate("Home")}>
        <Ionicons name="chevron-back" size={30} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Add Moment</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
        <View>
            <Image resizeMode= 'stretch' style={{width:"100%",height:RFPercentage(30),borderRadius:RFPercentage(1),marginVertical:RFPercentage(5)}} source={momentpic?{uri:momentpic}:require("../../images/nav.png")}></Image>
            <View style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={showDialog}  style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5),display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:colors.pink}}>
      <Ionicons name="camera" size={30} color="white"  />
      </TouchableOpacity>
            </View>
            <TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}} placeholder='Caption' onChangeText={(text)=>setcapt(text)} value={capt} />
<TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2)}} placeholder='Location' onChangeText={(text)=>setloca(text)} value={loca} />
<TouchableOpacity onPress={addpost} style={{backgroundColor:colors.pink,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}}>
    <Text style={{color:colors.white,textAlign:"center",fontWeight:"bold"}}>Upload</Text>
</TouchableOpacity>
        </View>
        </View>    
</ScrollView>
    </Screen>
  )}
}
