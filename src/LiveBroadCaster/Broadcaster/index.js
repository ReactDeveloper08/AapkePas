import React, {Component} from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ImageBackground,
  FlatList,
  Pressable,
  BackHandler,
  AppState,
  DeviceEventEmitter,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedLoader from 'react-native-animated-loader';
//user for BroadCasting and live Streaming
import RtcEngine, {
  RtcLocalView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from 'react-native-agora';
import {SafeAreaView} from 'react-native-safe-area-context';
//counter
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
// screen Awake
import KeepAwake from 'react-native-keep-awake';
import styles from '../DocLivecomponents/Style';
import CallBalancePopup from '../DocLivecomponents/PopupScreens/CallBalancePopup';
import database from '@react-native-firebase/database';
import {send, receiveCall, remove} from '../firebase/message';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import RNFetchBlob from 'rn-fetch-blob';
import {showToast} from 'components/CustomToast';

// Icons
import ic_play from 'assets/icons/ic_play.png';
import ic_pause from 'assets/icons/ic_pause.png';
import ic_mute from 'assets/icons/ic_mute.png';
import ic_unmute from 'assets/icons/ic_unmute.png';
import ic_Send_Msg from 'assets/icons/ic_send.png';
import ic_heart from 'assets/icons/ic_heart.png';

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */

export default class Live extends Component {
  constructor(props) {
    super(props);
    // this.rtmEngine = new RtmEngine();
    const channelData = this.props.navigation.getParam('channelDetal');
    const astrologerId = this.props.navigation.getParam('astrologerId');
    const {appCertificate, appID, channelId, channelName, channelTocken} =
      channelData;
    this.state = {
      ...channelData,
      appId: appID,
      token: channelTocken,
      channelName: channelName,
      openMicrophone: true,
      enableSpeakerphone: true,
      joinSucceed: false,
      peerIds: [],
      msgTxt: '',
      count: 1,
      msgValue: '',
      messages: [],
      // uid: '28',
      isFloat: false,
      isCall: false,
      showGrace: false,
      data: [{queue: 1}],
      name: '',
      payloadId: '',
      userImage: '',
      astrologerId,
      handleAnswer: '',
      call_to: '',
      liveCount: 0,
      time: '',
      gift: '',
      giftImg: '',
      giftUser: '',
      isGiftGiven: false,
      PauseVideo: false,
      PauseAudio: false,
      visible: true,
    };
  }

  //* Back handler
  backAction = () => {
    Alert.alert('Aapke Pass', 'Are you sure, you want to leave?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Leave', onPress: this.endCallAstro},
    ]);
    return true;
  };
  componentDidMount() {
    this.init();
    this.messageList();
    this.basicInfo();
    this.handle_Call();
    this.handleLive();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    AppState.addEventListener('change', this.handleAppStateChange);
    // uploadToken();
    DeviceEventEmitter.addListener('ON_HOME_BUTTON_PRESSED', () => {
      Alert.alert(
        'Aapke Pass',
        'You are permitted to use live stream \n schedule agin for use live stream',
        [
          {text: 'Cancel', onPress: null},
          {text: 'Leave', onPress: this.handleAppStateChange},
        ],
        {
          cancelable: true,
        },
      );
    });
  }

  handleAppStateChange = async nextAppState => {
    try {
      await this._engine?.leaveChannel();
      this.setState({peerIds: [], joinSucceed: false});
    } catch (error) {
      console.log(error.message);
    }
  };
  componentWillUnmount() {
    this.backHandler.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  //* agora astrologer
  init = async () => {
    const {appId} = this.state;
    this._engine = await RtcEngine.create(appId);

    // Enable the video module.
    await this._engine.enableVideo();
    await this._engine.enableAudio();
    await this._engine.startPreview();
    // Set the channel profile as live streaming.
    await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    // Set the usr role as host.
    await this._engine.setClientRole(ClientRole.Broadcaster);

    this._engine.addListener('StreamMessage', status => {
      // console.log('stream error', status);
    });

    this._engine.addListener('Warning', warn => {
      // console.log('Warning', warn);
    });

    this._engine.addListener('Error', err => {
      // console.log('Error', err);
      if (err === 17) {
        Alert.alert(
          'Aapke Pass',
          'You are permitted to use live stream \n schedule agin for use live stream',
          [
            {text: 'Cancel', onPress: null},
            {text: 'Leave', onPress: this.endCallAstro},
          ],
          {
            cancelable: true,
          },
        );
      }
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      // console.log('UserJoined', uid, elapsed);
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
      // console.log('UserOffline', uid, reason);
      const {peerIds} = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter(id => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      // console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
        uid,
      });
    });

    await this.startCall();
    KeepAwake.activate();
  };
  //firebase chat
  //* handle check the call is recive or not
  handle_Call = async () => {
    const {channelName, astrologerId} = this.state;

    // const call = 0;
    database()
      .ref('LiveCall/')
      .on('value', snapshot => {
        var a = snapshot.exists(); // true

        var b = snapshot.child(`${channelName}`).exists(); // true

        if (b !== false) {
          var c = snapshot
            .child(`${channelName}` + '/' + `${astrologerId}`)
            .exists(); // true
          if (b === true && c === true) {
            var call_val = snapshot
              .child(`${channelName}` + '/' + `${astrologerId}`)
              .val().call;
            var call_to = snapshot
              .child(`${channelName}` + '/' + `${astrologerId}`)
              .val().userId;

            if (call_val === 0) {
              // this.setState({handleAnswer: true, call_to});
              this.setState({showFormPopup: true, call_to});
            }
            if (call_val === 3) {
              // this.setState({handleAnswer: true, call_to});
              this.setState({
                showFormPopup: false,
                isCall: false,
                showGrace: false,
                call_to,
              });
            }
            // var d = snapshot.child('name/middle').exists(); // false
          }
        }
      });
  };
  //* live count
  handleLive = () => {
    try {
      const {channelName} = this.state;
      database()
        .ref('LiveCount')
        .on('value', snapshot => {
          var a = snapshot.exists(); // true
          var b = snapshot.child(`${channelName}`).exists(); // true

          if (a !== false) {
            const d = snapshot.child(`${channelName}`).hasChild('live');

            if (d !== false) {
              const live = snapshot.child(`${channelName}`).val().live;
              this.setState({liveCount: live + 1});
              if (!(live < this.state.liveCount)) {
                // console.log('live value', live, this.state.liveCount);
              } else {
                // console.log('liveCount value', this.state.liveCount);
              }
            }
            if (d !== false) {
              const c = snapshot.child(`${channelName}`).hasChild('time');
              if (c !== false) {
                const time = snapshot.child(`${channelName}`).val().time;

                this.setState({time});
              }
            }
          }
        });
    } catch (e) {}
  };
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
  // shouldComponentUpdate() {}
  showGifts = () => {
    this.setState({isGiftGiven: false});
  };
  //* astrologer info
  basicInfo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);

    const {name, payloadId, userImage} = userInfo;
    this.setState({name, payloadId, userImage});
  };
  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    // Join Channel using null token and channel name

    const userInfo = await getData(KEYS.USER_INFO);
    const {userId} = userInfo;
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      userId,
    );
    // await this.init();
    this.setState({PauseVideo: true, PauseAudio: true});
  };
  //* Start Again
  startAgain = async () => {
    this.init();
    this.setState({PauseVideo: true});
  };
  //*pause video and audio
  pauseCall = async () => {
    await this._engine?.disableVideo();

    this.setState({PauseVideo: false});
  };
  //* pause Audio
  pauseAudio = async () => {
    await this._engine?.disableAudio();
    this.setState({PauseAudio: false});
  };
  //* start Audio
  startAudio = () => {
    this.init();
    this.setState({PauseAudio: true});
  };
  /**s
   * @name endCall
   * @description Function to end the call
   */
  endCall = () => {
    Alert.alert(
      'Aapke Pass',
      'Are you sure, you want to leave?',
      [
        {text: 'Cancel', onPress: null},
        {text: 'Leave', onPress: this.endCallAstro},
      ],
      {
        cancelable: true,
      },
    );
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCallAstro = async () => {
    try {
      const {channelId, liveCount} = this.state;
      const params = {
        channelId: channelId,
        totalViewer: liveCount,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/endLiveSession',
        params,
        true,
        false,
      );
      //Alert.alert('', BASE_URL + 'api/Astrologers/endLiveSession');
      if (response) {
        const {success, message} = response;
        if (success) {
          const {
            expertName,
            expertImage,
            totalViewer,
            followerCount,
            totalVoice,
            totalCommission,
            liveTime,
            giftedList,
          } = response;
          const endDataResponse = {
            expertName,
            expertImage,
            totalViewer,
            followerCount,
            totalVoice,
            totalCommission,
            liveTime,
            giftedList,
            message,
          };

          const {channelName} = this.state;
          await this._engine?.leaveChannel();
          await this._engine?.destroy();
          this.setState({peerIds: [], joinSucceed: false});
          await remove(channelName);
          KeepAwake.deactivate();
          this.props.navigation.navigate('EndLive', {endDataResponse});
        } else {
          Alert.alert(message);
        }
      }
    } catch (e) {}
  };
  startInternetCall = async () => {
    await this._engine.enableAudio();
  };

  sendTxt = msgValue => {
    this.setState({msgValue});
  };
  setFloatHeart = () => {
    this.setState({isFloat: false});
  };
  handleSendMsg = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {name, payloadId, userImage} = userInfo;

    const {msgValue, channelName, uid} = this.state;
    this.setState({msgValue: ''});

    var date = Date();
    const base64ImageData = await this.encodeImageToBase64(userImage);
    let url = `data:image/jpeg;base64,${base64ImageData}`;

    if (msgValue) {
      await send(
        msgValue,
        channelName,
        uid,
        date,
        payloadId,
        name,
        '',
        url,
        '',
        '',
      );
      this.messageList();
    } else {
      this.messageList();
      this.setState({msgValue: ''});
    }
  };
  //*FOR BLOCK USER
  BlockUser = async usId => {
    const params = {
      userId: usId,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/blockUser',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/blockUser');
    if (response) {
      const {success, message} = response;
      if (success) {
        showToast(message);
      } else {
        showToast(message);
      }
    }
  };
  //* chat message data
  renderItem = ({item}) => {
    const {msg, usName, img, usId} = item;

    return (
      <View style={styles.chatItem}>
        <View>
          <Image source={{uri: img}} style={styles.avatar} />
        </View>
        <View style={styles.messageItem}>
          <Text style={styles.name}>{usName}</Text>
          <Pressable
            delayLongPress={150}
            onLongPress={() => {
              Alert.alert(
                `Are you sure`,
                `if you press yes user are blocked`,
                [
                  {
                    text: 'yes',
                    onPress: () => this.BlockUser(usId),
                  },
                ],
                {cancelable: true},
              );
            }}>
            <Text style={styles.content}>{msg}</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  //* Floating Heart
  handleFlotinghearts = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {name, payloadId} = userInfo;
    const {channelName, uid} = this.state;
    var date = Date();
    const heart = true;
    // await send('', channelName, uid, date, heart, '');
    await send('', channelName, uid, date, payloadId, name, heart, '', '', '');
    this.setState({isFloat: true});

    setTimeout(this.setFloatHeart, 4000);
  };
  //encode the image
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
      return null;
    }
  };
  //*call pick popup

  handleCallPopup = () => {
    this.setState({showFormPopup: true});
  };
  //*
  closeCallPopup = () => {
    this.setState({showFormPopup: false});
  };
  //* call answer
  handleAnswer = async () => {
    const {channelName, astrologerId, call_to} = this.state;
    const call = 1;

    await receiveCall(channelName, astrologerId, call_to, call);
    this.setState({isCall: true});
  };
  //* call decline
  handleDecline = async () => {
    const {channelName, astrologerId, call_to} = this.state;
    const call = 2;

    await receiveCall(channelName, astrologerId, call_to, call);
  };
  //* auto Grace Period
  autoGrace = () => {
    this.setState({showGrace: true});
  };
  //* End Time &  Grace Period
  endTimer = () => {
    this.setState({showGrace: false, isCall: false});
  };
  render() {
    const {isFloat, isCall, showGrace, time, PauseVideo, PauseAudio} =
      this.state;
    // const liveCount = peerIds.length;
    return (
      <SafeAreaView style={styles.max}>
        <ImageBackground
          source={require('assets/images/liveBg.png')}
          style={styles.backImg}>
          <View style={styles.max}>
            {this._renderVideos()}
            <View style={styles.buttonStyle}>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={{uri: this.state.userImage}}
                  style={styles.endIcon}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.liveCount}>{this.state.name}</Text>
                <Text style={styles.liveCount2}>
                  Live User : {this.state.liveCount}
                </Text>
              </View>
              {PauseVideo ? (
                <TouchableOpacity
                  onPress={this.pauseCall}
                  style={[styles.button, {marginLeft: wp(3)}]}>
                  <Image source={ic_pause} style={styles.endIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.startAgain}
                  style={[styles.button, {marginLeft: wp(3)}]}>
                  <Image source={ic_play} style={styles.endIcon} />
                </TouchableOpacity>
              )}
              {PauseAudio ? (
                <TouchableOpacity
                  onPress={this.pauseAudio}
                  style={[styles.button, {marginLeft: wp(3)}]}>
                  <Image source={ic_mute} style={styles.endIcon} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.startAudio}
                  style={[styles.button, {marginLeft: wp(3)}]}>
                  <Image source={ic_unmute} style={styles.endIcon} />
                </TouchableOpacity>
              )}
            </View>

            {/* {this._renderRemoteVideos()} */}

            <TouchableOpacity onPress={this.endCall} style={styles.buttonEnd}>
              <Image
                source={require('../DocLivecomponents/assets/power.webp')}
                style={styles.endIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.floatIconContainer}>
            {isFloat ? (
              <View style={styles.loaderContainer}>
                <AnimatedLoader
                  visible={this.state.visible}
                  overlayColor="rgba(255,255,255,00)"
                  source={require('assets/icons/heart.json')}
                  animationStyle={{
                    width: wp(100),
                    height: wp(100),
                    transform: [{rotate: '180deg'}],
                  }}
                  speed={1}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
          {showGrace ? (
            <View style={styles.graceDialerContainer}>
              <View style={styles.DialerContainer}>
                <Text style={styles.liveCount}>
                  Your Grace period will end in the next
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.indicator} />
                  <CountdownCircleTimer
                    isPlaying
                    duration={60}
                    size={40}
                    strokeWidth={0}
                    trailStrokeWidth={0}
                    onComplete={() => {
                      this.endTimer();
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
            </View>
          ) : null}
          {isCall ? (
            <View style={styles.callDialerContainer}>
              <View style={styles.DialerContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.indicator} />
                  <CountdownCircleTimer
                    isPlaying
                    duration={time * 60}
                    size={40}
                    strokeWidth={0}
                    trailStrokeWidth={0}
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
                    <Text style={styles.liveCount}>{this.state.call_to}</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          {this.state.isGiftGiven ? (
            <View style={styles.callContainer22}>
              <View style={styles.DialerContainer}>
                <Text style={styles.liveCount}>
                  Gift from {this.state.giftUser}
                </Text>
              </View>
              <Image
                source={{uri: this.state.giftImg}}
                style={styles.callIcn3}
              />
            </View>
          ) : null}
          {/* <TouchableOpacity
            onPress={this.startInternetCall}
            style={styles.buttonBottom}>
            <Image
              source={require('./components/callPhone.gif')}
              style={styles.endIcon}
            />
          </TouchableOpacity> 
          <TouchableOpacity style={styles.callContainer}>
            <Image
              source={require('components/ic_Call_Img.gif')}
              style={styles.callIcn}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.ofrContainer}>
            <Image
              source={require('components/ic_offer_l.gif')}
              style={styles.ofrIcn}
            />
          </TouchableOpacity>*/}
          <View style={styles.wrapListMessages}>
            <FlatList
              data={this.state.messages}
              renderItem={this.renderItem}
              inverted
            />
          </View>
          <View style={styles.chatContainer}>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={styles.extContainer}>
                <View style={styles.chatBox}>
                  <TextInput
                    placeholder="Say Hello ..."
                    placeholderTextColor="#999"
                    style={styles.input}
                    value={this.state.msgValue}
                    onChangeText={this.sendTxt}
                    maxLength={100}
                    keyboardType={Platform.OS === 'ios' ? null : 'default'}
                  />
                  <TouchableOpacity onPress={this.handleSendMsg}>
                    <Image source={ic_Send_Msg} style={styles.sndIcon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.extraIcn}
                  onPress={this.handleFlotinghearts}>
                  <Image source={ic_heart} style={styles.extIcon2} />
                </TouchableOpacity>
                {/* <TouchableOpacity
                style={styles.extraIcn}
                onPress={this.handleCallPopup}>
                <Image
                  source={require('components/ic_shareL.gif')}
                  style={styles.extIcon}
                />
              </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.extraIcn}>
                <Image
                  source={require('components/ic_marketplace.gif')}
                  style={styles.extIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.extraIcn}>
                <Image
                  source={require('components/ic_menuL.gif')}
                  style={styles.extIcon}
                />
              </TouchableOpacity> */}
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
        {this.state.showFormPopup && (
          <CallBalancePopup
            closePopup={this.closeCallPopup}
            nav={this.props.navigation}
            client_name={this.state.call_to}
            answer={this.handleAnswer}
            decline={this.handleDecline}
          />
        )}
      </SafeAreaView>
    );
  }

  _renderVideos = () => {
    const {joinSucceed} = this.state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={this.state.channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {/* {this._renderRemoteVideos()} */}
      </View>
    ) : null;
  };

  // _renderRemoteVideos = () => {
  //   const {peerIds} = this.state;
  //   return (
  //     <ScrollView
  //       style={styles.remoteContainer}
  //       contentContainerStyle={{paddingHorizontal: 2.5}}
  //       horizontal={true}>
  //       {peerIds.map(value => {
  //         return (
  //           <RtcRemoteView.SurfaceView
  //             style={styles.remote}
  //             uid={value}
  //             channelId={this.state.channelName}
  //             renderMode={VideoRenderMode.Hidden}
  //             zOrderMediaOverlay={true}
  //           />
  //         );
  //       })}
  //     </ScrollView>
  //   );
  // };
}
