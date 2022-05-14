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
import { ref,getDownloadURL,getStorage, uploadBytes  } from "firebase/storage"
import app from "../config/firebase"
import { Authcontext } from '../config/authconetxt';
export default function UpdateProfile(props) {
  const { user } = Authcontext();  
  const auth=getAuth(app)
    const db=getFirestore(app)
    const storage=getStorage(app)
    const [indicator,showindicator]=React.useState(false)
    const[username,setusername]=React.useState("")
    const[bio,setbio]=React.useState("")
    const[profile,setprofile]=React.useState("")
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
        setprofile(result.uri);
       
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
        setprofile(result.uri);
       
      }
    }
  
    //camera open
    //end
    const updatedetails=async()=>{
      if(username===''||bio===''||profile==='')
      {
        alert("Somefields are missing")
        return
      }
      try{
      showindicator(true)  
      const storageRef = ref(storage, 'users/' + user.email + "profilepic"+new Date().toLocaleString());
      const img = await fetch(profile);
      const bytes = await img.blob();
      uploadBytes(storageRef, bytes)
      .then(snapshot => {
        return getDownloadURL(snapshot.ref)
        showindicator(false)
      })
      .then(downloadURL => {
        const upDocRef = doc(db, "users", user.uid);
        const docRef = updateDoc(upDocRef, 
          {
            username: username,
            bio: bio,
            profile: downloadURL
          }
          ).then(()=>{
            updateProfile(auth.currentUser,{displayName:username,photoURL:downloadURL})
            showindicator(false)
            let toast = Toast.show('Updated', {
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
        <Dialog.Container visible={visible}>
        <Dialog.Title>Image Options</Dialog.Title>
        <Dialog.Description>
          Select camera for live image and gallery for existing one.
        </Dialog.Description>
        <Dialog.Button label="Camera" onPress={handleCamera} />
        <Dialog.Button label="Gallery" onPress={handleGallery} />
      </Dialog.Container>

    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
        <Ionicons name="menu-outline" size={35} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Update Profile</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
<View style={{minHeight:"100%",justifyContent:"center",alignItems:"center"}}>
<TouchableOpacity onPress={showDialog} >
<Avatar.Image source={profile?{uri:profile}:require("../../images/user.png")} size={100}> 
</Avatar.Image>
</TouchableOpacity>
<TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"90%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}} placeholder='Username' onChangeText={(text)=>setusername(text)} value={username} />
<TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"90%",borderRadius:RFPercentage(1),padding:RFPercentage(2)}} placeholder='About' onChangeText={(text)=>setbio(text)} value={bio} />
<TouchableOpacity onPress={updatedetails}  style={{backgroundColor:colors.pink,height:RFPercentage(7),width:"90%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}}>
    <Text style={{color:colors.white,textAlign:"center",fontWeight:"bold"}}>Update</Text>
</TouchableOpacity>
</View>
                </View>    
    </Screen>
  
    )}
}
