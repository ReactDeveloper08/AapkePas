import React, {Component} from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import logo from 'assets/images/logo.png';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, storeData, getData} from 'api/UserPreference';

//component
import CustomLoader from 'components/CustomLoader';

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
    };
  }

  handleLogin = async otp => {
    const info = this.props.navigation.getParam('info', null);
    //deviceID

    try {
      if (info) {
        const {mobile} = info;

        const params = {
          mobile,
          otp,
        };

        const response = await makeRequest(
          BASE_URL + 'registerOtpVerify',
          params,
        );

        if (response) {
          const {success, message} = response;
          if (success) {
            const {userInfo} = response;

            this.setState({
              isProcessing: false,
            });

            await storeData(KEYS.USER_INFO, userInfo);
            this.setState({otp: otp});
            Alert.alert(message);
            this.props.navigation.navigate('Home');
          } else {
            Alert.alert(message);
          }
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // handleLogin = async otp => {
  //   //deviceID
  //   const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);
  //   const {deviceId} = deviceInfo;

  //   const {mobile} = sig;

  //   const params = {
  //     mobile,
  //     otp,
  //   };

  //   const response = await makeRequest(
  //     BASE_URL + 'register_otp_verify',
  //     params,
  //   );

  //   console.log(response);

  //   if (response) {
  //     const {success, message} = response;

  //     if (success) {
  //       this.setState({
  //         isProcessing: false,
  //       });
  //       this.setState({otp: otp});

  //       Alert.alert(message);
  //       this.props.navigation.popToTop();
  //     } else {
  //       Alert.alert(message);
  //     }
  //   }
  // };

  render() {
    return (
      <LinearGradient
        colors={['#ff539b', '#ff628c', '#ff727c']}
        style={styles.container}>
        <View style={styles.loginContainer}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />

          <OTPInputView
            style={styles.otpContainer}
            pinCount={4}
            autoFocusOnLoad
            placeholderCharacter="0"
            placeholderTextColor="#ACACAC"
            codeInputFieldStyle={styles.underlineStyleBase}
            // onCodeChanged={this.handleLogin}
            onCodeFilled={this.handleLogin}
            //onCodeFilled={this.handleUserVerify}
          />
        </View>
        {this.state.isProcessing && <CustomLoader />}
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgContainer: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 150,
    aspectRatio: 1 / 1,
  },

  otpContainer: {
    width: wp(50),
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#fff',
    width: 36,
    height: 36,
  },

  otpButton: {
    backgroundColor: '#fff',
    height: 32,
    paddingHorizontal: wp(8),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(3),
  },
  btnText: {
    fontSize: wp(3.5),
    color: '#ff638b',
  },
});
