import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

//custom loader
import CustomLoader from 'components/CustomLoader';

// Icons
import ic_profile_mail from 'assets/icons/ic_profile_mail.png';
// import logo from 'assets/images/logo.png';
import logo from 'assets/appIcon/logoforapppngtransp.png';

//validations
import {isEmailAddress} from '../validations/FormValidations';

//component
import showToast from 'components/CustomToast';
//Redux
import {connect} from 'react-redux';
import {sessionOperations, sessionSelectors} from '../Redux/wiseword/session';
import {saveLocationSelectors} from 'Redux/wiseword/location';
import {ScrollView} from 'react-native-gesture-handler';
import {BASE_URL, makeRequest} from 'api/ApiInfo';

import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      gettingLoginStatus: true,
    };
  }

  onChangeEmail = email => {
    this.setState({email});
  };

  handleOtp = async () => {
    try {
      const {email} = this.state;
      //validating password no.
      if (!isEmailAddress(email)) {
        Alert.alert('', 'Please Enter a Valid email !', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }
      this.setState({isLoading: true});
      const params = {
        emailID: email,
      };
      const response = await makeRequest(
        BASE_URL + '/api/Customer/forgotPassword',
        params,
      );
      if (response && response.success) {
        this.setState({isLoading: false});
        this.props.navigation.pop();
        showToast(response.message);
      } else {
        this.setState({isLoading: false});
        showToast(response.message);
      }
    } catch (e) {
      console.log('error message in reset password', e);
    }
  };

  handleLogin = () => {
    this.props.navigation.pop();
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.loginContainer}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />
          <Text style={styles.hi}>Forget your password ?</Text>
          <Text style={styles.title}>
            Confirm your email we'll send the instructions.
          </Text>

          <View style={styles.inputContainer}>
            <Image
              source={ic_profile_mail}
              resizeMode="cover"
              style={styles.inputIcon}
            />
            {/* <View style={styles.separator} /> */}

            <TextInput
              placeholder="Enter Email Address"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={this.onChangeEmail}
              maxLength={100}
              style={styles.input}
              placeholderTextColor="#333"
            />
          </View>

          <Touchable
            style={styles.appButton}
            onPress={this.handleOtp}
            underlayColor="#4f000a">
            <Text style={styles.otpText}>Reset Password</Text>
          </Touchable>

          <View style={styles.forGetPassword}>
            <Touchable
              onPress={this.handleLogin}
              underlayColor="rgba(0, 0, 0, 0)">
              <Text style={styles.signUpButton}>Login</Text>
            </Touchable>
          </View>
        </ScrollView>
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
    height: wp(40),
    aspectRatio: 1 / 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: '#4f000a',
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
});
