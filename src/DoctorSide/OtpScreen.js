import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import logo from 'assets/images/logo.png';
import basicStyles from 'styles/BasicStyles';

//components
import CustomLoader from 'components/CustomLoader';
import {showToast} from 'components/CustomToast';

//api
import {KEYS, storeData, getData} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
export default class SplashScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      isLoading: false,
    };
  }
  handleOtpChange = otp => {
    this.setState({otp});
  };
  handleLogin = async () => {
    this.setState({isLoading: true});
    const {otp} = this.state;
    const mobile = this.props.navigation.getParam('mobile', null);
    const reg = this.props.navigation.getParam('reg', null);
    const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = deviceInfo;

    if (mobile) {
      const params = {
        mobile: mobile,
        otp: otp,
        deviceId,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/userOtpVerify',
        params,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          this.setState({isLoading: false});
          const {userInfo} = response;
          const {role} = userInfo;
          if (role === 'astrologer') {
            await storeData(KEYS.USER_INFO, userInfo);
            this.props.navigation.navigate('LoggedIn');
            showToast(message);
          } else {
            this.props.navigation.pop();
            showToast('You are not Authorized For This App');
          }
        } else {
          this.setState({message, isLoading: false});
          showToast(message);
        }
      }
    } else {
      const {mobile} = reg;

      const params = {
        mobile: mobile,
        otp: otp,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/registrationOtpVerify',
        params,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          this.setState({isLoading: false});
          this.props.navigation.navigate('Login');
          showToast(message);
        } else {
          this.setState({message, isLoading: false});
          showToast(message);
        }
      }
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    let otp_Validate = false;
    if (this.state.otp) {
      otp_Validate = true;
    }
    return (
      <SafeAreaView style={basicStyles.container}>
        <LinearGradient
          colors={['#ff9933', '#fd6c33', '#fd6c33']}
          style={styles.linearGradient}>
          <View style={[basicStyles.directionRow, styles.topSpace]}>
            <Image source={logo} resizeMode="cover" style={styles.logo} />
          </View>
          <View style={[basicStyles.mainContainer, styles.formContainer]}>
            <KeyboardAwareScrollView
              style={[basicStyles.flexOne, basicStyles.marginTop]}>
              <Text style={styles.signText}>Welcome to Parnam Guruji</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#666"
                  maxLength={4}
                  secureTextEntry
                  keyboardType="number-pad"
                  value={this.state.otp}
                  onChangeText={this.handleOtpChange}
                />
              </View>

              <View>
                {otp_Validate === true ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.button2}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetText}>Resent OTP</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  logo: {
    width: wp(30),
    aspectRatio: 1 / 1,
  },
  topSpace: {
    height: hp(25),
    alignItems: 'center',
    justifyContent: 'center',
  },

  formContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: wp(5),
    borderTopLeftRadius: wp(5),
    padding: wp(4),
    paddingTop: hp(15),
  },

  logoContainer: {
    backgroundColor: 'rgba(242, 241, 241, .8)',
    height: wp(40),
    width: wp(40),
    borderRadius: wp(20),
    alignSelf: 'center',
    marginTop: wp(-22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    height: wp(20),
    aspectRatio: 2 / 1,
    alignSelf: 'center',
  },
  topMargin: {
    marginTop: hp(4),
  },

  signText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(3),
    marginBottom: hp(3),
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    borderRadius: hp(3),
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
  },
  inputIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: wp(3.2),
    height: hp(6),
    textAlign: 'center',
  },

  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#fff',
    width: wp(7),
    marginRight: wp(1),
    height: hp(5),
    borderRadius: wp(3),
    borderWidth: 0,
  },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderRadius: 4,
  //   paddingHorizontal: wp(2),
  //   marginVertical: hp(2),
  // },
  // otpContainer: {
  //   marginLeft: wp(8),
  //   width: wp(65),
  //   height: hp(6.5),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  button: {
    marginVertical: hp(2),
    backgroundColor: '#fd6c33',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
  },
  button2: {
    marginVertical: hp(2),
    backgroundColor: '#ccc',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(3.2),
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
  resetText: {
    color: '#fd6c33',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  iconRow: {
    width: wp(6),
    textAlign: 'center',
  },
  otpContainer: {
    marginLeft: wp(8),
    width: wp(65),
    height: hp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
