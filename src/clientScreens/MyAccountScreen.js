import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import clear from 'react-native-clear-cache-lcm';
// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import CustomLoader from 'components/ProcessingLoader';
import showToast from 'components/CustomToast';
//For GoogleSignOut
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Icons
import ic_home_white from 'assets/icons/ic_home_white.png';

// import ic_footer_wallet from 'assets/icons/ic_footer_wallet.png';
import ic_footer_wallet from 'assets/icons/ic_wallet_profile.png';

// import ic_profile_logout from 'assets/icons/ic_profile_logout.png';
import ic_profile_logout from 'assets/icons/ic_logout.png';

// import ic_coupons from 'assets/icons/ic_coupons.png';
import ic_coupons from 'assets/icons/ic_coupen_profile.png';
import ic_followings from 'assets/icons/ic_followings.png';
import ic_consultation from 'assets/icons/ic_consultation.png';
import ic_invitate from 'assets/icons/ic_invitate.png';
import ic_faq from 'assets/icons/ic_faq.png';
import ic_privacy_policy from 'assets/icons/ic_privacy_policy.png';
import ic_terms_conditions from 'assets/icons/ic_terms_conditions.png';
import ic_about from 'assets/icons/ic_about.png';

//share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
//api
import {getData, KEYS, clearData} from 'api/UserPreference';
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import basicStyles from 'styles/BasicStyles';

//Redux
import {connect} from 'react-redux';
import {profileOperations, profileSelectors} from 'Redux/wiseword/profile';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from 'Redux/wiseword/availableBalance';
import {userInfoOperations} from 'Redux/wiseword/userDetails';
import {sessionOperations} from 'Redux/wiseword/session';
import {referralOperations, referralSelectors} from 'Redux/wiseword/refferal';

import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  myAccountListIcon,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: '',
      image: '',
      walletBalance: '',
      currency: '',
      email: '',
      profileResponse: '',
      isReffered: '',
      value: '',
    };
  }
  intervalID;
  componentDidMount() {
    this.getNameForAccount();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }
  getNameForAccount = async () => {
    try {
      const info = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      if (info) {
        const params = null;
        await this.props.profile(params);
        if (this.props.isGetProfile) {
          const {success} = this.props.isGetProfile;
          if (success) {
            const {userInfo} = this.props.isGetProfile;
            const {name, image, walletBalance, email, isReffered} = userInfo;
            this.setState({
              name,
              image,
              walletBalance,
              currency,
              email,
              isReffered,
              profileResponse: this.props.isGetProfile,
              isLoading: false,
            });
            this.props.saveAvailableBalance(walletBalance);
          } else {
            this.setState({isLoading: false});
          }
        }
      }
    } catch (error) {
      Alert.alert('there is an error in getNameAccount');
    }
  };

  handleEditProfile = () => {
    this.props.navigation.push('EditProfile');
  };
  handleProfile = () => {
    const {profileResponse} = this.state;
    const refresh = this.componentDidMount();
    this.props.navigation.push('Profile', {profileResponse, refresh});
  };
  handleWallet = () => {
    // this.props.navigation.navigate('Wallet');
    this.props.navigation.navigate('MyWallet');
  };

  handleCoupons = () => {
    this.props.navigation.push('Coupons');
  };
  handlePayment = () => {
    this.props.navigation.push('MyPayment');
  };
  handleMyExperts = () => {
    this.props.navigation.push('MyExperts');
  };

  handlePrivacy = async () => {
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/privacyPolicy',
      params,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        this.setState({isLoading: false});
        const answer = description;
        this.props.navigation.navigate('PrivacyPolicies', {answer});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };
  handleTermsCondition = async () => {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/termsAndConditions',
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        this.setState({isLoading: false});
        const answer = description;
        const page = 'Terms & Conditions';
        this.props.navigation.navigate('TermsCondition', {answer, page});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };

  handleContactUs = async () => {
    const response = await makeRequest(BASE_URL + 'api/Customer/contactUs');

    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        this.setState({isLoading: false});
        const answer = description;
        const page = 'About Us';
        this.props.navigation.navigate('TermsCondition', {answer, page});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };
  fetchReferralInfo = async () => {
    try {
      const info = await getData(KEYS.USER_INFO);

      if (!info) {
        Alert.alert(
          'Alert!',
          'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }

      // starting loader
      this.setState({isLoading: true});

      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Customer/referralCode',
        params,
        true,
        true,
      );

      if (response) {
        const {success, message} = response;

        if (success) {
          const {output} = response;
          this.setState({referralInfo: output, isLoading: false});
          this.handleShare();
        } else {
          console.log('the referral message', message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  handleShare = async () => {
    try {
      const {referralInfo} = this.state;
      const {shareInfo} = referralInfo;
      const {
        title,
        message,
        image,
        ForAstroPleasevisitText,
        ForAstroPleasevisitURL,
        ExpertiseText,
        androidUrl,
      } = shareInfo;

      const {url: url, extension} = image;

      const base64ImageData = await this.encodeImageToBase64(url);

      if (!base64ImageData) {
        return;
      }

      const shareOptions = {
        title,
        subject: title,
        message: `${title}\n${message}\n${ForAstroPleasevisitText}:${ForAstroPleasevisitURL}\n${ExpertiseText}${androidUrl}`,
        url: `data:image/${extension};base64,${base64ImageData}`,
      };

      // stopping loader
      this.setState({showProcessingLoader: false});

      await Share.open(shareOptions);
    } catch (error) {
      console.log(error.message);
    }
  };
  encodeImageToBase64 = async url => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});
      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      return null;
    }
  };
  handleFAQ = () => {
    this.props.navigation.navigate('FAQ');
  };
  handleLogoutPress = async () => {
    try {
      const info = await getData(KEYS.USER_INFO);

      const {email} = info;
      const params = {
        email,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Customer/logOut',
        params,
      );
      if (response && response.success) {
        const {message} = response;
        clear.runClearCache(() => {
          console.log('data clear');
        });
        await clearData();
        await this.props.resetLoggedInUser();
        await this.props.resetBalance();
        await this.props.logout();
        // await GoogleSignin.revokeAccess();
        // await GoogleSignin.signOut();
        // await checkPermission();
        this.props.navigation.navigate('Home');
      } else {
        clear.runClearCache(() => {
          console.log('data clear');
        });
        await clearData();
        await this.props.resetLoggedInUser();
        await this.props.resetBalance();
        await this.props.logout();
        // await GoogleSignin.revokeAccess();
        // await GoogleSignin.signOut();
        // await checkPermission();
        this.props.navigation.navigate('Home');
      }
    } catch (e) {
      console.log('there is an error in sign-out api', e);
    }
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.handleLogoutPress},
      ],
      {
        cancelable: false,
      },
    );
  };

  //* refferal
  inputReferral = value => {
    this.setState({value});
  };

  enterReferral = async () => {
    try {
      console.log('the enter value', this.state.value);
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You need to Login first.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }
      const {value} = this.state;
      // if (value.length === 10) {
      const params = {
        referralCode: value,
      };

      await this.props.enterReferral(params);
      if (this.props.isReferralEnter) {
        const {success, message} = this.props.isReferralEnter;
        if (success) {
          // const {message} = this.props.isReferralEnter;
          showToast(message);
        } else {
          // const {message} = this.props.isReferralEnter;
          showToast(message);
        }
      }
      // }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const {isLoading} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileContainer}>
          <HeaderComponent
            headerIcon={ic_home_white}
            headerTitle="My Account"
            navActionBack="back"
            nav={this.props.navigation}
          />
          <View style={styles.formContainer}>
            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri: this.state.image,
                }}
                style={styles.profileImage}
              />

              <View style={[basicStyles.flexOne, basicStyles.marginLeft]}>
                <Text style={styles.userName}>{this.state.name}</Text>
                <Touchable
                  underlayColor="#ffffff80"
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyEnd,
                    styles.profileButton,
                  ]}
                  onPress={this.handleProfile}>
                  <View>
                    <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                      View Profile
                    </Text>
                  </View>
                </Touchable>
              </View>

              <Touchable
                style={styles.logoutButton}
                onPress={this.handleLogout}>
                <Image
                  source={ic_profile_logout}
                  resizeMode="cover"
                  style={styles.logoutIcon}
                />
              </Touchable>
            </View>

            <View
              style={[
                basicStyles.whiteBackgroundColor,
                basicStyles.flexOne,
                styles.profileData,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyEvenly,
                ]}>
                <Touchable
                  underlayColor="transparent"
                  style={[basicStyles.flexOne]}
                  onPress={this.handleWallet}>
                  <View style={styles.profileRow2}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={ic_footer_wallet}
                        resizeMode="cover"
                        style={[styles.iconsPink]}
                      />
                    </View>
                    <View>
                      {this.state.currency === 'Rupee' ? (
                        <Text
                          style={[
                            basicStyles.headingLarge,
                            basicStyles.whiteColor,
                          ]}>
                          ₹ {this.props.isBalanceUpdated}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            basicStyles.headingLarge,
                            basicStyles.whiteColor,
                          ]}>
                          $ {this.props.isBalanceUpdated}
                        </Text>
                      )}
                      <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                        Wallet Balance
                      </Text>
                    </View>
                  </View>
                </Touchable>

                <View style={basicStyles.separatorVertical} />

                <Touchable
                  underlayColor="transparent"
                  style={[basicStyles.flexOne]}
                  onPress={this.handleCoupons}>
                  <View style={styles.profileRow2}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={ic_coupons}
                        resizeMode="cover"
                        style={[styles.iconsPink]}
                      />
                    </View>
                    <Text style={[styles.userText, basicStyles.whiteColor]}>
                      Coupons
                    </Text>
                  </View>
                </Touchable>
              </View>

              <View style={[styles.accountData, basicStyles.flexOne]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Touchable
                    onPress={this.handleMyExperts}
                    underlayColor="#ff638b40">
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_followings}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>Followings</Text>
                    </View>
                  </Touchable>

                  <Touchable
                    underlayColor="#ffffff80"
                    onPress={this.handlePayment}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_consultation}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>My Consultations</Text>
                    </View>
                  </Touchable>

                  <Touchable
                    underlayColor="#ffffff80"
                    onPress={this.fetchReferralInfo}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_invitate}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>Invite & Earn</Text>
                    </View>
                  </Touchable>

                  <Touchable underlayColor="#ffffff80" onPress={this.handleFAQ}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_faq}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>FAQ's</Text>
                    </View>
                  </Touchable>

                  <Touchable
                    underlayColor="#ffffff80"
                    onPress={this.handlePrivacy}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_privacy_policy}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>Privacy Policy</Text>
                    </View>
                  </Touchable>

                  <Touchable
                    underlayColor="#ffffff80"
                    onPress={this.handleTermsCondition}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_terms_conditions}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>Terms & Conditions</Text>
                    </View>
                  </Touchable>

                  <Touchable
                    underlayColor="#ffffff80"
                    onPress={this.handleContactUs}>
                    <View style={styles.profileRow}>
                      <Image
                        source={ic_about}
                        resizeMode="cover"
                        style={styles.infoIcon}
                      />
                      <Text style={styles.userText}>About The Aapke Pass</Text>
                    </View>
                  </Touchable>

                  {this.state.isReffered ? null : (
                    <View
                      style={[styles.inviteEarn, basicStyles.justifyBetween]}>
                      <TextInput
                        placeholder="Enter Your Referral Code"
                        placeholderTextColor="#666"
                        style={styles.referralCodeInput}
                        value={this.state.value}
                        onChangeText={this.inputReferral}
                      />

                      {this.state.value ? (
                        <Touchable
                          style={styles.bothIcon}
                          onPress={this.enterReferral}>
                          <Text style={styles.applyText}>Apply</Text>
                        </Touchable>
                      ) : null}
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
          <FooterComponent nav={this.props.navigation} />
          {isLoading && <CustomLoader />}
        </View>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isGetProfile: profileSelectors.isProfile(state),
  isReferralEnter: referralSelectors.isReferralEnter(state),
  isBalanceUpdated: availableBalanceSelectors.getAvailableBalance(state),
});
const mapDispatchToProps = {
  profile: profileOperations.profile,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
  enterReferral: referralOperations.enterReferral,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileButton: {
    backgroundColor: '#42a9e3',
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
  profileContainer: {
    flex: 1,
    elevation: 8,
  },
  formContainer: {
    flex: 1,
    // padding: wp(2),
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
  profileData: {
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    marginTop: hp(2),
    paddingTop: wp(3),
    backgroundColor: '#9cdbfe',
  },
  profileImage: {
    height: wp(22),
    width: wp(22),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#ff648a20',
  },
  userName: {
    fontSize: headingLargeSize,
    marginTop: hp(1),
    color: '#333',
    fontWeight: '700',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#ff638b10',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    height: hp(6.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    // marginBottom: wp(2),
    // elevation: 8,
  },
  profileRow3: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: hp(6),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    // elevation: 8,
  },
  profileRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff',
    paddingHorizontal: wp(3),
    borderRadius: hp(3),
    // marginTop: hp(1),
    // elevation: 8,
  },
  logoutRow: {
    flexDirection: 'row',
  },

  infoIcon: {
    width: wp(5.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  infoIcon2: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  userText: {
    fontSize: textSize,
    color: '#333',
  },
  inviteEarn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cccccc80',
    flexDirection: 'row',
    paddingRight: wp(3),
    alignItems: 'center',
  },
  referralCodeInput: {
    flex: 1,
    color: '#333',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    fontSize: wp(3.2),
    height: hp(5.5),
  },
  bothIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#4daee4',
  },
  iconContainer3: {
    backgroundColor: '#e9e5c580',
    height: wp(10),
    width: wp(10),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  earnIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  logoutButton: {
    backgroundColor: '#49ace4',
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  logoutIcon: {
    height: wp(5.5),
    aspectRatio: 1 / 1,
  },
  accountData: {
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    marginTop: wp(3),
    padding: wp(3),
  },
  iconContainer: {
    backgroundColor: '#48abe4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    marginRight: wp(2),
  },
  iconsPink: {
    width: wp(6),
    aspectRatio: 1 / 1,
  },
});
