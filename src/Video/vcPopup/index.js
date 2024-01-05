/**
 *  author : Dheerendra Singh Solanki
 */
import React, {PureComponent} from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from 'styles/BasicStyles';
import {showToast} from 'components/CustomToast';
import styles from './style';

import {measureConnectionSpeed} from 'react-native-network-bandwith-speed';
//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import ProcessingLoader from 'components/ProcessingLoader';

import RNVoipCallNativeModule from '../../callLib/RNVoipCall';
//Agora
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
// Cache Clear
import clear from 'react-native-clear-cache-lcm';

// Image
import voiceCallBg from 'assets/images/voiceCallBg.png';
import videoCallPopup from 'assets/images/videoCallPopup.png';
import background from '../../Live/Livecomponents/assets/voiceCallBg.png';
import endVideoCall from 'assets/icons/call_off.png';
import unmuteVideoCallAudio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_camara_on from '../../Live/Livecomponents/assets/ic_camara_on.png';
import ic_camara_off from '../../Live/Livecomponents/assets/ic_camara_off.png';
import photo_reverse from '../../Live/Livecomponents/assets/photo-reverse.png';

// Sound Player
import SoundPlayer from 'react-native-sound-player';
//Api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';

import database from '@react-native-firebase/database';
import {
  isAcceptVideoCall,
  isVideoCallEnd,
  isVCEnd,
} from '../../Chat_WiseWord/src/network';
import {nsNavigate} from 'routes/NavigationService';

export default class CallConfirmScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.FireData = database();
    this.state = {isLoading: false, declineChat: false};
    RNVoipCallNativeModule.stopRingtune();
    RNVoipCallNativeModule.endAllCalls();
    // RNVoipCallNativeModule.removeEventListener('answerCall');
  }
  componentDidMount() {
    this.checkChatDecline();
    this.nameTap();
  }

  checkChatDecline = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const dataBody = this.props.navigation.getParam('dataBody', null);
      const currentUserId = userInfo.userId;
      const guestUserId = dataBody.userId;
      let endVcData = [];
      let key_next = true;
      if (key_next === true) {
        await this.FireData.ref('endVC/')
          .on('value', async dataSnapShot => {
            let consultantData = dataSnapShot.exists();
            if (consultantData && key_next === true) {
              let end_data = dataSnapShot
                .child(currentUserId + '/' + guestUserId)
                .exists();
              if (end_data && key_next === true) {
                endVcData.push(
                  dataSnapShot.child(currentUserId + '/' + guestUserId).val()
                    .endVC,
                );
                if (endVcData.length !== 0 && key_next === true) {
                  endVcData.filter(async enddata => {
                    if (
                      key_next === true &&
                      enddata === 1 &&
                      enddata !== 0 &&
                      this.state.declineChat !== true
                    ) {
                      key_next = false;
                      this.setState({declineChat: true});
                      Alert.alert(
                        'Aapke Pass!',
                        'Client declined Video Call',
                        [
                          {
                            text: 'Ok',
                            // onPress: () => ,
                          },
                        ],
                        {
                          cancelable: false,
                        },
                      );
                      this.resetData();
                    }
                  });
                }
              }
            }
          })
          .bind(this);
      }
    } catch (error) {
      console.log('error while checking chat decline by user', error);
    }
  };
  async resetData() {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      var currentUserId = userInfo.userId;
      var guestUserId = dataBody.userId;
      let endNow = 0;
      isVCEnd(endNow, currentUserId, guestUserId);
      this.setState({declineChat: true});
      nsNavigate('astro_Home');
      SoundPlayer.stop();
    } catch (error) {
      console.log('error while reset', error);
    }
  }

  handleDenile = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      const params = {
        channelId: dataBody.channelId,
        consultationId: dataBody.consultationId,
      };
      // console.log('params are', params);
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
          nsNavigate('astro_Home');
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
          isVCEnd(2, userInfo.userId, dataBody.userId);
          await isAcceptVideoCall(accept, userInfo.userId, dataBody.userId);
          this.setState({isLoading: false, declineChat: false});
        } else {
          this.setState({isLoading: false, declineChat: false});
        }
      }
    } catch (e) {}
  };
  //Auto Login User For Chat
  nameTap = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      let endNow = 0;
      let accept = 0;
      let endMessage = '';
      const params = {
        consultationId: dataBody.consultationId,
      };
      console.log('when VC Accept params are', params, dataBody);
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/acceptVideo',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          console.log(
            'Response from accept Chat',
            response,
            'Data Body',
            dataBody,
          );
          await isVideoCallEnd(
            endMessage,
            endNow,
            userInfo.userId,
            dataBody.userId,
          );
          await isAcceptVideoCall(accept, userInfo.userId, dataBody.userId);
          this.props.navigation.navigate('vcDoc', {dataBody});
          this.setState({isLoading: false});
          SoundPlayer.stop();
        } else {
          this.setState({isLoading: false});
          showToast(message);
        }
      }
    } catch (e) {}
  };

  render() {
    const dataBody = this.props.navigation.getParam('dataBody', null);

    return (
      <ImageBackground
        source={voiceCallBg}
        resizeMode="cover"
        style={[
          basicStyles.container,
          basicStyles.alignCenter,
          basicStyles.justifyCenter,
        ]}>
        {/* <View style={styles.popUpScreen}> */}
        <View
          style={[
            // basicStyles.container,
            // basicStyles.whiteBackgroundColor,
            styles.popUpContainer,
          ]}>
          <View
            style={[
              basicStyles.mainContainer,
              basicStyles.justifyCenter,
              {marginTop: hp(8)},
            ]}>
            <View style={styles.requestContainer}>
              <Image
                source={{uri: dataBody.userImage}}
                resizeMode="cover"
                style={styles.userImage}
              />
              <Text style={styles.requestText}>
                You have Video Call request from {dataBody.clientName}
              </Text>
            </View>
            <Image
              source={videoCallPopup}
              resizeMode="cover"
              style={styles.chatIcon}
            />
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyAround,
              ]}></View>
          </View>
        </View>

        {this.state.isLoading && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}
