/**
 *  author : Dheerendra Singh Solanki
 */
import React, {PureComponent} from 'react';
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
//counter
import CountDown from 'react-native-countdown-component';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
//calling firebase
import database from '@react-native-firebase/database';
import {
  isAcceptVideoCall,
  isVideoCallEnd,
  isVCEnd,
  removeVideoCallEnd,
  removeAcceptVideoCall,
  removeVCEnd,
} from '../../Chat_WiseWord/src/network';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import ProcessingLoader from 'components/ProcessingLoader';
//Redux
import {connect} from 'react-redux';
import {vcOperations, vcSelectors} from '../../Redux/wiseword/VideoCall';
import {availableBalanceOperations} from '../../Redux/wiseword/availableBalance';
import {userInfoOperations} from '../../Redux/wiseword/userDetails';
import {profileOperations} from '../../Redux/wiseword/profile';
import {
  declineOperations,
  declineSelectors,
} from '../../Redux/wiseword/declineService';
import {sessionOperations} from '../../Redux/wiseword/session';

import showToast from 'components/CustomToast';
// screen and icon
// import requestCameraAndAudioPermission from './Permission';
import background from '../../Live/Livecomponents/assets/voiceCallBg.png';
import endVideoCall from 'assets/icons/call_off.png';
import unmuteVideoCallAudio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_camara_on from '../../Live/Livecomponents/assets/ic_camara_on.png';
import ic_camara_off from '../../Live/Livecomponents/assets/ic_camara_off.png';
import photo_reverse from '../../Live/Livecomponents/assets/photo-reverse.png';
import clear from 'react-native-clear-cache-lcm';
// style
import styles from './style';
import {isEmpty, parseInt} from 'lodash';
import basicStyles from 'styles/BasicStyles';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class vcClient extends PureComponent {
  constructor(props) {
    super(props);
    this._engine = RtcEngine;
    this._FireData = database();
    this.state = {
      availableMinutes: '',
      expertImage: '',
      expertName: '',
      channelName: '',
      joinSucceed: false,
      refresh: false,
      peerIds: [],
      muteAudio: false,
      muteVideo: false,
      callAccepted: false,
      acceptVC: false,
      endCall: false,
      isLoading: false,
      declineChat: false,
    };

    this.init = this.init.bind(this);
    // this.callAccept = this.callAccept.bind(this);
    // this.checkIsVideoCallEnd = this.checkIsVideoCallEnd.bind(this);
    // this.handleDeclineCallByCons = this.handleDeclineCallByCons.bind(this);
  }
  async UNSAFE_componentWillMount() {
    clear.runClearCache(() => {
      console.log('data clear');
    });
    const userInfo = await getData(KEYS.USER_INFO);
    const saveData = this.props.isVcRequest;
    const {channelDeta2, availableMinutes, expertImage, expertName} = saveData;
    const {channelName, appID, channelTocken} = channelDeta2;
    this._engine = await RtcEngine.create(appID);
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      channelTocken,
      channelName,
      null,
      userInfo.userId,
    );
    this.init();
    this.setState({availableMinutes, expertImage, expertName, channelName});
  }

  componentDidMount() {
    // this.callAccept();
    this.checkIsVideoCallEnd();
    this.handleDeclineCallByCons();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  //* Function to initialize the Rtc Engine, attach event listeners and actions
  init = async () => {
    try {
      // Enable the video module.
      await this._engine.enableVideo();
      await this._engine.enableAudio();
      // await this._engine.setRemoteVideoStreamType(0, 1);
      // await this._engine.enableDualStreamMode(false);
      await this._engine.startPreview();
      //* listener
      this._engine.addListener('Warning', warn => {
        console.log('Warning', warn);
        // errorCode(warn);
      });

      this._engine.addListener('Error', err => {
        console.log('Error', err);
      });
      // If Local user joins RTC channel
      this._engine?.addListener(
        'JoinChannelSuccess',
        (channel, uid, elapsed) => {
          console.log('JoinChannelSuccess', channel, uid, elapsed);
        },
      );
      this._engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        // Get current peer IDs
        const {peerIds} = this.state;
        // If new user
        if (peerIds.indexOf(uid) === -1) {
          this.setState({
            // Add peer ID to state array
            peerIds: [...peerIds, uid],
            refresh: true,
            joinSucceed: true,
            callAccepted: true,
            acceptVC: true,
          });
        }
      });

      this._engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        const {peerIds} = this.state;
        this.setState({
          // Remove peer ID from state array
          peerIds: peerIds.filter(id => id !== uid),
          callAccepted: false,
        });
        if (reason === 0) {
          this.setState({declineChat: true});
          this._engine?.leaveChannel();
          this._engine?.stopPreview();
          this._engine?.destroy();
          this.props.navigation.popToTop();
          console.log('userWalkout');
        } else if (reason === 1) {
          this.endTheCall();
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
    } catch (error) {
      console.error('error while Creating agora ID for VC', error);
    }
  };

  // //* video Call accept
  // callAccept = async () => {
  //   try {
  //     const userInfo = await getData(KEYS.USER_INFO);
  //     const saveData = this.props.isVcRequest;
  //     const {expertUserId} = saveData;
  //     await this._FireData
  //       .ref('acceptVideoCall/')
  //       .child(`${expertUserId}`)
  //       .child(`${userInfo.userId}`)
  //       .on('value', data => {
  //         if (!data.exists()) {
  //           return;
  //         }
  //         const valueData = data.val().acceptVideoCall;
  //         if (
  //           valueData === 0 &&
  //           valueData !== 1 &&
  //           this.state.acceptVC !== true
  //         ) {
  //           this.setState({callAccepted: true, acceptVC: true});
  //         } else {
  //           this.setState({callAccepted: false});
  //         }
  //       })
  //       .bind(this);
  //   } catch (e) {
  //     console.warn('error from accepting request by doc', e);
  //   }
  // };

  //*checking VideoCallEnd
  checkIsVideoCallEnd = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const saveData = this.props.isVcRequest;
      const {expertUserId} = saveData;
      const enddata = [];
      let key_next = true;
      if (key_next === true) {
        await this._FireData
          .ref('endVideoCall')
          .child(`${expertUserId}`)
          .child(`${userInfo.userId}`)
          .on('value', async resData => {
            const a = await resData.exists(); // true
            if (a && key_next === true) {
              enddata.push(resData.val().endVideoCall);
              if (enddata.length !== 0 && key_next === true) {
                enddata.filter(async valueData => {
                  const endMessage = resData.val().endMessage;
                  if (
                    key_next === true &&
                    valueData === 1 &&
                    endMessage !== '' &&
                    this.state.endCall !== true
                  ) {
                    key_next = false;
                    this._engine?.leaveChannel();
                    this.setState({
                      peerIds: [],
                      joinSucceed: false,
                      refresh: false,
                      endCall: true,
                    });
                    Alert.alert('Aapke Pass', `${endMessage}`);
                    // this.endChatMessage(endMessage);
                    this.props.navigation.popToTop();
                    // await this._engine.stopPreview();
                    // this._engine.destroy();
                  }
                });
              }
            }
          })
          .bind(this);
      }
    } catch (e) {
      console.warn('error in VideoCallEnd from Doctor side');
    }
  };
  //* Back handler
  backAction = () => {
    return true;
  };

  //* call end functionality
  endTheCall = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const saveData = this.props.isVcRequest;
      const {channelDeta2, consultationId, expertUserId} = saveData;
      const {channelId} = channelDeta2;
      const params = {consultationId, channelId};

      const response = await makeRequest(
        BASE_URL + 'api/Customer/endVideoRequest',
        params,
        true,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          this.setState({
            peerIds: [],
            joinSucceed: false,
            refresh: false,
            callAccepted: false,
            endCall: true,
            isLoading: false,
          });
          this._engine?.leaveChannel();
          this._engine?.stopPreview();
          this._engine?.destroy();
          this.requestEnd(message);
          this.props.navigation.popToTop();
          Alert.alert('Aapke Pass', `${message}`);
          await removeVideoCallEnd(expertUserId, userInfo.userId);
          await removeAcceptVideoCall(expertUserId, userInfo.userId);
          await removeVCEnd(expertUserId, userInfo.userId);
          await removeVCEnd(expertUserId, userInfo.userId);
        } else {
          this.props.navigation.popToTop();
          this.setState({isLoading: false});
          Alert.alert('Aapke Pass', `${message}`);
        }
      }
    } catch (e) {}
  };
  //*endChat dataRequest
  requestEnd = async message => {
    const userInfo = await getData(KEYS.USER_INFO);
    const saveData = this.props.isVcRequest;
    const {expertUserId} = saveData;
    let endMessage = message;
    let endNow = 1;
    let accept = 1;
    isVideoCallEnd(endMessage, endNow, expertUserId, userInfo.userId)
      .then(() => {})
      .catch(e => {
        console.warn(e);
      });
    isAcceptVideoCall(accept, expertUserId, userInfo.userId);
  };
  //* Start Stream
  startCall = async () => {
    const saveData = this.props.isVcRequest;
    const userInfo = await getData(KEYS.USER_INFO);
    const {channelDeta2} = saveData;
    const {channelTocken, channelName} = channelDeta2;

    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      channelTocken,
      channelName,
      null,
      userInfo.userId,
    );
  };

  //*End Stream
  endCall = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const saveData = this.props.isVcRequest;
      const {expertUserId, channelDeta2, consultationId} = saveData;
      const {channelId} = channelDeta2;
      let endNow = 1;
      const params = {
        consultationId,
        channelId,
      };
      console.log(' endCall request response', params);
      await this.props.declineService(params).then(async () => {
        isVCEnd(endNow, expertUserId, userInfo.userId);
        this.setState({
          declineChat: true,
          peerIds: [],
          joinSucceed: false,
          refresh: false,
          callAccepted: false,
          endCall: true,
        });
        await this._engine?.leaveChannel();
        await this._engine?.destroy();
        this.props.navigation.pop();
        await removeVideoCallEnd(expertUserId, userInfo.userId);
        await removeAcceptVideoCall(expertUserId, userInfo.userId);
        await removeVCEnd(expertUserId, userInfo.userId);
      });
    } catch (error) {}
  };

  //* VC Decline by Consultant
  handleDeclineCallByCons = async () => {
    try {
      const saveData = this.props.isVcRequest;
      const {expertUserId} = saveData;
      const guestUserId = expertUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      const currentUserId = userId;
      const enddata = [];
      let key_next = true;
      if (key_next === true) {
        await this._FireData
          .ref('endVC')
          .child(`${guestUserId}`)
          .child(`${currentUserId}`)
          .on('value', async dataSnapShot => {
            const a = await dataSnapShot.exists(); // true
            if (a && key_next === true) {
              enddata.push(await dataSnapShot.val().endVC);
              if (enddata.length !== 0 && key_next === true) {
                enddata.filter(async endData => {
                  if (
                    key_next === true &&
                    endData !== 1 &&
                    endData === 2 &&
                    this.state.declineChat !== true
                  ) {
                    key_next = false;
                    await this.setState({declineChat: true});
                    await this.resetData();
                    await Alert.alert(
                      'Aapke Pass!!',
                      'Consultant decline your Video Call',
                      [
                        {
                          text: 'Ok',
                          // onPress: ,
                        },
                      ],
                      {
                        cancelable: false,
                      },
                    );
                  }
                });
              }
            }
          })
          .bind(this);
      }
    } catch (error) {
      console.log('decline chat has an a issue', error);
    }
  };

  resetData = async () => {
    try {
      const saveData = this.props.isVcRequest;
      const {expertUserId} = saveData;
      const guestUserId = expertUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      const endNow = 0;
      this.props.navigation.pop();
      await isVCEnd(endNow, guestUserId, currentUserId);
      this._engine?.leaveChannel();
      this._engine?.destroy();
      await this.setState({
        declineChat: true,
        peerIds: [],
        joinSucceed: false,
        refresh: false,
        callAccepted: false,
        endCall: true,
      });
    } catch (error) {
      console.log('error while reset', error);
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
      console.warn('error in mute Video', e);
    }
  };
  handleUnMuteVideo = async () => {
    try {
      this.init();
      await this._engine.muteLocalVideoStream(false);
      this.setState({muteVideo: false});
    } catch (e) {
      console.warn('error in mute Video', e);
    }
  };

  //*switch camera
  handleSwitchCamera = async () => {
    try {
      await this._engine.switchCamera();
    } catch (e) {
      console.warn('error message in switch camera', e);
    }
  };

  render() {
    const {availableMinutes, expertImage, expertName, peerIds} = this.state;
    return (
      <View style={styles.max}>
        <ImageBackground source={background} style={styles.bcgImg}>
          {!isEmpty(peerIds) ? this._renderRemoteVideos() : null}
          {this.state.callAccepted ? (
            <View style={styles.buttonStyle}>
              <Touchable
                onPress={this.startCall.bind(this)}
                style={styles.profileButton}>
                <Image source={{uri: expertImage}} style={styles.endIcon2} />
              </Touchable>
              <View>
                <View>
                  <Text style={styles.liveCount}>{expertName} </Text>
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
                    size={30}
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
                          fontSize: wp(2.5),
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
                        source={{uri: expertImage}}
                        style={styles.userImage21}
                      />
                    </View>
                    <CountDown
                      until={20}
                      onFinish={() => {
                        this.endCall(this);
                        Alert.alert(
                          'Aapke Pass!',
                          'Client not respond the call',
                          [{text: 'Ok'}],
                          {cancelable: false},
                        );
                      }}
                      onPress={() => alert('hello')}
                      size={10}
                    />
                  </View>
                </View>
              </Touchable>
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
            {this.state.callAccepted ? (
              <Touchable
                onPress={this.endTheCall.bind(this)}
                style={styles.Iconbutton}>
                <Image source={endVideoCall} style={styles.buttonText} />
              </Touchable>
            ) : (
              <Touchable
                onPress={this.endCall.bind(this)}
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

const mapStateToProps = state => ({
  isDeclineDone: declineSelectors.isDeclineDone(state),
  isVcRequest: vcSelectors.isVcRequest(state),
  isVcEndRequest: vcSelectors.isVcEndRequest(state),
});
const mapDispatchToProps = {
  vcRequest: vcOperations.vcRequest,
  vcEndCall: vcOperations.vcEndCall,
  profile: profileOperations.profile,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  declineService: declineOperations.declineService,
};
export default connect(mapStateToProps, mapDispatchToProps)(vcClient);
