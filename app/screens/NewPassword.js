import { View, Text,StyleSheet,Image,TouchableOpacity } from 'react-native'
import * as React from 'react'
import {RFPercentage} from "react-native-responsive-fontsize"
import colors from '../config/colors'
import Screen from "../components/Screen"
import LoadingModal from '../components/LoadingModal'
import InputFeild from "../components/InputFeild"
import AppButton from '../components/AppButton'
import { Ionicons } from '@expo/vector-icons';
export default function Login(props) {
    const [indicator,showindicator]=React.useState(false)
    const[inputvalue,setinputvalue]=React.useState([
        {
            placeholder: "Enter password",
            iconName: 'lock',
            value: "",
            secure: true
        },
        {
            placeholder: "Please confirm password",
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
    const handelnewpassword=()=>{
        showindicator(true);
        let tempfeilds = [...inputvalue];
        if (tempfeilds[0].value === "" || tempfeilds[1].value === "") {
            alert("Please fill all the fields");
            showindicator(false);
            return false;
        }
        if (tempfeilds[0].value!==tempfeilds[1].value) {
            alert("Password not Matching");
            showindicator(false);
            return false;
        }
        
        try{
            showindicator(false);
            props.navigation.navigate("LoginScreen")

        }
        catch{
            showindicator(false);
        }
        showindicator(false);
    }
    return (
        <Screen style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", backgroundColor: colors.white }}>
        <LoadingModal show={indicator}></LoadingModal>
            <View style={styles.mnpglogin}>
            <View style={styles.mnpgloginnav}>
                <TouchableOpacity onPress={()=>props.navigation.navigate("ResetScreen")}>
                <Ionicons name="chevron-back" size={30} color={colors.mblack} />
                </TouchableOpacity>
                <Text style={{width:"90%",textAlign:"center",fontSize:RFPercentage(3),color:colors.mblack}}>Create New Password</Text>
            </View>
            <View style={styles.loginform}>
            <Text style={{color:colors.mblack,marginVertical:RFPercentage(2)}}>
                A strong password has a combination of letters, numbers, and special characters like $% etc.
            </Text>
            {
                inputvalue.map((item,i)=>{
                    return(
                        <View key={i} style={{marginTop:i===0?RFPercentage(10):RFPercentage(0),marginBottom:RFPercentage(1)}}>
                            <InputFeild 
                            placeholder={item.placeholder}
                            placeholderColor={colors.mblack}
                            height={RFPercentage(6.8)}
                            leftIconName={item.iconName}
                            backgroundColor={colors.white}
                            // onTouchStart={() => setGreenBorder(true)}
                            // onTouchEnd={() => setGreenBorder(false)}
                            borderWidth={RFPercentage(0.1)}
                            borderColor={colors.lightGray}
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
            <View style={{marginTop:RFPercentage(5)}}>
            <AppButton 
            onPress={()=>handelnewpassword()} 
            title="Save"
             color={colors.white}
              backgroundColor={colors.pink}
               width="100%"
               borderRadius={RFPercentage(1.4)}
               ></AppButton>
               </View>
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
