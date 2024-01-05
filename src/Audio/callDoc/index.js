import React, {Component} from 'react';
import {
  Alert,
  Animated,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  View,
  ImageBackground,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withNavigation} from 'react-navigation';
import RtcEngine, {ChannelProfile, ClientRole} from 'react-native-agora';
// import RtmEngine from 'agora-react-native-rtm';
import clear from 'react-native-clear-cache-lcm';
// error code for call
import {errorCode} from '../../Video/component/errorCode';
import ProcessingLoader from 'components/ProcessingLoader';
// showtoast
// import showToast from 'components/CustomToast';
// proximity services
import Proximity from 'react-native-proximity';
import {startProximity, stopProximity} from 'react-native-proximity-screen';

//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
//calling firebase
import database from '@react-native-firebase/database';
import {
  isVoipCallEnd,
  isAcceptVoipCall,
  removeAcceptVoipCall,
  removeEndCall,
  removeEndVoipCall,
  removeExtendVoipCall,
} from '../../Chat_WiseWord/src/network';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';

import requestCameraAndAudioPermission from './Permission';
import background from '../../Live/Livecomponents/assets/voiceCallBg.png';
import audio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_speaker from '../../Live/Livecomponents/assets/ic_speaker.png';
import mute_speaker from '../../Live/Livecomponents/assets/mute_speaker.png';
import call_cut from '../../Live/Livecomponents/assets/call_cut.png';

import styles from './style';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class callDoc extends Component {
  constructor(props) {
    super(props);
    this._engine = props.navigation.getParam('rtcEngineRole');
    this._rtmEngine = props.navigation.getParam('rtmRole');
    this.state = {
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
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }

    // this.init = this.init.bind(this);
    this.checkIsVideoCallEnd = this.checkIsVideoCallEnd.bind(this);
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
    this._subscribe = this.props.navigation.addListener(
      'didFocus',
      async () => {
        const dataBody = this.props.navigation.getParam('dataBody', null);
        // console.log('dataBody of call', dataBody);
        const {appID, channelName, channelTocken} = dataBody;
        const userInfo = await getData(KEYS.USER_INFO);
        this._engine = await RtcEngine.create(appID);
        // enable audio module
        await this._engine?.enableAudio();
        // adding listeners
        this._addListeners();
        // Join Channel using null token and channel name
        await this._engine?.joinChannel(
          channelTocken,
          channelName,
          null,
          userInfo.userId,
        );
        this.checkIsVideoCallEnd();
      },
    );
  }

  componentWillUnmount() {
    this._subscribe.remove();
    Proximity.removeListener(this._proximityListener);
    this.backHandler.remove();
    this._rtcEngine?.destroy();
  }
  _proximityListener = data => {
    this.setState({
      proximity: data.proximity,
      distance: data.distance, // Android-only
    });
  };

  //*add listeners
  _addListeners = async () => {
    this._engine.addListener('Warning', warn => {
      console.log('Warning', warn);
      // errorCode(warn);
    });

    this._engine.addListener('Error', err => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const {peerIds} = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const {peerIds} = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter(id => id !== uid),
      });
      if (reason == 0) {
        this.checkIsVideoCallEnd();
      } else if (reason === 1) {
        this.endTheCall();
      }
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });
    this._engine.addListener(
      'ConnectionLost',
      (channel, uid, elapsed, data, err) => {
        console.log(
          'the connection lost +++ Reason is ==k',
          channel,
          uid,
          elapsed,
          data,
          err,
        );
        this._engine.leaveChannel();
        this.props.navigation.goBack();
      },
    );
  };

  //*checking VideoCallEnd
  checkIsVideoCallEnd = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.getParam('dataBody', null);
      const {userId} = dataBody;
      let key_new = true;
      if (key_new === true) {
        database()
          .ref('endVoipCall')
          .child(`${userId}`)
          .child(`${userInfo.userId}`)
          .on('value', async data => {
            const valueData = data.val().endVoipCall;
            const endMessage = data.val().endMessage;
            if (
              key_new === true &&
              valueData === 1 &&
              endMessage !== '' &&
              this.state.endCall !== true
            ) {
              key_new = false;
              Alert.alert('AapkePass !', `${endMessage}`, [{text: 'Ok'}], {
                cancelable: false,
              });
              this.props.navigation.popToTop();
              await this._engine?.leaveChannel();
              await this._engine?.destroy();
              this.setState({peerIds: [], joinSucceed: false, endCall: true});
            }
          })
          .bind(this);
      }
    } catch (e) {}
  };

  //* Back handler
  backAction = () => {
    Alert.alert(
      'Aapke Pass',
      'Are you sure, you want to leave ?',
      [{text: 'Leave', onPress: this.endTheCall}],
      {
        cancelable: true,
      },
    );

    return true;
  };
  //* call end functionality
  endTheCall = async () => {
    try {
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
          this.setState({
            peerIds: [],
            joinSucceed: false,
            endCall: true,
            isLoading: false,
          });
          this.props.navigation.navigate('astro_Home');
          this.setState({isLoading: false});
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

  //*End Stream

  endCall = async () => {
    await this._engine?.leaveChannel();
    this.setState({peerIds: [], joinSucceed: false});
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
    this.init();
    await this._engine?.muteLocalAudioStream(false);
    this.setState({muteAudio: false});
  };

  //* MuteVideo
  handleMuteVideo = async () => {
    try {
      // console.log('speaker mute');
      await this._engine.setEnableSpeakerphone(true);
      this.setState({muteVideo: true});
    } catch (e) {
      // console.log('error in mute Video', e);
    }
  };
  handleUnMuteVideo = async () => {
    try {
      // console.log('speaker unmute');
      await this._engine.setEnableSpeakerphone(false);
      this.setState({muteVideo: false});
      this.init();
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

  render() {
    if (this.state.proximity === true) {
      startProximity();
    } else {
      stopProximity();
    }
    return (
      <View style={styles.max}>
        <ImageBackground source={background} style={styles.bcgImg}>
          {this.renderCounter()}
          {this.renderButtonOperation()}
        </ImageBackground>
        {this.state.isLoading && <ProcessingLoader />}
      </View>
    );
  }
}

export default withNavigation(callDoc);
