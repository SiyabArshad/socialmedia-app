import { View, Text,StyleSheet,Image,TouchableOpacity } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import InputFeild from "../components/InputFeild"
import AppButton from '../components/AppButton'
import { Ionicons } from '@expo/vector-icons';
import {signInWithEmailAndPassword,getAuth} from "firebase/auth"
import app from '../config/firebase'
import Toast from 'react-native-root-toast'
export default function Login(props) {
    const auth=getAuth(app)
    const [indicator,showindicator]=React.useState(false)
    const[inputvalue,setinputvalue]=React.useState([
        {
            placeholder: "Email or Username",
            iconName: 'email',
            value: "",
        },
        {
            placeholder: "Password",
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
    //end
    const handellogin=()=>{
        showindicator(true);
        let tempfeilds = [...inputvalue];
        if (tempfeilds[0].value === "" || tempfeilds[1].value === "") {
            let toast = Toast.show('Please fill all required fields', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
            showindicator(false);
            return false;
        }
        if(!emailValidation(tempfeilds[0].value))
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
            signInWithEmailAndPassword(auth,tempfeilds[0].value,tempfeilds[1].value).then(()=>{
                showindicator(false);
                let toast = Toast.show('Login sucessfully', {
                    duration: Toast.durations.LONG,
                  });
                  setTimeout(function hideToast() {
                    Toast.hide(toast);
                  }, 1000);
            
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
            let toast = Toast.show('Login failed', {
                duration: Toast.durations.LONG,
              });
              setTimeout(function hideToast() {
                Toast.hide(toast);
              }, 1000);
        }
    }
    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
            <View style={styles.mnpglogin}>
            <View style={styles.mnpgloginnav}>
                <TouchableOpacity onPress={()=>props.navigation.navigate("SigninScreen")}>
                <Ionicons name="chevron-back" size={30} color={colors.mblack} />
                </TouchableOpacity>
                <Text style={{width:"90%",textAlign:"center",fontSize:RFPercentage(3),color:colors.mblack}}>Sign in</Text>
            </View>
            <View style={styles.loginform}>
            <Text style={{color:colors.mblack,marginVertical:RFPercentage(2)}}>
                Type in Your Email ID and Password you choose for FIYR and Click go to Feed
            </Text>
            {
                inputvalue.map((item,i)=>{
                    return(
                        <View key={i} style={{marginTop:i===0?RFPercentage(15):RFPercentage(0),marginBottom:RFPercentage(1)}}>
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
            <View style={{marginTop:RFPercentage(1)}}>
            <AppButton 
            onPress={()=>handellogin()} 
            title="Go to Feed"
             color={colors.white}
              backgroundColor={colors.pink}
               width="100%"
               borderRadius={RFPercentage(1.4)}
               ></AppButton>
               </View>
            <TouchableOpacity onPress={()=>props.navigation.navigate("ResetScreen")} style={{marginVertical:RFPercentage(10)}} >
                <Text style={{color:colors.pink,textAlign:"center"}}>Cant sign In? Reset Password </Text>
            </TouchableOpacity>
            </View>
            
            </View>
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
        paddingVertical:RFPercentage(10),
        paddingHorizontal:RFPercentage(2)
    }
    })
