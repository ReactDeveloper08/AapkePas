import React from 'react';
import {
  Alert,
  View,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  BackHandler,
  DeviceEventEmitter,
} from 'react-native';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import CountDown from 'react-native-countdown-component';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyle, color} from '../../utility';
import styles from './styles';
import basicStyles from 'styles/BasicStyles';
import {InputField, BoxChat} from '../../component';
import database from '@react-native-firebase/database';

import {senderMsg, recieverMsg, isTyping, ChatOperation} from '../../network';

import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, getData} from 'api/UserPreference';

import get from 'lodash/get';
import dot from 'assets/images/3dot.gif';
// import EndChat from 'assets/icons/endChat.png';
import EndChat from 'assets/icons/endChat1.png';
// import {nsPop} from 'routes/NavigationService';
import clear from 'react-native-clear-cache-lcm';
import {Component} from 'react';
//redux
import {connect} from 'react-redux';
import {ChatOperations, ChatSelectors} from '../../../../Redux/wiseword/chat';
class Chat extends Component {
  constructor(props) {
    super(props);
    var params = get(this.props.navigation, 'state.params.params', '');
    // const params = this.props.isChatDataSave;
    // console.log(params);
    const {
      name,
      guestUserId,
      currentUserId,
      now,
      response,
      timeChat,
      img,
      imgText,
    } = params;
    const {availableMinutes, extendTime, consultationId} =
      this.props.isChatRequest;

    this.state = {
      name,
      guestUserId,
      currentUserId,
      now,
      response,
      timeChat,
      img,
      imgText,
      availableMinutes,
      extendTime,
      consultationId,
      endCallFire: false,
      msgValue: '',
      messeges: [],
      type: false,
      isExtendTime: false,
      valueChange: 0,
      newExtendedTime: false,
    };
    this.handleMessage = this.handleMessage.bind(this);
    this.checkIsTyping = this.checkIsTyping.bind(this);
    this.checkIsEndChat = this.checkIsEndChat.bind(this);
    database().setPersistenceEnabled(true);
    DeviceEventEmitter.addListener('ON_HOME_BUTTON_PRESSED', event => {
      Alert.alert('Aapke Pass!', 'Are you sure you want to End Chat ?', [
        {
          text: 'Cancel',

          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.endChat()},
      ]);
      return true;
    });
  }

  // const [endCallFire, setEndCallFire] = useState(false);
  // const [msgValue, setMsgValue] = useState('');
  // const [messeges, setMesseges] = useState([]);
  // const [time, setTime] = useState('');
  // let [type, setTyping] = useState(false);
  // const [isExtendTime, setIsExtendTime] = useState(false);
  // const [valueChange, setValueChange] = useState(0);
  // const [newExtendedTime, setNewExtendedTime] = useState(false);
  // const [endChatMsg, setEndChatMsg] = useState('');
  // const [extendsChat, setExtendedChat] = useState(0);
  // const [isExtended, setIsExtended] = useState(false);
  // const [isSetTime, setIsSetTime] = useState(false);
  // let params = get(navigation, 'state.params', '');
  // const {
  //   name,
  //   guestUserId,
  //   currentUserId,
  //   now,
  //   response,
  //   timeChat,
  //   img,
  //   imgText,
  // } = params;
  // const {availableMinutes, extendTime, consultationId} = response;
  // const callRef = useRef(endCallFire);
  // console.log('welcome to chat', navigation.state);
  // console.log('the chat time start *****---', params);

  componentDidMount() {
    clear.runClearCache(() => {
      console.log('data clear');
    });
    this.handleMessage();
    this.chatChecker();
    // BackHandler.exitApp()
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    Alert.alert('Aapke Pass!', 'Are you sure you want to End Chat ?', [
      {
        text: 'Cancel',

        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.endChat()},
    ]);
    return true;
  };
  handleMessage = () => {
    try {
      database()
        .ref('messeges')
        .child(`${this.state.currentUserId}`)
        .child(`${this.state.guestUserId}`)
        .on('value', dataSnapshot => {
          let msgs = [];
          dataSnapshot.forEach(child => {
            msgs.push({
              timer: child.val().messege.time,
              sendBy: child.val().messege.sender,
              recievedBy: child.val().messege.reciever,
              msg: child.val().messege.msg,
              img: child.val().messege.img,
            });
          });
          this.setState({messeges: msgs.reverse(), type: false});
        });
    } catch (error) {
      alert(error);
    }
  };

  chatChecker = () => {
    this.checkIsTyping();
    this.checkIsEndChat();

    // checkIsExtendChat();
  };

  //*checking Typing
  checkIsTyping = () => {
    database()
      .ref('typing')
      .child(`${this.state.guestUserId}`)
      .child(`${this.state.currentUserId}`)
      .on('value', data => {
        if (data.key === this.state.guestUserId) {
          this.setState({type: false});
        } else {
          this.setState({type: true});
        }
      });
  };

  //*checking EndChat
  checkIsEndChat = () => {
    let key_end = true;
    if (key_end === true) {
      const endChat = database().ref('chatOperation');
      endChat
        .child(`${this.state.guestUserId}`)
        .child(`${this.state.currentUserId}`)
        .on('value', async dataSnapshot => {
          let chatOperationMsg = [];
          dataSnapshot.forEach(child => {
            chatOperationMsg.push({
              accept: child.val().chatOperation.accept,
              endMessage: child.val().chatOperation.endMessage,
              endNow: child.val().chatOperation.endNow,
              extendChat: child.val().chatOperation.extendChat,
            });
          });
          let newChatOperation = chatOperationMsg.reverse();
          if (
            key_end === true &&
            newChatOperation.length !== 0 &&
            this.state.endCallFire !== true
          ) {
            if (
              key_end === true &&
              newChatOperation[0].endNow === 2 &&
              newChatOperation[0].endMessage !== '' &&
              this.state.endCallFire !== true
            ) {
              key_end = false;
              this.setState({endCallFire: true});

              // await remove(guestUserId, currentUserId);

              this.props.navigation.popToTop();
              Alert.alert(
                `The Consultation Charges `,
                `${newChatOperation[0].endMessage}`,
                [
                  {
                    text: 'Ok',
                    // onPress: () => nsPop(),
                  },
                ], //() => navigation.popToTop()
                {
                  cancelable: false,
                },
              );
              endChat.off();
            }
            if (newChatOperation[0].extendChat === 1) {
              key_end = false;
              this.setState({isExtendTime: true});
              endChat.off();
            }
          }
          endChat.off();
        })
        .bind(this);
      endChat.off();
    }
  };

  //*endChat Function
  endChatConfirm = () => {
    Alert.alert(
      'Aapke Pass',
      'Are You Sure You Want To End Chat ?',
      [
        {
          text: 'NO',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: this.endChat.bind(this),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  endChat = async value => {
    // console.log('the end chat time in chat duration ========>', value, time);
    const {now, consultationId, guestUserId, currentUserId} = this.state;
    const endTime = new Date();
    const totalTime = endTime - now;
    var inSec = totalTime / 1000;
    const endchatParam = {
      consultationId: consultationId,
      balanceMinutes: inSec,
    };
    console.log('endcharParam', endchatParam);
    const typing = 0;
    isTyping(typing, currentUserId, guestUserId);
    const endResponse = await makeRequest(
      BASE_URL + 'api/Customer/endChatRequest',
      endchatParam,
      true,
      false,
    );
    // console.log('endResponse======>', endResponse);
    if (endResponse && endResponse.success === true) {
      const {message} = endResponse;

      // await setTyping(false);
      // await setEndCallFire(!endCallFire);
      this.setState({type: false, endCallFire: true});
      let endNow = 3;
      let accept = 1;
      let extend = 0;
      let endMessage = message;

      ChatOperation(
        endMessage,
        extend,
        accept,
        endNow,
        guestUserId,
        currentUserId,
      );
      Alert.alert(
        `The Consultation Charges with ${this.state.name}`,
        `${message}`,
      );

      this.props.navigation.popToTop();
    } else if (endResponse && endResponse.success === false) {
      const {message} = endResponse;
      this.setState({type: false, endCallFire: true});
      let endNow = 3;
      let accept = 1;
      let extend = 0;
      let endMessage = message;

      ChatOperation(
        endMessage,
        extend,
        accept,
        endNow,
        guestUserId,
        currentUserId,
      );

      Alert.alert(
        `The Consultation Charges with ${this.state.name}`,
        `${message}`,
        [{text: 'Ok', onPress: () => this.props.navigation.popToTop()}], //() => this.props.navigation.popToTop()
        {
          cancelable: false,
        },
      );
    }
  };

  handleSend = () => {
    const typing = 0;
    isTyping(typing, this.state.currentUserId, this.state.guestUserId)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    this.setState({type: false, msgValue: ''});

    var eTime = Date();

    if (
      (this.state.msgValue && !this.state.msgValue) ||
      /^\s*$/.test(this.state.msgValue) === false
    ) {
      senderMsg(
        this.state.msgValue,
        this.state.currentUserId,
        this.state.guestUserId,
        '',
        eTime,
      )
        .then(() => {})
        .catch(err => alert(err));

      // * guest user

      recieverMsg(
        this.state.msgValue,
        this.state.currentUserId,
        this.state.guestUserId,
        '',
        eTime,
      )
        .then(() => {})
        .catch(err => alert(err));
    }
  };

  //* Camera Permission
  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });
      const result = await check(platformPermission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleCamera();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleCamera();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Camera" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };
  //*CAMERA
  handleCamera = () => {
    console.log('camera perss');
    const option = {
      skipBackup: true,
      includeBase64: true,
      mediaType: 'photo',
      quality: 0.4,
      maxWidth: 250,
      maxHeight: 250,
    };

    ImagePicker.showImagePicker(option, response => {
      if (response.didCancel) {
        console.log('User cancel image picker');
      } else if (response.error) {
        console.log(' image picker error', response.error);
      } else {
        // Base 64
        const eTime = Date();
        let source = 'data:image/jpeg;base64,' + response.data;

        senderMsg(
          this.state.msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          source,
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));

        // * guest user

        recieverMsg(
          this.state.msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          source,
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));
      }
    });
  };

  handleOnChange = text => {
    try {
      const typing = 1;
      isTyping(typing, this.state.currentUserId, this.state.guestUserId)
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    if (text.length > 0) {
      this.setState({type: true});
    } else if (text.length === 0) {
      const typing = 0;
      isTyping(typing, this.state.currentUserId, this.state.guestUserId)
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
      this.setState({type: false});
    }
    this.checkIsTyping();
    this.setState({msgValue: text});
  };

  //   * On image tap
  imgTap = chatImg => {
    const name = this.state.name;
    this.props.navigation.navigate('ShowFullImg', {name, img: chatImg});
  };

  render() {
    const remainTime = async remainingTime => {
      if (this.state.isExtendTime === true) {
        const bTime = this.state.extendTime * 60;
        const tTime = remainingTime.remainingTime + bTime;
        await this.setState({valueChange: tTime, newExtendedTime: true});
      }
    };

    return (
      <SafeAreaView style={[globalStyle.flex1, {backgroundColor: '#fff'}]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubTitle}> {this.state.name} </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#ff638b',
                height: 8,
                width: 8,
                borderRadius: 4,
              }}
            />
            {this.state.newExtendedTime ? (
              <CountDown
                until={this.state.valueChange}
                size={12}
                running={true}
                onFinish={value => this.endChat(value)}
                digitStyle={{backgroundColor: '#FFF'}}
                digitTxtStyle={{color: '#c0c0c0'}}
                timeToShow={['M', 'S']}
                timeLabels={{m: null, s: null}}
              />
            ) : (
              <CountdownCircleTimer
                isPlaying
                duration={this.state.availableMinutes * 60}
                size={45}
                strokeWidth={0}
                trailStrokeWidth={0}
                onComplete={() => {
                  this.endChat();
                }}
                colors={[
                  ['#F7B801', 0.4],
                  ['#c0c0c0', 0.2],
                  ['#004777', 0.4],
                ]}
                renderAriaTime={remainingTime => {
                  remainTime(remainingTime);
                }}>
                {({remainingTime, children, animatedColor}) => (
                  <Animated.Text
                    style={{
                      color: '#333',
                      fontWeight: '700',
                      fontSize: wp(3),
                    }}>
                    {parseInt(remainingTime / 60, 10) % 60}:
                    {parseInt(remainingTime % 60)}
                  </Animated.Text>
                )}
              </CountdownCircleTimer>
            )}
          </View>
          <Touchable
            style={basicStyles.marginLeft}
            onPress={this.endChatConfirm.bind(this)}>
            <Image
              source={EndChat}
              style={{height: hp(4), aspectRatio: 1 / 1}}
            />
          </Touchable>
        </View>

        <View style={basicStyles.flexOne}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 90}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[globalStyle.flex1, {backgroundColor: '#fff'}]}>
            <View style={[globalStyle.flex1]}>
              <FlatList
                inverted
                data={this.state.messeges}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <BoxChat
                    msg={item.msg}
                    userId={item.sendBy}
                    img={item.img}
                    onImgTap={() => this.imgTap(item.img)}
                    uuid={this.state.currentUserId}
                    typing={this.state.type}
                    timer={item.timer}
                  />
                )}
                style={styles.chatFlatListStyle}
                contentContainerStyle={styles.children}
              />
              {this.state.type === true || this.state.type ? (
                <Image source={dot} style={styles.typingIcon} />
              ) : (
                <CountDown
                  until={59}
                  onFinish={() => this.endChat(this)}
                  onPress={() => alert('hello')}
                  size={5}
                />
              )}
              {/* Send Message */}
              <View style={styles.sendMessageContainer}>
                <InputField
                  placeholder="Type Here"
                  placeholderTextColor="#333"
                  numberOfLines={10}
                  inputStyle={styles.input}
                  value={this.state.msgValue}
                  onChangeText={text => this.handleOnChange(text)}
                />
                <View style={styles.sendBtnContainer}>
                  <MaterialCommunityIcons
                    name="send"
                    color={'#4faee4'}
                    size={34}
                    onPress={() => this.handleSend()}
                  />
                </View>
                <View style={styles.sendBtnContainer}>
                  <MaterialCommunityIcons
                    name="camera"
                    color={'#4faee4'}
                    size={34}
                    onPress={() => this.checkPermission()}
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isChatRequest: ChatSelectors.isChatRequest(state),
  isChatDataSave: ChatSelectors.isChatDataSave(state),
});
const mapDispatchToProps = {
  chatRequest: ChatOperations.chatRequest,
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
