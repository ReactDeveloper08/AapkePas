import React, {Component} from 'react';
import {
  View,
  Alert,
  Text,
  Linking,
  AppState,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import tile_call from 'assets/icons/tile_call.png';
import call_receiving from 'assets/icons/call_receiving.png';
import call_repeat from 'assets/icons/call_repeat.png';
import ratingsStar from 'assets/icons/ratings.png';

// Styles
import basicStyles from 'styles/BasicStyles';

// Images
import astrologerImage from 'assets/images/ic_breathing.png';

// Icons
import officials from 'assets/images/officials.gif';

import posts from 'assets/icons/post.png';
import my_posts from 'assets/icons/mypost.png';
import networking from 'assets/icons/networking.png';

// Delegates
import {
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from 'firebase_api/FirebaseAPI';

//components
import ProcessingLoader from 'components/ProcessingLoader';
import {showToast} from 'components/CustomToast';
//api
// import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, clearData, getData} from 'api/UserPreference';
import VersionInfo from 'react-native-version-info';

//Redux
import {connect} from 'react-redux';
import {docHomeOperations, docHomeSelectors} from 'Redux/wiseword/docHome';

// Vector Icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import HomeInfoTIle from 'components/HomeInfoTIle';
import HomeCharUserComponent from 'components/HomeCharUserComponent';
// import CategoryComponent from 'components/CategoryComponent';

// tabs
import ServiceOrder from 'components/ServiceOrder';
import LiveOrder from 'components/LiveOrder';

// Popup
import ScheduleOnlineTimePopup from 'popup/ScheduleOnlineTimePopup';

//permission's for live
import requestCameraAndAudioPermission from 'LiveBroadCaster/DocLivecomponents/Permission';
// notification listener
// import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import CheckChat from 'firebase_api/CheckChatMiss';
import {withNavigation} from 'react-navigation';
// References
export let homeScreenFetchNotificationCount = null;
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.onPressAlertPositiveButton =
      this.onPressAlertPositiveButton.bind(this);
    this.onPressAlertNegativeButton =
      this.onPressAlertNegativeButton.bind(this);
    this.state = {
      appState: AppState.currentState,
      tabActive: 'Service',
      offlineStatus: false,
      videoStatus: false,
      callOfflineStatus: false,
      homeInfo: '',
      notification: '',
      missed_record: '',
      isLoading: false,
      isListRefreshing: false,
      pendingChats: [],
      isProcessing: false,
      appLink: 'https://pranamguruji.com/',
      useInfo: '',
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        // console.log('requested!');
      });
    }
    this.showHomeData = this.showHomeData.bind(this);
    // this.notificationListenerService();
    // navigating to Notification screen
    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      // this.props.navigation.navigate('CallConfirm');
      return;
    }
    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
    // uploadToken();
    DeviceEventEmitter.addListener('ON_HOME_BUTTON_PRESSED', event => {
      console.log('You tapped the home button!', event);
    });
    this._unsubscribeSiFocus = props.navigation.addListener('focus', e => {
      console.log(props.route.params);
    });
    this._unsubscribeSiBlur = props.navigation.addListener('blur', e => {
      AppState.addEventListener('change', this.handleAppStateChange);
      // uploadToken();
      DeviceEventEmitter.addListener('ON_HOME_BUTTON_PRESSED', event => {
        console.log('You tapped the home button!', event);
      });
    });
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.showHomeData();
      //Put your Data loading function here instead of my this.LoadData()
    });
  }

  componentWillUnmount() {
    this._subscribe.remove();
    this._unsubscribeSiFocus();
    this._unsubscribeSiBlur();
    clearTimeout(this.intervalID);
    setInterval(this.getNameForAccount, 5000);
    // Removing firebase listeners
    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
    DeviceEventEmitter.removeAllListeners();
  }

  onPressAlertPositiveButton = () => {
    alert('Positive Button Clicked');
  };

  onPressAlertNegativeButton = () => {
    alert('Negative Button Clicked');
  };
  // * notification Listener Service
  // notificationListenerService = async () => {
  //   const status = await RNAndroidNotificationListener.getPermissionStatus();
  //   // console.log(status);
  //   if (status === 'denied') {
  //     await RNAndroidNotificationListener.requestPermission();
  //   } else if (status === 'unknown') {
  //     await RNAndroidNotificationListener.requestPermission();
  //   }
  // };

  handleAppStateChange = async nextAppState => {
    try {
      this.setState({isListRefreshing: false});
    } catch (error) {
      console.log(error.message);
    }
  };
  //*HomeData
  showHomeData = async () => {
    this.setState({isLoading: true});
    const useInfo = await getData(KEYS.USER_INFO);

    const params = null;
    await this.props.getDocHome(params);
    if (this.props.isGetHome) {
      const {success, message, isAuthTokenExpired} = this.props.isGetHome;
      if (success) {
        const {homeInfo, notification, missed_record} = this.props.isGetHome;
        const {appVersion, appLink} = homeInfo;
        this.setState({appLink});
        this.setState({
          homeInfo,
          useInfo,
          notification,
          missed_record,
          isLoading: false,
          isListRefreshing: false,
        });
      } else {
        this.setState({message, isListRefreshing: false, isLoading: false});
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
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
  };
  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };
  //* AppVersioning
  goToPlayStore = async () => {
    const {appLink} = this.state;
    try {
      const supported = await Linking.canOpenURL(appLink);
      if (supported) {
        Linking.openURL(appLink);
      } else {
        console.log('Unable to handle this url');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  chatItem = ({item}) => (
    <HomeCharUserComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{width: wp(2)}} />;

  handleVideoOffLine = async () => {
    const {videoCallStatus} = this.state.homeInfo;
    let {videoStatus} = this.state;
    if (videoCallStatus === true) {
      videoStatus = false;
      this.setState({videoStatus});
    } else {
      videoStatus = true;
      this.setState({videoStatus});
    }
    const params = {
      serviceType: 'videocall',
      status: videoStatus,
    };
    await this.props.getOnline(params);
    const getOffline = this.props.isGetOnline;
    if (getOffline) {
      const {success, message, isAuthTokenExpired} = getOffline;
      if (success) {
        this.setState({isLoading: false});
        this.showHomeData();
        showToast(message);
      } else {
        this.setState({isLoading: false});
        showToast(message);
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
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
  };
  handleOnOffLine = async () => {
    const {chatOnlineStatus} = this.state.homeInfo;
    let {offlineStatus} = this.state;
    if (chatOnlineStatus === true) {
      offlineStatus = false;
      this.setState({offlineStatus});
    } else {
      offlineStatus = true;
      this.setState({offlineStatus});
    }
    const params = {
      serviceType: 'chat',
      status: offlineStatus,
    };
    await this.props.getOnline(params);
    const getOffline = this.props.isGetOnline;
    if (getOffline) {
      const {success, message, isAuthTokenExpired} = getOffline;
      if (success) {
        this.setState({isLoading: false});
        this.showHomeData();
        showToast(message);
      } else {
        this.setState({isLoading: false});
        showToast(message);
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
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
  };

  handleCallOnOffLine = async () => {
    const {callOnlineStatus} = this.state.homeInfo;
    let {callOfflineStatus} = this.state;
    if (callOnlineStatus === true) {
      callOfflineStatus = false;
      this.setState({callOfflineStatus});
    } else {
      callOfflineStatus = true;
      this.setState({callOfflineStatus});
    }
    const params = {
      serviceType: 'call',
      status: callOfflineStatus,
    };
    await this.props.getOnline(params);
    const getCallOffline = this.props.isGetOnline;

    if (getCallOffline) {
      const {success, message, isAuthTokenExpired} = getCallOffline;
      if (success) {
        this.setState({isLoading: false});
        this.showHomeData();
        showToast(message);
      } else {
        this.setState({isLoading: false});
        showToast(message);
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
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
  };

  handleMoreInfo = () => {
    this.setState({showWalletPopup: true});
  };

  closePopup = () => {
    this.setState({showWalletPopup: false});
  };

  handleSetting = () => {
    this.props.navigation.navigate('Setting');
  };
  handleGoToday = () => {};
  handleToday = () => {};
  handleTotal = () => {
    this.props.navigation.navigate('TotalPayment');
  };
  handleFollowers = () => {
    this.props.navigation.navigate('Following');
  };
  handleWritePost = () => {
    this.props.navigation.navigate('writePost');
  };
  handleMyPost = () => {
    this.props.navigation.navigate('MyPosts');
  };
  handleMoments = () => {
    this.props.navigation.navigate('MyMoments');
  };
  handleNetwork = () => {
    this.props.navigation.navigate('StatusCheck');
  };
  handleOfficial = () => {
    this.props.navigation.navigate('PranamGurujiOfficial');
  };
  handleOutlook = () => {
    this.props.navigation.navigate('OperationLogbook');
  };
  handleProfile = () => {
    this.props.navigation.navigate('AstrologerProfile');
  };

  handleVideo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    var {name} = userInfo;
    var payloadId = name;

    this.props.navigation.navigate('GoLive', {payloadId});
  };
  handleAllChat = () => {
    this.props.navigation.navigate('StartChat');
  };
  handleReplyChat = () => {
    // this.props.navigation.navigate('ChatList');
    this.props.navigation.navigate('StartChat');
  };
  //* Go_Live
  handleGoLive = async () => {
    // const userInfo = await getData(KEYS.USER_INFO);
    // var {name} = userInfo;
    // var payloadId = name;
    try {
      const {homeInfo} = this.state;
      const {astrologerId} = homeInfo;
      const params = {live: 'Y'};
      await this.props.GoLive(params);
      const response = this.props.isGoLive;
      if (response) {
        const {success, message} = response;
        if (success) {
          const {channelDetal} = response;

          this.props.navigation.navigate('GoLive', {
            channelDetal,
            astrologerId,
          });
        } else {
          Alert.alert('', `${message}`);
        }
      }
    } catch (e) {}
  };

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Service') {
      return (
        <ServiceOrder
          nav={this.props.navigation}
          missed={this.state.missed_record}
        />
      );
    } else if (tabActive === 'Live') {
      return <LiveOrder nav={this.props.navigation} />;
    }
  };

  handleAllService = () => {
    this.setState({tabActive: 'Service'});
  };
  handleLive = () => {
    this.setState({tabActive: 'Live'});
  };

  handleLogout = async () => {
    await clearData();
    // await uploadToken();
    this.props.navigation.navigate('Login');
  };
  handleInfo = moreInfo => () => {
    this.setState(prevState => ({[moreInfo]: !prevState[moreInfo]}));
  };

  handleListRefresh = () => {
    try {
      // pull-to-refresh

      this.setState({isListRefreshing: true});
      // updating list
      this.showHomeData();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleChat = () => {
    const {
      userbirthPlace,
      clientName,
      userImage,
      userId,
      userDob,
      userbirthTime,
      consultationId,
      userMobile,
    } = this.state.notification;
    const notification = {
      _data: {
        birthPlace: userbirthPlace,
        clientName,
        userImage,
        userId,
        DOB: userDob,
        birthTime: userbirthTime,
        consultationId,
        clientMobile: userMobile,
      },
    };
    this.props.navigation.navigate('CallConfirm', {notification});
  };

  renderHeader(homeInfo) {
    if (homeInfo.profileImage) {
      var profileImg = {
        uri: homeInfo.profileImage,
        headers: {Authorization: 'someAuthToken'},
        priority: FastImage.priority.normal,
      };
    } else {
      var profileImg = astrologerImage;
    }
    return (
      <View style={styles.screenHeader}>
        <View style={styles.headerBarContainer}>
          <View style={styles.imgVer}>
            <FastImage
              style={styles.astroImg}
              source={profileImg}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text
              style={[
                // basicStyles.versionHeading,
                basicStyles.whiteColor,
                styles.offer,
              ]}
              onPress={this.handleCallAlert}>
              V.{VersionInfo.appVersion}
            </Text>
          </View>

          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            {/* {isPending === true ? (
                  <Touchable
                    onPress={this.handleChat}
                    underlayColor="transparent">
                    <Image
                      source={notificationBell}
                      style={[styles.notificationBell]}
                    />
                  </Touchable>
                ) : null} */}

            <Touchable
              onPress={this.handleInfo('moreInfo').bind(this)}
              underlayColor="transparent">
              <MaterialCommunityIcons
                name="eye-outline"
                color="#fff"
                size={26}
                style={basicStyles.marginHorizontal}
              />
            </Touchable>

            <Touchable
              onPress={this.handleSetting.bind(this)}
              underlayColor="transparent">
              <FontAwesome name="user" color="#fff" size={22} />
            </Touchable>

            <Touchable
              onPress={this.handleMoreInfo.bind(this)}
              underlayColor="transparent">
              <Entypo
                name="dots-three-vertical"
                color="#fff"
                size={22}
                style={basicStyles.marginLeft}
              />
            </Touchable>
          </View>
        </View>

        {/* <View style={styles.corner} />
            <View style={styles.cornerColor} /> */}
      </View>
    );
  }

  renderButton(homeInfo) {
    const {chatOnlineStatus, callOnlineStatus, videoCallStatus} = homeInfo;
    var currency = 'Rupee';
    var symbol = '₹';
    var {currency} = this.state.useInfo;
    currency === 'Rupee' ? (symbol = '₹') : (symbol = '$');
    return (
      <>
        <View style={styles.astroStatus}>
          {chatOnlineStatus === true ? (
            <Touchable
              onPress={this.handleOnOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.chatTabLive,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  color="#fff"
                  size={25}
                  style={styles.iconRow}
                />
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Online
                </Text>
              </View>
            </Touchable>
          ) : (
            <Touchable
              onPress={this.handleOnOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.chatTab,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  color="#333"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={basicStyles.text}>Offline</Text>
                {/* <Entypo
                      name="dot-single"
                      color="#999"
                      size={36}
                      style={styles.deActive}
                    /> */}
              </View>
            </Touchable>
          )}
          {videoCallStatus === true ? (
            <Touchable
              onPress={this.handleVideoOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.chatTabLive,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <MaterialCommunityIcons
                  name="video-outline"
                  color="#fff"
                  size={25}
                  style={styles.iconRow}
                />
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Online
                </Text>
              </View>
            </Touchable>
          ) : (
            <Touchable
              onPress={this.handleVideoOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.chatTab,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <MaterialCommunityIcons
                  name="video-outline"
                  color="#333"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={basicStyles.text}>Offline</Text>
                {/* <Entypo
                      name="dot-single"
                      color="#999"
                      size={36}
                      style={styles.deActive}
                    /> */}
              </View>
            </Touchable>
          )}

          {callOnlineStatus === true ? (
            <Touchable
              onPress={this.handleCallOnOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.chatTabLive,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <Feather
                  name="phone-call"
                  color="#fff"
                  size={15}
                  style={styles.iconRow}
                />
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Online
                </Text>
              </View>
            </Touchable>
          ) : (
            <Touchable
              onPress={this.handleCallOnOffLine.bind(this)}
              underlayColor="#f2f1f1"
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                styles.callTab,
              ]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.alignCenter,
                  styles.buttonInner,
                ]}>
                <Feather
                  name="phone-call"
                  color="#333"
                  size={15}
                  style={styles.iconRow}
                />
                <Text style={basicStyles.text}>Offline</Text>
                {/* <Entypo
                      name="dot-single"
                      color="#999"
                      size={36}
                      style={styles.deActive}
                    /> */}
              </View>
            </Touchable>
          )}

          <Touchable
            onPress={this.handleGoLive.bind(this)}
            underlayColor="#4e84eb80"
            style={[
              basicStyles.flexOne,
              basicStyles.alignCenter,
              styles.liveTab,
            ]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyCenter,
                basicStyles.alignCenter,
              ]}>
              <FontAwesome
                name="video-camera"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                Go Live
              </Text>
            </View>
          </Touchable>
        </View>
      </>
    );
  }

  renderRestScreen(homeInfo) {
    const {
      showWalletPopup,
      isLoading,
      moreInfo,
      pendingChats,
      notification,
      missed_record,
    } = this.state;
    const {
      todayEarnings,
      totalEarnings,
      followers,
      Orders,
      oldOrders,
      todayPickUpRate,
      oldPickUpRate,
      ratings,
      oldRatings,
      oldRepurchase,
      repurchase,
      notificationCountStatus,
      notificationCount,
    } = homeInfo;
    const {missedCallCount, missedChatCount, isMissedChat} = missed_record;
    var currency = 'Rupee';
    var symbol = '₹';
    var {currency} = this.state.useInfo;
    currency === 'Rupee' ? (symbol = '₹') : (symbol = '$');
    return (
      <>
        <View style={styles.mainPart}>
          {moreInfo ? (
            <View style={[basicStyles.directionRow, styles.counterContainer]}>
              <Touchable
                onPress={this.handleToday.bind(this)}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Today</Text>
                  <Text style={styles.value}>
                    {symbol} {todayEarnings}
                  </Text>
                </View>
              </Touchable>
              <View style={basicStyles.separatorVertical} />
              <Touchable
                onPress={this.handleTotal.bind(this)}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Total</Text>
                  <Text style={styles.value}>
                    {symbol} {totalEarnings}
                  </Text>
                </View>
              </Touchable>
              <View style={basicStyles.separatorVertical} />
              <Touchable
                onPress={this.handleFollowers.bind(this)}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Followers</Text>
                  <Text style={styles.value}>{followers}</Text>
                </View>
              </Touchable>
            </View>
          ) : (
            <View style={[basicStyles.directionRow, styles.counterContainer]}>
              <Touchable
                onPress={this.handleToday}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Today</Text>
                  <Text style={styles.value}>{symbol} ***</Text>
                </View>
              </Touchable>
              <View style={basicStyles.separatorVertical} />
              <Touchable
                onPress={this.handleTotal.bind(this)}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Total</Text>
                  <Text style={styles.value}>{symbol} ***</Text>
                </View>
              </Touchable>
              <View style={basicStyles.separatorVertical} />
              <Touchable
                onPress={this.handleFollowers.bind(this)}
                underlayColor="transparent"
                style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <View style={basicStyles.alignCenter}>
                  <Text style={[basicStyles.textBold]}>Followers</Text>
                  <Text style={styles.value}>{followers}</Text>
                </View>
              </Touchable>
            </View>
          )}

          <View style={styles.postsContainer}>
            <View style={basicStyles.directionRow}>
              <Touchable
                onPress={this.handleWritePost.bind(this)}
                underlayColor="#fff"
                style={basicStyles.flexOne}>
                <View style={styles.postTile}>
                  {/* <MaterialCommunityIcons
                      name="file-document-edit-outline"
                      color="#333"
                      size={26}
                    /> */}
                  <Image
                    source={posts}
                    resizeMode="cover"
                    style={styles.icons}
                  />

                  <Text
                    style={{
                      fontSize: wp(2.8),
                      fontWeight: '700',
                      color: '#000',
                    }}>
                    Posts
                  </Text>
                </View>
              </Touchable>

              <View style={basicStyles.separatorVertical} />

              <Touchable
                onPress={this.handleMyPost.bind(this)}
                underlayColor="#fff"
                style={basicStyles.flexOne}>
                <View style={styles.postTile}>
                  <Image
                    source={my_posts}
                    resizeMode="cover"
                    style={styles.icons}
                  />
                  <Text
                    style={{
                      fontSize: wp(2.8),
                      fontWeight: '700',
                      color: '#000',
                    }}>
                    My Posts
                  </Text>
                </View>
              </Touchable>
            </View>
          </View>

          <View
            style={[
              basicStyles.marginTop,
              basicStyles.directionRow,
              basicStyles.justifyBetween,
            ]}>
            {oldOrders <= Orders ? (
              <HomeInfoTIle
                title="Calls"
                tileIcon={tile_call}
                value={Orders}
                smallValue={oldOrders}
                bgColor="#409335"
                boxColor="#ff638b"
                icon="arrowup"
              />
            ) : (
              <HomeInfoTIle
                title="Calls"
                tileIcon={tile_call}
                value={Orders}
                smallValue={oldOrders}
                bgColor="#bc0f17"
                boxColor="#ff638b"
                icon="arrowdown"
              />
            )}

            {oldPickUpRate >= todayPickUpRate ? (
              <HomeInfoTIle
                title="Receiving"
                tileIcon={call_receiving}
                value={todayPickUpRate}
                smallValue={oldPickUpRate}
                bgColor="#409335"
                boxColor="#7084e6"
                icon="arrowup"
              />
            ) : (
              <HomeInfoTIle
                title="Receiving"
                tileIcon={call_receiving}
                value={todayPickUpRate}
                smallValue={oldPickUpRate}
                bgColor="#bc0f17"
                boxColor="#7084e6"
                icon="arrowdown"
              />
            )}
            {oldRepurchase <= repurchase ? (
              <HomeInfoTIle
                title="Repeat Calls"
                tileIcon={call_repeat}
                value={repurchase}
                smallValue={oldRepurchase}
                bgColor="#409335"
                boxColor="#f88484"
                icon="arrowup"
              />
            ) : (
              <HomeInfoTIle
                title="Repeat Calls"
                tileIcon={call_repeat}
                value={repurchase}
                smallValue={oldRepurchase}
                bgColor="#bc0f17"
                boxColor="#f88484"
                icon="arrowdown"
              />
            )}
            {oldRatings <= ratings ? (
              <HomeInfoTIle
                title="Ratings"
                tileIcon={ratingsStar}
                value={ratings}
                smallValue={oldRatings}
                bgColor="#409335"
                boxColor="#3b82b3"
                icon="arrowup"
              />
            ) : (
              <HomeInfoTIle
                title="Ratings"
                tileIcon={ratingsStar}
                value={ratings}
                smallValue={oldRatings}
                bgColor="#bc0f17"
                boxColor="#3b82b3"
                icon="arrowdown"
              />
            )}
          </View>

          <View style={[basicStyles.marginTop, basicStyles.directionRow]}>
            <Touchable
              onPress={this.handleNetwork}
              underlayColor="#ff648a"
              style={[styles.networkTile]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.paddingHorizontal,
                  basicStyles.justifyBetween,
                  basicStyles.alignCenter,
                ]}>
                <Image
                  source={networking}
                  resizeMode="cover"
                  style={{width: hp(5), aspectRatio: 1 / 1}}
                />
                <Text
                  style={[
                    basicStyles.headingLarge,
                    basicStyles.flexOne,
                    basicStyles.paddingLeft,
                  ]}>
                  App & Network Settings
                </Text>
              </View>
            </Touchable>
            {notificationCountStatus ? (
              <Touchable
                onPress={this.handleOfficial.bind(this)}
                underlayColor="#ff648a"
                style={[styles.officialTile]}>
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Text style={[basicStyles.headingLarge, basicStyles.flexOne]}>
                    Notification {notificationCount}
                  </Text>
                  <Image
                    source={officials}
                    style={{width: wp(10), aspectRatio: 1 / 1}}
                  />
                </View>
              </Touchable>
            ) : (
              <Touchable
                onPress={this.handleOfficial.bind(this)}
                underlayColor="#ff648a"
                style={[styles.officialTile]}>
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Text style={[basicStyles.headingLarge, basicStyles.flexOne]}>
                    Notification : {notificationCount}
                  </Text>
                </View>
              </Touchable>
            )}
          </View>

          <View style={[basicStyles.marginTop, basicStyles.directionRow]}>
            <Touchable
              onPress={this.handleOutlook.bind(this)}
              underlayColor="#ffb1c4"
              style={[basicStyles.flexFour, styles.button]}>
              <Text style={[basicStyles.headingLarge, basicStyles.whiteColor]}>
                Logbook
              </Text>
            </Touchable>
            <View style={{width: wp(2)}} />
            <Touchable
              onPress={this.handleProfile.bind(this)}
              underlayColor="#ffb1c4"
              style={[basicStyles.flexOne, styles.button]}>
              <Entypo name="user" color="#fff" size={22} />
            </Touchable>
            <View style={{width: wp(2)}} />
            {/* <Touchable
                // onPress={this.handleVideo}
                underlayColor="#bc0f1780"
                style={[basicStyles.flexOne, styles.button]}>
                <Entypo name="video-camera" color="#fff" size={22} />
              </Touchable> */}
          </View>

          <View style={styles.reviewsReasons}>
            <View style={[basicStyles.directionRow]}></View>
            <Text style={[basicStyles.headingLarge, basicStyles.marginTop]}>
              Order
            </Text>
            <Text style={[basicStyles.textLarge, basicStyles.flexOne]}>
              You Have {missedCallCount} Missed Call
            </Text>
            {this.renderSlots()}
          </View>

          <View style={styles.reviewsReasons}>
            <Text style={[basicStyles.headingLarge]}>Chats</Text>

            {isMissedChat ? (
              <View>
                <Text style={[basicStyles.text, basicStyles.marginBottom]}>
                  You have {missedChatCount} missed Chats
                </Text>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                  ]}></View>
                <Touchable
                  onPress={this.handleReplyChat.bind(this)}
                  underlayColor="#ff648a80"
                  style={[basicStyles.button, basicStyles.blucolor]}>
                  <Text
                    style={[
                      basicStyles.heading,
                      basicStyles.whiteColor,
                      {borderRadius: 8},
                    ]}>
                    Reply Chat
                  </Text>
                </Touchable>
              </View>
            ) : (
              <View>
                <Text style={[basicStyles.text, basicStyles.paddingBottom]}>
                  No Missed Chat
                </Text>
                <Touchable
                  onPress={this.handleReplyChat.bind(this)}
                  underlayColor="#ff648a80"
                  style={[
                    basicStyles.button,
                    basicStyles.blucolor,
                    {borderRadius: 8},
                  ]}>
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    All Chats
                  </Text>
                </Touchable>
              </View>
            )}
          </View>
        </View>
      </>
    );
  }

  render() {
    const {showWalletPopup, homeInfo, isLoading} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <ScrollView
          contentContainerStyle={[basicStyles.whiteBackgroundColor]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh.bind(this)}
            />
          }>
          {this.renderHeader(homeInfo)}
          {this.renderButton(homeInfo)}
          {this.renderRestScreen(homeInfo)}
        </ScrollView>
        {showWalletPopup && (
          <ScheduleOnlineTimePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
        )}
        {isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isGetHome: docHomeSelectors.isGetHome(state),
  isGoLive: docHomeSelectors.isGoLive(state),
  isGetOnline: docHomeSelectors.isGetOnline(state),
});
const mapDispatchToProps = {
  getDocHome: docHomeOperations.getDocHome,
  GoLive: docHomeOperations.GoLive,
  getOnline: docHomeOperations.getOnline,
};
export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(HomeScreen),
);

const styles = StyleSheet.create({
  screenHeader: {
    backgroundColor: '#45aae2',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom: hp(4),
  },
  corner: {
    backgroundColor: '#ff648a',
    height: wp(20),
    width: wp(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  cornerColor: {
    backgroundColor: '#ff648a',
    height: wp(20),
    width: wp(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: wp(10),
  },
  mainPart: {
    flex: 1,
    padding: wp(3),
    backgroundColor: '#fff',
    borderTopRightRadius: wp(10),
  },
  headerBarContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9,
    padding: wp(2),
    justifyContent: 'space-between',
  },
  astroImg: {
    width: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  icons: {
    height: wp(6),
    aspectRatio: 1 / 1,
    marginBottom: wp(0.5),
  },
  imgVer: {
    zIndex: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  astroStatus: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 9,
    backgroundColor: '#fff',
    marginHorizontal: wp(2),
    height: hp(8),
    marginBottom: wp(2),
    marginTop: hp(-4),
    alignItems: 'center',
    paddingHorizontal: wp(1),
    // paddingVertical: hp(2),
    shadowColor: '#0006',
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    margin: wp(3),
    borderRadius: wp(3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  chatTabLive: {
    backgroundColor: '#4cade2',
    elevation: 8,
    margin: wp(1),
    height: hp(4.5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTab: {
    backgroundColor: '#fff',
    margin: wp(1),
    height: hp(4.5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  callTab: {
    backgroundColor: '#fff',
    margin: wp(1),
    height: hp(4.5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  liveTab: {
    backgroundColor: '#4faee4',
    margin: wp(1),
    height: hp(4.5),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  buttonInner: {
    width: '100%',
    height: '100%',
  },
  iconRow: {
    marginRight: wp(1),
  },
  deActive: {
    position: 'absolute',
    right: wp(0),
  },
  offer: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  notificationBell: {
    borderColor: '#fff',
    height: wp(10),
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    borderRadius: hp(2),
  },

  counterContainer: {
    padding: wp(2),
    borderRadius: wp(2),
  },
  value: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#4faee4',
  },
  postsContainer: {
    backgroundColor: '#fff',
    marginTop: wp(2),
    padding: wp(2),
    shadowColor: '#0006',
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    margin: wp(3),
    borderRadius: wp(3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  postTile: {
    alignItems: 'center',
    width: '100%',
    padding: wp(2),
  },
  networkTile: {
    // width: wp(58),
    flex: 1,
    backgroundColor: '#ccc4',
    height: hp(10),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  officialTile: {
    width: wp(36),
    backgroundColor: '#ccc4',
    height: hp(10),
    padding: wp(2),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: wp(0),
  },
  tileIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  officialValue: {
    backgroundColor: '#ff648a',
    padding: 5,
    marginLeft: wp(3),
    borderRadius: 5,
    color: '#fff',
  },
  button: {
    backgroundColor: '#4faee4',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 10,
  },
  reviewsReasons: {
    marginTop: wp(2),
    backgroundColor: '#ccc4',
    padding: wp(2),
  },
  reviews: {
    alignSelf: 'flex-start',
    padding: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: 10,
    marginTop: wp(2),
    marginRight: wp(2),
  },
  orderTab: {
    flex: 1,
    alignSelf: 'flex-start',
    padding: wp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    marginTop: wp(2),
    marginRight: wp(2),
    backgroundColor: '#999',
    alignItems: 'center',
  },
  parcelIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  messageTab: {
    width: wp(13.33),
    height: wp(13.33),
    borderRadius: wp(6.66),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  chatImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: wp(6.66),
  },
  icon: {
    position: 'absolute',
    zIndex: 9,
    right: -12,
    top: -12,
  },
});
