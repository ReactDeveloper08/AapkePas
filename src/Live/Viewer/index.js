import React, {PureComponent} from 'react';
import {
  Alert,
  Animated,
  Image,
  Text,
  ImageBackground,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  LogBox,
  BackHandler,
  Pressable,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedLoader from 'react-native-animated-loader';
import {SafeAreaView} from 'react-native-safe-area-context';
//user for BroadCasting and live Streaming
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcRemoteView,
} from 'react-native-agora';

// import requestCameraAndAudioPermission from 'components/Permission';

import styles from '../Livecomponents/Style';
import background from '../Livecomponents/assets/liveBg.png';
import endChat from '../Livecomponents/assets/power.webp';
import userImages from '../Livecomponents/assets/user.png';
import ic_callPrice_white from 'assets/icons/ic_callPrice1.gif';

// firebse for chat room
import database from '@react-native-firebase/database';
import {send, receiveCall, liveCount} from '../firebase/message';

// screen Awake
import KeepAwake from 'react-native-keep-awake';

//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

//Api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

//share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

//Popup screen
import CallBalancePopup from '../Livecomponents/popupscreen/CallBalancePopup';
import ReportLive from '../Livecomponents/popupscreen/ReportLive';
import SaveKundli from '../Livecomponents/popupscreen/SaveKundli';

//Redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from 'Redux/wiseword/wallet';
import {
  userInfoSelectors,
  userInfoOperations,
} from 'Redux/wiseword/userDetails';
import {availableBalanceOperations} from 'Redux/wiseword/availableBalance';
import {sessionOperations} from 'Redux/wiseword/session';
import {
  liveStreamOperations,
  liveStreamSelectors,
} from 'Redux/wiseword/liveStream';
import {nsNavigate} from 'routes/NavigationService';
import showToast from 'components/CustomToast';

// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
// import style from 'Video/vcClient/style';

LogBox.ignoreAllLogs();
const Touchable = withPreventDoubleClick(TouchableOpacity);
const PressButton = withPreventDoubleClick(Pressable);

class Live extends PureComponent {
  constructor(props) {
    super(props);
    // this._engine = RtcEngine;
    // const liveData = this.props.navigation.getParam('liveData', null);
    const liveData = this.props.getSaveLiveData;

    const {channelName, channelTocken, expertID} = liveData;
    this.state = {
      ...liveData,
      expertID,
      token: channelTocken,
      channelName,
      openMicrophone: true,
      enableSpeakerphone: true,
      joinSucceed: true,
      isLowAudio: true,
      peerIds: [],
      peerIdss: 0,
      msgValue: '',
      messages: [],
      uid: '2882341273',
      deviceId: 0,
      count: [],
      isFloat: false,
      isCall: false,
      data: [{queue: 1}],
      Balance: '',
      miniBalance: '',
      consultationData: '',
      showGrace: false,
      giftList: '',
      isProcessed: false,
      usName: '',
      gift: '',
      giftImg: '',
      giftUser: '',
      isGiftGiven: false,
      onCall: false,
      liveGrace: false,
      liveCalluserName: '',
      currency: '',
      rotateValue: new Animated.Value(0),
      visible: true,
    };
    console.log('====================================');
    console.log(this.state);
    console.log('====================================');
  }

  async UNSAFE_componentWillMount() {
    try {
      this.liveCounter();
      const deviceId = await getData(KEYS.DEVICE_UNIQUE_ID);
      const time = this.state.live_call_duration;
      const live = this.state.peerIdss + 1;
      // const {deviceId} = this.state;
      if (deviceId.deviceId !== 0) {
        await liveCount(this.state.channelName, live, time);
      }
      // this.setState({deviceId: deviceId.deviceId});
    } catch (e) {
      console.log('error while connecting with Agora', e);
    }
  }

  componentDidMount() {
    this.init();
    this.messageList();
    this.walletBalance();
    this.handle_Call();
    this.handleLive();
    this.sendInitialMessage();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  //* Agora Stream
  async init() {
    const liveData = this.props.getSaveLiveData;
    const {appID, channelName, channelTocken} = liveData;
    this._engine = await RtcEngine.create(appID);
    const {deviceId} = await getData(KEYS.DEVICE_UNIQUE_ID);
    const devId = deviceId;
    // Enable the video module.
    await this._engine.enableVideo();
    await this._engine.enableLocalAudio(false);
    // Set the channel profile as live streaming.
    await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    // Set the usr role as host.
    await this._engine.setClientRole(ClientRole.Audience);
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(channelTocken, channelName, null, devId);
    await this._engine?.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.info('JoinChannelSuccess', channel, uid, elapsed);
        // RtcLocalView.SurfaceView must render after engine init and channel join
        this.setState({
          joinSucceed: true,
          uid,
        });
      },
    );
    // adding listener
    await this._initListeners();
    // for screen goes to on with permission
    KeepAwake.activate();
  }
  //* initial join and connect with agora
  async _initListeners() {
    this._engine?.addListener('Warning', warningCode => {
      // console.info('Warning', warningCode);
    });
    this._engine?.addListener('Error', errorCode => {
      // console.info('Error', errorCode);
    });

    await this._engine?.addListener('UserJoined', async (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
      const {expertUserID} = this.props.getSaveLiveData;
      const {peerIds} = this.state;
      this.setState({peerIds: [...peerIds, expertUserID]});
    });
    await this._engine?.addListener('UserOffline', (uid, reason) => {
      console.info('UserOffline', uid, reason);
      const {peerIds} = this.state;
      const {expertUserID} = this.props.getSaveLiveData;
      if (uid === expertUserID) {
        this.setState({
          // Remove peer ID from state array
          peerIds: peerIds.filter(id => id !== expertUserID),
          uid,
        });
        this.leaveChannel();
      }
    });
  }

  //* handle audio call
  _audioCall = async () => {
    await this._engine.enableLocalAudio(true);
    await this._engine.enableLocalVideo(false);
    await this._engine.enableAudio();
    await this._engine.muteLocalVideoStream(true);
    await this._engine.setClientRole(ClientRole.Broadcaster);
    this._addListeners();
  };
  //*listener for agora connection
  _addListeners = async () => {
    const liveData = this.props.getSaveLiveData;
    const {userId} = await getData(KEYS.DEVICE_UNIQUE_ID);

    const {channelTocken, channelId, channelName} = liveData;
    this._engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({isJoined: true});
    });
    this._engine?.addListener('LeaveChannel', stats => {
      // console.info('LeaveChannel', stats);
      this.setState({isJoined: false});
    });
    await this._engine?.joinChannel(null, null, userId);
  };

  //* live count
  handleLive = () => {
    try {
      const {channelName} = this.state;
      database()
        .ref('LiveCount')
        .on('value', snapshot => {
          var a = snapshot.exists(); // true
          var b = snapshot.child(channelName).exists(); // true

          if (a !== false) {
            const d = snapshot.child(channelName).hasChild('live');

            if (d !== false) {
              const live = snapshot.child(channelName).val().live;
              this.setState({peerIdss: live});
              if (!(live < this.state.peerIdss)) {
                // console.log('live value', live, this.state.peerIdss);
              } else {
                // console.log('live value value', this.state.peerIdss);
              }
            }
          }
        });
    } catch (e) {
      console.log('Error in live and counter', e);
    }
  };

  //*send live count data
  liveCounter = async () => {};
  //* Floating Heart
  setFloatHeart = () => {
    this.setState({isFloat: false});
  };
  //* show Gift
  showGifts = () => {
    this.setState({isGiftGiven: false});
  };
  //* check the call is receive or not
  async handle_Call() {
    try {
      const {channelName, expertID} = this.state;
      console.log('call recive ');
      let callValue = 0;
      let userId_value = '';
      await database()
        .ref('LiveCall/')
        .on('value', async snapshot => {
          console.log('call recive 2');
          var a = snapshot.exists(); // true
          var b = snapshot.child(`${channelName}`).exists(); // true
          if (a && b !== false) {
            var c = snapshot
              .child(`${channelName}` + '/' + `${expertID}`)
              .exists(); // true
            if (b === true && c === true) {
              let call = snapshot
                .child(`${channelName}` + '/' + `${expertID}`)
                .val().call;
              let userId = snapshot
                .child(`${channelName}` + '/' + `${expertID}`)
                .val().userId;
              callValue = call;
              userId_value = userId;
            }
          }
          console.log('call recive 3');
          if (callValue === 1 && userId_value === this.state.userName) {
            // await this.handleCallToAstro();
            await this.setState({
              isCall: true,
              isProcessed: false,
              showGrace: false,
              showCallBalPopup: false,
            });
            await this._audioCall();
            console.log('call recive 4');
          } else if (callValue === 1 && userId_value !== this.state.userName) {
            await this.setState({
              onCall: true,
              liveCalluserName: userId_value,
              liveGrace: false,
            });
            console.log('call recive 5');
          } else {
            this.setState({onCall: false, liveGrace: false});
          }
        });
      console.log('call recive 6');
    } catch (e) {
      console.log('the log message', e);
    }
  }
  //* message list
  messageList = () => {
    try {
      database()
        .ref('chatRoom')
        .child(`${this.state.channelName}`)
        .on('value', dataSnapshot => {
          let msgs = [];

          let messages = [];

          dataSnapshot.forEach(child => {
            msgs.push({
              msg: child.val().message.msg,
              chName: child.val().message.chName,
              userId: child.val().message.userId,
              date: child.val().message.date,
              usId: child.val().message.usId,
              usName: child.val().message.usName,
              heart: child.val().message.heart,
              img: child.val().message.img,
              gift: child.val().message.gift,
              giftImg: child.val().message.giftImg,
            });
            if (child.val().message.msg !== '') {
              messages.push({
                msg: child.val().message.msg,
                chName: child.val().message.chName,
                userId: child.val().message.userId,
                date: child.val().message.date,
                usId: child.val().message.usId,
                usName: child.val().message.usName,
                heart: child.val().message.heart,
                img: child.val().message.img,
                gift: child.val().message.gift,
                giftImg: child.val().message.giftImg,
              });
            }
          });
          let newMsg = msgs.reverse();
          // let newCount = liveCount.reverse();
          if (newMsg.length !== 0) {
            if (newMsg[0].heart !== '') {
              this.setState({isFloat: true});

              setTimeout(this.setFloatHeart, 4000);
            }
            if (newMsg[0].gift !== '') {
              this.setState({isGiftGiven: true});

              this.setState({
                giftImg: newMsg[0].giftImg,
                giftUser: newMsg[0].usName,
              });
              setTimeout(this.showGifts, 3000);
            }
          }

          this.setState({messages: messages.reverse()});
        });
    } catch (e) {
      console.log('Error in retrieve messages', e);
    }
  };

  //*wallet Balance
  walletBalance = async () => {
    try {
      await this.props.getWalletBalance();
      const userInfo = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      const {name} = userInfo;
      this.setState({userName: name, currency});

      if (this.props.isWalletBalance !== 0) {
        this.setState({
          Balance: this.props.isWalletBalance,
          miniBalance: this.props.isMiniBalance,
        });
      }
      this.setState({
        miniBalance: this.props.isMiniBalance,
      });
    } catch (e) {
      console.log('walletBalance error', e);
    }
  };
  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    const liveData = this.props.getSaveLiveData;
    const {channelName, channelTocken} = liveData;
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      channelTocken,
      channelName,
      null,
      0,
      undefined,
    );
  };

  //* Back handler
  backAction = () => {
    if (this.state.isCall) {
      Alert.alert(
        'Aapke Pass',
        'Are you sure, you want to leave?, You are in call with astrologer',
        [{text: 'Leave', onPress: this.endTheCall}],
        {
          cancelable: true,
        },
      );
    } else {
      Alert.alert(
        'Aapke Pass',
        'Are you sure, you want to leave?',
        [
          {text: 'Follow & Leave', onPress: this.handleFollowLeave},
          {text: 'Leave', onPress: this.leaveChannel},
        ],
        {
          cancelable: true,
        },
      );
    }
    return true;
  };
  /**s
   * @name endCall
   * @description Function to end the call
   */
  endCall = () => {
    if (this.state.isCall) {
      Alert.alert(
        'Aapke Pass',
        'Are you sure, you want to leave?, You are in call with astrologer',
        [{text: 'Leave', onPress: this.endTheCall}],
        {
          cancelable: true,
        },
      );
    } else {
      Alert.alert(
        'Aapke Pass',
        'Are you sure, you want to leave?',
        [
          {text: 'Follow & Leave', onPress: this.handleFollowLeave},
          {text: 'Leave', onPress: this.leaveChannel},
        ],
        {
          cancelable: true,
        },
      );
    }
  };
  //*leave Channel
  leaveChannel = async () => {
    await this._engine?.leaveChannel();
    this.setState({peerIds: [], joinSucceed: false});

    const time = this.state.live_call_duration;
    const live = this.state.peerIdss - 1;

    await liveCount(this.state.channelName, live, time);

    KeepAwake.deactivate();
    const refreshCallBack = await this.props.navigation.getParam(
      'refreshCallBack',
    );
    const tabActive = await this.props.navigation.getParam('tabActive');
    if (refreshCallBack) {
      refreshCallBack('message');
      tabActive('Completed');
      this.props.navigation.navigate('Lives');
      console.log('go to live with refresh');
    } else {
      console.log('go to live page');
      this.props.navigation.pop();
    }
  };
  //* leave chanel when user goes to login
  leaveChannel_Login = async () => {
    await this._engine?.leaveChannel();
    this.setState({peerIds: [], joinSucceed: false});
    KeepAwake.deactivate();
    nsNavigate('Login');
  };

  //*handleFollow and leave
  handleFollowLeave = async () => {
    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'LOGIN',
            onPress: this.handleLogin,
          },
        ],
        {
          cancelable: true,
        },
      );
      return;
    }
    const params = {
      expertId: this.state.expertID,
      channelId: this.state.channelId,
    };
    await this.props.liveFollow(params);
    const response = this.props.isLiveFollow;
    if (response) {
      const {success, message} = response;
      if (success) {
        this.leaveChannel();
        Alert.alert(`Aapke Pass`, `${message}`);
      } else {
        this.leaveChannel();
        Alert.alert(`Aapke Pass`, `${message}`);
      }
    }
  };
  //*handleProfile
  handleProfile = () => {
    this.props.navigation.navigate('EditProfile');
  };
  //* Call TO Astrologer
  async handleCallToAstro() {
    try {
      this.setState({
        isProcessed: true,
        showCallBalPopup: false,
      });
      const userInfo = await getData(KEYS.USER_INFO);
      var {name, deviceId} = userInfo;
      if (name === 'visitor') {
        Alert.alert(
          '${name}',
          'You need to Update Profile first.\nPress Update to Update Profile. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleProfile,
            },
          ],
          {
            cancelable: false,
          },
        );
        return;
      }
      const params = {
        expertId: this.state.expertID,
        channelId: this.state.channelId,
        deviceId,
      };
      await this.props.callToExpert(params);
      const dataRes = this.props.isLiveCallToExpert;

      if (dataRes.success === true) {
        const {output, isLogOut, message} = dataRes;

        if (isLogOut === false) {
          await this.setState({
            consultationData: output,
            // isCall: true,
            // isProcessed: false,
            // showGrace: false,
            // showCallBalPopup: false,
          });
        } else {
          Alert.alert(
            'Aapke Pass',
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
          // this.handleLogoutFromDevice();
          return;
        }
      } else {
        const {isLogOut, message} = dataRes;
        if (isLogOut === false) {
          this.setState({
            isCall: false,
            isProcessed: false,
            showGrace: false,
            showCallBalPopup: false,
          });
          showToast(message);
        } else {
          Alert.alert(
            'Aapke Pass',
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
          // this.handleLogoutFromDevice();
          return;
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  }
  //*Logout From Device
  handleLogoutFromDevice = async () => {
    const userInfo = await this.props.userInfo;
    const {mobile} = userInfo;
    const m_No = parseInt(mobile, 10);

    try {
      const params = {
        mobile: m_No,
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
        await this.props.navigation.navigate('Home');
      } else {
        console.log('logout not possible at this time');
      }
    } catch (e) {
      console.log('error in logout', e);
    }
  };
  //* call end functionality
  endTheCall = async () => {
    try {
      const call = 3;
      const userInfo = await getData(KEYS.USER_INFO);
      const {consultationId} = this.state.consultationData;
      const {channelName, expertID} = this.state;
      const {payloadId} = userInfo;
      const params = {consultationId};
      await this.props.endLiveCall(params);
      const response = this.props.isLiveEndLiveCall;
      if (response) {
        const {success, message} = response;
        if (success) {
          // await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
          await this._engine.setClientRole(ClientRole.Audience);
          await this._engine.stopAudioRecording();
          await receiveCall(channelName, expertID, payloadId, call);
          this.setState({
            isCall: false,
            showGrace: false,
            isProcessed: false,
            onCall: false,
          });
          // await this.UNSAFE_componentWillMount();
          Alert.alert(`Aapke Pass`, `${message}`);
        } else {
          console.log(message);
        }
      }
    } catch (e) {}
  };
  //* message Value change
  onValueChange = msgValue => {
    this.setState({msgValue});
  };
  //*Login credential
  handleLogin = () => {
    this.props.nav.navigate('Login');
  };
  //* send message to firebase
  sendMessage = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const Info = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = Info;
    const {msgValue, channelName, uid} = this.state;
    this.setState({msgValue: ''});
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first.\nPress LOGIN to continue. !',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'LOGIN',
            onPress: this.handleLogin,
          },
        ],
        {
          cancelable: false,
        },
      );
      return;
    } else {
      var {name, payloadId, userImage} = userInfo;
    }
    const base64ImageData = await this.encodeImageToBase64(userImage);
    var date = Date();
    let url = `data:image/jpeg;base64,${base64ImageData}`;
    if (msgValue) {
      send(msgValue, channelName, uid, date, payloadId, name, '', url, '', '')
        .then(() => {})
        .catch(err => Alert.alert(err));
      this.setState({msgValue: ''});
    } else {
      this.setState({msgValue: ''});
    }
  };
  //* send Initial message to firebase
  sendInitialMessage = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const Info = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = Info;
    const {channelName, uid} = this.state;
    if (!userInfo) {
      var payloadId = deviceId; // var id = Math.random().toFixed(2).toString();
      var name = 'Visitor' + ` ${deviceId}`;
    } else {
      var {name, payloadId, userImage} = userInfo;
    }
    const msgValue = `${name}` + ' Joined the Live';
    const base64ImageData = await this.encodeImageToBase64(userImage);
    var date = Date();
    let url = `data:image/jpeg;base64,${base64ImageData}`;
    if (msgValue) {
      send(msgValue, channelName, uid, date, payloadId, name, '', url, '', '')
        .then(() => {})
        .catch(err => Alert.alert(err));
      this.messageList();
    } else {
      this.messageList();
      this.setState({msgValue: ''});
    }
  };
  //* Floating Heart
  handleFlotinghearts = async () => {
    const {channelName, uid} = this.state;
    var date = Date();
    var id = Math.random().toFixed(2);
    var name = 'visitor' + `${id}`;
    const heart = true;
    await send('', channelName, uid, date, id, name, heart, '', '', '');
    this.setState({isFloat: true});
    setTimeout(this.setFloatHeart, 4000);
  };
  //*share the astroinfo
  fetchReferralInfo = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }
      let params = null;
      // calling api
      await this.props.liveShare(params);
      const response = this.props.isLiveShare;
      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;
          const {shareInfo} = output;
          const {title, message, image, ForAstroPleasevisitURL, androidUrl} =
            shareInfo;

          const {url: url, extension} = image;
          const base64ImageData = await this.encodeImageToBase64(url);
          if (!base64ImageData) {
            return;
          }
          const shareOptions = {
            title,
            subject: title,
            message: `${title}\n${message}\n${ForAstroPleasevisitURL}\n${androidUrl}`,
            url: `data:image/${extension};base64,${base64ImageData}`,
          };
          //* stopping loader
          this.setState({showProcessingLoader: false});
          await Share.open(shareOptions);
        } else {
          const {message} = response;
          console.log('the referral message', message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //*Image Encoder
  encodeImageToBase64 = async url => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };
  //* chat message data
  renderItem = ({item}) => {
    const {msg, usName, img} = item;
    let images = '';
    let imgGiven = false;
    if (img === `data:image/jpeg;base64,null`) {
      images = userImages;
      imgGiven = true;
    } else {
      images = img;
      imgGiven = false;
    }
    return (
      <View style={styles.chatItem}>
        <View>
          {imgGiven ? (
            <Image source={images} style={styles.avatar} />
          ) : (
            <Image source={{uri: images}} style={styles.avatar} />
          )}
        </View>
        <View style={styles.messageItem}>
          <Text style={styles.name}>{usName}</Text>
          <Text style={styles.content}>{msg}</Text>
        </View>
      </View>
    );
  };
  //* for login
  handleLogin = async () => {
    await this.leaveChannel_Login();
    this.props.navigation.navigate('Login');
  };
  //* call base Popup
  handleCallBalInfo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first.\nPress LOGIN to continue. !',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'LOGIN',
            onPress: this.handleLogin,
          },
        ],
        {
          cancelable: true,
        },
      );
      return;
    }
    this.walletBalance();
    this.setState({showCallBalPopup: true});
  };
  //* check call busy
  handleCallCheck = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {name} = userInfo;
    const {channelName, expertID} = this.state;
    const call = 0;
    const params = {
      expertId: this.state.expertID,
      channelId: this.state.channelId,
    };
    await this.props.checkCallBusy(params);
    const response = this.props.isLiveCallBusy;
    if (response) {
      const {success, message} = response;
      if (success) {
        this.handleCallToAstro();
        await receiveCall(channelName, expertID, name, call);
      } else {
        Alert.alert('Alert !', message);
        this.setState({isCall: false});
      }
    }
  };
  //* call base closer
  closePopup = () => {
    this.setState({showCallBalPopup: false});
  };
  //* auto Grace Period
  autoGrace = () => {
    this.setState({showGrace: true});
  };
  //*Report Popup
  handleReportPopup = () => {
    this.setState({showReportPopup: true});
  };
  //*
  closeReportPopup = () => {
    this.setState({showReportPopup: false});
  };
  //*show_Form
  handleFormPopup = () => {
    this.setState({showFormPopup: true});
  };
  //*
  closeFormPopup = () => {
    this.setState({showFormPopup: false});
  };
  //*GiftItem for astrologer
  handleGiftBox = async () => {
    try {
      const params = null;
      await this.props.giftList(params);
      const response = this.props.isLiveGiftList;
      if (response) {
        const {success, message} = response;
        if (success) {
          const {giftList} = response;
          this.setState({giftList});
        } else {
          console.log('gift list error message', message);
        }
      }
      this.setState({showFormPopup: true});
    } catch (e) {
      console.log('gift list error message', e);
    }
  };
  //*
  closeGiftPopup = () => {
    this.setState({showFormPopup: false});
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    const {
      isFloat,
      isProcessed,
      isCall,
      onCall,
      liveGrace,
      peerIds,
      live_call_duration,
      live_call_charges,
      userName,
      showGrace,
      giftUser,
      live_call_charges_dollar,
    } = this.state;
    const liveCallData = {
      live_call_duration,
      live_call_charges,
      live_call_charges_dollar,
    };
    const liveCnt = this.state.peerIdss + 1;
    return (
      <SafeAreaView style={styles.max}>
        <ImageBackground source={background} style={styles.bcgImg}>
          {this.state.joinSucceed ? this._renderVideos() : null}
          <View style={styles.buttonStyle}>
            <Touchable onPress={this.startCall} style={styles.profileButton}>
              <Image
                source={{uri: this.state.expertImage}}
                style={styles.endIcon}
              />
            </Touchable>
            <View>
              <Text style={styles.liveCount}>{this.state.expertName}</Text>
              <Text style={styles.liveCount2}>Live : {liveCnt}</Text>
            </View>
            {/* <Touchable onPress={this.startCall} style={styles.button}>
              <Image source={ic_startV} style={styles.endIcon} />
            </Touchable> */}
          </View>

          <Touchable onPress={this.endCall} style={styles.buttonEnd}>
            <Image source={endChat} style={styles.endIcon} />
          </Touchable>
          {liveGrace == true && showGrace == false ? (
            <View style={styles.graceDialerContainer}>
              <View style={styles.DialerContainer}>
                <Text style={styles.liveCount}>
                  Your Grace period will end in the next
                </Text>
                <CountdownCircleTimer
                  isPlaying
                  duration={60}
                  size={40}
                  strokeWidth={5}
                  trailStrokeWidth={6}
                  onComplete={() => {
                    this.setState({liveGrace: false, onCall: false});
                  }}
                  colors={[
                    ['#F7B801', 0.4],
                    ['#db9058', 0.2],
                    ['#bc0f17', 0.4],
                  ]}>
                  {({remainingTime, animatedColor}) => (
                    <Animated.Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                      }}>
                      {parseInt(remainingTime / 60, 10)}:
                      {parseInt(remainingTime % 60, 10)}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
              </View>
            </View>
          ) : null}
          {showGrace ? (
            <View style={styles.graceDialerContainer}>
              <View style={styles.DialerContainer}>
                <Text style={styles.liveCount}>
                  Your Grace period will end in the next
                </Text>
                <CountdownCircleTimer
                  isPlaying
                  duration={60}
                  size={40}
                  strokeWidth={5}
                  trailStrokeWidth={6}
                  onComplete={() => {
                    this.endTheCall();
                  }}
                  colors={[
                    ['#F7B801', 0.4],
                    ['#db9058', 0.2],
                    ['#bc0f17', 0.4],
                  ]}>
                  {({remainingTime, animatedColor}) => (
                    <Animated.Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                      }}>
                      {parseInt(remainingTime / 60, 10)}:
                      {parseInt(remainingTime % 60, 10)}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
              </View>
            </View>
          ) : null}
          {isCall === true ? (
            <View style={styles.callDialerContainer}>
              <View style={styles.DialerContainer}>
                <CountdownCircleTimer
                  isPlaying
                  duration={live_call_duration * 60}
                  size={40}
                  strokeWidth={5}
                  trailStrokeWidth={6}
                  onComplete={() => {
                    this.autoGrace();
                  }}
                  colors={[
                    ['#F7B801', 0.4],
                    ['#db9058', 0.2],
                    ['#bc0f17', 0.4],
                  ]}>
                  {({remainingTime, children, animatedColor}) => (
                    <Animated.Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                      }}>
                      {parseInt(remainingTime / 60, 10) % 60}:
                      {parseInt(remainingTime % 60, 10)}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
                <View style={styles.DialerContainer}>
                  <Text style={styles.liveCount}>{userName}</Text>
                </View>
              </View>
            </View>
          ) : null}
          {isCall !== true && onCall === true ? (
            <View style={styles.callDialerContainer}>
              <View style={styles.DialerContainer}>
                <CountdownCircleTimer
                  isPlaying
                  duration={live_call_duration * 60}
                  size={40}
                  strokeWidth={5}
                  trailStrokeWidth={6}
                  onComplete={() => {
                    this.setState({liveGrace: true});
                  }}
                  colors={[
                    ['#F7B801', 0.4],
                    ['#db9058', 0.2],
                    ['#bc0f17', 0.4],
                  ]}>
                  {({remainingTime, children, animatedColor}) => (
                    <Animated.Text
                      style={{
                        color: '#fff',
                        fontSize: wp(3),
                      }}>
                      {parseInt(remainingTime / 60, 10) % 60}:
                      {parseInt(remainingTime % 60, 10)}
                    </Animated.Text>
                  )}
                </CountdownCircleTimer>
                <View style={styles.DialerContainer}>
                  <Text style={styles.liveCount}>
                    {this.state.liveCalluserName}
                  </Text>
                </View>
              </View>
            </View>
          ) : isProcessed === true ? (
            <View style={styles.callDialerContainer3}>
              <View style={styles.DialerContainer}>
                <Image
                  source={ic_callPrice_white}
                  resizeMode="cover"
                  style={styles.processIcon}
                />
                <Text style={styles.liveCount}>Call in Progress</Text>
              </View>
            </View>
          ) : null}
          {this.state.isGiftGiven ? (
            <View style={styles.callContainer22}>
              <View style={styles.DialerContainer}>
                <Text style={styles.liveCount}>Gift from {giftUser}</Text>
              </View>
              <Image
                source={{uri: this.state.giftImg}}
                style={styles.callIcn3}
              />
            </View>
          ) : null}
          <View style={styles.floatIconContainer}>
            {isFloat ? (
              <View style={styles.loaderContainer}>
                <AnimatedLoader
                  visible={this.state.visible}
                  overlayColor="rgba(255,255,255,00)"
                  source={require('../Livecomponents/assets/heart.json')}
                  animationStyle={styles.lottie}
                  speed={1}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
          {/*   <PressButton
            delayLongPress={150}
            style={styles.ofrContainer}
            onPress={this.handleGiftBox.bind(this)}
            onLongPress={() => {
              Alert.alert(
                `Alert!`,
                `you can press only once `,
                [
                  {
                    text: 'Ok',
                    // onPress: () => block(),
                  },
                ],
                { cancelable: true },
              );
            }}>
            <Image
              source={require('assets/images/giftBox.png')}
              style={styles.ofrIcn}
            />
          </PressButton>

         <Touchable
            style={styles.ofrContainer}
            onPress={this.handleGiftBox}>
            <Image
              source={require('assets/images/giftBox.png')}
              style={styles.ofrIcn}
            />
          </Touchable> */}
          {isCall ? (
            <Touchable style={styles.callContainer} onPress={this.endTheCall}>
              <Image
                source={require('../Livecomponents/assets//cndcall.png')}
                style={styles.callIcn}
              />
            </Touchable>
          ) : (
            <Touchable
              style={styles.callContainer}
              onPress={this.handleCallBalInfo}>
              <Image
                source={require('assets/images/callToDoctor.png')}
                style={styles.callIcn}
              />
              {this.state.currency === 'Rupee' ? (
                <View style={styles.priceContainer}>
                  <Text style={styles.callPrice}>₹{live_call_charges}</Text>
                  <Text style={styles.textFormat}>
                    {live_call_duration} Mins
                  </Text>
                </View>
              ) : (
                <View style={styles.priceContainer}>
                  <Text style={styles.callPrice}>
                    ${this.state.live_call_charges_dollar}
                  </Text>
                  <Text style={styles.textFormat}>
                    {live_call_duration} Mins
                  </Text>
                </View>
              )}
            </Touchable>
          )}

          <View style={styles.wrapListMessages}>
            <FlatList
              data={this.state.messages}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              inverted
              showsVerticalScrollIndicator={false}
            />
          </View>

          <Touchable style={styles.shareIcn} onPress={this.fetchReferralInfo}>
            <Image
              source={require('../Livecomponents/assets/ic_share.png')}
              style={styles.shareIcon}
            />
          </Touchable>

          <View style={styles.chatContainer}>
            <View style={styles.chatBox}>
              <TextInput
                placeholder="Type..."
                placeholderTextColor="#999"
                numberOfLines={10}
                style={styles.input}
                onChangeText={value => {
                  this.setState({msgValue: value});
                }}
                value={this.state.msgValue}
              />

              <Touchable onPress={this.sendMessage}>
                <Image
                  source={require('../Livecomponents/assets/ic_send.png')}
                  style={styles.sndIcon}
                />
              </Touchable>
            </View>
            <View style={styles.extContainer}>
              <Touchable
                style={styles.extraIcn}
                // activeOpacity={1}
                onPress={this.handleFlotinghearts}>
                <Image
                  source={require('../Livecomponents/assets//ic_heart.png')}
                  style={styles.extIcon}
                />
              </Touchable>

              <Touchable
                style={styles.extraIcn}
                onPress={this.handleReportPopup}>
                <Image
                  source={require('../Livecomponents/assets//ic_menu2.png')}
                  style={styles.extIcon}
                />
              </Touchable>
            </View>
          </View>
        </ImageBackground>
        {this.state.showCallBalPopup && (
          <CallBalancePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            call={this.handleCallCheck}
            liveCharge={liveCallData}
            Balance={this.state.Balance}
            miniBalance={this.state.miniBalance}
            leaveChanel={this.leaveChannel_Login}
          />
        )}
        {this.state.showReportPopup && (
          <ReportLive
            closePopup={this.closeReportPopup}
            nav={this.props.navigation}
            expertId={this.state.expertID}
            channelId={this.state.channelId}
          />
        )}
        {this.state.showFormPopup && (
          <SaveKundli
            data={this.state.giftList}
            closePopup={this.closeFormPopup}
            leaveChanel={this.leaveChannel_Login}
            nav={this.props.navigation}
            channelName={this.state.channelName}
            expertId={this.state.expertID}
            channelId={this.state.channelId}
            Balance={this.state.Balance}
            uid={this.state.uid}
            miniBalance={this.state.miniBalance}
          />
        )}
      </SafeAreaView>
    );
  }

  _renderVideos = () => {
    const {joinSucceed} = this.state;
    return joinSucceed ? this._renderRemoteVideos() : null;
  };

  _renderRemoteVideos = () => {
    const {peerIds} = this.state;
    return (
      <View
        style={styles.remoteContainer}
        contentContainerStyle={{paddingHorizontal: 2.5}}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView style={styles.remote} uid={value} />
          );
        })}
      </View>
    );
  };
}
const mapStateToProps = state => ({
  isMiniBalance: transactionSelectors.isMiniBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  userInfo: userInfoSelectors.getUserInfo(state),
  getSaveLiveData: liveStreamSelectors.getSaveLiveData(state),
  isLiveUserCount: liveStreamSelectors.isLiveUserCount(state),
  isLiveFollow: liveStreamSelectors.isLiveFollow(state),
  isLiveCallToExpert: liveStreamSelectors.isLiveCallToExpert(state),
  isLiveEndLiveCall: liveStreamSelectors.isLiveEndLiveCall(state),
  isLiveShare: liveStreamSelectors.isLiveShare(state),
  isLiveCallBusy: liveStreamSelectors.isLiveCallBusy(state),
  isLiveGiftList: liveStreamSelectors.isLiveGiftList(state),
  isLiveCallFirebase: liveStreamSelectors.isLiveCallFirebase(state),
});

const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  liveUserCount: liveStreamOperations.liveUserCount,
  liveFollow: liveStreamOperations.liveFollow,
  callToExpert: liveStreamOperations.callToExpert,
  endLiveCall: liveStreamOperations.endLiveCall,
  liveShare: liveStreamOperations.liveShare,
  checkCallBusy: liveStreamOperations.checkCallBusy,
  giftList: liveStreamOperations.giftList,
  saveLiveCallFirebase: liveStreamOperations.saveLiveCallFirebase,
};
export default connect(mapStateToProps, mapDispatchToProps)(Live);
