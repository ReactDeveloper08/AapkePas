import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  BackHandler,
  Animated,
} from 'react-native';
import styles from './style';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import clear from 'react-native-clear-cache-lcm';
// proximity services
import Proximity from 'react-native-proximity';
import {startProximity, stopProximity} from 'react-native-proximity-screen';
//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import basicStyles from 'styles/BasicStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import SoundPlayer from 'react-native-sound-player';
import {withNavigation} from 'react-navigation';
// import NotificationSounds from 'react-native-notification-sounds';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';
import RNVoipCallNativeModule from '../../callLib/RNVoipCall';
import CountDown from 'react-native-countdown-component';
// agora
import RtcEngine from 'react-native-agora';
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
// import {setAsyncStorage, keys} from 'screens/Chat/src/asyncStorage';
import {nsNavigate} from 'routes/NavigationService';
import ProcessingLoader from 'components/ProcessingLoader';
import voiceCallBg from 'assets/images/voiceCallBg.png';
import voiceCallPopup from 'assets/images/voiceCallPopup.png';
import background from '../../Live/Livecomponents/assets/voiceCallBg.png';
import audio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_speaker from '../../Live/Livecomponents/assets/ic_speaker.png';
import mute_speaker from '../../Live/Livecomponents/assets/mute_speaker.png';
import call_cut from '../../Live/Livecomponents/assets/call_cut.png';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);

class callPopUp extends PureComponent {
  constructor(props) {
    super(props);
    this._engine = RtcEngine;
    const dataBody = props.navigation.getParam('dataBody', null);
    this.state = {
      isLoading: false,
      declineChat: false,
      dataBody,
      joinSucceed: false,
      peerIds: [],
      muteAudio: false,
      muteVideo: false,
      openMicrophone: true,
      enableSpeakerphone: true,
      proximity: '',
      distance: '',
      endCall: false,
    };

    RNVoipCallNativeModule.stopRingtune();
    RNVoipCallNativeModule.endAllCalls();
    RNVoipCallNativeModule.removeEventListener('answerCall');
    RNVoipCallNativeModule.removeEventListener('endCall');
    clear.runClearCache(() => {
      console.log('data clear');
    });
    Proximity.addListener(this._proximityListener);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  async componentDidMount() {
    const userInfo = await getData(KEYS.USER_INFO);
    const dataBody = this.props.navigation.getParam('dataBody', null);
    this._engine = await RtcEngine.create(dataBody.appID);

    const getInstance = RtcEngine.instance();

    // enable audio module
    await this._engine?.enableAudio();

    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      dataBody.channelTocken,
      dataBody.channelName,
      null,
      userInfo.userId,
    );

    console.log('agora instance after connection with it', getInstance);

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
    });
    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      this.nameTap();
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      if (reason === 0) {
        this.setState({declineChat: true});
        this._engine?.leaveChannel();
        this._engine?.stopPreview();
        this._engine?.destroy();
        this.props.navigation.navigate('astro_Home');
        console.log('userWalkout');
      } else if (reason === 1) {
        this.state.joinSucceed === true
          ? this.endTheCall()
          : this.handleDenile();
      }
    });

    this._engine.addListener(
      'ConnectionLost',
      (channel, uid, elapsed, data, err) => {
        console.log(
          'the connection lost +++ Reason is C L==',
          channel,
          uid,
          elapsed,
          data,
          err,
        );
        this._engine.leaveChannel();
        this.props.navigation.popToTop();
      },
    );
    this._engine.addListener(
      'NetworkTypeChanged',
      (channel, uid, elapsed, data, err) => {
        console.log(
          'the connection lost +++ Reason is NC ==',
          channel,
          uid,
          elapsed,
          data,
          err,
        );
        // this._engine.leaveChannel();
        // this.props.navigation.popToTop();
      },
    );

    const connectionState = await this._engine.getConnectionState();
    console.log(
      'agora connection State after connection with it',
      connectionState,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
    Proximity.removeListener(this._proximityListener);
    this._engine?.destroy();
  }
  _proximityListener = data => {
    this.setState({
      proximity: data.proximity,
      distance: data.distance, // Android-only
    });
  };

  //* Back handler
  backAction = () => {
    return true;
  };

  walkOut = async () => {
    await this._engine?.leaveChannel();
    await this._engine?.stopPreview();
    await this._engine?.destroy();
    this.props.navigation.navigate('astro_Home');
    console.log('userWalkout');
  };

  checkChatDecline = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      var currentUserId = userInfo.userId;
      var guestUserId = dataBody.userId;
      let key_new = true;
      if (key_new === true) {
        database()
          .ref('endCall')
          .child(`${currentUserId}`)
          .child(`${guestUserId}`)
          .on('value', async dataSnapShot => {
            const enddata = dataSnapShot.val().endCall;
            if (
              key_new === true &&
              this.state.declineChat !== true &&
              enddata === 1 &&
              enddata !== 0
            ) {
              await this.setState({declineChat: true});
              key_new = false;
              // let endNow = 0;
              // isCallEnd(endNow, currentUserId, guestUserId);
              Alert.alert(
                'Aapke Pass!',
                'Client declined Call',
                [
                  {
                    text: 'Ok',
                    // onPress: () => this.resetData(),
                  },
                ],
                {
                  cancelable: false,
                },
              );
              this.resetData();
              removeExtendVoipCall(currentUserId, guestUserId);
              removeAcceptVoipCall(currentUserId, guestUserId);
              removeEndVoipCall(currentUserId, guestUserId);
              removeEndCall(currentUserId, guestUserId);
            }
          })
          .bind(this);
      }
    } catch (error) {
      console.log('error while checking chat decline by user', error);
    }
  };
  resetData = async () => {
    try {
      this.setState({declineChat: true});
      nsNavigate('astro_Home');
    } catch (error) {
      console.log('error while reset', error);
    }
  };
  handleDenile = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      const params = {
        consultationId: dataBody.consultationId,
        channelId: dataBody.channelId,
      };
      // console.log('params are', params);
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
          nsNavigate('astro_Home');
          let endNow = 1;
          let accept = 1;
          let endMessage = '';
          await isVoipCallEnd(
            endMessage,
            endNow,
            userInfo.userId,
            dataBody.userId,
          );
          await isAcceptVoipCall(accept, userInfo.userId, dataBody.userId);
          await isCallEnd(2, userInfo.userId, dataBody.userId);
          RNVoipCallNativeModule.stopRingtune();
          RNVoipCallNativeModule.endAllCalls();
          // RNVoipCallNativeModule.removeEventListener('endCall');
          await this._engine?.leaveChannel();
          await this._engine?.stopPreview();
          await this._engine?.destroy();
          await removeExtendVoipCall(userInfo.userId, dataBody.userId);
          await removeAcceptVoipCall(userInfo.userId, dataBody.userId);
          await removeEndVoipCall(dataBody.userId, userInfo.userId);
          await removeEndVoipCall(userInfo.userId, dataBody.userId);
          await removeEndCall(userInfo.userId, dataBody.userId);
          this.setState({isLoading: false, declineChat: true});
        }
      } else {
        this.setState({isLoading: false, declineChat: true});
      }
    } catch (e) {
      Alert.alert('', e);
    }
  };
  //Auto Login User For Chat
  nameTap = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      // console.log('Customer Info', dataBody);
      // console.log('Doctor Info', userInfo);
      let endNow = 0;
      let accept = 0;
      let extendChat = 0;
      let endMessage = '';
      await isVoipCallEnd(endMessage, endNow, userInfo.userId, dataBody.userId)
        .then(() => {})
        .catch(e => {
          console.log(e);
        });
      await isAcceptVoipCall(accept, userInfo.userId, dataBody.userId);
      await isExtendVoipCall(extendChat, userInfo.userId, dataBody.userId);
      const params = {
        consultationId: dataBody.consultationId,
      };
      // console.log('params are', params);
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/acceptICall',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          // console.log('Response from accept Chat', response);
          this.setState({
            joinSucceed: true,
          });
          // this.props.navigation.navigate('callDoc', {dataBody});
          this.setState({isLoading: false});
        } else {
          this.setState({isLoading: false});
          showToast(message);
        }
      }
    } catch (e) {
      console.log('the error log in Call', e);
      Alert.alert('', e);
    }
  };

  //* MuteAudio
  pauseAudio = async () => {
    // console.log('the audio pause');
    await this._engine?.muteLocalAudioStream(true);
    this.setState({muteAudio: true});
  };
  //* start Audio
  startAudio = async () => {
    // console.log('video Audio');
    await this._engine?.muteLocalAudioStream(false);
    this.setState({muteAudio: false});
  };

  //* MuteVideo
  handleMuteVideo = async () => {
    try {
      console.log('speaker mute');
      await this._engine.setEnableSpeakerphone(true);
      this.setState({muteVideo: true});
    } catch (e) {
      // console.log('error in mute Video', e);
    }
  };
  handleUnMuteVideo = async () => {
    try {
      console.log('speaker unmute');
      await this._engine.setEnableSpeakerphone(false);
      this.setState({muteVideo: false});
    } catch (e) {
      console.log('error in mute Video', e);
    }
  };

  //*switch camera

  handleSwitchCamera = async () => {
    try {
      await this._engine.switchCamera();
    } catch (e) {
      console.log('error message in switch camera', e);
    }
  };

  //* Start Stream

  startCall = async () => {
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0,
      undefined,
    );
  };

  renderCounter() {
    const dataBody = this.props.navigation.getParam('dataBody', null);
    return (
      <>
        <View style={styles.buttonStyle}>
          <CountdownCircleTimer
            isPlaying
            duration={dataBody.availableMinutes * 60}
            size={150}
            strokeWidth={5}
            trailStrokeWidth={6}
            style={{marginTop: hp(-10)}}
            onComplete={() => {
              this.endTheCall();
            }}
            colors={[
              ['#fff0', 0.4],
              ['#fff0', 0.2],
              ['#fff0', 0.4],
            ]}>
            {({remainingTime, children, animatedColor}) => (
              <View>
                <Touchable
                  onPress={this.startCall.bind(this)}
                  style={styles.profileButton}>
                  <View style={styles.border2}>
                    <View style={styles.border3}>
                      <View style={styles.border4}>
                        <Image
                          source={{uri: dataBody.userImage}}
                          style={styles.userImage}
                        />
                      </View>
                    </View>
                  </View>
                </Touchable>
                <View>
                  <Text style={styles.liveCount}>{dataBody.clientName}</Text>
                </View>
                <Animated.Text
                  style={{
                    color: '#333',
                    fontSize: wp(4),
                    alignSelf: 'center',
                    marginTop: hp(1),
                    // marginBottom: hp(-10),
                  }}>
                  {parseInt(remainingTime / 60, 10) % 60}:
                  {parseInt(remainingTime % 60, 10)}
                </Animated.Text>
              </View>
            )}
          </CountdownCircleTimer>
        </View>
      </>
    );
  }

  renderButtonOperation() {
    return (
      <>
        <View style={styles.buttonHolder}>
          {this.state.muteAudio ? (
            <Touchable
              onPress={this.startAudio.bind(this)}
              style={styles.Iconbutton}>
              <Image source={audio} style={styles.buttonIcon} />
            </Touchable>
          ) : (
            <Touchable
              onPress={this.pauseAudio.bind(this)}
              style={styles.Iconbutton}>
              <Image source={mute_audio} style={styles.buttonIcon} />
            </Touchable>
          )}

          <Touchable onPress={this.endTheCall.bind(this)} style={styles.button}>
            <Image source={call_cut} style={styles.buttonText} />
          </Touchable>

          {this.state.muteVideo ? (
            <Touchable
              onPress={this.handleUnMuteVideo.bind(this)}
              style={styles.Iconbutton}>
              <Image source={ic_speaker} style={styles.buttonIcon} />
            </Touchable>
          ) : (
            <Touchable
              onPress={this.handleMuteVideo.bind(this)}
              style={styles.Iconbutton}>
              <Image source={mute_speaker} style={styles.buttonIcon} />
            </Touchable>
          )}
        </View>
      </>
    );
  }

  //* call end functionality
  endTheCall = async () => {
    try {
      console.log('End Call Press');
      this.setState({isLoading: true});
      const dataBody = this.props.navigation.getParam('dataBody', null);
      const {consultationId, channelId} = dataBody;
      const params = {consultationId, channelId};
      console.log(params);
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/endICallRequest',
        params,
        true,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          await this.requestEnd(message);
          await this._engine?.leaveChannel();
          this._engine?.destroy();
          this._rtmEngine?.leaveChannel(dataBody.channelName);
          this.setState({
            peerIds: [],
            joinSucceed: false,
            endCall: true,
            isLoading: false,
          });
          this.props.navigation.navigate('astro_Home');
          Alert.alert('Aapke Pass', `${message}`);
        } else {
          this.props.navigation.navigate('astro_Home');
          this.setState({isLoading: false});
          Alert.alert('Aapke Pass', `${message}`);
        }
      }
    } catch (e) {
      Alert.alert('', e);
    }
  };
  //*endChat dataRequest
  requestEnd = async message => {
    const userInfo = await getData(KEYS.USER_INFO);
    const dataBody = this.props.navigation.getParam('dataBody', null);
    // console.log('chat end ', userInfo.userId, userId);
    let endNow = 1;
    let accept = 1;
    let endMessage = message;
    await isVoipCallEnd(endMessage, endNow, userInfo.userId, dataBody.userId);
    await isAcceptVoipCall(accept, userInfo.userId, dataBody.userId);
    await removeExtendVoipCall(userInfo.userId, dataBody.userId);
    await removeAcceptVoipCall(userInfo.userId, dataBody.userId);
    await removeEndVoipCall(dataBody.userId, userInfo.userId);
    await removeEndVoipCall(userInfo.userId, dataBody.userId);
    await removeEndCall(userInfo.userId, dataBody.userId);
    await removeEndCall(userInfo.userId, dataBody.userId);
    await removeEndCall(userInfo.userId, dataBody.userId);
  };

  render() {
    const {dataBody} = this.state;
    if (this.state.proximity === true) {
      startProximity();
    } else {
      stopProximity();
    }
    return (
      <ImageBackground
        source={voiceCallBg}
        resizeMode="cover"
        style={[
          basicStyles.container,
          basicStyles.alignCenter,
          basicStyles.justifyCenter,
        ]}>
        {this.state.joinSucceed === false ? (
          <View
            style={[
              // basicStyles.container,
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
                  style={styles.userImage2}
                />
                <Text style={[styles.requestText]}>
                  You have Voice Call request from === {dataBody.clientName}
                </Text>
              </View>
              <Image
                source={voiceCallPopup}
                resizeMode="cover"
                style={styles.chatIcon}
              />
              <View
                style={[basicStyles.directionRow, basicStyles.justifyAround]}>
                <CountDown
                  until={20}
                  onFinish={() => this.handleDenile(this)}
                  onPress={() => alert('hello')}
                  size={10}
                />
              </View>
            </View>
            {/* <Image source={logo} resizeMode="cover" style={styles.screenLogo} /> */}
          </View>
        ) : (
          <>
            {this.renderCounter()}
            {this.renderButtonOperation()}
          </>
        )}

        {this.state.isLoading && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}
export default withNavigation(callPopUp);
