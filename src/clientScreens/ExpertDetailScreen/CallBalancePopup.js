import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  BackHandler,
  Platform,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import clear from 'react-native-clear-cache-lcm';
import ProcessingLoader from 'components/ProcessingLoader';
import styles from './styles';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
// agora
import RtcEngine from 'react-native-agora';
// import RtmEngine from 'agora-react-native-rtm';
// Images
import ic_callPrice_white from 'assets/icons/ic_callPrice1.gif';
import ic_close_white from 'assets/icons/ic_close_white.png';
import voiceCallBg from 'assets/images/voiceCallBg.png';
import ic_processing from 'assets/images/ic_processing.gif';

// proximity services
import Proximity from 'react-native-proximity';
import {startProximity, stopProximity} from 'react-native-proximity-screen';
import requestCameraAndAudioPermission from './Permission';
import audio from '../../Live/Livecomponents/assets/ic_audio.png';
import mute_audio from '../../Live/Livecomponents/assets/mute_audio.png';
import ic_speaker from '../../Live/Livecomponents/assets/ic_speaker.png';
import mute_speaker from '../../Live/Livecomponents/assets/mute_speaker.png';
import call_cut from '../../Live/Livecomponents/assets/call_cut.png';

import basicStyles from 'styles/BasicStyles';

//redux
import {connect} from 'react-redux';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from '../../Redux/wiseword/availableBalance';
import {userInfoOperations} from '../../Redux/wiseword/userDetails';
import {
  transactionOperations,
  transactionSelectors,
} from '../../Redux/wiseword/wallet';
import {
  CallToAstroOperations,
  CallToAstroSelectors,
} from '../../Redux/wiseword/callToAstro';
import {
  declineOperations,
  declineSelectors,
} from '../../Redux/wiseword/declineService';
import {sessionOperations} from '../../Redux/wiseword/session';
import {clearAsyncStorage} from '../../Chat_WiseWord/src/asyncStorage';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import showToast from 'components/CustomToast';
//Firebase
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
// import firebase from '../../Chat_WiseWord/src/firebase/config';
import database from '@react-native-firebase/database';
import {nsNavigate} from 'routes/NavigationService';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
import CountDown from 'react-native-countdown-component';

//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

const Touchable = withPreventDoubleClick(TouchableOpacity);
class CallBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this._engine = RtcEngine;
    this.state = {
      isLoading: false,
      enableButton: true,
      isChatEnable: true,
      Balance: 0,
      userInfo: '',
      currency: '',
      acceptCall: false,
      response1: '',
      declineChat: false,
      callInfo: false,
      joinSucceed: false,
      proximity: '',
      distance: '',
      muteAudio: false,
      muteVideo: false,
      openMicrophone: true,
      enableSpeakerphone: true,
      endCall: false,
    };
    this.parentView = null;

    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
    clear.runClearCache(() => {
      console.log('data clear');
    });
    Proximity.addListener(this._proximityListener);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentDidMount() {
    this.handleAccept();
    this.walletInfo();
    this.handleDeclineCallByCons();
  }
  componentWillUnmount() {
    Proximity.removeListener(this._proximityListener);
    this.backHandler.remove();
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

  //* wallet Info
  walletInfo = async () => {
    try {
      this.setState({isLoading: true});
      await this.props.getWalletBalance();
      const userInfo = await getData(KEYS.USER_INFO);
      if (this.props.isWalletBalance !== 0) {
        await this.props.saveAvailableBalance(this.props.isWalletBalance);
        this.setState({
          Balance: this.props.isWalletBalance,
          userInfo,
          isLoading: false,
        });
      } else {
        this.setState({
          userInfo,
          isLoading: false,
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  handleAccept = async () => {
    // const isChatEnable = await getData(KEYS.FIREBASE_AUTH);
    const currency = await getData(KEYS.NEW_CURRENCY);

    if (this.state.isChatEnable === true) {
      this.setState({currency});
    } else {
      this.setState({currency});
    }
  };
  handleDeclineCallByCons = async () => {
    try {
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      let key_new = true;
      if (key_new === true) {
        const endCallRef = database()
          .ref('endCall')
          .child(`${guestUserId}`)
          .child(`${currentUserId}`);

        endCallRef.on('value', dataSnapShot => {
          var a = dataSnapShot.exists(); // true
          if (a && key_new === true) {
            let enddata = dataSnapShot.val().endCall;
            console.log('end Data', enddata);
            if (
              key_new === true &&
              enddata === 2 &&
              enddata !== 1 &&
              this.state.declineChat !== true
            ) {
              key_new = false;
              this.setState({declineChat: true});
              Alert.alert(
                'Aapke Pass!!',
                'Consultant declined your Call',
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
              removeEndCall(guestUserId, currentUserId);
            }
          }
        });
      }
    } catch (error) {
      console.log('decline chat has an issue', error);
    }
  };

  resetData = async () => {
    try {
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      let endNow = 0;
      // await isCallEnd(endNow, guestUserId, currentUserId);
      await this._engine?.leaveChannel();
      await this._engine?.stopPreview();
      this.closeOldPop();
    } catch (error) {
      console.log('error while reset', error);
    }
  };

  handleDeclineCall = async () => {
    try {
      this.setState({isLoading: true});
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      let endNow = 1;
      if (this.state.response1 !== '') {
        const {consultationId, channelDeta2} = this.state.response1;
        const {channelId} = channelDeta2;
        const params = {
          consultationId,
          channelId,
        };
        console.log('call request response', params);
        await this.props.declineService(params).then(async () => {
          isCallEnd(endNow, guestUserId, currentUserId);
          await this._engine?.leaveChannel();
          await this._engine?.stopPreview();
          await this._engine?.destroy();
          await removeExtendVoipCall(guestUserId, currentUserId);
          await removeAcceptVoipCall(guestUserId, currentUserId);
          await removeEndVoipCall(currentUserId, guestUserId);
          await removeEndVoipCall(guestUserId, currentUserId);
          await removeEndCall(guestUserId, currentUserId);
          this.setState({declineChat: true, isLoading: false});
          this.closeOldPop();
        });
      }
    } catch (error) {
      console.log('decline chat has an a issue', error);
    }
  };

  //* chat is requested and start
  startChat = async () => {
    this.setState({enableButton: false, isLoading: true});
    const id = this.props.id;
    var guestUserId = this.props.guestUserId;
    // const guestName = this.props.guestName;
    // const guestImg = this.props.guestImg;
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId, deviceId} = userInfo;
    var currentUserId = userId;
    const walletBalance = this.props.availableBalance;
    const {discountChatCharges, actualChatCharges} = this.props;
    var charges = 0,
      callTime = 0;
    const accept = 1;
    const extend = 0;
    let endNow = 0;
    var timeChat = 0;
    let endMessage = '';
    await isAcceptVoipCall(accept, guestUserId, currentUserId);
    await isExtendVoipCall(extend, guestUserId, currentUserId);
    await isVoipCallEnd(endMessage, endNow, currentUserId, guestUserId);
    if (discountChatCharges != null) {
      charges = discountChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    }

    if (callTime > 30) {
      timeChat = 30;
    } else if (callTime < 30) {
      if (callTime >= 0 && callTime < 3) {
        Alert.alert(
          'Aapke Pass!!',
          'Insufficient Balance \n' + 'Please Recharge Your Wallet For Chat',
          [
            {
              text: 'Recharge',
              onPress: () => this.props.nav.navigate('Wallet'),
            },
          ],
          {
            cancelable: false,
          },
        );
      }
      timeChat = callTime;
    }
    const params = {
      astrologerId: id,
      deviceId,
    };
    const response1 = await makeRequest(
      BASE_URL + 'api/Customer/callRequestNew',
      params,
      true,
      false,
    );
    if (response1) {
      const {success, isLogOut, message} = response1;
      if (isLogOut !== true) {
        if (success) {
          const {channelDeta2} = response1;
          this.setState({isLoading: false, response1});
          this.createSession(response1);
          // this.handleRtmClient(channelDeta2);
        } else {
          this.setState({isLoading: false, enableButton: false});
          const {isAuthTokenExpired} = this.props.isCallStart;
          this.closeOldPop();
          showToast(message);
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Aapke Pass!',
              'Your Session Has Been Expired \n Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
            return;
          }
        }
      } else {
        this.setState({isLoading: false, enableButton: false});
        Alert.alert(
          'Aapke Pass!',
          `${message}`,
          [
            {
              text: 'OK',
            },
          ],
          {
            cancelable: false,
          },
        );
        // this.closeOldPop();
        this.handleLogoutFromDevice();
        return;
      }
    }
  };

  createSession = async response1 => {
    const {channelDeta2} = response1;

    const guestUserId = this.props.guestUserId;
    const userInfo = await getData(KEYS.USER_INFO);
    const currentUserId = userInfo.userId;
    console.log('user wating for join', channelDeta2);

    this._engine = await RtcEngine.create(channelDeta2.appID);
    // Join Channel using null token and channel name
    console.log(
      'user wating for join',
      channelDeta2.appID,
      channelDeta2.channelTocken,
      channelDeta2.channelName,
      userInfo.userId,
    );
    await this._engine?.joinChannel(
      channelDeta2.channelTocken,
      channelDeta2.channelName,
      null,
      userInfo.userId,
    );

    console.log('after join the channel');
    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
    });
    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      this.setState({
        joinSucceed: true,
      });
      this.handleStartCall();
    });

    this._engine.addListener('UserOffline', async (uid, reason) => {
      console.log('UserOffline', uid, reason);

      if (reason == 0) {
        var guestUserId = this.props.guestUserId;
        const userInfo = await getData(KEYS.USER_INFO);
        const {userId} = userInfo;
        var currentUserId = userId;
        let endNow = 0;
        await isCallEnd(endNow, guestUserId, currentUserId);
        await this._engine?.leaveChannel();
        await this._engine?.stopPreview();
        await this._engine?.destroy();

        this.closeOldPop();
      } else if (reason === 1) {
        if (this.state.joinSucceed === true) {
          this.endTheCall();
        } else {
          this.handleDeclineCall();
        }
      }
    });
    this._engine.addListener(
      'ConnectionLost',
      (channel, uid, elapsed, data, err) => {
        console.log(
          'the connection lost +++ Reason is ==',
          channel,
          uid,
          elapsed,
          data,
          err,
        );
        let endNow = 1;
        isCallEnd(endNow, guestUserId, currentUserId);
        this._engine.leaveChannel();
        this.props.nav.popToTop();
      },
    );
  };

  handleTokenExpire = async () => {
    await clearAsyncStorage();
    nsNavigate('Login');
  };

  handleLogoutFromDevice = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {email} = userInfo;
    try {
      const params = {
        email,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/logOut',
        params,
      );
      if (response && response.success) {
        const {message} = response;

        clearData();
        this.props.resetLoggedInUser();
        this.props.resetBalance();
        this.props.logout();
        await nsNavigate('Homes');
      } else {
        console.log('logout not possible at this time');
      }
    } catch (e) {
      console.log('error in logout', e);
    }
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  openNewPop = async () => {
    this.setState({showAllSetPopup: true});
  };

  handleAllSet = () => {
    // this.props.nav.navigate('AllSetPopup');
  };

  closeOldPop = () => {
    this.props.closePopup();
  };

  quitPopup = () => {
    this.setState({showAllSetPopup: false});
  };

  //* MuteAudio
  pauseAudio = async () => {
    await this._engine?.muteLocalAudioStream(true);
    console.log('pause call');
    this.setState({muteAudio: true});
  };
  //* start Audio
  startAudio = async () => {
    await this._engine?.muteLocalAudioStream(false);
    console.log('Start Call');
    this.setState({muteAudio: false});
  };

  //* MuteVideo
  handleMuteVideo = async () => {
    try {
      await this._engine.setEnableSpeakerphone(true);
      this.setState({muteVideo: true});
    } catch (e) {
      console.log('error in mute Video', e);
    }
  };
  handleUnMuteVideo = async () => {
    try {
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

  //* start audio call
  handleStartCall = async () => {
    try {
      // enable audio module
      await this._engine?.enableAudio();
      // await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      // await this._engine.setClientRole(ClientRole.Broadcaster);
    } catch (error) {
      console.log('error message in Audio Start', e);
    }
  };

  endTheCall = async () => {
    try {
      this.setState({isLoading: true});
      const data = this.state.response1;
      const {consultationId, channelDeta2} = data;
      const {channelId} = channelDeta2;
      const params = {consultationId, channelId};
      var guestUserId = this.props.guestUserId;
      // const guestName = this.props.guestName;
      // const guestImg = this.props.guestImg;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId, deviceId} = userInfo;
      var currentUserId = userId;
      const response = await makeRequest(
        BASE_URL + 'api/Customer/endICallRequest',
        params,
        true,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          await this._engine?.leaveChannel();
          await this._engine?.stopPreview();
          await this._engine?.destroy();
          await removeExtendVoipCall(guestUserId, currentUserId);
          await removeAcceptVoipCall(guestUserId, currentUserId);
          await removeEndVoipCall(currentUserId, guestUserId);
          await removeEndVoipCall(guestUserId, currentUserId);
          await removeEndCall(guestUserId, currentUserId);
          // this._rtmEngine?.leaveChannel(data.channelName);
          this.setState({
            peerIds: [],
            joinSucceed: false,
            endCall: true,
            isLoading: false,
          });
          // this.props.navigation.navigate('ExpertDetail');
          this.closeOldPop();
          Alert.alert(`Aapke Pass`, `${message}`);
        } else {
          this.closeOldPop();
          this.setState({isLoading: false});
          // this.props.navigation.navigate('ExpertDetail');
          Alert.alert(`Aapke Pass`, `${message}`);
        }
      }
    } catch (e) {}
  };

  render() {
    if (this.state.isLoading) {
      return <ProcessingLoader />;
    }
    if (this.state.joinSucceed && this.state.proximity === true) {
      startProximity();
    } else {
      stopProximity();
    }
    const {enableButton, isChatEnable, userInfo, Balance, currency, callInfo} =
      this.state;

    const walletBalance = Balance;
    const {name} = userInfo;
    const {
      discountChatCharges,
      actualChatCharges,
      actualDollarChatCharges,
      discountDollarChatCharges,
    } = this.props;
    var charges = 0,
      callTime = 0;
    if (currency === 'Rupee') {
      if (discountChatCharges != null) {
        charges = discountChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      } else {
        charges = actualChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      }
    } else {
      if (discountDollarChatCharges != null) {
        charges = discountDollarChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      } else {
        charges = actualDollarChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      }
    }

    const guestName = this.props.guestName;
    const guestImg = this.props.guestImg;

    return (
      <SafeAreaView
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        {enableButton === true ? (
          <View style={styles.startCallContainer}>
            <View style={styles.listContainerMain00}>
              <Text style={{fontWeight: '700', marginBottom: wp(3)}}>
                User : {name}
              </Text>
              <View style={styles.listContainer2}>
                <FontAwesome5
                  name="wallet"
                  color="#9cdaff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                {currency === 'Rupee' ? (
                  <Text>₹ {walletBalance}</Text>
                ) : (
                  <Text>$ {walletBalance}</Text>
                )}
              </View>
              <View style={styles.listContainer2}>
                <Ionicons
                  name="time"
                  color="#9cdaff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Max Time EST</Text>
                <Text>{callTime.toFixed(2)} Min.</Text>
              </View>
            </View>

            <Touchable
              style={styles.popupButton}
              onPress={this.startChat.bind(this)}>
              <Ionicons
                name="ios-call"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Start Call</Text>
            </Touchable>
          </View>
        ) : (
          <ImageBackground source={voiceCallBg} style={styles.popupContainer}>
            {this.state.joinSucceed === false ? (
              <>
                <View style={styles.dataContainer}>
                  <View style={styles.expertImageContainer}>
                    <View style={styles.border2}>
                      <View style={styles.border3}>
                        <View style={styles.border4}>
                          <Image
                            source={{uri: guestImg}}
                            style={styles.userImage}
                          />
                        </View>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontWeight: '700',
                        marginTop: wp(5),
                        fontSize: wp(4.5),
                        textAlign: 'center',
                      }}>
                      {guestName}
                    </Text>
                  </View>
                </View>
                <Image
                  source={ic_processing}
                  resizeMode="cover"
                  style={[styles.processingLoader, {marginTop: hp(3)}]}
                />
                <CountDown
                  until={20}
                  onFinish={() => this.handleDeclineCall(this)}
                  onPress={() => alert('hello')}
                  size={10}
                />
                {isChatEnable ? (
                  enableButton ? (
                    <Touchable
                      style={styles.popupButton}
                      onPress={this.startChat.bind(this)}>
                      <Image
                        source={ic_callPrice_white}
                        resizeMode="cover"
                        style={styles.chatIcon}
                      />
                    </Touchable>
                  ) : (
                    <Touchable
                      // style={styles.popupButton}
                      onPress={this.handleDeclineCall.bind(this)}>
                      <View style={styles.popupButton2}>
                        <Image
                          source={ic_callPrice_white}
                          resizeMode="cover"
                          style={styles.chatIcon}
                        />
                      </View>
                    </Touchable>
                  )
                ) : (
                  <View style={styles.popupButton2}>
                    <Image
                      source={ic_close_white}
                      resizeMode="cover"
                      style={basicStyles.iconRow}
                    />
                    <Text style={styles.popupButtonText}>
                      Wait for Call Button
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.buttonStyle}>
                  <CountdownCircleTimer
                    isPlaying
                    duration={this.state.response1.availableMinutes * 60}
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
                        <TouchableOpacity
                          // onPress={this.startCall.bind(this)}
                          style={styles.profileButton}>
                          <View style={styles.border2}>
                            <View style={styles.border3}>
                              <View style={styles.border4}>
                                <Image
                                  source={{uri: guestImg}}
                                  style={styles.userImage}
                                />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.liveCount}>{guestName}</Text>
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

                <View style={styles.buttonHolder}>
                  {this.state.muteAudio ? (
                    <TouchableOpacity
                      onPress={this.startAudio.bind(this)}
                      style={styles.Iconbutton}>
                      <Image source={audio} style={styles.buttonIcon} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={this.pauseAudio.bind(this)}
                      style={styles.Iconbutton}>
                      <Image source={mute_audio} style={styles.buttonIcon} />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={this.endTheCall.bind(this)}
                    style={styles.button}>
                    <Image source={call_cut} style={styles.buttonText} />
                  </TouchableOpacity>

                  {this.state.muteVideo ? (
                    <TouchableOpacity
                      onPress={this.handleUnMuteVideo.bind(this)}
                      style={styles.Iconbutton}>
                      <Image source={ic_speaker} style={styles.buttonIcon} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={this.handleMuteVideo.bind(this)}
                      style={styles.Iconbutton}>
                      <Image source={mute_speaker} style={styles.buttonIcon} />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </ImageBackground>
        )}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isCallStart: CallToAstroSelectors.isCallStart(state),
  availableBalance: availableBalanceSelectors.getAvailableBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isDeclineDone: declineSelectors.isDeclineDone(state),
});
const mapDispatchToProps = {
  getCall: CallToAstroOperations.getCall,
  getWalletBalance: transactionOperations.getWalletBalance,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
  declineService: declineOperations.declineService,
  getEndCall: CallToAstroOperations.getEndCall,
};
export default connect(mapStateToProps, mapDispatchToProps)(CallBalancePopup);
