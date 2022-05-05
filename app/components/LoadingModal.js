import React from 'react';
import { Modal, View, ActivityIndicator, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import colors from '../config/colors';
const windowHeight = Dimensions.get('window').height

// config
import Colors from '../config/colors';

function LoadingModal({ show }) {
    return (
        <Modal visible={show} transparent={false} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <View style={{ marginTop: (windowHeight / 2) - 50, width: "100%", height: RFPercentage(10), borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} >
                <View style={{ elevation: 5, width: RFPercentage(10), height: RFPercentage(10), borderRadius: 10, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }} >
                    <ActivityIndicator size={RFPercentage(5)} color="#1D3557" />
                </View>
            </View>
        </Modal>
    );
}

export default LoadingModal;