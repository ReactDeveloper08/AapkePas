import React, {Component} from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Text,
  ScrollView,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';

// Images
// import logo from 'assets/images/logo.png';
import logo from 'assets/appIcon/logoforapppngtransp.png';

//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/CustomLoader';
//validation
import {
  isNameValid,
  isEmailAddress,
  isMobileNumber,
  isPasswordvalid,
} from '../validations/FormValidations';

// Icons
import ic_phone_white from 'assets/icons/ic_phone_white.png';
import ic_user from 'assets/icons/ic_user.png';
import ic_email from 'assets/icons/ic_email.png';
import ic_password from 'assets/icons/ic_password.png';
import ic_gender from 'assets/icons/ic_gender.png';
import ic_code from 'assets/icons/ic_code.png';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
//Redux
import {connect} from 'react-redux';
import {saveLocationSelectors} from 'Redux/wiseword/location';
import {sessionOperations, sessionSelectors} from 'Redux/wiseword/session';
import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  signupInputWidth,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isLoading: false,
      name: '',
      mobile: '',
      gender: 'Male',
      email: '',
      confirmPassword: '',
      password: '',
      referral: '',
      isChecked: false,
      referralCode: '',
    };
    this.radio_props = [
      {label: 'Male', value: 'Male'},
      {label: 'Female', value: 'Female'},
      {label: 'Other', value: 'Other'},
    ];
  }

  handleLogin = () => {
    this.props.navigation.pop();
  };

  onChangeName = name => {
    this.setState({name});
  };
  onChangeMobile = mobile => {
    this.setState({mobile});
  };
  onChangeGender = gender => {
    this.setState({gender});
  };
  onChangeemail = email => {
    this.setState({email});
  };
  handleSelectGender = value => {
    this.setState({gender: value});
  };
  onChangeConfirmPassword = confirmPassword => {
    this.setState({confirmPassword});
  };
  onChangePassword = password => {
    this.setState({password});
  };

  onChangeReferralCode = referralCode => {
    this.setState({referralCode});
  };

  handleCheckUnCheck = async () => {
    try {
      await this.setState({isChecked: !this.state.isChecked});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOtp = async () => {
    const {
      name,
      mobile,
      gender,
      email,
      password,
      isChecked,
      confirmPassword,
      referralCode,
    } = this.state;

    const long_name = await getData(KEYS.NWE_LOCATION);
    const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = devId;
    // validations
    if (!isNameValid(name)) {
      Alert.alert('', 'Please enter your name !', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (!isEmailAddress(email)) {
      Alert.alert(
        '',
        ' Please enter your valid email address !',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (!isMobileNumber(mobile)) {
      Alert.alert(
        '',
        'Please enter your valid mobile number!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (gender.trim === '') {
      Alert.alert('', 'Please select your gender ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (!isPasswordvalid(password)) {
      Alert.alert(
        '',
        'Please enter valid password with 7 to 15 characters which contain at least one numeric and one special character',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(
        '',
        'Please enter correct password your entered password was not matched with password',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (isChecked === false) {
      Alert.alert('', 'Please accept terms and conditions. ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    this.setState({
      isProcessing: true,
    });
    const params = {
      name: name,
      mobile: mobile,
      email: email,
      gender: gender,
      password: password,
      deviceId,
      location: long_name,
      referralCode,
    };

    await this.props.login(params);

    const {success, message} = this.props.isLoggedIn;

    if (success) {
      const info = {email};
      this.setState({
        isProcessing: false,
      });
      this.props.navigation.push('Login', {info});
      Alert.alert('', message);
    } else {
      this.setState({
        isProcessing: false,
      });
      Alert.alert('', message);
    }
  };

  handleTerms = async () => {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/termsAndConditions',
      null,
      false,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        this.setState({isLoading: false});
        const answer = description;
        const page = 'Terms & condition';
        this.props.navigation.push('Terms', {answer, page});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };

  render() {
    const {isChecked} = this.state;
    if (this.state.isProcessing) {
      return <CustomLoader />;
    }
    return (
      <View
        // colors={['#ff539b', '#ff628c', '#ff727c']}
        style={styles.container}>
        <ScrollView
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Image source={logo} resizeMode="cover" style={styles.logo} />

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_user}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Name"
                  value={this.state.name}
                  onChangeText={this.onChangeName}
                  style={styles.input}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_email}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Email Address"
                  value={this.state.email}
                  onChangeText={this.onChangeemail}
                  style={styles.input}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_phone_white}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={this.state.mobile}
                  onChangeText={this.onChangeMobile}
                  maxLength={10}
                  style={styles.input}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_gender}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                {/* <TextInput
                  placeholder="Gender"
                  value={this.state.gender}
                  onChangeText={this.onChangeGender}
                  style={styles.input}
                  placeholderTextColor="#fff"
                /> */}
                <RadioForm
                  radio_props={this.radio_props}
                  onPress={this.handleSelectGender}
                  buttonSize={8}
                  buttonColor={'#fff'}
                  selectedButtonColor={'#fff'}
                  labelColor={'#666'}
                  labelStyle={styles.radioButtonLabel}
                  style={styles.checkboxButton}
                  value={this.state.gender}
                  onChangeText={this.onUpdateGender}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_password}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Password"
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={this.onChangePassword}
                  style={styles.input}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_password}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Confirm Password"
                  value={this.state.confirmPassword}
                  secureTextEntry={true}
                  onChangeText={this.onChangeConfirmPassword}
                  style={styles.input}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={ic_code}
                  resizeMode="cover"
                  style={styles.inputIcon}
                />
                <View style={styles.separator} />

                <TextInput
                  placeholder="Referral Code"
                  style={styles.input}
                  placeholderTextColor="#fff"
                  value={this.state.referralCode}
                  onChangeText={this.onChangeReferralCode}
                />
              </View>

              <View style={styles.checkboxContainer}>
                <CheckBox
                  tintColors={{true: '#ffffff', false: '#fff'}}
                  style={styles.checkboxStyle}
                  checkBoxColor={'#F77062'}
                  boxType={'square'}
                  value={isChecked}
                  onValueChange={() => this.handleCheckUnCheck()}
                />
                <Text style={styles.conditionStyle}>
                  I Accept WiseWorld's{' '}
                  <Text style={styles.termStyle} onPress={this.handleTerms}>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
            </View>

            <Touchable
              style={styles.appButton}
              onPress={this.handleOtp}
              underlayColor="#ffffff80">
              <Text style={styles.otpText}>Signup</Text>
            </Touchable>

            <Text style={styles.loginStyle}>
              User Already Registered{' '}
              <Text
                style={styles.termStyle}
                onPress={this.handleLogin}
                underlayColor="rgba(0, 0, 0, 0)">
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  getSaveLocation: saveLocationSelectors.isLocationGet(state),
  isLoggedIn: sessionSelectors.isLoggedIn(state),
  isOtpResend: sessionSelectors.isOtpResend(state),
});
const mapDispatchToProps = {
  login: sessionOperations.login,
};
export default connect(mapStateToProps, mapDispatchToProps)(Signup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#47aae3',
  },
  backgroundImageContainer: {
    flex: 1,
  },
  scrollContainer: {
    // flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
  },
  logo: {
    width: hp(20),
    height: hp(25),
  },

  inputContainer: {
    width: signupInputWidth,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  inputIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
  input: {
    fontSize: textSize,
    flex: 1,
    height: hp(5.5),
    color: '#fff',
  },
  separator: {
    width: 1,
    height: 26,
    backgroundColor: '#fff',
    marginHorizontal: wp(2),
  },
  continueButton: {
    width: 100,
    height: 30,
    marginTop: 12,
    backgroundColor: '#27aa04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: textSize,
    fontWeight: '400',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(10),
  },
  checkBox: {
    width: 36,
    padding: 6,
  },
  checkBoxTitle: {
    fontSize: textSize,
    color: '#fff',
  },
  appButton: {
    backgroundColor: '#fff',
    height: hp(4.5),
    paddingHorizontal: wp(8),
    borderRadius: hp(2.25),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(4),
  },
  otpText: {
    fontSize: textSize,
    color: '#000',
  },
  signUp: {
    marginTop: hp(3),
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: hp(2),
  },
  checkboxStyle: {
    height: hp(2),
  },
  termStyle: {
    fontWeight: '700',
    fontSize: headingSize,
  },
  conditionStyle: {
    color: '#fff',
    fontSize: textSize,
  },
  loginStyle: {
    marginTop: hp(3.5),
    color: '#fff',
    fontSize: textSize,
  },
  label: {
    margin: wp(1.5),
    color: '#fff',
    fontSize: textSize,
  },
  radioButtonLabel: {
    fontSize: textSize,
    color: '#fff',
    marginRight: 15,
    marginLeft: 2,
  },
  checkboxButton: {
    flexDirection: 'row',
    marginLeft: wp(0.5),
    justifyContent: 'center',
    marginVertical: hp(1),
  },
});
