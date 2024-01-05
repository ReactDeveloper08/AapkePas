import React from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import clear from 'react-native-clear-cache-lcm';
import basicStyles from 'styles/BasicStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProcessingLoader from 'components/ProcessingLoader';
import database from '@react-native-firebase/database';
import SoundPlayer from 'react-native-sound-player';
// import NotificationSounds from 'react-native-notification-sounds';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';
import {setAsyncStorage, keys} from 'asyncStorage';
import {connect} from 'react-redux';
import {ChatOperations, ChatSelectors} from 'Redux/wiseword/chat';
import {nsNavigate} from 'routes/NavigationService';
import {
  LoginRequest,
  SignUpRequest,
  AddUser,
  isChatEnd,
  chatOperation,
} from '../DoctorSideChat/src/network';
import {
  isAcceptVideoCall,
  isVideoCallEnd,
  isVCEnd,
} from '../../Chat_WiseWord/src/network';
import {
  isVoipCallEnd,
  isAcceptVoipCall,
  isExtendVoipCall,
  isCallEnd,
} from '../../Chat_WiseWord/src/network';

const acceptChat = async (props, notification) => {
  try {
    const userInfo = await getData(KEYS.USER_INFO);
    console.log('notification response', notification);
    var dataBody = notification.data;
    const {
      profileImg,
      clientName,
      clientMobile,
      DOB,
      birthTime,
      birthPlace,
      userId,
      consultationId,
    } = dataBody;
    var currentID = userInfo.userId;
    var guestId = dataBody.userId;
    let endNow = 0;
    let accept = 0;
    let extend = 0;
    let endMessage = '';
    // await isChatEnd(endMessage, endNow, currentID, guestId)
    //   .then(() => {})
    //   .catch(e => {
    //     console.log(e);
    //   });
    // await isAcceptChat(accept, currentID, guestId);
    // await isExtendChat(extendChat, currentID, guestId);
    chatOperation(endMessage, extend, accept, endNow, currentID, guestId);
    SoundPlayer.stop();
    const params = {
      consultationId: dataBody.consultationId,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/acceptChat',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {availableMinutes} = response;
        SoundPlayer.stop();
        if (!profileImg) {
          var now = new Date();
          const chatData = {
            name: clientName,
            imgText: clientName.charAt(0),
            guestUserId: guestId,
            currentUserId: currentID,
            dob: DOB,
            time: birthTime,
            date: birthPlace,
            userId,
            now,
            consultationId,
            availableMinutes,
            clientMobile,
          };
          await props.docSaveChatData(chatData).then(() => {
            nsNavigate('Doc_Chat');
          });
        } else {
          var now = new Date();
          const chatData = {
            name: clientName,
            img: profileImg,
            guestUserId: guestId,
            currentUserId: currentID,
            dob: DOB,
            time: birthTime,
            date: birthPlace,
            userId,
            now,
            consultationId,
            availableMinutes,
            clientMobile,
          };
          await props.docSaveChatData(chatData).then(() => {
            nsNavigate('Doc_Chat');
          });
        }
      } else {
        showToast(message);
      }
    }
  } catch (error) {
    console.log('error while accept Chat request', error);
  }
};

const mapStateToProps = state => ({
  isDocChatDataSave: ChatSelectors.isDocChatDataSave(state),
});
const mapDispatchToProps = {
  docSaveChatData: ChatOperations.docSaveChatData,
};

export default connect(mapStateToProps, mapDispatchToProps)(acceptChat);
