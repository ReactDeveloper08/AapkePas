import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProcessingLoader from 'components/ProcessingLoader';

import CountDown from 'react-native-countdown-component';
//Icons
import ic_processing from 'assets/images/ic_processing.gif';

import basicStyles from 'styles/BasicStyles';
import styles from './styles';
//redux
import {connect} from 'react-redux';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from '../../Redux/wiseword/availableBalance';
import {ChatOperations, ChatSelectors} from '../../Redux/wiseword/chat';
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
import {sessionOperations} from '../../Redux/wiseword/session';
import {
  declineOperations,
  declineSelectors,
} from '../../Redux/wiseword/declineService';
import {clearAsyncStorage} from '../../Chat_WiseWord/src/asyncStorage';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import showToast from 'components/CustomToast';
import clear from 'react-native-clear-cache-lcm';
import {
  ChatOperation,
  isChatEnd,
  isAcceptChat,
} from '../../Chat_WiseWord/src/network';
import {
  removeChatOperation,
  removeEndChat,
  endTyping,
} from 'ChatDoctor/src/network/messeges';
import database from '@react-native-firebase/database';
import {nsNavigate} from 'routes/NavigationService';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';

const Touchable = withPreventDoubleClick(TouchableOpacity);
class ChatBalancePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      enableButton: true,
      isChatEnable: true,
      Balance: 0,
      userInfo: '',
      currency: '',
      acceptChat: false,
      declineChat: false,
      response: '',
    };
    clear.runClearCache(() => {
      console.log('data clear');
    });
    this.parentView = null;
    this.handleAccept = this.handleAccept.bind(this);
    this.walletInfo = this.walletInfo.bind(this);
    database().setPersistenceEnabled(true);
    // this.handleDeclineChatByCons = this.handleDeclineChatByCons.bind(this);
  }
  componentDidMount() {
    this.handleAccept();
    this.walletInfo();
    this.handleDeclineChatByCons();
    this.handleInternetCheck();
  }
  async componentDidUpdate(prevProps) {
    await NetInfo.fetch().then(async state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);

      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      // since I can connect from multiple devices or browser tabs, we store each connection instance separately
      // any time that connectionsRef's value is null (i.e. has no children) I am offline

      // stores the timestamp of my last disconnect (the last time I was seen online)
      var lastOnlineRef = database().ref(`connection/${guestUserId}/${userId}`);

      var connectedRef = database().ref('.info/connected');
      connectedRef.on('value', function (snap) {
        if (snap.val() === true) {
          // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
          var con = lastOnlineRef;

          // When I disconnect, remove this device
          con.onDisconnect().remove();
          // Add this device to my connections list
          // this value could contain info about the device or a timestamp too
          con.set(state.isConnected);

          // When I disconnect, update the last time I was seen online
          lastOnlineRef.onDisconnect().set(state.isConnected);
        }
      });
    });
  }
  componentWillUnmount() {}
  //* wallet Info
  walletInfo = async () => {
    try {
      await this.props.getWalletBalance();
      const userInfo = await getData(KEYS.USER_INFO);
      if (this.props.isWalletBalance !== 0) {
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

  //* Internet Connectivity
  handleInternetCheck = async () => {
    try {
    } catch (error) {
      console.log('error while checking the internet connectivity code', error);
    }
  };

  //* chat is requested and start
  startChat = async () => {
    this.setState({enableButton: false, isLoading: true});
    const id = this.props.id;
    var guestUserId = this.props.guestUserId;
    const guestName = this.props.guestName;
    const guestImg = this.props.guestImg;
    const userInfo = await getData(KEYS.USER_INFO);
    const {userId, deviceId} = userInfo;
    var currentUserId = userId;
    const walletBalance = this.props.availableBalance;
    const {discountChatCharges, actualChatCharges} = this.props;
    var charges = 0,
      callTime = 0;
    const accept = 1;
    let endNow = 0;
    var timeChat = 0;
    const extend = 0;
    let endMessage = '';
    ChatOperation(
      endMessage,
      extend,
      accept,
      endNow,
      guestUserId,
      currentUserId,
    );
    isAcceptChat(accept, guestUserId, currentUserId);
    isChatEnd(endNow, guestUserId, currentUserId);
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
    await this.props.chatRequest(params);
    const response = this.props.isChatRequest;
    if (response) {
      console.log('response', response);
      const {success, isLogOut, message} = response;
      if (isLogOut !== true) {
        if (success) {
          this.setState({isLoading: false, response});
          let chatOperationMsg = [];
          let newChatOperation = null;

          let key_new = true;
          if (key_new === true) {
            let acceptRef = database().ref('acceptChat');
            acceptRef
              .on('value', async dataSnapShot => {
                let consultantData = dataSnapShot.exists();
                if (consultantData && key_new === true) {
                  let acceptChatExist = dataSnapShot
                    .child(`${guestUserId}` + '/' + `${currentUserId}`)
                    .exists();
                  if (acceptChatExist && key_new === true) {
                    // let enddata = dataSnapShot.val().endChat;
                    let acceptChat = dataSnapShot
                      .child(`${guestUserId}` + '/' + `${currentUserId}`)
                      .val().acceptChat;

                    if (
                      key_new === true &&
                      acceptChat === 0 &&
                      acceptChat !== 1 &&
                      this.state.declineChat !== true
                    ) {
                      key_new = false;
                      this.setState({
                        acceptChat: true,
                        isLoading: false,
                        enableButton: false,
                      });
                      if (guestImg) {
                        const now = new Date();
                        const params = {
                          name: guestName,
                          imgText: guestName.charAt(0),
                          guestUserId,
                          currentUserId,
                          now: now,
                          timeChat,
                          response,
                        };
                        this.props.nav.navigate('Chat', {params});
                        acceptRef.off();
                      } else {
                        const now = new Date();
                        const params = {
                          name: guestName,
                          imgText: guestName.charAt(0),
                          guestUserId,
                          currentUserId,
                          now: now,
                          timeChat,
                          response,
                        };
                        this.props.nav.navigate('Chat', {params});
                        acceptRef.off();
                      }
                    }
                  }
                }
              })
              .bind(this);
          }
        } else {
          this.setState({isLoading: false, enableButton: false});
          const {isAuthTokenExpired} = response;
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
          showToast(message);
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
    // this.props.nav.navigate('StartChat');
  };

  handleDeclineChatByCons = async () => {
    try {
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId, deviceId} = userInfo;
      var currentUserId = userId;
      let key_new = true;
      if (key_new === true) {
        database()
          .ref('endChat/')
          .on('value', async dataSnapShot => {
            let consultantData = dataSnapShot.exists();
            if (consultantData && key_new === true) {
              let end_data = dataSnapShot
                .child(`${guestUserId}` + '/' + `${currentUserId}`)
                .exists();
              if (end_data && key_new === true) {
                // let enddata = dataSnapShot.val().endChat;
                let enddata = dataSnapShot
                  .child(`${guestUserId}` + '/' + `${currentUserId}`)
                  .val().endChat;

                if (
                  key_new === true &&
                  enddata === 2 &&
                  enddata !== 1 &&
                  this.state.declineChat !== true
                ) {
                  key_new = false;
                  this.setState({declineChat: true});
                  let endNow = 0;
                  await isChatEnd(endNow, guestUserId, currentUserId);
                  this.closeOldPop();
                  Alert.alert(
                    'Aapke Pass!!',
                    'Consultant decline your chat',
                    [
                      {
                        text: 'Ok',
                      },
                    ],
                    {
                      cancelable: false,
                    },
                  );
                  // this.resetData();
                }
              }
            }
          })
          .bind(this);
      }
    } catch (error) {
      console.log('decline chat has an a issue', error);
    }
  };

  resetData = async () => {
    try {
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      let endNow = 0;
      await isChatEnd(endNow, guestUserId, currentUserId);
      this.closeOldPop();
    } catch (error) {
      console.log('error while reset', error);
    }
  };

  handleDeclineChat = async () => {
    try {
      var guestUserId = this.props.guestUserId;
      const userInfo = await getData(KEYS.USER_INFO);
      const {userId} = userInfo;
      var currentUserId = userId;
      let endNow = 1;
      if (this.state.response !== '') {
        console.log('chat request response', this.state.response);
        const {consultationId} = this.state.response;
        const params = {
          consultationId,
        };
        await this.props.declineService(params).then(() => {
          isChatEnd(endNow, guestUserId, currentUserId);
          this.setState({declineChat: true});
          this.closeOldPop();
          removeChatOperation(guestUserId, currentUserId);
          removeEndChat(guestUserId, currentUserId);
          endTyping(guestUserId, currentUserId);
        });
      }
    } catch (error) {
      console.log('decline chat has an a issue', error);
    }
  };

  handleTokenExpire = async () => {
    await clearAsyncStorage();
    nsNavigate('Login');
  };

  handleLogoutFromDevice = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
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
        await this.props.navigation.pop();
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
                  size={22}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                {currency === 'Rupee' ? (
                  <Text style={basicStyles.heading}>₹ {walletBalance}</Text>
                ) : (
                  <Text style={basicStyles.heading}>$ {walletBalance}</Text>
                )}
              </View>
              <View style={styles.listContainer2}>
                <Ionicons
                  name="time"
                  color="#9cdaff"
                  size={22}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Max Time EST</Text>
                <Text style={basicStyles.heading}>
                  {callTime.toFixed(2)} Min.
                </Text>
              </View>
            </View>

            <Touchable style={styles.popupButton} onPress={this.startChat}>
              <MaterialCommunityIcons
                name="chat-processing-outline"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />

              <Text style={styles.popupButtonText}>Start Chat</Text>
            </Touchable>
          </View>
        ) : (
          <View style={styles.startCallContainer}>
            <View style={styles.listContainerMain00}>
              <Text style={{fontWeight: '700', marginBottom: wp(3)}}>
                User: {name}
              </Text>

              <View style={styles.listContainer2}>
                <FontAwesome5
                  name="wallet"
                  color="#9cdaff"
                  size={22}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                {currency === 'Rupee' ? (
                  <Text style={basicStyles.heading}>₹ {walletBalance}</Text>
                ) : (
                  <Text style={basicStyles.heading}>$ {walletBalance}</Text>
                )}
              </View>
              <View style={styles.listContainer2}>
                <Ionicons
                  name="time"
                  color="#9cdaff"
                  size={22}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Max Time EST</Text>
                <Text style={basicStyles.heading}>
                  {callTime.toFixed(2)} Min.
                </Text>
              </View>
            </View>

            <Image
              source={ic_processing}
              resizeMode="cover"
              style={styles.processingLoader}
            />
            {this.state.acceptChat === false ? (
              <CountDown
                until={20}
                onFinish={() => this.handleDeclineChat(this)}
                onPress={() => alert('hello')}
                size={10}
              />
            ) : null}

            <Touchable
              style={styles.popupButton}
              onPress={this.handleDeclineChat.bind(this)}>
              {/* <View style={styles.popupButton2}> */}
              {/* <Image
                  source={ic_close_white}
                  resizeMode="cover"
                  style={styles.chatIcon}
                /> */}
              <Text style={styles.popupButtonText}>End Chat</Text>
              {/* </View> */}
            </Touchable>
          </View>
        )}
        {this.state.isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  availableBalance: availableBalanceSelectors.getAvailableBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isProfile: profileSelectors.isProfile(state),
  userInfo: userInfoSelectors.getUserInfo(state),
  isChatRequest: ChatSelectors.isChatRequest(state),
  isChatDataSave: ChatSelectors.isChatDataSave(state),
  isDeclineDone: declineSelectors.isDeclineDone(state),
});
const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  profile: profileOperations.profile,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
  chatRequest: ChatOperations.chatRequest,
  saveChatData: ChatOperations.saveChatData,
  declineService: declineOperations.declineService,
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatBalancePopup);
