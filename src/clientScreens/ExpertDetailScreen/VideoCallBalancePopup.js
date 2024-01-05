import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  BackHandler,
  Platform,
  Animated,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ProcessingLoader from 'components/ProcessingLoader';

// Icons
// import ic_callPrice_white from 'assets/icons/ic_callPrice.gif';
import ic_video_white from 'assets/icons/ic_video_white.png';
import voiceCallBg from 'assets/images/voiceCallBg.png';
// import ic_processing from 'assets/images/ic_processing.gif';
import styles from './styles';
//redux
import {connect} from 'react-redux';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from '../../Redux/wiseword/availableBalance';
import {
  userInfoSelectors,
  userInfoOperations,
} from '../../Redux/wiseword/userDetails';
import {
  profileOperations,
  profileSelectors,
} from '../../Redux/wiseword/profile';
import {
  transactionOperations,
  transactionSelectors,
} from '../../Redux/wiseword/wallet';
import {vcOperations, vcSelectors} from '../../Redux/wiseword/VideoCall';
import {sessionOperations} from '../../Redux/wiseword/session';
import {clearAsyncStorage} from '../../Chat_WiseWord/src/asyncStorage';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import showToast from 'components/CustomToast';

import {
  isAcceptVideoCall,
  isVCEnd,
  isVideoCallEnd,
} from '../../Chat_WiseWord/src/network';
// import firebase from '../../Chat_WiseWord/src/firebase/config';

import {nsNavigate} from 'routes/NavigationService';

// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);

class VideoCallBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      enableButton: true,
      isChatEnable: true,
      Balance: 0,
      userInfo: '',
      currency: '',
    };
    this.parentView = null;
    this.handleAccept = this.handleAccept.bind(this);
    this.walletInfo = this.walletInfo.bind(this);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentDidMount() {
    this.handleAccept();
    this.walletInfo();
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }
  //* Back handler
  backAction = () => {
    return true;
  };

  //* wallet Info
  walletInfo = async () => {
    try {
      this.setState({isLoading: true});
      await this.props.getWalletBalance();
      const userInfo = await getData(KEYS.USER_INFO);
      if (this.props.isWalletBalance !== 0) {
        await this.props.saveAvailableBalance(this.props.isWalletBalance);
        this.setState({
          Balance: this.props.isWalletBalance,
          userInfo,
          isLoading: false,
        });
      } else {
        this.setState({
          userInfo,
          isLoading: false,
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  handleAccept = async () => {
    // const isChatEnable = await getData(KEYS.FIREBASE_AUTH);
    const currency = await getData(KEYS.NEW_CURRENCY);

    if (this.state.isChatEnable === true) {
      this.setState({currency});
    } else {
      this.setState({currency});
    }
  };

  //* chat is requested and start
  startChat = async () => {
    this.setState({enableButton: false, isLoading: true});
    const id = this.props.id;
    var guestUserId = this.props.guestUserId;
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId, deviceId} = userInfo;
    var currentUserId = userId;
    const walletBalance = this.props.availableBalance;
    const {discountChatCharges, actualChatCharges} = this.props;
    var charges = 0,
      callTime = 0;
    const accept = 1;
    const extend = 0;
    let endNow = 0;
    var timeChat = 0;
    let endMessage = '';
    await isAcceptVideoCall(accept, guestUserId, currentUserId);
    // await isExtendVideoCall(extend, guestUserId, currentUserId);
    await isVideoCallEnd(endMessage, endNow, guestUserId, currentUserId);
    if (discountChatCharges != null) {
      charges = discountChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    }

    if (callTime > 30) {
      timeChat = 30;
    } else if (callTime < 30) {
      if (callTime >= 0 && callTime < 3) {
        Alert.alert(
          'Aapke Pass!!',
          'Insufficient Balance \n' + 'Please Recharge Your Wallet For Chat',
          [
            {
              text: 'Recharge',
              onPress: () => this.props.nav.navigate('Wallet'),
            },
          ],
          {
            cancelable: false,
          },
        );
      }
      timeChat = callTime;
    }
    const params = {
      astrologerId: id,
      deviceId,
    };
    await this.props.vcRequest(params);
    if (this.props.isVcRequest) {
      const {success, isLogOut, message} = this.props.isVcRequest;
      if (isLogOut !== true) {
        if (success) {
          this.setState({isLoading: false});

          this.closeOldPop();

          if (this.props.isVcRequest) {
            this.props.nav.navigate('vcClient');
          } else {
            console.warn('Step 3 no data found in to the save live');
          }
        } else {
          this.setState({isLoading: false, enableButton: false});
          const {isAuthTokenExpired} = this.props.isVcRequest;
          showToast(message);
          this.closeOldPop();
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Aapke Pass!',
              'Your Session Has Been Expired \n Login Again to Continue!',
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
            return;
          }
          // this.setState({message});
        }
      } else {
        this.setState({isLoading: false, enableButton: false});
        Alert.alert(
          'Aapke Pass!',
          `${message}`,
          [
            {
              text: 'OK',
            },
          ],
          {
            cancelable: false,
          },
        );
        this.closeOldPop();
        this.handleLogoutFromDevice();
        return;
      }
    }
  };
  //* logout when auth token expire
  handleTokenExpire = async () => {
    await clearAsyncStorage();
    nsNavigate('Login');
  };
  //* logout when auth token expire
  handleLogoutFromDevice = async () => {
    const userInfo = await getData(KEYS.USER_DATA);
    const {email} = userInfo;
    try {
      const params = {
        email,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/logOut',
        params,
      );
      if (response && response.success) {
        const {message} = response;

        clearData();
        this.props.resetLoggedInUser();
        this.props.resetBalance();
        this.props.logout();
        await this.props.navigation.navigate('Homes');
      } else {
        console.warn('logout not possible at this time');
      }
    } catch (e) {
      console.warn('error in logout', e);
    }
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  openNewPop = async () => {
    this.setState({showAllSetPopup: true});
  };

  handleAllSet = () => {
    // this.props.nav.navigate('AllSetPopup');
  };

  closeOldPop = () => {
    this.props.closePopup();
  };

  quitPopup = () => {
    this.setState({showAllSetPopup: false});
  };

  render() {
    if (this.state.isLoading) {
      return <ProcessingLoader />;
    }
    const {enableButton, isChatEnable, userInfo, Balance, currency} =
      this.state;
    const walletBalance = Balance;
    const {name} = userInfo;
    const {
      discountChatCharges,
      actualChatCharges,
      actualDollarChatCharges,
      discountDollarChatCharges,
    } = this.props;
    var charges = 0,
      callTime = 0;
    if (currency === 'Rupee') {
      if (discountChatCharges != null) {
        charges = discountChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      } else {
        charges = actualChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      }
    } else {
      if (discountDollarChatCharges != null) {
        charges = discountDollarChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      } else {
        charges = actualDollarChatCharges.split('/')[0];
        callTime = walletBalance / charges;
      }
    }
    const guestName = this.props.guestName;
    const guestImg = this.props.guestImg;
    return (
      <SafeAreaView
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        {enableButton === true ? (
          <View style={styles.startCallContainer}>
            <View style={styles.listContainerMain00}>
              <Text style={{fontWeight: '700', marginBottom: wp(3)}}>
                User: {name}
              </Text>
              <View style={styles.listContainer2}>
                <FontAwesome5
                  name="wallet"
                  color="#9cdaff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                {currency === 'Rupee' ? (
                  <Text>₹ {walletBalance}</Text>
                ) : (
                  <Text>$ {walletBalance}</Text>
                )}
              </View>
              <View style={styles.listContainer2}>
                <Ionicons
                  name="time"
                  color="#9cdaff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Max Time EST</Text>
                <Text>{callTime.toFixed(2)} Min.</Text>
              </View>
            </View>

            {/* <Touchable
              style={styles.popupButton}
              onPress={this.startChat.bind(this)}>
              <Ionicons
                name="ios-call"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              
              <Text style={styles.popupButtonText}>Start Call</Text>
            </Touchable> */}

            <Touchable
              style={styles.popupButton}
              onPress={this.startChat.bind(this)}>
              {/* <Image
                source={ic_video_white}
                resizeMode="cover"
                style={styles.chatIcon}
              /> */}
              <Ionicons
                name="videocam"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />

              <Text style={styles.popupButtonText}>Start Video Call</Text>
            </Touchable>
          </View>
        ) : (
          <ImageBackground source={voiceCallBg} style={styles.popupContainer}>
            <Text style={{fontWeight: '700', marginTop: wp(5)}}>
              User: {name}
            </Text>
            <View style={styles.listContainerMain}>
              <View style={styles.listContainer2}>
                <FontAwesome5
                  name="wallet"
                  color="#ff648a"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                {currency === 'Rupee' ? (
                  <Text>₹ {walletBalance}</Text>
                ) : (
                  <Text>$ {walletBalance}</Text>
                )}
              </View>
              <View style={styles.listContainer2}>
                <Ionicons
                  name="time"
                  color="#ff648a"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Max Time EST</Text>
                <Text>{callTime.toFixed(2)} Min.</Text>
              </View>
            </View>
            <View style={styles.dataContainer}>
              <View style={styles.expertImageContainer}>
                <View style={styles.border2}>
                  <View style={styles.border3}>
                    <View style={styles.border4}>
                      <Image
                        source={{uri: guestImg}}
                        style={styles.userImage}
                      />
                    </View>
                  </View>
                </View>

                <Text
                  style={{
                    fontWeight: '700',
                    marginTop: wp(5),
                    fontSize: wp(4.5),
                    textAlign: 'center',
                  }}>
                  {guestName}
                </Text>
              </View>
            </View>
            {isChatEnable ? (
              enableButton ? (
                <Touchable
                  style={styles.popupButton}
                  onPress={this.startChat.bind(this)}>
                  <Image
                    source={ic_video_white}
                    resizeMode="cover"
                    style={styles.chatIcon}
                  />
                </Touchable>
              ) : (
                <View style={styles.popupButton2}>
                  <Image
                    source={ic_video_white}
                    resizeMode="cover"
                    style={styles.chatIcon}
                  />
                </View>
              )
            ) : (
              <View style={styles.popupButton2}>
                <Image
                  source={ic_video_white}
                  resizeMode="cover"
                  style={styles.chatIcon}
                />
              </View>
            )}
          </ImageBackground>
        )}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isVcRequest: vcSelectors.isVcRequest(state),
  // isSaveVcData: vcSelectors.isSaveVcData(state),
  availableBalance: availableBalanceSelectors.getAvailableBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isProfile: profileSelectors.isProfile(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});
const mapDispatchToProps = {
  vcRequest: vcOperations.vcRequest,
  // saveVCData: vcOperations.saveVCData,
  getWalletBalance: transactionOperations.getWalletBalance,
  profile: profileOperations.profile,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoCallBalancePopup);
