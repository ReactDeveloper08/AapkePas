import React, {useLayoutEffect, useState, useEffect, Fragment} from 'react';
import {
  Pressable,
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
} from 'react-native';
import {withPreventDoubleClick} from 'ViewUtils/Click';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {globalStyle} from '../../utility';
import styles from './styles';
// import {InputField, ChatBox} from '../../component';
import {BoxChat, ChatBox} from 'Chat_WiseWord/src/component';
import database from '@react-native-firebase/database';

import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import basicStyles from 'styles/BasicStyles';
// import {showToast} from 'components/CustomToast';
import get from 'lodash/get';
import typingdots from 'assets/images/3dot.gif';
import {nsPop, nsNavigate} from 'routes/NavigationService';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ChatHistory = ({route, navigation}) => {
  console.log('welcome to Chat Screen========}}}}>>>', navigation, route);
  // const params = props.navigation.getParams('params');
  // console.log(params);

  var params = get(navigation, 'state.params', '');
  // console.log('===---<<<<', params);
  const {
    // consultationId,
    expertName,
    // expertcharge,
    // callDuration,
    // chargeDeducted,
    // date,
    // userMobile,
    expertMobile,
    userId,
    // userImage,
  } = params;
  var currentUserId = userId;
  var guestUserId = expertMobile;

  // console.log('---', params);

  const [messeges, setMesseges] = useState([]);
  const [templateList, setTemplateList] = useState('');
  const [type, setTyping] = useState(false);

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
    // tempLets();
  }, []);

  //* CHAT_SEND with typing

  //   * On image tap
  const imgTap = chatImg => {
    // console.log('on image Press', chatImg);
    let name = expertName;
    nsNavigate('ShowFullImg', {name, img: chatImg});
  };

  return (
    <SafeAreaView
      style={[globalStyle.flex1, {backgroundColor: '#fff', flex: 1}]}>
      {route ? null : (
        <View style={styles.headerContainer}>
          <Touchable underlayColor="transparent" onPress={() => nsPop()}>
            <Ionicons
              name="arrow-back-sharp"
              color="#333"
              size={26}
              style={styles.iconRow}
            />
          </Touchable>
          <Text style={styles.headerSubTitle}> {expertName} </Text>
        </View>
      )}
      <View style={basicStyles.flexOne}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 90 : 90}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[globalStyle.flex1, {backgroundColor: '#fff', flex: 1}]}>
          <View style={[globalStyle.flex1, {marginBottom: hp(4)}]}>
            <FlatList
              inverted
              data={messeges}
              keyExtractor={(_, index) => index.toString()}
              // contentContainerStyle={{
              //   borderWidth: 1,
              //   borderColor: 'red',
              //   flex: 1,
              //   justifyContent: 'flex-start',
              // }}
              renderItem={({item}) => (
                <BoxChat
                  msg={item.msg}
                  userId={item.sendBy}
                  img={item.img}
                  timer={item.timer}
                  onImgTap={() => imgTap(item.img)}
                  uuid={currentUserId}
                  // block={BlockUser}
                  typing={type}
                />
              )}
            />
            {type === true || type ? (
              <Image source={typingdots} style={styles.typingIcon} />
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChatHistory;
