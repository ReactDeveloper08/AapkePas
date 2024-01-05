import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {
//   GoogleSigninButton,
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-community/google-signin';
//import {signUp} from '../screens/Google-Login';
//import { GoogleSignin } from '@react-native-community/google-signin';
//import {WEB_CLIENT_ID} from '../screens/keys';

// Firebase API
import {checkPermission} from 'firebase_api/FirebaseAPI';
//custom loader
import CustomLoader from 'components/CustomLoader';
//google Login
import GoogleLogin, {loginWithGoogle} from './GoogleLogin';

// Icons
import ic_profile_mail from 'assets/icons/ic_profile_mail.png';
import ic_lock from 'assets/icons/ic_lock.png';
// import logo from 'assets/images/logo.png';
import logo from 'assets/appIcon/logoforapppngtransp.png';
import password_hide from 'assets/icons/hidePassword.png';
import password_show from 'assets/icons/showPassword.png';

//api
import {KEYS, storeData, getData} from 'api/UserPreference';
//firebase validation
import {
  LoginRequest,
  SignUpRequest,
  AddUser,
} from '../Chat_WiseWord/src/network';
// import {keys, setAsyncStorage} from '../Chat_WiseWord/src/asyncStorage';
//validations
import {isEmailAddress, isPasswordvalid} from '../validations/FormValidations';

//component
import showToast from 'components/CustomToast';
//Redux
import {connect} from 'react-redux';
import {sessionOperations, sessionSelectors} from '../Redux/wiseword/session';
import {
  saveLocationSelectors,
  // saveLocationOperation,
} from 'Redux/wiseword/location';
import {ScrollView} from 'react-native-gesture-handler';
import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';
// import basicStyles from 'styles/BasicSyles';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      userInfo: null,
      gettingLoginStatus: true,
      isVisible: true,
    };
  }

  onChangeEmail = email => {
    this.setState({email});
  };

  onChangePassword = password => {
    this.setState({password});
  };
  onPressVisibleKey = () => {
    this.setState({isVisible: !this.state.isVisible});
  };
  //* authorization with firebase
  handleAccept = async userInfo => {
    const {userId, name} = userInfo;
    var email = userId + '@thewiseword.in';
    var password = email;
    email = email.toString();
    password = password.toString();

    if (!email) {
      Alert.alert('Email is required');
    } else if (!password) {
      Alert.alert('Password is required');
    } else {
      // this.setState({isLoading: true});

      LoginRequest(email, password)
        .then(async res => {
          // const {user, code, message} = res;
          const {user} = res;
          console.log('user IN Login----<>', res);
          if (user) {
            if (!res.additionalUserInfo) {
              this.setState({isLoading: false});
              Alert.alert(res);

              return;
            }
            console.log('user is Logged In for chat', res.user.uid);
            const isChatEnable = true;
            await storeData(KEYS.FIREBASE_AUTH, isChatEnable);

            // this.props.navigation.navigate('Home');
            this.setState({isLoading: false});
          } else {
            SignUpRequest(email, password).then(res => {
              // let uid = firebase.auth().currentUser.uid;
              let uid = userId;
              let profileImg = '';
              console.log('user in signUp block ', res);
              AddUser(name, email, uid, profileImg)
                .then(async () => {
                  // setUniqueValue(uid);
                  const isChatEnable = true;
                  console.log(
                    'UserSuccessFullySignUp',
                    name,
                    email,
                    uid,
                    profileImg,
                  );
                  await storeData(KEYS.FIREBASE_AUTH, isChatEnable);
                  // this.props.navigation.navigate('Home');
                  this.setState({isLoading: false});
                })
                .catch(err => {
                  this.setState({isLoading: false});
                  alert(err);
                });
            });
          }
        })
        .catch(res => {
          this.setState({isLoading: false});

          Alert.alert(res);
        });
    }
  };

  handleOtp = async () => {
    const {password, email} = this.state;
    //validating password no.
    if (!isEmailAddress(email)) {
      Alert.alert('', 'Please Enter Valid email !', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (!isPasswordvalid(password)) {
      Alert.alert('', 'Please Enter Valid Password !', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    this.setState({isLoading: true});
    await checkPermission();
    const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
    const location = await getData(KEYS.NWE_LOCATION);
    const wallet = this.props.navigation.getParam('wallet', null);
    const info = this.props.navigation.getParam('info');
    const account = this.props.navigation.getParam('account', null);

    const {deviceId} = devId;

    if (account === null && wallet === null) {
      try {
        const params = {password, email, deviceId, location: location};
        await this.props.sendOTP(params);
        if (this.props.isOTPSent) {
          const {success, message, userInfo} = this.props.isOTPSent;
          if (success === true) {
            const {role} = userInfo;

            if (role === 'expert') {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('astro_Home');
            } else {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('Homes');
            }

            Alert.alert('Alert!', message);
          } else {
            this.setState({isLoading: false});
            Alert.alert('Alert!', message);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (!(wallet === null)) {
      try {
        const params = {password, email, deviceId, location: location};
        await this.props.sendOTP(params);
        if (this.props.isOTPSent) {
          const {success, message, userInfo} = this.props.isOTPSent;
          if (success === true) {
            const {role} = userInfo;

            if (role === 'expert') {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('astro_Home');
            } else {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('MyPayment');
            }
          } else {
            this.setState({isLoading: false});
            Alert.alert('Alert!', message);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else if (!(account === null)) {
      try {
        const params = {password, email, deviceId, location: location};
        await this.props.sendOTP(params);
        if (this.props.isOTPSent) {
          const {success, message, userInfo} = this.props.isOTPSent;
          if (success === true) {
            const {role} = userInfo;

            if (role === 'expert') {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('astro_Home');
            } else {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              // showToast('Welcome');
              await this.handleAccept(userInfo);

              this.props.navigation.navigate('MyAccount');
            }
          } else {
            this.setState({isLoading: false});
            Alert.alert('Alert!', message);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        const params = {password, email, deviceId, location: location};
        await this.props.sendOTP(params);
        if (this.props.isOTPSent) {
          const {success, message, userInfo} = this.props.isOTPSent;
          if (success === true) {
            const {role} = userInfo;

            if (role === 'expert') {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              Alert.alert('', message);
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('astro_Home');
            } else {
              await storeData(KEYS.USER_INFO, userInfo);
              this.setState({isLoading: false});
              Alert.alert('', message);
              await this.handleAccept(userInfo);
              this.props.navigation.navigate('Homes');
            }
          } else {
            Alert.alert('', message);
            this.setState({isLoading: false});
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  handleSignUp = () => {
    this.props.navigation.push('SignUp');
  };
  handleForgetPassword = () => {
    this.props.navigation.push('ForgetPassword');
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.loginContainer}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />
          <Text style={styles.hi}>Welcome</Text>
          <Text style={styles.title}>Please Sign in or Signup to Continue</Text>

          <View style={styles.inputContainer}>
            <Image
              source={ic_profile_mail}
              resizeMode="cover"
              style={styles.inputIcon}
            />
            {/* <View style={styles.separator} /> */}

            <TextInput
              placeholder="Email ID"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={this.onChangeEmail}
              maxLength={100}
              style={styles.input}
              placeholderTextColor="#333"
            />
          </View>
          <View style={styles.inputContainer}>
            <Image
              source={ic_lock}
              resizeMode="cover"
              style={styles.inputIcon}
            />
            {/* <View style={styles.separator} /> */}

            <TextInput
              placeholder="Password"
              keyboardType="default"
              value={this.state.password}
              onChangeText={this.onChangePassword}
              maxLength={50}
              secureTextEntry={this.state.isVisible}
              style={styles.input}
              placeholderTextColor="#333"
            />
            <TouchableOpacity onPress={this.onPressVisibleKey}>
              <Image
                source={this.state.isVisible ? password_show : password_hide}
                resizeMode="cover"
                style={styles.inputFieldIcon}
              />
            </TouchableOpacity>
          </View>

          {/* <Touchable
            style={styles.appButton}
            onPress={this.handleOtp}
            underlayColor="#4f000a">
            <Text style={styles.otpText}>Submit </Text>
          </Touchable> */}
          {/* <Button title="Submit" color="#4f000a" onPress={this.handleOtp} /> */}
          <Pressable
            delayLongPress={150}
            style={styles.appButton}
            onPress={() => {
              this.handleOtp();
            }}>
            {({pressed}) => (
              <Text style={{color: '#000', fontSize: textSize}}>Submit</Text>
            )}
          </Pressable>
          <View style={styles.forGetPassword}>
            <Touchable
              onPress={this.handleForgetPassword}
              underlayColor="rgba(0, 0, 0, 0)">
              <Text style={styles.signUpButton}>Forgot Password?</Text>
            </Touchable>
          </View>
          <View style={styles.signUp}>
            <Text style={styles.signUpText}>Don't have account? </Text>
            <Touchable
              onPress={this.handleSignUp}
              underlayColor="rgba(0, 0, 0, 0)">
              <Text style={styles.signUpButton}>Sign Up</Text>
            </Touchable>
          </View>
          <GoogleLogin nav={this.props.navigation} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  getSaveLocation: saveLocationSelectors.isLocationGet(state),
  isOTPSent: sessionSelectors.isOTPSent(state),
});

const mapDispatchToProps = {
  sendOTP: sessionOperations.sendOTP,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#47aae3',
  },
  logo: {
    width: hp(20),
    height: hp(25),
  },
  loginContainer: {
    marginTop: hp(15),
    alignItems: 'center',
    padding: wp(2),
  },
  hi: {
    fontSize: headingLargeXSize,
    fontWeight: '700',
    color: '#fff',
  },
  title: {
    fontSize: textLargeSize,
    color: '#fff',
    marginBottom: wp(5),
  },
  inputContainer: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#fff',
    paddingHorizontal: wp(3),
    marginBottom: wp(3),
    borderRadius: 5,
  },
  inputIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  input: {
    fontSize: textSize,
    flex: 1,
    height: hp(5.5),
    padding: wp(2),
    color: '#333',
    paddingLeft: wp(4),
  },
  separator: {
    width: 1,
    height: 26,
    backgroundColor: '#333',
    marginHorizontal: wp(2),
  },

  appButton: {
    backgroundColor: '#ffff',
    height: hp(5.5),
    width: wp(90),
    paddingHorizontal: wp(6),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  otpText: {
    fontSize: textSize,
    color: '#fff',
  },
  signUp: {
    flexDirection: 'row',
    marginBottom: hp(2),
    alignItems: 'center',
  },
  forGetPassword: {
    flexDirection: 'row',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  signUpText: {
    color: '#fff',
    fontSize: textSize,
  },
  signUpButton: {
    color: '#fff',
    fontSize: headingSize,
    fontWeight: '700',
  },
  inputFieldIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
});
