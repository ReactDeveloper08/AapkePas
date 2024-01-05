import React, {useState, useEffect} from 'react';
import {
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
// import {senderMsg, recieverMsg} from '../../network';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {smallDeviceHeight} from '../../utility/constants';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import basicStyles from 'styles/BasicStyles';

import get from 'lodash/get';
import {nsPop} from 'routes/NavigationService';
import {withPreventDoubleClick} from 'ViewUtils/Click';
import {Alert} from 'native-base';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ChatHistory = ({route, navigation}) => {
  var params = get(navigation, 'state.params', '');
  const {
    // astro_name,
    astro_mobile,
    user_name,
    user_mobile,
    // consultationId,
    type,
    date,
    clientPaid,
    // orderType,
    // userName,
    userImage,
    minutes,
  } = params;
  // const currentUserId = astro_mobile;
  const guestUserId = user_mobile;

  const [response, setResponse] = useState('');

  //* USEEFFECT
  useEffect(() => {
    handleClientData();
    // return chatChecker();
  }, []);
  const {currentBalance, maxDuration, youRating, allRating} = response;
  const handleClientData = async () => {
    const data = {mobile: guestUserId};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/getClientDetails',
      data,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/getClientDetails');
    setResponse(response);
    // console.log(response, data);
  };

  return (
    <SafeAreaView style={[globalStyle.flex1, {backgroundColor: '#fd6c33'}]}>
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
        style={[globalStyle.flex1, {backgroundColor: '#fd6c33'}]}>
        <View style={[globalStyle.flex1]}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
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
            <Text
              style={[
                basicStyles.textAlign,
                basicStyles.headingLarge,
                basicStyles.whiteColor,
              ]}>
              {user_name}
            </Text>
            <View style={styles.callStyles}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  Call Time
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
                  {date}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  Call Type
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
                  {type}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  Client Paid
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
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
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  Current Balance
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
                  ₹ {currentBalance}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  Max Duration
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
                  {maxDuration}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  You Rating
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
                  {youRating}
                </Text>
              </View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.paddingHalfVertical,
                ]}>
                <Text style={[basicStyles.whiteColor, basicStyles.flexOne]}>
                  All Rating
                </Text>
                <Text
                  style={[
                    basicStyles.whiteColor,
                    basicStyles.paddingHorizontal,
                  ]}>
                  :
                </Text>
                <Text style={[basicStyles.whiteColor, basicStyles.flexTow]}>
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
