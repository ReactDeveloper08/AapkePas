import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
//otp text field
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CheckBox from '@react-native-community/checkbox';
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
import showToast from 'components/CustomToast';

//basicStyles
import basicStyles from 'styles/BasicStyles';

//Redux
import {connect} from 'react-redux';
import {sessionOperations, sessionSelectors} from '../Redux/wiseword/session';
import {userInfoOperations} from '../Redux/wiseword/userDetails';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class OTPScreen extends Component {
  constructor(props) {
    super(props);
    const sig = this.props.navigation.getParam('info', null);
    const logins = this.props.navigation.getParam('keypoint', null);
    const account = this.props.navigation.getParam('account', null);
    const wallet = this.props.navigation.getParam('wallet', null);
    if (!(logins == null)) {
      var {mobile} = logins;
    } else if (!(account === null)) {
      var {mobile} = account;
    } else if (!(wallet === null)) {
      var {mobile} = wallet;
    } else if (!(sig == null)) {
      var {mobile} = sig;
    }
    this.state = {
      mobile: mobile,
      otp: '',
      isProcessing: false,
      toggleCheckBox: false,
    };
  }
  onChangeOtp = otp => {
    this.setState({otp});
  };

  handleLogin = async () => {
    const sig = this.props.navigation.getParam('info', null);
    const logins = this.props.navigation.getParam('keypoint', null);
    const account = this.props.navigation.getParam('account', null);
    const wallet = this.props.navigation.getParam('wallet', null);
    //deviceID
    const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = deviceInfo;
    const {otp} = this.state;

    if (!(logins == null)) {
      try {
        const {mobile} = logins;
        if (logins) {
          const params = {
            mobile,
            otp,
            deviceId,
          };
          this.setState({mobile});
          const response = await makeRequest(
            BASE_URL + 'api/Customer/userOtpVerify',
            params,
            false,
            false,
          );
          if (response) {
            const {success, message} = response;

            if (success) {
              const {userInfo} = response;
              const {role} = userInfo;
              this.setState({
                isProcessing: false,
              });
              if (role === 'expert') {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('AstrologerNav');
              } else {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('Home');
              }
            } else {
              showToast(message);
            }
          }
        } else {
          Alert.alert('error in user otp verification');
        }
      } catch (error) {
        Alert.alert('error in login block response');
      }
    } else if (!(account === null)) {
      try {
        const {mobile} = account;
        if (account) {
          const params = {
            mobile,
            otp,
            deviceId,
          };
          this.setState({mobile});
          const response = await makeRequest(
            BASE_URL + 'api/Customer/userOtpVerify',
            params,
            false,
            false,
          );
          if (response) {
            const {success, message} = response;

            if (success) {
              const {userInfo} = response;
              const {role} = userInfo;
              this.setState({
                isProcessing: false,
              });
              if (role === 'expert') {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('AstrologerNav');
              } else {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('MyAccount');
              }
            } else {
              showToast(message);
            }
          }
        } else {
          Alert.alert('error in user otp verification');
        }
      } catch (error) {
        Alert.alert('error in login block response');
      }
    } else if (!(wallet === null)) {
      try {
        const {mobile} = wallet;
        this.setState({mobile});
        if (wallet) {
          const params = {
            mobile,
            otp,
            deviceId,
          };

          const response = await makeRequest(
            BASE_URL + 'api/Customer/userOtpVerify',
            params,
            false,
            false,
          );
          if (response) {
            const {success, message} = response;

            if (success) {
              const {userInfo} = response;
              const {role} = userInfo;
              this.setState({
                isProcessing: false,
              });
              if (role === 'expert') {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('AstrologerNav');
              } else {
                await storeData(KEYS.USER_INFO, userInfo);

                showToast('Welcome');
                this.props.navigation.navigate('Vault');
              }
            } else {
              showToast(message);
            }
          }
        } else {
          Alert.alert('error in user otp verification');
        }
      } catch (error) {
        Alert.alert('error in login block response');
      }
    } else if (!(sig == null)) {
      //const reg = this.props.navigation.getParam('keypoint', null);
      const {mobile} = sig;

      const params = {
        mobile,
        otp,
      };
      this.setState({mobile});
      const response = await makeRequest(
        BASE_URL + 'registerOtpVerify',
        params,
      );

      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({
            isProcessing: false,
          });
          this.setState({otp: otp});

          Alert.alert('', message);
          this.props.navigation.popToTop();
        } else {
          Alert.alert(message);
        }
      }
    } else {
      Alert.alert('error on both block');
    }
  };

  handleResentOTP = async () => {
    try {
      // this.setState({isLoading: true});
      const params = this.props.navigation.getParam('params', null);
      await this.props.sendOTP(params);
      if (this.props.isOTPSent) {
        this.setState({isLoading: false});
        const {success, message} = this.props.isOTPSent;
        if (success) {
          showToast('Otp Resend Successfully to your registered device');
        } else {
          showToast(message);
          this.setState({isLoading: false});
        }
      }
    } catch (e) {}
  };

  render() {
    return (
      <LinearGradient
        colors={['#ff539b', '#ff628c', '#ff727c']}
        style={styles.container}>
        <View
          style={[
            styles.loginContainer,
            basicStyles.mainContainer,
            styles.formContainer,
            basicStyles.flexOne,
            basicStyles.marginTop,
          ]}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />

          <OTPInputView
            style={styles.otpContainer}
            pinCount={4}
            autoFocusOnLoad
            placeholderCharacter="0"
            placeholderTextColor="#ACACAC"
            codeInputFieldStyle={styles.underlineStyleBase}
            onCodeChanged={this.onChangeOtp}
            // onCodeFilled={this.handleLogin}
            //onCodeFilled={this.handleUserVerify}
          />

          <View style={styles.checkBoxStyle}>
            <CheckBox
              disabled={false}
              value={this.state.toggleCheckBox}
              onValueChange={newValue =>
                this.setState({toggleCheckBox: newValue})
              }
            />
            <Text style={styles.textCheck}>
              I {this.state.mobile}, hereby authorize PranamGuruji.com. to
              contact me. It will override my registry on the NCPR.{' '}
            </Text>
          </View>

          {this.state.toggleCheckBox == true ? (
            <Touchable style={styles.button} onPress={this.handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </Touchable>
          ) : (
            <View style={styles.button2}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          )}

          <Touchable style={styles.resetButton} onPress={this.handleResentOTP}>
            <Text style={styles.resetText}>Resent OTP</Text>
          </Touchable>
        </View>
        {this.state.isProcessing && <CustomLoader />}
      </LinearGradient>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: sessionSelectors.isLoggedIn(state),
  isOtpResend: sessionSelectors.isOtpResend(state),
});

const mapDispatchToProps = {
  login: sessionOperations.login,
  resend: sessionOperations.resendOtp,
  saveLoggedInUser: userInfoOperations.saveLoggedInUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen);

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
    width: wp(10),
    height: wp(10),
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
  checkBoxStyle: {
    marginTop: 20,
    marginRight: wp(5),
    flexDirection: 'row',
  },
  textCheck: {
    flex: 1,
    color: '#fff',
    marginTop: 5,
    marginLeft: wp(5),
    fontSize: wp(2.8),
  },
  button: {
    marginVertical: hp(2),
    backgroundColor: '#fd6c33',
    height: hp(6),
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
  },
  button2: {
    marginVertical: hp(2),
    backgroundColor: '#ccc',
    height: hp(6),
    width: wp(25),
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
    color: '#fff',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
});
/**
  handleLogin = async otp => {
    const info = this.props.navigation.getParam('info', null);

    try {
      if (info) {
        const {mobile} = info;

        const params = {
          mobile,
          otp,
        };

        const response = await makeRequest(
          BASE_URL + 'user_otp_verify',
          params,
        );

        if (response) {
          const {success} = response;
          if (success) {
            const {userInfo} = response;

            this.setState({isProcessing: false});

            await storeData(KEYS.USER_INFO, userInfo);

            this.props.navigation.navigate('Home');
          }
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };*/
