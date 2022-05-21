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
import Bottomtab from '../components/Bottomtab'
import { Video, AVPlaybackStatus } from 'expo-av';
export default function Addvideo(props) {
    const { user } = Authcontext();  
    const auth=getAuth(app)
    const db=getFirestore(app)
    const storage=getStorage(app)
    const [indicator,showindicator]=React.useState(false)
    const[title,settitle]=React.useState("")
    const[desc,setdesc]=React.useState("")
    const[movie,setmovie]=React.useState("")
    const[percent,setpercent]=React.useState("")
    const [visiblew, setVisiblew] = React.useState(false);
  const showDialogw = () => {
    setVisiblew(true);
  };
  const handleGallery = () => {
    showImagePicker()
  };
    const showImagePicker = async () => {
      // Ask the user for the permission to access the media library 
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your gallery!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:'Videos'
      });
      if (!result.cancelled) {
        setmovie(result.uri);
      }
    }
    //end
const addpost=()=>{
if(movie==null)
{
    let toast = Toast.show('no video selected', {
        duration: Toast.durations.LONG,
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1000);
    return 
}
    updatepost()
}
    const updatepost=async()=>{
      try{
        showindicator(true)  
        const storageRef = ref(storage,'videos/' + user.email + "post"+new Date().toLocaleString());
        const img = await fetch(movie);
        const bytes = await img.blob();
        uploadBytes(storageRef, bytes)
        .then(snapshot => {
            showindicator(false)
            return getDownloadURL(snapshot.ref)
        })
        .then(downloadURL => {
          setTimeout(() => {
            addDoc(collection(db, "videos"), {
              video:downloadURL,
              title:title,
              desc:desc,
              time:serverTimestamp(),
              userid:auth.currentUser.uid,
              likes:[],
              comments:[]
            }).then(()=>{
              showindicator(false)
              let toast = Toast.show('video added', {
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
    React.useEffect(()=>{
    showDialogw()
    },[])
    if(indicator)
    {
      return <LoadingModal></LoadingModal>
    }
    else{
  return (
    <Screen style={{ flex: 1,backgroundColor: colors.white }}>
        <Dialog.Container visible={visiblew}>
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Description>
          Donot share sexual,hateful or abuse content on application you get reported or blocked.
        </Dialog.Description>
        <Dialog.Button label="Agree" onPress={()=>setVisiblew(false)} />
      </Dialog.Container>
        <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{padding:RFPercentage(2)}}>
        <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>props.navigation.navigate("Videos")}>
        <Ionicons name="chevron-back" size={30} color={colors.mblack} />
        </TouchableOpacity>
            <Text style={{fontSize:RFPercentage(2.5)}}>Add Video</Text>
            <TouchableOpacity>
            <MaterialIcons name="supervisor-account" size={35} color={colors.mblack} />
        </TouchableOpacity>
        </View>
        <View>
        <Video
        
        style={{width:"100%",height:RFPercentage(30),borderRadius:RFPercentage(1),marginVertical:RFPercentage(5),display:!movie?"none":"flex"}}
        source={{
          uri: movie,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        shouldPlay={true}
      />
            <View style={{display:'flex',justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={handleGallery}  style={{width:RFPercentage(7),height:RFPercentage(7),borderRadius:RFPercentage(3.5),display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:colors.pink}}>
      <Ionicons name="camera" size={30} color="white"  />
      </TouchableOpacity>
            </View>
            <TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}} placeholder='Title...' onChangeText={(text)=>settitle(text)} value={title} />
<TextInput style={{borderColor:colors.grey,borderWidth:1,color:colors.mblack,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2)}} placeholder='Description...' onChangeText={(text)=>setdesc(text)} value={desc} />
<TouchableOpacity onPress={addpost} style={{backgroundColor:colors.pink,height:RFPercentage(7),width:"100%",borderRadius:RFPercentage(1),padding:RFPercentage(2),marginVertical:RFPercentage(2)}}>
    <Text style={{color:colors.white,textAlign:"center",fontWeight:"bold"}}>Upload</Text>
</TouchableOpacity>
        </View>
        </View>    
</ScrollView>
<Bottomtab props={props}></Bottomtab>
    </Screen>
  )}
}
