import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {globalStyle} from '../../utility';
import styles from './styles';

import {senderMsg, recieverMsg} from '../../network';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import basicStyles from 'styles/BasicStyles';
import {nsPop} from 'routes/NavigationService';
import get from 'lodash/get';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ChatHistory = ({route, navigation}) => {
  var params = get(navigation, 'state.params', '');
  const {
    // astro_name,
    astro_mobile,
    user_name,
    user_mobile,
    user_email,
    // consultationId,
    type,
    date,
    clientPaid,
    // orderType,
    // userName,
    userImage,
    // minutes,
  } = params;
  const currentUserId = astro_mobile;
  const guestUserId = user_mobile;

  // const [msgValue, setMsgValue] = useState('');
  // const [messeges, setMesseges] = useState([]);
  const [moreInfo, setMoreInfo] = useState(false);
  // const [templateList, setTemplateList] = useState('');
  // const [type, setTyping] = useState(false);
  // const [isEndChat, setEndChat] = useState(0);
  // const [countTimer, setCountTimer] = useState(0);
  // const [tempMessage, setTempMessage] = useState('');
  const [response, setResponse] = useState('');

  //* USEEFFECT
  useEffect(() => {
    handleClientData();
  }, []);
  const {currentBalance, maxDuration, youRating, allRating} = response;
  const handleClientData = async () => {
    const data = {email: user_email};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/getClientDetails',
      data,
      true,
      false,
    );
    setResponse(response);
  };
  //*on tap Client Data
  const clientData = async () => {
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
    let data = 'Please Wait Astrologer Will check your Kundali';

    senderMsg(data, currentUserId, guestUserId, '')
      .then(() => {})
      .catch(err => alert(err));
    recieverMsg(data, currentUserId, guestUserId, '')
      .then(() => {})
      .catch(err => alert(err));
  };

  return (
    <SafeAreaView style={[globalStyle.flex1]}>
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
          <Text style={styles.headerSubTitle}> {user_name} </Text>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            {/* <Touchable style={basicStyles.marginRight} onPress={endChat}>
              <Text style={styles.headerSub}>EndChat</Text>
            </Touchable> */}
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[globalStyle.flex1]}>
        <View style={[globalStyle.flex1]}>
          <View
            style={{
              flex: 1,
              padding: wp(3),
              // alignItems: 'center',
              // justifyContent: 'center',
            }}>
            <Image
              source={{uri: userImage}}
              style={{
                width: wp(30),
                aspectRatio: 1 / 1,
                borderRadius: wp(15),
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: '#bc0f1780',
                marginBottom: hp(2),
              }}
            />
            <Text style={[basicStyles.textAlign, basicStyles.headingLarge]}>
              {user_name}
            </Text>
            <View style={styles.callStyles}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  Call Time
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {date}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  Call Type
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {type}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  Client Paid
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {clientPaid}
                </Text>
              </View>
            </View>

            <View style={styles.callStyles}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  Current Balance
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  ₹ {currentBalance}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  Max Duration
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {maxDuration}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  You Rating
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {youRating}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.darkColor, basicStyles.flexOne]}>
                  All Rating
                </Text>
                <Text
                  style={[
                    basicStyles.darkColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.darkColor, basicStyles.flexTow]}>
                  {allRating}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatHistory;
