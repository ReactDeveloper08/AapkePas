import React, {PureComponent} from 'react';
import {Alert, View, Text, TouchableOpacity} from 'react-native';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProcessingLoader from 'pages/components/ProcessingLoader';

import styles from './styles';
//redux
import {connect} from 'react-redux';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from 'reduxPranam/ducks/availableBalance';
import {
  userInfoSelectors,
  userInfoOperations,
} from 'reduxPranam/ducks/userInfo';
import {profileOperations, profileSelectors} from 'reduxPranam/ducks/profile';
import {
  transactionOperations,
  transactionSelectors,
} from 'reduxPranam/ducks/transaction';
import {sessionOperations} from 'reduxPranam/ducks/session';
import {clearAsyncStorage} from 'pages/screens/Chat/src/asyncStorage';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import {showToast} from 'pages/components/CustomToast';

import {
  isChatEnd,
  isAcceptChat,
  isExtendChat,
} from 'pages/screens/Chat/src/network';
import firebase from 'pages/screens/Chat/src/firebase/config';
import {nsNavigate} from 'routes/NavigationService';

class ChatBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      enableButton: true,
      isChatEnable: false,
      Balance: 0,
    };
    this.parentView = null;
  }
  componentDidMount() {
    this.handleAccept();
    this.walletInfo();
  }

  //* wallet Info
  walletInfo = async () => {
    try {
      await this.props.getWalletBalance();

      if (this.props.isWalletBalance !== 0) {
        this.setState({
          Balance: this.props.isWalletBalance,
        });
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  handleAccept = async () => {
    const isChatEnable = await getData(KEYS.FIREBASE_AUTH);
    if (isChatEnable === true) {
      this.setState({isChatEnable});
    } else {
      this.setState({isChatEnable: false});
    }
  };

  //* chat is requested and start
  startChat = async () => {
    this.setState({enableButton: false, isLoading: true});
    const id = this.props.id;
    const guestUserId = this.props.guestUserId;
    const guestName = this.props.guestName;
    const guestImg = this.props.guestImg;
    const {userInfo} = this.props;
    const {mobile, deviceId} = userInfo;
    const currentUserId = mobile;
    const walletBalance = this.props.availableBalance;
    const {discountChatCharges, actualChatCharges} = this.props;
    var charges = 0,
      callTime = 0;
    const accept = 1;
    const extend = 0;
    let endNow = 0;
    var timeChat = 0;
    await isAcceptChat(accept, guestUserId, currentUserId)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
    await isExtendChat(extend, guestUserId, currentUserId);
    await isChatEnd(endNow, currentUserId, guestUserId)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
    if (discountChatCharges != null) {
      charges = discountChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    }
    // console.log('Call Time', callTime);
    if (callTime > 30) {
      // console.log('time chat is in 30 min');
      timeChat = 30;
    } else if (callTime < 30) {
      // console.log('time chat is in 3 min');
      if (callTime >= 0 && callTime < 3) {
        Alert.alert(
          'Aapke Pass!',
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
    const response = await makeRequest(
      BASE_URL + 'api/Customer/chatRequestNew',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/chatRequestNew');
    if (response) {
      const {success, isLogOut, message} = response;
      if (isLogOut !== true) {
        if (success) {
          this.setState({isLoading: false});
          // console.log('response', response);
          // console.log('the Chat Request Response ', response);
          this.props.nav.navigate('AllSetChatPopup', {guestImg});
          firebase
            .database()
            .ref('acceptChat')
            .child(guestUserId)
            .child(currentUserId)
            .on('value', data => {
              const valueData = data.val().acceptChat;
              // console.log('the aastorloger is ', valueData);
              if (valueData === 0 && valueData !== 1) {
                if (guestImg) {
                  const now = new Date();
                  this.props.nav.push('Chat', {
                    name: guestName,
                    imgText: guestName.charAt(0),
                    guestUserId,
                    currentUserId,
                    now: now,
                    timeChat,
                    response,
                  });
                } else {
                  const now = new Date();
                  this.props.nav.push('Chat', {
                    name: guestName,
                    img: guestImg,
                    guestUserId,
                    currentUserId,
                    now: now,
                    timeChat,
                    response,
                  });
                }
              }
            });
        } else {
          this.setState({isLoading: false, enableButton: false});
          const {isAuthTokenExpired} = response;
          this.closeOldPop();
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Aapke Pass',
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
          showToast(message);
          // this.setState({message});
        }
      } else {
        this.setState({isLoading: false, enableButton: false});
        Alert.alert(
          'Aapke Pass',
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
    // this.props.nav.navigate('StartChat');
  };

  handleTokenExpire = async () => {
    await clearAsyncStorage();
    nsNavigate('Login');
  };

  handleLogoutFromDevice = async () => {
    const userInfo = await getData(KEYS.USER_DATA);
    const {mobile} = userInfo;
    const m_No = parseInt(mobile, 10);
    // console.log(userInfo, m_No);
    try {
      const params = {
        mobile: m_No,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/logOut',
        params,
      );
      //Alert.alert('', BASE_URL + 'api/Customer/logOut');
      if (response && response.success) {
        const {message} = response;
        // console.log(message);
        clearData();
        this.props.resetLoggedInUser();
        this.props.resetBalance();
        this.props.logout();
        await this.props.navigation.navigate('Home');
      } else {
        console.log('logout not possible at this time');
      }
    } catch (e) {
      console.log('error in logout', e);
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

    const {enableButton, isChatEnable} = this.state;
    const {image} = this.props;

    if (image != null) {
      var obj = image.map(key => ({url: key.image}));
    }
    const walletBalance = this.state.Balance;
    const {userInfo} = this.props;
    const {mobile} = userInfo;
    const {discountChatCharges, actualChatCharges} = this.props;
    // console.log('charges for call ', discountChatCharges, actualChatCharges);
    var charges = 0,
      callTime = 0;
    if (discountChatCharges != null) {
      charges = discountChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualChatCharges.split('/')[0];
      callTime = walletBalance / charges;
    }

    // console.log('the mod data', callTime, 'wallet', walletBalance, userInfo);

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={{fontWeight: '700', marginTop: wp(5)}}>
            Contact No. {mobile}
          </Text>
          <View style={styles.listContainerMain}>
            <View style={styles.listContainer}>
              <FontAwesome5
                name="wallet"
                color="#fd6c33"
                size={18}
                style={styles.iconRow}
              />
              <Text style={{flex: 1}}>Wallet Balance</Text>
              <Text>₹ {walletBalance}</Text>
            </View>
            <View style={styles.listContainer}>
              <Ionicons
                name="time"
                color="#fd6c33"
                size={18}
                style={styles.iconRow}
              />
              <Text style={{flex: 1}}>Max Time EST</Text>
              <Text>{callTime.toFixed(2)} Min.</Text>
            </View>
          </View>
          {isChatEnable ? (
            enableButton ? (
              <TouchableOpacity
                style={styles.popupButton}
                onPress={this.startChat}>
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  color="#fffdc5"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={styles.popupButtonText}>Start Chat</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.popupButton2}>
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  color="#fffdc5"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={styles.popupButtonText}>
                  Chat Request in Process Please Wait...
                </Text>
              </View>
            )
          ) : (
            <View style={styles.popupButton2}>
              <MaterialCommunityIcons
                name="chat-processing-outline"
                color="#fffdc5"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Wait for Chat Button</Text>
            </View>
          )}
        </View>
        {/* {this.state.showAllSetPopup && (
          <AllSetPopup
            quitPopup={this.quitPopup}
            nav={this.props.navigation}
            image={image}
          />
        )} */}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  availableBalance: availableBalanceSelectors.getAvailableBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isProfile: profileSelectors.isProfile(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});
const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  profile: profileOperations.profile,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatBalancePopup);
