import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  // widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-picker';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyle} from '../../utility';
import styles from './styles';
import {InputField, ChatBox} from '../../component';
import database from '@react-native-firebase/database';
import {senderMsg, recieverMsg, isTyping} from '../../network';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import basicStyles from 'styles/BasicStyles';

import get from 'lodash/get';
import typingdots from 'assets/images/3dot.gif';

import {nsPop} from 'routes/NavigationService';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ChatHistory = ({route, navigation}) => {
  // const params = props.navigation.getParams('params');

  var params = get(navigation, 'state.params', '');

  var {astro_mobile, user_name, user_mobile, user_email} = params;
  // const userMobileNo = user_mobile;

  const currentUserId = astro_mobile;
  const guestUserId = user_mobile;

  const [msgValue, setMsgValue] = useState('');
  const [messeges, setMesseges] = useState([]);
  const [moreInfo, setMoreInfo] = useState(false);
  const [templateList, setTemplateList] = useState('');
  const [type, setTyping] = useState(false);
  const [isEndChat, setEndChat] = useState(0);
  const [tempMessage, setTempMessage] = useState('');
  const [response, setResponse] = useState('');

  // const [time, setTime] = useState(70);
  // const [isSetTime, setIsSetTime] = useState(false);
  // const [valueChange, setValueChange] = useState(0);
  //* USEEFFECT
  useEffect(() => {
    try {
      database()
        .ref('messeges')
        .child(`${currentUserId}`)
        .child(`${guestUserId}`)
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
        });
    } catch (error) {
      alert(error);
    }
    tempLets();
  }, []);

  //* CHAT_SEND with typing
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
  //* CLIENT_FINANCIAL INFO
  const handleClientData = async () => {
    const data = {email: user_email};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/getClientDetails',
      data,
      true,
      false,
    );
    setResponse(response);
    clientData();
  };
  //*on tap Client Data
  const clientData = async () => {
    const {currentBalance, maxDuration, youRating, allRating} = response;
    setMoreInfo(false);
    Alert.alert(
      `${user_name}`,
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
  //* MESSAGE FOR WAITING Templates with typing
  const handleWaitMessage = () => {
    let data = 'Please Wait Doctor Will check your Report';
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
    senderMsg(data, currentUserId, guestUserId, '', eTime)
      .then(() => {})
      .catch(err => alert(err));
    recieverMsg(data, currentUserId, guestUserId, '', eTime)
      .then(() => {})
      .catch(err => alert(err));
  };
  //*HANDLE CHANGE ALL VALUES
  const handleOnChange = text => {
    setMsgValue(text);
  };

  //   * On image tap
  const imgTap = chatImg => {
    const name = user_name;
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

  const handleInfo = () => {
    if (moreInfo === true) {
      setMoreInfo(false);
    } else {
      setMoreInfo(true);
    }
  };

  const chatItem = ({item}) => (
    <ScrollView style={styles.moreData}>
      <Text style={styles.preDefineText}>{item.userName}</Text>
    </ScrollView>
  );

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => (
    <View style={{height: 1, backgroundColor: '#ffffff80'}} />
  );

  const endChat = () => {
    nsPop();
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: '#fff'}]}>
      {route ? null : (
        <View style={styles.headerContainer}>
          <Touchable underlayColor="transparent" onPress={() => nsPop()}>
            <Ionicons
              name="arrow-back-sharp"
              color="#fff"
              size={26}
              style={styles.iconRow}
            />
          </Touchable>
          <Text style={styles.headerSubTitle}>{user_name}</Text>
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
                    timer={item.timer}
                    // block={BlockUser}
                    typing={type}
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
                <Touchable onPress={() => handleInfo('moreInfo')}>
                  <FontAwesome5 name="list-alt" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={() => handleDocumentPicker()}>
                  <FontAwesome name="photo" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={() => handleCamera()}>
                  <Entypo name="camera" color={'#333'} size={22} />
                </Touchable>
                <Touchable onPress={() => handleWaitMessage()}>
                  <FontAwesome5 name="star-of-david" color={'#333'} size={22} />
                </Touchable>
                <Touchable
                  onPress={() => {
                    handleClientData();
                  }}>
                  <FontAwesome5 name="user-circle" color={'#333'} size={22} />
                </Touchable>
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
                        backgroundColor: '#ff648a',
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

export default ChatHistory;
