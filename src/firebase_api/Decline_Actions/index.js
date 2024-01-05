import React from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  NativeModules,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import clear from 'react-native-clear-cache-lcm';
// import basicStyles from 'styles/BasicStyles';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import ProcessingLoader from 'components/ProcessingLoader';
import database from '@react-native-firebase/database';
import SoundPlayer from 'react-native-sound-player';
// import NotificationSounds from 'react-native-notification-sounds';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
// import {showToast} from 'components/CustomToast';
// import {setAsyncStorage, keys} from 'asyncStorage';
// import {connect} from 'react-redux';
// import {ChatOperations, ChatSelectors} from 'Redux/wiseword/chat';
import {nsNavigate} from 'routes/NavigationService';
import {
  LoginRequest,
  SignUpRequest,
  AddUser,
  isChatEnd,
  chatOperation,
} from 'ChatDoctor/src/network';
import {
  isAcceptVideoCall,
  isVideoCallEnd,
  isVCEnd,
  removeVideoCallEnd,
  removeAcceptVideoCall,
  removeVCEnd,
} from '../../Chat_WiseWord/src/network';
import {
  isVoipCallEnd,
  isAcceptVoipCall,
  isExtendVoipCall,
  isCallEnd,
  removeAcceptVoipCall,
  removeEndCall,
  removeEndVoipCall,
  removeExtendVoipCall,
} from '../../Chat_WiseWord/src/network';
import RNVoipCallNativeModule from '../../callLib/RNVoipCall';
import RNRestart from 'react-native-restart';
export const declineChat = async notification => {
  RNVoipCallNativeModule.stopRingtune();
  RNVoipCallNativeModule.endAllCalls();
  // RNVoipCallNativeModule.removeEventListener('endCall');
  try {
    const userInfo = await getData(KEYS.USER_INFO);
    var dataBody = notification;
    const params = {
      consultationId: dataBody.consultationId,
    };

    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/declineChat',
      params,
      true,
      false,
    );
    if (response) {
      const {success} = response;
      if (success) {
        // const {message} = response;
        SoundPlayer.stop();
        var clientId = userInfo.userId;
        var guestId = dataBody.userId;
        let endNow = 1;
        let accept = 1;
        let extend = 0;
        let endMessage = '';
        await chatOperation(
          endMessage,
          extend,
          accept,
          endNow,
          guestId,
          clientId,
        );
        await isChatEnd(2, clientId, guestId)
          .then(() => {})
          .catch(e => {
            console.log(e);
          });
        await nsNavigate('astro_Home');
        await RNRestart.Restart();
        // NativeModules.DevSettings.reload();
        // await isAcceptChat(accept, guestId, clientId);
      }
    }
  } catch (error) {
    console.log('error while decline chat request', error);
  }
};

export const declineCall = async notification => {
  RNVoipCallNativeModule.stopRingtune();
  RNVoipCallNativeModule.endAllCalls();
  // RNVoipCallNativeModule.removeEventListener('endCall');
  // RNVoipCallNativeModule.removeEventListener('answerCall');
  try {
    const userInfo = await getData(KEYS.USER_INFO);
    var dataBody = notification;
    const params = {
      consultationId: dataBody.consultationId,
      channelId: dataBody.channelId,
    };
    console.log('params are', dataBody);
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/declineICall',
      params,
      true,
      false,
    );
    if (response) {
      const {success} = response;
      if (success) {
        // const {message} = response;
        SoundPlayer.stop();
        let endNow = 1;
        let accept = 1;
        let endMessage = '';
        await isVoipCallEnd(
          endMessage,
          endNow,
          userInfo.userId,
          dataBody.userId,
        )
          .then(() => {})
          .catch(e => {
            console.log(e);
          });
        await isAcceptVoipCall(accept, userInfo.userId, dataBody.userId);
        await isCallEnd(2, userInfo.userId, dataBody.userId);
        await nsNavigate('astro_Home');
        await removeExtendVoipCall(userInfo.userId, dataBody.userId);
        await removeAcceptVoipCall(userInfo.userId, dataBody.userId);
        await removeEndVoipCall(dataBody.userId, userInfo.userId);
        await removeEndVoipCall(userInfo.userId, dataBody.userId);
        await removeEndCall(userInfo.userId, dataBody.userId);
        await RNRestart.Restart();
      }
    }
  } catch (error) {
    console.log('error while decline call request');
  }
};

export const declineVideoCall = async notification => {
  RNVoipCallNativeModule.stopRingtune();
  RNVoipCallNativeModule.endAllCalls();
  // RNVoipCallNativeModule.removeEventListener('endCall');
  try {
    const userInfo = await getData(KEYS.USER_INFO);
    var dataBody = notification;
    const params = {
      channelId: dataBody.channelId,
      consultationId: dataBody.consultationId,
    };
    console.log('params are', params);
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/declineVideo',
      params,
      true,
      false,
    );
    if (response) {
      const {success} = response;
      if (success) {
        // const {message} = response;
        SoundPlayer.stop();
        let endNow = 1;
        let accept = 1;
        let endMessage = '';
        await isVideoCallEnd(
          endMessage,
          endNow,
          userInfo.userId,
          dataBody.userId,
        )
          .then(() => {})
          .catch(e => {
            console.log(e);
          });
        await isVCEnd(2, userInfo.userId, dataBody.userId);
        await isAcceptVideoCall(accept, userInfo.userId, dataBody.userId);
        await nsNavigate('astro_Home');
        await removeVideoCallEnd(userInfo.userId, dataBody.userId);
        await removeAcceptVideoCall(userInfo.userId, dataBody.userId);
        await removeVCEnd(userInfo.userId, dataBody.userId);
        await RNRestart.Restart();
      }
    }
  } catch (error) {
    console.log('errore while decline video call');
  }
};
