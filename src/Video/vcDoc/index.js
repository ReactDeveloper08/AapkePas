/**
 *  author : Khush Singh
 */
import React, {Component} from 'react';
import {
  Alert,
  Animated,
  ScrollView,
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
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
//Voip
import RNVoipCallNativeModule from '../../callLib/RNVoipCall';
//counter
import CountDown from 'react-native-countdown-component';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import ProcessingLoader from 'components/ProcessingLoader';
//calling firebase
import database from '@react-native-firebase/database';
import {
  isAcceptVideoCall,
  isVideoCallEnd,
  removeVideoCallEnd,
  removeAcceptVideoCall,
  removeVCEnd,
} from '../../Chat_WiseWord/src/network';
import {isEmpty, parseInt} from 'lodash';
//error Codes
// import {errorCode} from '../component/errorCode';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';

import background from '../../Live/Livecomponents/assets/voiceCallBg.png';
import endVideoCall from 'assets/icons/call_off.png';
import unmuteVideoCallAudio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_camara_on from '../../Live/Livecomponents/assets/ic_camara_on.png';
import ic_camara_off from '../../Live/Livecomponents/assets/ic_camara_off.png';
import photo_reverse from '../../Live/Livecomponents/assets/photo-reverse.png';

import styles from '../vcClient/style';
import basicStyles from 'styles/BasicStyles';
import showToast from 'components/CustomToast';
import clear from 'react-native-clear-cache-lcm';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class vdDoc extends Component {
  constructor(props) {
    super(props);
    this._engine = RtcEngine;
    const dataBody = this.props.navigation.state.params.dataBody;
    this.state = {
      ...dataBody,
      joinSucceed: false,
      refresh: false,
      peerIds: [],
      muteAudio: false,
      muteVideo: false,
      endCall: false,
      isLoading: false,
    };

    RNVoipCallNativeModule.stopRingtune();
    RNVoipCallNativeModule.endAllCalls();
    RNVoipCallNativeModule.removeEventListener('answerCall');
    RNVoipCallNativeModule.removeEventListener('endCall');
    // this.checkIsVideoCallEnd = this.checkIsVideoCallEnd.bind(this);
    clear.runClearCache(() => {
      console.log('data clear');
    });

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  async componentDidMount() {
    await this.checkIsVideoCallEnd();
    this.setState({isLoading: true});
    const dataBody = this.props.navigation.state.params.dataBody;
    console.log('accept data for VC', dataBody);
    const params = {
      consultationId: dataBody.consultationId,
    };
    console.log('when VC Accept params are', params);
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/acceptVideo',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/acceptVideo');
    if (response && response.success) {
      console.log('Response from accept Chat', response);

      const {appID, channelTocken, channelName} = dataBody;
      const userInfo = await getData(KEYS.USER_INFO);
      this._engine = await RtcEngine.create(appID);

      // Join Channel using null token and channel name
      this._engine?.joinChannel(
        channelTocken,
        channelName,
        null,
        userInfo.userId,
      );
      // await isVideoCallEnd(
      //   endMessage,
      //   endNow,
      //   userInfo.userId,
      //   dataBody.userId,
      // );
      // await isAcceptVideoCall(accept, userInfo.userId, dataBody.userId);
      this.init(dataBody);
      this.setState({isLoading: false});
    } else {
      this.setState({isLoading: false});
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = this.state;
      this.props.navigation.navigate('astro_Home');
      await removeVideoCallEnd(userInfo.userId, userId);
      await removeAcceptVideoCall(userInfo.userId, userId);
      await removeVCEnd(userInfo.userId, userId);
      await removeVCEnd(userInfo.userId, userId);
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
    // this._engine?.destroy();
  }

  acceptVCall = async () => {
    try {
      // const userInfo = await getData(KEYS.USER_INFO);
      let endNow = 0;
      let accept = 0;
      let endMessage = '';
    } catch (e) {
      console.log('erroe while acept the VC', e);
    }
  };

  //* Function to initialize the Rtc Engine, attach event listeners and actions
  init = async dataBody => {
    try {
      const getInstance = RtcEngine.instance();
      // Enable the video module.
      await this._engine?.enableVideo();
      await this._engine?.enableAudio();
      console.log('agora instance after connection with it', getInstance);

      await this._engine?.startPreview();

      this._engine?.addListener('Warning', warn => {
        console.log('Warning', warn);
      });

      this._engine?.addListener('Error', err => {
        console.log('Error', err);
      });
      this._engine?.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        const {peerIds} = this.state;
        this.setState({
          // Remove peer ID from state array
          peerIds: peerIds.filter(id => id !== uid),
        });
        if (reason === 0) {
          this.setState({declineChat: true});
          this._engine?.leaveChannel();
          this._engine?.stopPreview();
          this._engine?.destroy();

          this.props.navigation.navigate('astro_Home');
          console.log('userWalkout');
        } else if (reason === 1) {
          this.endTheCall();
        }
      });
      // If Local user joins RTC channel
      this._engine?.addListener(
        'JoinChannelSuccess',
        (channel, uid, elapsed) => {
          console.log('JoinChannelSuccess', channel, uid, elapsed);
          // Set state variable to true
        },
      );
      this._engine?.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        // Get current peer IDs
        const {peerIds} = this.state;
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          this.setState({
            refresh: true,
            joinSucceed: true,
          });
          this.setState({
            // Add peer ID to state array
            peerIds: [...peerIds, uid],
          });
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
          this._engine.leaveChannel();
          this.props.navigation.popToTop();
        },
      );

      const connectionState = await this._engine.getConnectionState();
      console.log(
        'agora connection State after connection with it',
        connectionState,
      );
    } catch (error) {
      // console.log('error while Creating agora ID for VC', error);
    } finally {
      this._engine?.addListener('Warning', warn => {
        // console.log('Warning', warn);
        // errorCode(warn);
      });
    }
  };

  //*checking VideoCallEnd
  checkIsVideoCallEnd = async () => {
    try {
      console.log(this._engine != null);
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = this.state;
      const endVcData = [];
      let key_next = true;
      if (key_next === true) {
        const refData = database().ref('endVC');
        console.log('vc end 1');
        refData
          .child(`${userInfo.userId}`)
          .child(`${userId}`)
          .on('value', async data => {
            const a = await data.exists();
            if (a && key_next === true) {
              endVcData.push(data.val().endVideoCall);
              if (endVcData.length !== 0 && key_next === true) {
                endVcData.filter(async valueData => {
                  const endMessage = data.val().endMessage;
                  if (
                    key_next === true &&
                    valueData === 1 &&
                    endMessage !== '' &&
                    this.state.endCall !== true
                  ) {
                    console.log('vc end 2', endMessage);
                    this.setState({
                      peerIds: [],
                      joinSucceed: false,
                      refresh: false,
                      endCall: true,
                    });
                    Alert.alert(
                      'Aapke Pass !',
                      `${endMessage}`,
                      [
                        {
                          text: 'Ok',
                          //  onPress: () => this.props.navigation.popToTop()
                        },
                      ],
                      {
                        cancelable: false,
                      },
                    );
                    console.log(this._engine != null);
                    this._engine?.leaveChannel();
                    this._engine?.stopPreview();
                    this._engine?.destroy();
                    this.props.navigation.navigate('astro_Home');
                    await removeVideoCallEnd(userInfo.userId, userId);
                    await removeAcceptVideoCall(userInfo.userId, userId);
                    await removeVCEnd(userInfo.userId, userId);
                    await removeVCEnd(userInfo.userId, userId);
                  }
                });
              }
            }
          })
          .bind(this);
      }
    } catch (e) {}
  };

  //* Back handler
  backAction = () => {
    return true;
  };
  //* call end functionality
  endTheCall = async () => {
    try {
      this.setState({isLoading: true});
      const {consultationId, channelId} = this.state;
      const userInfo = await getData(KEYS.USER_INFO);
      const params = {consultationId, channelId};
      const {userId} = this.state;
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/endVideoRequest',
        params,
        true,
      );
      //Alert.alert('', BASE_URL + 'api/Astrologers/endVideoRequest');
      if (response) {
        const {success, message} = response;
        if (success) {
          this.setState({
            peerIds: [],
            joinSucceed: false,
            refresh: false,
            endCall: true,
            isLoading: false,
          });
          await this._engine?.leaveChannel();
          await this._engine?.stopPreview();
          await this._engine?.destroy();
          this.setState({peerIds: [], joinSucceed: false, refresh: false});
          await this.requestEnd(message);
          this.props.navigation.navigate('astro_Home');
          Alert.alert(`Aapke Pass`, `${message}`);
          await removeVideoCallEnd(userInfo.userId, userId);
          await removeAcceptVideoCall(userInfo.userId, userId);
          await removeVCEnd(userInfo.userId, userId);
          await removeVCEnd(userInfo.userId, userId);
        } else {
          await this._engine?.leaveChannel();
          await this._engine?.stopPreview();
          await this._engine?.destroy();
          this.setState({peerIds: [], joinSucceed: false, refresh: false});
          this.props.navigation.navigate('astro_Home');
          this.setState({isLoading: false});
          Alert.alert(`Aapke Pass`, `${message}`);
          await removeVideoCallEnd(userInfo.userId, userId);
          await removeAcceptVideoCall(userInfo.userId, userId);
          await removeVCEnd(userInfo.userId, userId);
          await removeVCEnd(userInfo.userId, userId);
        }
      }
    } catch (e) {}
  };
  //*endChat dataRequest
  requestEnd = async message => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId} = this.state;

    let endNow = 1;
    let accept = 1;
    let endMessage = message;
    await isVideoCallEnd(endMessage, endNow, userInfo.userId, userId);
    await isAcceptVideoCall(accept, userInfo.userId, userId);
  };
  //* Start Stream

  startCall = async () => {
    const dataBody = this.props.navigation.state.params.dataBody;
    const {channelName, channelTocken} = dataBody;
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId} = userInfo;
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(channelTocken, channelName, null, userId);
  };

  //*End Stream

  endCall = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId} = this.state;
    console.log(this._engine != null);
    const params = {
      channelId: this.state.channelId,
      consultationId: this.state.consultationId,
    };
    // console.log('params are', params);
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/declineVideo',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/declineVideo');
    if (response) {
      const {success} = response;
      if (success) {
        // const {message} = response;
        this._engine?.leaveChannel();
        this._engine?.stopPreview();
        this._engine?.destroy();
        this.props.navigation.navigate('astro_Home');
        await removeVideoCallEnd(userInfo.userId, userId);
        await removeAcceptVideoCall(userInfo.userId, userId);
        await removeVCEnd(userInfo.userId, userId);
        await removeVCEnd(userInfo.userId, userId);
        this.setState({peerIds: [], joinSucceed: false, refresh: false});
      }
    }
  };

  //* MuteAudio
  pauseAudio = async () => {
    await this._engine.muteLocalAudioStream(true);
    this.setState({muteAudio: true});
  };
  //* start Audio
  startAudio = async () => {
    this.init();
    await this._engine.muteLocalAudioStream(false);
    this.setState({muteAudio: false});
  };

  //* MuteVideo
  handleMuteVideo = async () => {
    try {
      await this._engine.muteLocalVideoStream(true);
      this.setState({muteVideo: true});
    } catch (e) {
      // console.log('error in mute Video', e);
    }
  };
  handleUnMuteVideo = async () => {
    try {
      this.init();
      await this._engine.muteLocalVideoStream(false);
      this.setState({muteVideo: false});
    } catch (e) {
      // console.log('error in mute Video', e);
    }
  };

  //*switch camera

  handleSwitchCamera = async () => {
    try {
      await this._engine.switchCamera();
    } catch (e) {
      console.log('error messaage in switch camera', e);
    }
  };

  render() {
    const {availableMinutes} = this.state;
    return (
      <View style={styles.max}>
        <ImageBackground source={background} style={styles.bcgImg}>
          {!isEmpty(this.state.peerIds) ? this._renderRemoteVideos() : null}
          {this.state.joinSucceed ? (
            <View style={styles.buttonStyle}>
              <Touchable
                onPress={this.startCall.bind(this)}
                style={styles.profileButton}>
                <Image
                  source={{uri: this.state.userImage}}
                  style={styles.endIcon2}
                />
              </Touchable>
              <View>
                <View>
                  <Text style={styles.liveCount}>{this.state.clientName} </Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.paddingHalfLeft,
                    {marginBottom: wp(-1.5)},
                  ]}>
                  <View style={styles.indicator} />
                  <CountdownCircleTimer
                    isPlaying
                    duration={availableMinutes * 60}
                    size={38}
                    strokeWidth={0}
                    trailStrokeWidth={0}
                    onComplete={() => {
                      this.endTheCall();
                    }}
                    colors={[
                      ['#F7B801', 0.4],
                      ['#db9058', 0.2],
                      ['#bc0f17', 0.4],
                    ]}>
                    {({remainingTime, children, animatedColor}) => (
                      <Animated.Text
                        style={{
                          color: '#333',
                          fontSize: wp(3),
                          flexWrap: 'nowrap',
                        }}>
                        {parseInt(remainingTime / 60, 10) % 60}:
                        {parseInt(remainingTime % 60, 10)}
                      </Animated.Text>
                    )}
                  </CountdownCircleTimer>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                height: hp(100),
              }}>
              <Touchable
                onPress={this.startCall.bind(this)}
                style={styles.profileButton2}>
                <View style={styles.border2}>
                  <View style={styles.border3}>
                    <View style={styles.border4}>
                      <Image
                        source={{uri: this.state.userImage}}
                        style={styles.userImage21}
                      />
                    </View>
                  </View>
                </View>
              </Touchable>
              <CountDown
                until={10}
                onFinish={() => {
                  this.endCall(this);
                  Alert.alert(
                    'Aapke Pass!',
                    'Client not respond !',
                    [{text: 'Ok'}],
                    {cancelable: false},
                  );
                }}
                onPress={() => alert('hello')}
                size={10}
              />
            </View>
          )}

          <Touchable
            onPress={this.handleSwitchCamera.bind(this)}
            style={styles.flipIcon}>
            <Image source={photo_reverse} style={styles.flipIconImage} />
          </Touchable>

          <View style={styles.buttonHolder}>
            {this.state.muteAudio ? (
              <Touchable
                onPress={this.startAudio.bind(this)}
                style={styles.Iconbutton}>
                <Image
                  source={unmuteVideoCallAudio}
                  style={styles.buttonIcon}
                />
              </Touchable>
            ) : (
              <Touchable
                onPress={this.pauseAudio.bind(this)}
                style={styles.Iconbutton}>
                <Image source={mute_audio} style={styles.buttonIcon} />
              </Touchable>
            )}

            {this.state.joinSucceed ? (
              <Touchable
                onPress={this.endTheCall.bind(this)}
                style={styles.Iconbutton}>
                <Image source={endVideoCall} style={styles.buttonText} />
              </Touchable>
            ) : (
              <Touchable
                // onPress={this.endTheCall.bind(this)}
                style={styles.Iconbutton}>
                <Image source={endVideoCall} style={styles.buttonText} />
              </Touchable>
            )}

            {this.state.muteVideo ? (
              <Touchable
                onPress={this.handleUnMuteVideo.bind(this)}
                style={styles.Iconbutton}>
                <Image source={ic_camara_on} style={styles.buttonIcon} />
              </Touchable>
            ) : (
              <Touchable
                onPress={this.handleMuteVideo.bind(this)}
                style={styles.Iconbutton}>
                <Image source={ic_camara_off} style={styles.buttonIcon} />
              </Touchable>
            )}
          </View>
        </ImageBackground>
        {this.state.isLoading && <ProcessingLoader />}
      </View>
    );
  }

  _renderVideos = () => {
    const {joinSucceed} = this.state;
    return joinSucceed ? (
      <View style={styles.remoteContainer}>
        <RtcLocalView.SurfaceView
          style={styles.remote}
          channelId={this.state.channelName}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
        />
        {/* {this._renderRemoteVideos()} */}
      </View>
    ) : null;
  };

  _renderRemoteVideos = () => {
    const {peerIds} = this.state;
    return (
      <ScrollView contentContainerStyle={[styles.fullView]} horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.max}
              uid={value}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}
            />
          );
        })}
        {this._renderVideos()}
      </ScrollView>
    );
  };
}

export default vdDoc;
