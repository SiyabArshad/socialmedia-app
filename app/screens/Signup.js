import { View, ScrollView,Text,StyleSheet,Image,TouchableOpacity } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import InputFeild from "../components/InputFeild"
import AppButton from '../components/AppButton'
import { Ionicons } from '@expo/vector-icons';
import {createUserWithEmailAndPassword,getAuth,deleteUser,updateProfile,sendEmailVerification} from "firebase/auth"
import {doc,setDoc,getFirestore, addDoc, serverTimestamp} from "firebase/firestore"
import app from '../config/firebase'
import Toast from 'react-native-root-toast'
export default function Signup(props) {
    const db=getFirestore(app)
    const auth=getAuth(app)
    const [indicator,showindicator]=React.useState(false)
    const[inputvalue,setinputvalue]=React.useState([
        {
            placeholder: "Username",
            iconName: 'account-circle',
            value: "",
        },
        {
            placeholder: "Email",
            iconName: 'email',
            value: "",
        },
        {
            placeholder: "Location(Optional)",
            iconName: 'location-pin',
            value: "",
        },
        {
            placeholder: "Password",
            iconName: 'lock',
            value: "",
            secure: true
        }
        ,
        {
            placeholder: "Confirm Password",
            iconName: 'lock',
            value: "",
            secure: true
        },
    ])
    const handleChange = (text, i) => {
        let tempfeilds = [...inputvalue];
        tempfeilds[i].value = text;
        setinputvalue(tempfeilds);

    };
 //email validation frontend
 const emailValidation=(useremail)=>{
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!useremail || regex.test(useremail) === false){
        return false;
    }
    return true;
}

    const handelsignup=()=>{
        showindicator(true);
        let tempfeilds = [...inputvalue];
        if (tempfeilds[0].value === "" || tempfeilds[1].value === ""|| tempfeilds[3].value === ""|| tempfeilds[4].value === "") {
            let toast = Toast.show('PLease fill all fields', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            showindicator(false);
            return false;
        }
        if (tempfeilds[3].value!==tempfeilds[4].value) {
            let toast = Toast.show('Password not matching with confirm password', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            showindicator(false);
            return false;
        }
if(!emailValidation(tempfeilds[1].value))
        {
            showindicator(false)
            let toast = Toast.show('Email not valid', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            return false
        }        
        try{
            showindicator(true)
            createUserWithEmailAndPassword(auth,tempfeilds[1].value,tempfeilds[3].value).then((userCredential) => {  
            sendEmailVerification(userCredential.user).then(()=>{
                setDoc(doc(db, "users",userCredential.user.uid ), {
                    username:tempfeilds[0].value,
                    email:tempfeilds[1].value,
                    location:tempfeilds[2].value,
                    time:serverTimestamp(),
                    profile:"",
                    bio:"",
                    userid:userCredential.user.uid,
                    followers:[],
                    following:[],
                    blockusers:[]
                }).then((result)=>{
                    updateProfile(auth.currentUser,{displayName:tempfeilds[0].value,photoURL:""})
                    //email sent to registered account email address
                    
                    //end eamil sent code
                    showindicator(false);
                    let toast = Toast.show('Welcome to FIYR', {
                        duration: Toast.durations.LONG,
                      });
                      setTimeout(function hideToast() {
                        Toast.hide(toast);
                      }, 1000);
                }).catch((error)=>{
                    deleteUser(auth.currentUser).then(() => {
                        // User deleted.
                        showindicator(false)
                      }).catch((error) => {
                        // An error ocurred
                        // ...
                        showindicator(false)
                      });
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      showindicator(false);
                      let toast = Toast.show(errorMessage, {
                        duration: Toast.durations.LONG,
                      });
                      setTimeout(function hideToast() {
                        Toast.hide(toast);
                      }, 1000);
              }).catch(()=>{
                  
              })
    
            })
                
       //     props.navigation.navigate("HomeScreen")
            }).catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                showindicator(false);
                let toast = Toast.show(errorMessage, {
                    duration: Toast.durations.LONG,
                  });
                  setTimeout(function hideToast() {
                    Toast.hide(toast);
                  }, 1000);
          })
        }
        catch{
            showindicator(false);
        }
        //showindicator(false);
    }
    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
<ScrollView>
            <View style={styles.mnpglogin}>
            <View style={styles.mnpgloginnav}>
                <TouchableOpacity onPress={()=>props.navigation.navigate("LoginScreen")}>
                <Ionicons name="chevron-back" size={30} color={colors.mblack} />
                </TouchableOpacity>
                <Text style={{width:"90%",textAlign:"center",fontSize:RFPercentage(3),color:colors.mblack}}>Sign up</Text>
            </View>
            <View style={styles.loginform}>
            <Text style={{color:colors.mblack,marginVertical:RFPercentage(2)}}>
                Fill all Fields correctly to register yourself and share your moments
            </Text>
            {
                inputvalue.map((item,i)=>{
                    return(
                        <View key={i} style={{marginTop:i===0?RFPercentage(10):RFPercentage(0),marginBottom:RFPercentage(1)}}>
                            <InputFeild
                            borderWidth={RFPercentage(0.1)}
                            borderColor={colors.lightGray} 
                            placeholder={item.placeholder}
                            placeholderColor={colors.mblack}
                            height={RFPercentage(6.8)}
                            leftIconName={item.iconName}
                            backgroundColor={colors.white}
                            // onTouchStart={() => setGreenBorder(true)}
                            // onTouchEnd={() => setGreenBorder(false)}
                            secure={item.secure}
                            borderRadius={RFPercentage(1.4)}
                            color={colors.black}
                            fontSize={RFPercentage(2)}
                            handleFeild={(text) => handleChange(text, i)}
                            value={item.value}
                            width={"100%"}
                             >
                             </InputFeild>
                        </View>
                    )
                })
            }
            <View style={{marginTop:RFPercentage(3)}}>
            <AppButton 
            onPress={()=>handelsignup()} 
            title="Go to Feed"
             color={colors.white}
              backgroundColor={colors.pink}
               width="100%"
               borderRadius={RFPercentage(1.4)}
               ></AppButton>
               </View>
            <TouchableOpacity onPress={()=>props.navigation.navigate("LoginScreen")} style={{marginVertical:RFPercentage(3)}}>
                <Text style={{color:colors.pink,textAlign:"center"}}>Already have an Account? Signin</Text>
            </TouchableOpacity>
            </View>
            
            </View>
            </ScrollView>
        </Screen>
  )
}

const styles=StyleSheet.create({
    mnpglogin:{
        flex:1,
        padding:RFPercentage(1.5)
    },
    mnpgloginnav:{
        display:"flex",
        flexDirection:"row",
    },
    loginform:{
        paddingVertical:RFPercentage(1),
        paddingHorizontal:RFPercentage(2)
    }
    })
/**
 * signInWithEmailAndPassword(auth, userCredential._tokenResponse.email, tempfeilds[2].value)
                .then((userCredential) => {
                  updateProfile(auth.currentUser,{displayName:tempfeilds[0].value,photoURL:""}) 
                  showIndicator(false);      
                    }).catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      showIndicator(false);
                      alert(errorMessage)
                      // ..
                    });
            
 */