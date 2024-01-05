import React, {useContext, useState, useEffect} from 'react';
import {
  Platform,
  Alert,
  Text,
  SafeAreaView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
('react-native-keyboard-aware-scroll-view');
import {InputField, RoundCornerButton, Logo} from '../../component';
import {globalStyle, color} from '../../utility';
import {Store} from '../../context/store';
import {LOADING_START, LOADING_STOP} from '../../context/actions/type';
import {setAsyncStorage, keys} from '../../asyncStorage';

import {KEYS, getData} from 'api/UserPreference';

import {setUniqueValue, keyboardVerticalOffset} from '../../utility/constants';
import {LoginRequest} from '../../network';

export default ({navigation}) => {
  const globalState = useContext(Store);
  const {dispatchLoaderAction} = globalState;
  const [credential, setCredential] = useState({
    email: '',
    password: '',
  });
  const [InfoUsr, setInfoUsr] = useState('');
  const [logo, toggleLogo] = useState(true);
  const {email, password} = credential;

  const setInitialState = () => {
    setCredential({email: '', password: ''});
  };
  // * HANDLE ON CHANGE
  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };
  useEffect(() => {
    Info();
  });
  const Info = async () => {
    const userInfo = await getData(KEYS.USER_INFO, null);

    setInfoUsr(userInfo);
    onLoginPress();
  };

  //   * ON LOGIN PRESS
  const onLoginPress = () => {
    const {mobile} = InfoUsr;
    let email = mobile + '@pranamguruji.com';
    let password = mobile;

    Keyboard.dismiss();
    if (!email) {
      Alert.alert('Email is required');
    } else if (!password) {
      Alert.alert('Password is required');
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });

      LoginRequest(email, password)
        .then(res => {
          const {user, code, message} = res;
          if (user) {
            if (!res.additionalUserInfo) {
              dispatchLoaderAction({
                type: LOADING_STOP,
              });
              Alert.alert(res);

              return;
            }
            setAsyncStorage(keys.uuid, res.user.uid);
            setUniqueValue(res.user.uid);

            dispatchLoaderAction({
              type: LOADING_STOP,
            });
            setInitialState();

            navigation.navigate('Live Chat');
          } else {
            Alert.alert(message, code);
          }
        })
        .catch(res => {
          dispatchLoaderAction({
            type: LOADING_STOP,
          });

          Alert.alert(res);
        });
    }
  };
  // * ON INPUT FOCUS

  const handleFocus = () => {
    setTimeout(() => {
      toggleLogo(false);
    }, 200);
  };
  // * ON INPUT BLUR

  const handleBlur = () => {
    setTimeout(() => {
      toggleLogo(true);
    }, 200);
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={[globalStyle.flex1, {backgroundColor: '#fffcd5'}]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[globalStyle.flex1, {backgroundColor: '#fffcd5'}]}>
          {/* {logo && (
            <View style={[globalStyle.containerCentered]}>
              <Logo />
            </View>
          )} */}
          <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
            <InputField
              placeholder="Enter email"
              value={email}
              onChangeText={text => handleOnChange('email', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
            <InputField
              placeholder="Enter password"
              value={password}
              secureTextEntry={true}
              onChangeText={text => handleOnChange('password', text)}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />

            <RoundCornerButton title="Login" onPress={() => onLoginPress()} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: color.LIGHT_GREEN,
              }}
              onPress={() => {
                setInitialState();
                navigation.navigate('SignUp');
              }}>
              Sign Up
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
