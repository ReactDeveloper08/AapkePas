import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import CustomLoader from 'components/CustomLoader';

// Icons

// import ic_profile_user from 'assets/icons/ic_profile_user.png';
import ic_profile_user from 'assets/icons/ic_profile_icon.png';
// import ic_profile_phone from 'assets/icons/ic_profile_phone.png';
import ic_profile_phone from 'assets/icons/ic_phone_profile.png';
// import ic_profile_mail from 'assets/icons/ic_profile_mail.png';
import ic_profile_mail from 'assets/icons/ic_mail_profile.png';
// import ic_profile_gender from 'assets/icons/ic_profile_gender.png';
import ic_profile_gender from 'assets/icons/ic_gender_profile.png';

//api
import {KEYS, getData, clearData} from 'api/UserPreference';
//Redux
import {connect} from 'react-redux';
import {profileOperations, profileSelectors} from 'Redux/wiseword/profile';

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
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const profileResponse = this.props.navigation.getParam(
      'profileResponse',
      null,
    );
    this.state = {
      ...profileResponse,
      userInfo: '',
      isLoading: true,
      name: '',
      mobile: '',
      email: '',
      gender: '',
      image: '',
    };
  }

  componentDidMount() {
    this.showUserProfile();
  }

  showUserProfile = async () => {
    try {
      const Info = await getData(KEYS.USER_INFO, null);
      this.setState({isLoading: true});

      if (Info) {
        const params = null;

        await this.props.profile(params);

        if (this.props.isGetProfile) {
          const {success, isAuthTokenExpired} = this.props.isGetProfile;
          if (success) {
            const {userInfo} = this.props.isGetProfile;
            const {name, mobile, email, gender, image} = userInfo;

            this.setState({
              userInfo,
              name,
              email,
              gender,
              mobile,
              image,
              isLoading: false,
            });
          } else {
            if (isAuthTokenExpired === true) {
              Alert.alert(
                'Session Expired',
                'Login Again to Continue!',
                [
                  {
                    text: 'OK',
                  },
                ],
                {
                  cancelable: false,
                },
              );
              this.handleTokenExpire();
            }
          }
        }
      }
    } catch (error) {}
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  handleEditProfile = () => {
    const {userInfo} = this.state;
    this.props.navigation.push('EditProfile', {
      userInfo,
      refreshCallback: this.showUserProfile,
    });
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Profile"
          // showGradient
          nav={this.props.navigation}
        />
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            {this.state.image && this.state.image !== 'null' ? (
              <Image
                source={{
                  uri: this.state.image,
                }}
                style={styles.profileImage}
              />
            ) : null}

            <View style={[basicStyles.flexOne, basicStyles.marginLeft]}>
              <Text style={styles.userName}>{this.state.name}</Text>
              <Touchable
                style={[styles.profileButton]}
                onPress={this.handleEditProfile}
                underlayColor="#ff648a">
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Edit Profile
                </Text>
              </Touchable>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.profileContainer}>
            <View style={styles.formContainer}>
              <KeyboardAvoidingView behavior="padding">
                <View style={styles.profileRow}>
                  <Image
                    source={ic_profile_user}
                    resizeMode="cover"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.userText}>{this.state.name}</Text>
                </View>
                {this.state.mobile !== 'null' ? (
                  <View style={styles.profileRow}>
                    <Image
                      source={ic_profile_phone}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>{this.state.mobile}</Text>
                  </View>
                ) : null}

                <View style={styles.profileRow}>
                  <Image
                    source={ic_profile_mail}
                    resizeMode="cover"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.userText}>{this.state.email}</Text>
                </View>
                {this.state.gender !== 'null' ? (
                  <View style={styles.profileRow}>
                    <Image
                      source={ic_profile_gender}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>{this.state.gender}</Text>
                  </View>
                ) : null}
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isGetProfile: profileSelectors.isProfile(state),
});
const mapDispatchToProps = {
  profile: profileOperations.profile,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flex: 1,
  },
  profileButton: {
    backgroundColor: '#4cade2',
    // height: wp(14),
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: wp(2),
    marginBottom: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    // borderWidth: 1,
    // borderColor: '#fff',
  },

  formContainer: {
    flex: 1,
    paddingTop: wp(3),
    backgroundColor: '#fff',
    borderTopRightRadius: wp(5),
    borderTopLeftRadius: wp(5),
  },
  editIcon: {
    alignSelf: 'flex-end',
    padding: wp(2),
  },
  editIconImage: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
  },
  profileImage: {
    height: wp(22),
    width: wp(22),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#ff648a20',
  },
  userName: {
    fontSize: textLargeSize,
    marginTop: hp(2),
    color: '#333',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9bdaff',
    // borderBottomWidth: 4,
    // borderColor: '#ff638b20',
    height: hp(6),
    paddingHorizontal: wp(3),
    marginHorizontal: wp(3),
    borderRadius: 5,
    marginBottom: wp(2),
    // elevation: 8,
  },
  logoutRow: {
    flexDirection: 'row',
  },
  infoIcon: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  userText: {
    fontSize: textSize,
    color: '#fff',
  },
});
