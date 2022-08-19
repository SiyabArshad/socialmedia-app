import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {RFPercentage} from "react-native-responsive-fontsize"
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
    Colors
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import colors from "../config/colors"
import { collection,  setDoc,doc,addDoc,getDocs,getDoc,updateDoc,getFirestore,query, where,deleteDoc } from "firebase/firestore";
import app from './firebase';
import {signOut,getAuth,updateProfile,deleteUser} from "firebase/auth"
import { ref,getDownloadURL,getStorage, uploadBytes  } from "firebase/storage"
import Toast from 'react-native-root-toast';
import LoadingModal from '../components/LoadingModal';
import Dialog from "react-native-dialog";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Authcontext } from './authconetxt';
export function DrawerContent(props) {
    const{user}=Authcontext()
const auth=getAuth(app)
const db=getFirestore(app)
const storage=getStorage(app)
const[profile,setprofile]=React.useState("")
const [visible, setVisible] = React.useState(false);
const [indicator,showindicator]=React.useState(false)
const[dailogvisi,setdailogvisi]=React.useState(false)
//const [singleuser,setsingetuser]=React.useState({})
const[followerlist,setfollowerlist]=React.useState([])

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
      updatedetails(result.uri)
     
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
      updatedetails(result.uri)
     
    }
  }

  //camera open
  //end
  const updatedetails=async(profiles)=>{
    if(profiles==='')
    {
      alert("Somefields are missing")
      return
    }
    try{
    showindicator(true)  
    const storageRef = ref(storage, 'users/' + user.email + "profilepic"+new Date().toLocaleString());
    const img = await fetch(profiles);
    const bytes = await img.blob();
    uploadBytes(storageRef, bytes)
    .then(snapshot => {
      return getDownloadURL(snapshot.ref)
      
    })
    .then(downloadURL => {
      const upDocRef = doc(db, "users", user.uid);
      const docRef = updateDoc(upDocRef, 
        {
         profile: downloadURL
        }
        ).then(()=>{
          updateProfile(auth.currentUser,{displayName:auth.currentUser.displayName,photoURL:downloadURL})
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

const logoutops=()=>{
    signOut(auth).then(()=>{
        let toast = Toast.show('Logged out', {
            duration: Toast.durations.LONG,
          });
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 1000);
    }).catch(()=>{
        alert("Try again later")
    })
}
const getuserinfo=async()=>{
    showindicator(true)
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
//setsingetuser(docSnap.data())
followingpage(docSnap.data())
showindicator(false)
} else {
    showindicator(false)
props.navigation.navigate("Home")
}
}

const followingpage=(suser)=>
    {
        showindicator(true)
        let tempdata=[]
        suser.following.map((item)=>{
            showindicator(true)
            const docRef = doc(db, "users", item.userid);
            getDoc(docRef).then((docSnap)=>{
                tempdata.push(docSnap.data())
            }).catch(()=>{
            })
    
        })
        setfollowerlist(tempdata)
        showindicator(false)
    }
    
    const deletefunc=async(id,tablename)=>{
      await deleteDoc(doc(db, tablename, id));
    }
    const deleteaccount=async()=>{
      try{
        showindicator(true)
              deleteuserposts(auth.currentUser.uid)
              deleteuserfleets(auth.currentUser.uid)
              deleteuservideos(auth.currentUser.uid)
              deleteuser(auth.currentUser.uid)
              await deleteUser(auth.currentUser)
              showindicator(false)
      }
      catch{
        showindicator(false)
      }
    }
    const deleteuser=async(id)=>{
      try{
        deletefunc(id,"users")
      }
      catch{
        //showindicator(false)
      }
    }
    
    const deleteuserposts=async(id)=>{
      try{
        const q=query(collection(db, "allposts"),where("userid", "==",id))
        getDocs(q).then((res)=>{
          res.docs.map(doc=>{
        deletefunc(doc.id,"allposts")
        })
         // showindicator(false)
        }).catch(()=>{
         // showindicator(false)
        })
      }
      catch{
      //  showindicator(false)
      }
    }
    const deleteuservideos=async(id)=>{
      try{
        const q=query(collection(db, "videos"),where("userid", "==",id))
        getDocs(q).then((res)=>{
          res.docs.map(doc=>{
        deletefunc(doc.id,"videos")
        })
         // showindicator(false)
        }).catch(()=>{
         // showindicator(false)
        })
      }
      catch{
        //showindicator(false)
      }
    }
    const deleteuserfleets=async(id)=>{
      try{
        const q=query(collection(db, "tweets"),where("userid", "==",id))
        getDocs(q).then((res)=>{
          res.docs.map(doc=>{
        deletefunc(doc.id,"tweets")
        })
         // showindicator(false)
        }).catch(()=>{
         // showindicator(false)
        })
      }
      catch{
      //  showindicator(false)
      }
    }
React.useEffect(()=>{
    getuserinfo()
},[])
    return(
        <View style={{flex:1}}>
           <Dialog.Container visible={dailogvisi}>
        <Dialog.Title>Account Deactivation</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete Account.
        </Dialog.Description>
        <Dialog.Button label="Yes" onPress={deleteaccount} />
        <Dialog.Button label="No" onPress={()=>setdailogvisi(false)} />
      </Dialog.Container>
               <Dialog.Container visible={visible}>
        <Dialog.Title>Image Options</Dialog.Title>
        <Dialog.Description>
          Select camera for live image and gallery for existing one.
        </Dialog.Description>
        <Dialog.Button label="Camera" onPress={handleCamera} />
        <Dialog.Button label="Gallery" onPress={handleGallery} />
      </Dialog.Container>
            <DrawerContentScrollView {...props}>
                <LoadingModal show={indicator}></LoadingModal>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: RFPercentage(3.5)}}>
                            <TouchableOpacity onPress={()=>setVisible(true)}>
                            <Avatar.Image 
                            
                                source={auth.currentUser.photoURL?{uri:auth.currentUser.photoURL}:require("../../images/user.png")}
                                size={50}
                            />
                            </TouchableOpacity>
                            <View style={{marginLeft:RFPercentage(3), flexDirection:'column'}}>
                                <Title style={styles.title}>{auth.currentUser.displayName}</Title>
                                <Caption style={styles.caption}>@_{auth.currentUser.displayName}</Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Paragraph>{auth.currentUser.displayName}</Paragraph>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="home-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => props.navigation.navigate("Home")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="account-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Profile"
                            onPress={() =>props.navigation.navigate("Profile",{userid:auth.currentUser.uid})}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Feather name="settings" size={24} color={colors.mblack}/>
                            )}
                            label="Update Profile"
                            onPress={() =>props.navigation.navigate("UpdateProfile")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="chat-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Chat"
                            onPress={() =>props.navigation.navigate("ContactScreen",{usersfollower:followerlist})}
                        />
                    <DrawerItem 
                            icon={({color, size}) => (
                                <FontAwesome name="safari" size={size} color={colors.mblack} />
                            )}
                            label="Discover"
                            onPress={() =>props.navigation.navigate("Discover")}
                        />
                <DrawerItem 
                    icon={({color, size}) => (
                        <AntDesign name="retweet" size={size} color={colors.mblack} />
                            )}
                            label="Fleet"
                            onPress={() =>props.navigation.navigate("Tweets")}
                        />
                        <DrawerItem 
                    icon={({color, size}) => (
                        <Entypo name="video" size={size} color={colors.mblack} />
                            )}
                            label="Videos"
                            onPress={() =>props.navigation.navigate("Videos")}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="delete-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Deactivate Account"
                            onPress={() => setdailogvisi(true)}
                        />
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Icon 
                                name="close-outline" 
                                color={colors.mblack}
                                size={size}
                                />
                            )}
                            label="Close Menu"
                            onPress={() => props.navigation.closeDrawer()}
                        />
                    </Drawer.Section>
                    
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={colors.mblack}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={logoutops}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    caption1: {
        fontSize: 14,
        lineHeight: RFPercentage(3),
      }
    
    ,
    row: {
      marginTop: RFPercentage(4),
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });