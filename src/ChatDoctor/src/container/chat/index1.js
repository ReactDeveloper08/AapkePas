import React, {useState, useEffect, useRef} from 'react';
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
import {nsNavigate, nsPop} from 'routes/NavigationService';
import clear from 'react-native-clear-cache-lcm';
// import {constant} from 'lodash';

const Chat = ({route, navigation}) => {
  if (route) {
    var {params} = route;
  } else {
    var params = get(navigation, 'state.params', '');
  }

  var {
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
  const guestId = guestUserId;

  const [endCallFire, setEndCallFire] = useState(false);
  const [msgValue, setMsgValue] = useState('');
  const [messeges, setMesseges] = useState([]);
  const [moreInfo, setMoreInfo] = useState(false);
  const [templateList, setTemplateList] = useState('');
  const [type, setTyping] = useState(false);
  const [isEndChat, setEndChat] = useState(0);
  const [countTimer, setCountTimer] = useState(3);
  const [tempMessage, setTempMessage] = useState('');
  const [isExtended, setIsExtended] = useState(true);
  const [extendsChat, setExtendedChat] = useState(0);
  const [extendTime, setExtendTime] = useState(availableMinutes);
  const [isSetTime, setIsSetTime] = useState(false);
  const [valueChange, setValueChange] = useState(0);

  //*USE EFFECT
  useEffect(() => {
    try {
      database()
        .ref('messeges')
        .child(currentUserId)
        .child(guestUserId)
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
          setMesseges(msgs.reverse());
          setTyping(false);
        });
    } catch (error) {
      alert(error);
    }
    tempLets();

    return chatChecker();
  }, []);

  const chatChecker = () => {
    checkIsTyping();
    checkIsEndChat();
    // checkIsExtendChat();
  };

  // * backhandler
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to End Chat?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => endChat()},
      ]);
      return true;
    };
    // BackHandler.exitApp()
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  //*Checking Is Typing
  const checkIsTyping = () => {
    database()
      .ref('typing')
      .child(guestUserId)
      .child(currentUserId)
      .on('value', data => {
        if (data.key === guestUserId) {
          setTyping(false);
        } else {
          setTyping(true);
        }
      });
  };
  //*checking EndChat
  const checkIsEndChat = async () => {
    await database()
      .ref('chatOperation')
      .child(currentUserId)
      .child(guestUserId)
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
        if (newChatOperation.length !== 0) {
          if (
            newChatOperation[0].endNow === 3 &&
            newChatOperation[0].endMessage !== '' &&
            newChatOperation[0].endNow !== 2 &&
            endCallFire !== true
          ) {
            clear.runClearCache(() => {
              console.log('data clear');
            });
            await setEndCallFire(true);
            Alert.alert(
              `The Consultation Charges `,
              `${newChatOperation[0].endMessage}`,
              [
                {
                  text: 'Ok',
                  onPress: () => nsNavigate('astro_Home'),
                },
              ], //() => navigation.popToTop()
              {
                cancelable: false,
              },
            );
          }
          if (newChatOperation[0].extendChat === 1) {
            setIsExtended(false);
          }
        }
      });
  };

  //*extendChat
  // const checkIsExtendChat = () => {
  //  database()
  //     .ref('extendChat')
  //     .child(currentUserId)
  //     .child(guestUserId)
  //     .on('value', data => {
  //       const valueResponse = data.val().extendChat;
  //       if (valueResponse === 1) {
  //         setIsExtended(false);
  //       }
  //     });
  // };

  const EndNow = () => {
    Alert.alert('Hold on!', 'Are you sure you want to End Chat?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => endChat()},
    ]);
  };
  //*END CHAT
  const endChat = async () => {
    var endTime = new Date();
    var totalTime = endTime - now;

    var inSec = totalTime / 1000;

    const params = {
      consultationId,
      balanceMinutes: inSec,
    };
    const typing = 0;
    isTyping(typing, currentUserId, guestUserId)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    setTyping(false);
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/endChatRequest',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        requestEnd(message);
        navigation.popToTop();
        clear.runClearCache(() => {
          console.log('data clear');
        });
        Alert.alert(
          `The Consultation Charges with ${name}`,
          `${message}`,
          [{text: 'Ok', onPress: () => null}],
          {
            cancelable: false,
          },
        );
        await setEndCallFire(true);
      } else {
        showToast(message);
      }
    }
  };
  //*endChat dataRequest
  const requestEnd = async message => {
    let endNow = 2;
    let accept = 1;
    let extend = 0;
    let endMessage = message;
    await chatOperation(
      endMessage,
      extend,
      accept,
      endNow,
      currentUserId,
      guestUserId,
    );
    // await isChatEnd(endMessage, endNow, currentUserId, guestUserId)
    //   .then(() => {})
    //   .catch(e => {
    //     console.log(e);
    //   });
    // await isAcceptChat(accept, currentUserId, guestUserId);
  };

  //*CHAT SEND with typing
  const handleSend = () => {
    const typing = 0;
    isTyping(typing, currentUserId, guestUserId)
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    setTyping(false);
    setMsgValue('');
    const eTime = Date();
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getDate();
    // var hours = date.getHours();
    // var minutes = date.getMinutes();
    // var seconds = date.getSeconds();
    // var eTime =
    //   year +
    //   '-' +
    //   month +
    //   '-' +
    //   day +
    //   ' ' +
    //   hours +
    //   ':' +
    //   minutes +
    //   ':' +
    //   seconds;
    if (msgValue) {
      senderMsg(msgValue, currentUserId, guestUserId, '', eTime)
        .then(() => {})
        .catch(err => alert(err));

      // * guest user

      recieverMsg(msgValue, currentUserId, guestUserId, '', eTime)
        .then(() => {})
        .catch(err => alert(err));
    }
  };

  //*FOR BLOCK USER
  const BlockUser = async () => {
    const params = {
      userId,
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
  const handleCamera = () => {
    setMoreInfo(false);

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
        // var date = new Date();
        // var year = date.getFullYear();
        // var month = date.getMonth() + 1;
        // var day = date.getDate();
        // var hours = date.getHours();
        // var minutes = date.getMinutes();
        // var seconds = date.getSeconds();
        // var eTime =
        //   year +
        //   '-' +
        //   month +
        //   '-' +
        //   day +
        //   ' ' +
        //   hours +
        //   ':' +
        //   minutes +
        //   ':' +
        //   seconds;
        let source = 'data:image/jpeg;base64,' + response.data;

        senderMsg(msgValue, currentUserId, guestUserId, source, eTime)
          .then(() => {})
          .catch(err => alert(err));

        // * guest user

        recieverMsg(msgValue, currentUserId, guestUserId, source, eTime)
          .then(() => {})
          .catch(err => alert(err));
      }
    });
  };
  //*FOR GALLERY
  const handleDocumentPicker = () => {
    setMoreInfo(false);

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
        // var date = new Date();
        // var year = date.getFullYear();
        // var month = date.getMonth() + 1;
        // var day = date.getDate();
        // var hours = date.getHours();
        // var minutes = date.getMinutes();
        // var seconds = date.getSeconds();
        // var eTime =
        //   year +
        //   '-' +
        //   month +
        //   '-' +
        //   day +
        //   ' ' +
        //   hours +
        //   ':' +
        //   minutes +
        //   ':' +
        //   seconds;
        senderMsg(msgValue, currentUserId, guestUserId, source, eTime)
          .then(() => {})
          .catch(err => alert(err));

        // * guest user

        recieverMsg(msgValue, currentUserId, guestUserId, source, eTime)
          .then(() => {})
          .catch(err => alert(err));
      }
    });
  };
  //*CLIENT FINANCIAL INFO
  const handleClientData = async () => {
    const data = {email: clientMobile};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/getClientDetails',
      data,
      true,
      false,
    );

    const {currentBalance, maxDuration, youRating, allRating} = response;
    setMoreInfo(false);
    Alert.alert(
      `${name}`,
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
  const handleWaitMessage = async () => {
    let msgValue = 'Please Wait Doctor Will check your Report';
    const eTime = Date();
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getDate();
    // var hours = date.getHours();
    // var minutes = date.getMinutes();
    // var seconds = date.getSeconds();
    // var eTime =
    //   year +
    //   '-' +
    //   month +
    //   '-' +
    //   day +
    //   ' ' +
    //   hours +
    //   ':' +
    //   minutes +
    //   ':' +
    //   seconds;
    await senderMsg(msgValue, currentUserId, guestUserId, '', eTime)
      .then(() => {})
      .catch(err => alert(err));
    await recieverMsg(msgValue, currentUserId, guestUserId, '', eTime)
      .then(() => {})
      .catch(err => alert(err));
  };
  //*HANDLE CHANGE ALL VALUES
  const handleOnChange = text => {
    try {
      const typing = 1;
      isTyping(typing, currentUserId, guestUserId)
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    if (text.length > 0) {
      setTyping(true);
    } else if (text.length === 0) {
      const typing = 0;
      isTyping(typing, currentUserId, guestUserId)
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
      setTyping(false);
    }
    checkIsTyping();
    setMsgValue(text);
  };

  //   * On image tap
  const imgTap = chatImg => {
    navigation.navigate('show_FullImg', {name, img: chatImg});
  };
  //*FOR PRE-TYPED MESSAGES
  const tempLets = async () => {
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
        setTemplateList(templateList);
      } else {
        setTempMessage(message);
      }
    }
  };

  //* ExtendChat
  const extendChat = async () => {
    if (valueChange === 0) {
      Alert.alert(`You Can't extend Chat until 1 min. Left`);
      return;
    }
    const eTime = Date();
    // var dates = new Date();
    // var year = dates.getFullYear();
    // var month = dates.getMonth() + 1;
    // var day = dates.getDate();
    // var hours = dates.getHours();
    // var minutes = dates.getMinutes();
    // var seconds = dates.getSeconds();
    // var eTime =
    //   year +
    //   '-' +
    //   month +
    //   '-' +
    //   day +
    //   ' ' +
    //   hours +
    //   ':' +
    //   minutes +
    //   ':' +
    //   seconds;

    const paramsd = {
      consultationId,
    };
    setCountTimer(countTimer + 3);
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
        setExtendedChat(extendTime);
        setIsSetTime(true);

        const msgValue = message;

        let extendChat = 1;
        isExtendChat(extendChat, currentUserId, guestUserId);
        senderMsg(msgValue, currentUserId, guestUserId, '', eTime)
          .then(() => {})
          .catch(err => alert(err));
        recieverMsg(msgValue, currentUserId, guestUserId, '', eTime)
          .then(() => {})
          .catch(err => alert(err));
        showToast(message);
      } else {
        senderMsg(msgValue, currentUserId, guestUserId, '', eTime)
          .then(() => {})
          .catch(err => alert(err));
        recieverMsg(msgValue, currentUserId, guestUserId, '', eTime)
          .then(() => {})
          .catch(err => alert(err));
        showToast(message);
      }
    }
  };

  const handleInfo = () => {
    if (moreInfo === true) {
      setMoreInfo(false);
    } else {
      setMoreInfo(true);
    }
  };

  const chatItem = ({item}) => (
    <ScrollView style={styles.moreData}>
      <Text
        style={styles.preDefineText}
        onPress={() => handleOnChange(item.userName)}>
        {item.userName}
      </Text>
    </ScrollView>
  );

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => (
    <View style={{height: 1, backgroundColor: '#ffffff80'}} />
  );

  return (
    <SafeAreaView style={[basicStyles.flexOne, {backgroundColor: '#fff'}]}>
      {route ? null : (
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubTitle}>{name}</Text>

          {isExtended ? (
            <TouchableOpacity onPress={extendChat}>
              <Image
                source={ExtendChat}
                style={[
                  basicStyles.iconRow,
                  {height: wp(6), marginRight: wp(4)},
                ]}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={EndNow}>
            <Image
              source={EndChat}
              style={[basicStyles.iconRow, {height: wp(6), marginRight: wp(4)}]}
            />
          </TouchableOpacity>
          {isSetTime ? (
            <CountdownCircleTimer
              isPlaying
              duration={valueChange + extendsChat * 60}
              size={45}
              strokeWidth={5}
              trailStrokeWidth={6}
              onComplete={() => {
                endChat();
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
              until={extendTime * 60}
              running={true}
              size={12.5}
              onChange={async value => {
                if (value <= 60) {
                  await setValueChange(value);
                }
              }}
              onFinish={() => endChat()}
              digitStyle={{backgroundColor: '#FFF'}}
              digitTxtStyle={{color: '#c0c0c0'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: null, s: null}}
            />
          )}
        </View>
      )}
      <View style={basicStyles.flexOne}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 90 : 90}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[globalStyle.flex1, {backgroundColor: '#fff'}]}>
          <TouchableWithoutFeedback
            style={[globalStyle.flex1]}
            onPress={Keyboard.dismiss}>
            <View style={[globalStyle.flex1]}>
              <FlatList
                inverted
                data={messeges}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <ChatBox
                    msg={item.msg}
                    userId={item.sendBy}
                    img={item.img}
                    onImgTap={() => imgTap(item.img)}
                    uuid={currentUserId}
                    block={BlockUser}
                    typing={type}
                    timer={item.timer}
                  />
                )}
              />
              {type === true || type ? (
                <Image source={typingdots} style={styles.typingIcon} />
              ) : null}
              {/* Send Message */}
              <View style={styles.sendMessageContainer}>
                <InputField
                  placeholder="Type Here"
                  placeholderTextColor="#333"
                  numberOfLines={10}
                  inputStyle={styles.input}
                  value={msgValue}
                  onChangeText={text => handleOnChange(text)}
                />
                <View style={styles.sendBtnContainer}>
                  <MaterialCommunityIcons
                    name="send-circle"
                    color={'#333'}
                    size={30}
                    onPress={() => handleSend()}
                  />
                </View>
              </View>
              <View style={styles.chatBottomOption}>
                <TouchableOpacity onPress={() => handleInfo('moreInfo')}>
                  <FontAwesome5 name="list-alt" color={'#333'} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDocumentPicker}>
                  <FontAwesome name="photo" color={'#333'} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCamera}>
                  <Entypo name="camera" color={'#333'} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWaitMessage}>
                  <FontAwesome5 name="star-of-david" color={'#333'} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClientData}>
                  <FontAwesome5 name="user-circle" color={'#333'} size={22} />
                </TouchableOpacity>
              </View>
              {moreInfo ? (
                <View style={{minHeight: hp(10)}}>
                  {templateList ? (
                    <View style={{height: hp(30)}}>
                      <FlatList
                        data={templateList}
                        renderItem={chatItem}
                        keyExtractor={keyExtractor}
                        ItemSeparatorComponent={itemSeparator}
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
                      <Text>{tempMessage}</Text>
                    </View>
                  )}
                </View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
