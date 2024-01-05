import React from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  Animated,
  DeviceEventEmitter,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//countdown
import CountDown from 'react-native-countdown-component';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

//imagePicker
import ImagePicker from 'react-native-image-picker';

//vector Icons

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ExtendChat from 'assets/icons/ic_extend_chat.png';
import EndChat from 'assets/icons/ic_end_chat.png';
import typingdots from 'assets/images/3dot.gif';

//styles
import {globalStyle} from '../../utility';
import styles from './styles';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';
import basicStyles from 'styles/BasicStyles';

//components
import {InputField, ChatBox} from '../../component';
// import firebase from '../../firebase/config';
import database from '@react-native-firebase/database';
import {
  senderMsg,
  recieverMsg,
  isTyping,
  isChatEnd,
  isAcceptChat,
  isExtendChat,
  chatOperation,
  remove,
} from '../../network';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {showToast} from 'components/CustomToast';
import get from 'lodash/get';
import {isEmpty} from 'lodash';
import {nsNavigate, nsPop} from 'routes/NavigationService';
import clear from 'react-native-clear-cache-lcm';
import {Component} from 'react';
// import {constant} from 'lodash';
import {connect} from 'react-redux';
import {ChatOperations, ChatSelectors} from 'Redux/wiseword/chat';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);

class Chat extends Component {
  constructor(props) {
    super(props);
    const params = this.props.isDocChatDataSave;
    const {
      name,
      img,
      imgText,
      guestUserId,
      currentUserId,
      dob,
      time,
      date,
      userId,
      consultationId,
      clientMobile,
      now,
      availableMinutes,
    } = params;
    this.state = {
      name,
      img,
      imgText,
      guestId: guestUserId,
      guestUserId,
      currentUserId,
      dob,
      time,
      date,
      userId,
      consultationId,
      clientMobile,
      now,
      availableMinutes,
      endCallFire: false,
      msgValue: '',
      messeges: [],
      moreInfo: false,
      templateList: '',
      type: false,
      isEndChat: 0,
      countTimer: 3,
      tempMessage: '',
      isExtended: true,
      extendsChat: 0,
      extendTime: availableMinutes,
      isSetTime: false,
      valueChange: 0,
    };
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
  //   const guestId = guestUserId;
  //   const [endCallFire, setEndCallFire] = useState(false);
  //   const [msgValue, setMsgValue] = useState('');
  //   const [messeges, setMesseges] = useState([]);
  //   const [moreInfo, setMoreInfo] = useState(false);
  //   const [templateList, setTemplateList] = useState('');
  //   const [type, setTyping] = useState(false);
  //   const [isEndChat, setEndChat] = useState(0);
  //   const [countTimer, setCountTimer] = useState(3);
  //   const [tempMessage, setTempMessage] = useState('');
  //   const [isExtended, setIsExtended] = useState(true);
  //   const [extendsChat, setExtendedChat] = useState(0);
  //   const [extendTime, setExtendTime] = useState(availableMinutes);
  //   const [isSetTime, setIsSetTime] = useState(false);
  //   const [valueChange, setValueChange] = useState(0);

  //*USE componentDidMoun
  componentDidMount() {
    this.handleChat();
    this.checkIsTyping();
    this.checkIsEndChat();
    this.tempLets();
    // BackHandler.exitApp()
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleChat = () => {
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

  // chatChecker = () => {
  //   // checkIsExtendChat();
  // };

  // * backhandler
  backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to End Chat?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.endChat()},
    ]);
    return true;
  };

  //*Checking Is Typing
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
  checkIsEndChat = async () => {
    let key_new = true;
    if (key_new === true) {
      await database()
        .ref('chatOperation')
        .child(`${this.state.currentUserId}`)
        .child(`${this.state.guestUserId}`)
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
          if (newChatOperation.length !== 0 && key_new === true) {
            if (
              key_new === true &&
              newChatOperation[0].endNow === 3 &&
              newChatOperation[0].endMessage !== '' &&
              newChatOperation[0].endNow !== 2 &&
              this.state.endCallFire !== true
            ) {
              key_new = false;
              clear.runClearCache(() => {
                console.log('data clear');
              });
              this.setState({endCallFire: true});
              Alert.alert(
                `The Consultation Charges `,
                `${newChatOperation[0].endMessage}`,
                [
                  {
                    text: 'Ok',
                  },
                ], //() => navigation.popToTop()
                {
                  cancelable: false,
                },
              );
              nsNavigate('astro_Home');
            }
            if (newChatOperation[0].extendChat === 1) {
              key_new = false;
              this.setState({isExtended: false});
            }
          }
        })
        .bind(this);
    }
  };

  EndNow = () => {
    Alert.alert('Hold on!', 'Are you sure you want to End Chat?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.endChat()},
    ]);
  };
  //*END CHAT
  endChat = async () => {
    var endTime = new Date();
    var totalTime = endTime - this.state.now;

    var inSec = totalTime / 1000;

    const params = {
      consultationId: this.state.consultationId,
      balanceMinutes: inSec,
    };
    const typing = 0;
    isTyping(typing, this.state.currentUserId, this.state.guestUserId)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    this.setState({type: false});

    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/endChatRequest',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        this.requestEnd(message);
        this.props.navigation.popToTop();
        clear.runClearCache(() => {
          console.log('data clear');
        });
        Alert.alert(
          `The Consultation Charges with ${this.state.name}`,
          `${message}`,
          [{text: 'Ok', onPress: () => null}],
          {
            cancelable: false,
          },
        );
        this.setState({endCallFire: true});
      } else {
        showToast(message);
      }
    }
  };
  //*endChat dataRequest
  requestEnd = async message => {
    let endNow = 2;
    let accept = 1;
    let extend = 0;
    let endMessage = message;
    await chatOperation(
      endMessage,
      extend,
      accept,
      endNow,
      this.state.currentUserId,
      this.state.guestUserId,
    );
  };

  //*CHAT SEND with typing
  handleSend = () => {
    const typing = 0;
    isTyping(typing, this.state.currentUserId, this.state.guestUserId)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    this.setState({type: false, msgValue: ''});
    const eTime = Date();
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

  //*FOR BLOCK USER
  BlockUser = async () => {
    const params = {
      userId: this.state.userId,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/blockUser',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        showToast(message);
      } else {
        showToast(message);
      }
    }
  };
  //*CAMERA
  handleCamera = () => {
    this.setState({moreInfo: false});
    const option = {
      skipBackup: true,
      includeBase64: true,
      mediaType: 'photo',
      quality: 0.4,
      maxWidth: 250,
      maxHeight: 250,
    };

    ImagePicker.launchCamera(option, response => {
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
  //*FOR GALLERY
  handleDocumentPicker = () => {
    this.setState({moreInfo: false});
    const option = {
      skipBackup: true,
      includeBase64: true,
      mediaType: 'photo',
      quality: 0.4,
      maxWidth: 250,
      maxHeight: 250,
    };
    ImagePicker.launchImageLibrary(option, response => {
      if (response.didCancel) {
        console.log('User cancel image picker');
      } else if (response.error) {
        console.log(' image picker error', response.error);
      } else {
        // Base 64
        let source = 'data:image/jpeg;base64,' + response.data;
        const eTime = Date();
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
  //*CLIENT FINANCIAL INFO
  handleClientData = async () => {
    const data = {email: this.state.clientMobile};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/getClientDetails',
      data,
      true,
      false,
    );
    const {currentBalance, maxDuration, youRating, allRating} = response;
    this.setState({moreInfo: false});
    Alert.alert(
      `${this.state.name}`,
      `Current Balance: ${currentBalance}\nMax Duration: ${maxDuration}\nAvg. Rating(You): ${youRating}\nAvg. Rating(All): ${allRating}`,
      [
        {
          text: 'Ok',
          // onPress: () => logout(),
        },
      ],
      {cancelable: true},
    );
  };
  //*MESSAGE FOR WAITING Templates with typing
  handleWaitMessage = async () => {
    let msgValue = 'Please Wait Doctor Will check your Report';
    const eTime = Date();
    await senderMsg(
      msgValue,
      this.state.currentUserId,
      this.state.guestUserId,
      '',
      eTime,
    )
      .then(() => {})
      .catch(err => alert(err));
    await recieverMsg(
      msgValue,
      this.state.currentUserId,
      this.state.guestUserId,
      '',
      eTime,
    )
      .then(() => {})
      .catch(err => alert(err));
  };
  //*HANDLE CHANGE ALL VALUES
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
    this.setState({msgValue: text});
    this.checkIsTyping();
  };

  //   * On image tap
  imgTap = chatImg => {
    const name = this.state.name;
    this.props.navigation.navigate('show_FullImg', {name, img: chatImg});
  };
  //*FOR PRE-TYPED MESSAGES
  tempLets = async () => {
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/userTemplateList',
      null,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {templateList} = response;
        this.setState({templateList: templateList});
      } else {
        this.setState({tempMessage: message});
      }
    }
  };

  //* ExtendChat
  extendChat = async () => {
    if (this.state.valueChange === 0) {
      Alert.alert(`You Can't extend Chat until 1 min. Left`);
      return;
    }
    const eTime = Date();

    const paramsd = {
      consultationId: this.state.consultationId,
    };
    this.setState({countTimer: this.state.countTimer + 3});

    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/extend_chat',
      paramsd,
      true,
      false,
    );
    if (response) {
      const {message, success} = response;
      if (success) {
        const {extendTime} = response;
        this.setState({extendsChat: extendTime, isSetTime: true});

        const msgValue = message;

        let extendChat = 1;
        isExtendChat(
          extendChat,
          this.state.currentUserId,
          this.state.guestUserId,
        );
        senderMsg(
          msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          '',
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));
        recieverMsg(
          msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          '',
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));
        showToast(message);
      } else {
        senderMsg(
          this.state.msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          '',
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));
        recieverMsg(
          this.state.msgValue,
          this.state.currentUserId,
          this.state.guestUserId,
          '',
          eTime,
        )
          .then(() => {})
          .catch(err => alert(err));
        showToast(message);
      }
    }
  };

  handleInfo = () => {
    if (this.state.moreInfo === true) {
      this.setState({moreInfo: false});
    } else {
      this.setState({moreInfo: true});
    }
  };

  chatItem = ({item}) => (
    <ScrollView style={styles.moreData}>
      <Text
        style={styles.preDefineText}
        onPress={() => this.handleOnChange(item.userName)}>
        {item.userName}
      </Text>
    </ScrollView>
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => (
    <View style={{height: 1, backgroundColor: '#ffffff80'}} />
  );
  render() {
    return (
      <SafeAreaView style={[basicStyles.flexOne, {backgroundColor: '#fff'}]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubTitle}>{this.state.name}</Text>

          {this.state.isExtended ? (
            <Touchable onPress={this.extendChat}>
              <Image
                source={ExtendChat}
                style={[
                  basicStyles.iconRow,
                  {height: wp(6), marginRight: wp(4)},
                ]}
              />
            </Touchable>
          ) : null}

          <Touchable onPress={this.EndNow}>
            <Image
              source={EndChat}
              style={[basicStyles.iconRow, {height: wp(6), marginRight: wp(4)}]}
            />
          </Touchable>
          {this.state.isSetTime ? (
            <CountdownCircleTimer
              isPlaying
              duration={this.state.valueChange + this.state.extendsChat * 60}
              size={45}
              strokeWidth={5}
              trailStrokeWidth={6}
              onComplete={() => {
                this.endChat();
              }}
              colors={[
                ['#F7B801', 0.4],
                ['#c0c0c0', 0.2],
                ['#004777', 0.4],
              ]}>
              {({remainingTime, children, animatedColor}) => (
                <Animated.Text
                  style={{
                    color: animatedColor,
                  }}>
                  {parseInt(remainingTime / 60, 10) % 60}:
                  {parseInt(remainingTime % 60)}
                </Animated.Text>
              )}
            </CountdownCircleTimer>
          ) : (
            <CountDown
              until={this.state.extendTime * 60}
              running={true}
              size={12.5}
              onChange={async value => {
                if (value <= 60) {
                  this.setState({valueChange: value});
                }
              }}
              onFinish={() => this.endChat()}
              digitStyle={{backgroundColor: '#FFF'}}
              digitTxtStyle={{color: '#c0c0c0'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: null, s: null}}
            />
          )}
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
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <ChatBox
                    msg={item.msg}
                    userId={item.sendBy}
                    img={item.img}
                    onImgTap={() => this.imgTap(item.img)}
                    uuid={this.state.currentUserId}
                    block={this.BlockUser}
                    typing={this.state.type}
                    timer={item.timer}
                  />
                )}
              />
              {this.state.type === true || this.state.type ? (
                <Image source={typingdots} style={styles.typingIcon} />
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
                    name="send-circle"
                    color={'#333'}
                    size={30}
                    onPress={() => this.handleSend()}
                  />
                </View>
              </View>
              <View style={styles.chatBottomOption}>
                <Touchable onPress={() => this.handleInfo('moreInfo')}>
                  <FontAwesome5 name="list-alt" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={this.handleDocumentPicker}>
                  <FontAwesome name="photo" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={this.handleCamera}>
                  <Entypo name="camera" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={this.handleWaitMessage}>
                  <FontAwesome5 name="star-of-david" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={this.handleClientData}>
                  <FontAwesome5 name="user-circle" color={'#333'} size={22} />
                </Touchable>
              </View>
              {this.state.moreInfo ? (
                <View style={{minHeight: hp(10)}}>
                  {this.state.templateList ? (
                    <View style={{height: hp(30)}}>
                      <FlatList
                        data={this.state.templateList}
                        renderItem={this.chatItem}
                        keyExtractor={this.keyExtractor}
                        ItemSeparatorComponent={this.itemSeparator}
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#bc0f1780',
                        height: hp(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text>{this.state.tempMessage}</Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isDocChatDataSave: ChatSelectors.isDocChatDataSave(state),
});
const mapDispatchToProps = {
  docSaveChatData: ChatOperations.docSaveChatData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
