'use strict';

import React, {Component} from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  TouchableOpacity,
  FlatList,
  AppState,
  Linking,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import {Shadow} from 'react-native-neomorph-shadows';
import clear from 'react-native-clear-cache-lcm';
import FastImage from 'react-native-fast-image';

//api
import {KEYS, getData} from 'api/UserPreference';

// Images
import video_bg_1 from 'assets/images/list_bg_2.png';
import ic_wallet_pink from 'assets/icons/ic_wallet_white.png';
import wallet from 'assets/icons/wallet.png';
import ic_play from 'assets/icons/ic_videoCall_white.png';
import notifi from 'assets/icons/ic_notification_bell.png';
import notifi_2 from 'assets/icons/ic_notification_bell3.gif';
// import ic_filter_black from 'assets/icons/ic_filter_black.png';
import ic_filter_black from 'assets/icons/filter.png';
// import ic_sort from 'assets/icons/ic_sort.png';
import ic_sort from 'assets/icons/ic_sort_blue.png';
import internetConnectionState from 'assets/images/internetConnectionState.gif';

// Components
import HomeListComponent from 'components/HomeListComponent';
import FooterComponent from 'components/FooterComponent';
import ConsultantTileComponent from 'components/ConsultantTileComponent';
import PopulartyPopupComponent from 'components/PopulartyPopupComponent';
import FilterPopupComponent from 'components/FilterPopupComponent';

// camera and audio permission
import {
  requestCameraAndAudioPermission,
  requestCameraAndAudioPermissionIOS,
} from '../Live/Livecomponents/Permission';

//styles
import basicStyles from 'styles/BasicStyles';
// VersionInfo
import VersionInfo from 'react-native-version-info';
//redux
import {connect} from 'react-redux';
import {homeOperations, homeSelectors} from '../Redux/wiseword/home';

import {
  transactionOperations,
  transactionSelectors,
} from '../Redux/wiseword/wallet';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from '../Redux/wiseword/availableBalance';
import {
  liveStreamOperations,
  liveStreamSelectors,
} from 'Redux/wiseword/liveStream';
import CustomLoader from 'components/ProcessingLoader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {withNavigation} from 'react-navigation';
// Responsive

import {
  homeShadowHeight,
  textSize,
  backgroundColor,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.connectionState = true;
    this.state = {
      isLoading: true,
      message: '',
      output: '',
      categories: '',
      details: '',
      splashScren: '',
      liveSlider: '',
      isListRefreshing: false,
      appState: AppState.currentState,
      userNotificationCountStatus: false,
      notificationCount: 0,
      appLink: '',
      latitude: '',
      longitude: '',
      notification: false,
      todayLiveSchedule: '',
      usrInfo: '',
      currency: '',
      location: '',
      // notificationCount: 0,
      // appState: AppState.currentState,
    };
    this.isLocationPermissionBlocked = false;
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {});
    } else {
      requestCameraAndAudioPermissionIOS().then(() => {});
    }
    this.showCategories = this.showCategories.bind(this);
    this.showHomeData = this.showHomeData.bind(this);
    clear.runClearCache(() => {
      console.log('data clear');
    });
    //Put your Data loading function here instead of my this.LoadData()
  }
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.homeDataCall();
    });
  }
  componentWillUnmount() {
    this._subscribe.remove();
  }

  homeDataCall = async () => {
    if (this.connectionState) {
      this.showCategories();
      this.showHomeData();
      const userInfo = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      const location = await getData(KEYS.NWE_LOCATION);

      this.setState({
        usrInfo: userInfo,
        currency,
        location,
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  //* show home data
  showHomeData = async srtData => {
    try {
      // await firebaseApi.checkPermission();
      const userInfo = await getData(KEYS.USER_INFO);
      const {deviceId} = await getData(KEYS.DEVICE_UNIQUE_ID);
      console.log(userInfo, deviceId, srtData);
      if (userInfo) {
        var params = {
          deviceId,
          userId: userInfo.userId,
          sortBy: srtData,
        };
      } else {
        var params = {deviceId, sortBy: srtData};
      }
      await this.props.getHome(params).then(async () => {
        if (this.props.isGetHome) {
          const {details, todayLiveSchedule, walletBalance} =
            this.props.isGetHome;
          const {
            splashScren,
            liveSlider,
            appVersion,
            appLink,
            astrologers,
            userNotificationCountStatus,
            userNotificationCount,
          } = details;
          this.setState({
            isListRefreshing: false,
            isLoading: false,
            details: astrologers,
            splashScren,
            liveSlider,
            appLink,
            notificationCount: userNotificationCount,
            walletBalance: walletBalance,
            userNotificationCountStatus,
            todayLiveSchedule,
          });
          await this.props.saveAvailableBalance(walletBalance);

          // const appVer = parseFloat(appVersion);
          // const appVers = parseFloat(VersionInfo.appVersion);
          // if (appVer > appVers) {
          //   Alert.alert(
          //     'Update!',
          //     'Your App Version is Outdated\n' +
          //     'Kindly Update Your App to Latest Version to Avail Best Services',
          //     [
          //       { text: 'Goto Play Store', onPress: this.goToPlayStore },
          //       { text: 'Update Now', onPress: this.goToUpdate },
          //     ],
          //     {
          //       cancelable: false,
          //     },
          //   );
          // }
        }
      });
    } catch (e) {
      console.log('there is an error in load home Data', e);
      Alert.alert(
        'Location Permission',
        'Press OK and provide "Location" permission \tapp wont function untill you provide location permission',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            // onPress: handleOpenSettings(),
          },
        ],
        {cancelable: false},
      );
      return;
    }
  };
  //* show categories
  showCategories = async () => {
    const currency = await getData(KEYS.NEW_CURRENCY);
    const location = await getData(KEYS.NWE_LOCATION);
    const params = null;
    await this.props.getCategories(params);
    if (this.props.isGetCategories) {
      this.setState({
        categories: this.props.isGetCategories,
        currency,
        location,
      });
    }
  };

  //*Notification
  handleNotification = () => {
    this.props.navigation.navigate('Notification');
  };

  goToPlayStore = async () => {
    const {appLink} = this.state;
    // const result = await startUpdateFlow(this.updateModes);
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
  goToUpdate = async () => {
    try {
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <HomeListComponent item={item} nav={this.props.navigation} />
  );

  consultantItem = ({item}) => (
    <ConsultantTileComponent
      item={item}
      nav={this.props.navigation}
      currency={this.state.currency}
    />
  );

  listItem = ({item}) => (
    <Touchable style={[styles.tileStyle]}>
      <FastImage
        source={item.icon}
        resizeMode="cover"
        style={basicStyles.iconRow}
      />
      <View>
        <Text style={[basicStyles.headingLarge, basicStyles.whiteColor]}>
          {item.label}
        </Text>
        <Text style={[basicStyles.textLarge, basicStyles.whiteColor]}>
          {item.detail}
        </Text>
      </View>
    </Touchable>
  );

  liveItem = ({item}) => {
    const {isLive} = item;
    return isLive ? (
      <Touchable
        style={styles.tileContainer}
        underlayColor="transparent"
        onPress={() => this.handleVideo(item)}>
        <View style={styles.videoBg}>
          <View style={styles.dataContainer}>
            <View style={[styles.imageContainers, basicStyles.marginRight]}>
              <FastImage
                source={{uri: item.expertImage}}
                resizeMode="cover"
                style={[styles.image]}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.Duration}>{item.expertName}</Text>
              <Text style={styles.Duration2}>{item.scheduleTime}</Text>
              <Text style={styles.title}>{item.tiltle}</Text>
            </View>
            <FastImage
              source={ic_play}
              resizeMode="cover"
              style={styles.icon}
            />
          </View>
        </View>
      </Touchable>
    ) : (
      <View style={styles.videoBg}>
        <View style={styles.dataContainer}>
          <View style={[styles.imageContainers, basicStyles.marginRight]}>
            <FastImage
              source={{uri: item.expertImage}}
              resizeMode="cover"
              style={[styles.image]}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.Duration}>{item.expertName}</Text>
            <Text style={styles.Duration2}>{item.scheduleTime}</Text>
            <Text style={styles.title}>{item.tiltle}</Text>
          </View>
          <FastImage source={ic_play} resizeMode="cover" style={styles.icon} />
        </View>
      </View>
    );
  };

  //*handle Live stream video
  handleVideo = async item => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const liveData = item;
      const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
      const {deviceId} = devId;
      if (userInfo) {
        var {name} = userInfo;
        var initialData = name;
      } else {
        var initialData = 'Visitor' + ` ${deviceId}`;
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: false,
          },
        );
        return;
      }
      const refreshCallBack = this.showHomeData();
      await this.props.saveLiveData(liveData).then(() => {
        this.props.navigation.navigate('Customer_Viewer', {
          initialData,
          refreshCallBack,
        });
      });
    } catch (e) {
      console.log('error in live schedule', e);
    }
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  infoSeparator = () => <View style={styles.infoSeparator} />;

  handleProfile = async () => {
    this.props.navigation.navigate('Home');
  };
  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };
  handleWallet = async () => {
    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first \nPress LOGIN to continue !',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'LOGIN',
            onPress: this.handleLogin,
          },
        ],
        {
          cancelable: false,
        },
      );
      return;
    }
    // this.props.navigation.navigate('WalletHistory');
    this.props.navigation.navigate('Vault');
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.showCategories();
      await this.showHomeData();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMoreInfo = () => {
    this.setState({showSortPopup: true});
  };

  handleFilterInfo = () => {
    this.setState({showFilterPopup: true});
  };

  closePopup = () => {
    this.setState({showSortPopup: false});
  };

  closePopup2 = () => {
    this.setState({showFilterPopup: false});
  };

  render() {
    const {currency, showSortPopup, showFilterPopup} = this.state;
    const availableBalance = this.props.getAvailableBalance;

    return (
      <InternetConnectionAlert
        onChange={connectionState => {
          this.connectionState = connectionState.isConnected;
          if (connectionState.isConnected === true) {
            this.homeDataCall();
          }
        }}>
        <SafeAreaView style={styles.container}>
          <Shadow
            // inner // <- enable inner shadow
            // useArt // <- set this prop to use non-native shadow on ios
            style={styles.mainHeader}>
            <View
              style={[
                // basicStyles.padding,
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                styles.homeHeader,
              ]}>
              <Touchable
                style={styles.userProfile}
                onPress={this.handleProfile.bind(this)}>
                <FastImage
                  style={styles.profileImage}
                  source={require('assets/appIcon/logoicon.png')}
                />
              </Touchable>

              <View style={[basicStyles.flexOne, basicStyles.marginLeft]}>
                <Text
                  style={{
                    fontSize: wp(3),
                    fontWeight: '700',
                    color: '#4faee4',
                  }}>
                  Aapke Pass
                </Text>
                <Text style={[basicStyles.textSmall, basicStyles.blackColor]}>
                  Version {VersionInfo.appVersion}
                </Text>
              </View>

              <Pressable
                delayLongPress={150}
                style={styles.walletBtn}
                onPress={this.handleWallet.bind(this)}
                // onLongPress={() => {
                //   Alert.alert(
                //     `Alert!`,
                //     `you can press only once `,
                //     [
                //       {
                //         text: 'Ok',
                //         // onPress: () => block(),
                //       },
                //     ],
                //     {cancelable: true},
                //   );
                // }}
              >
                <FastImage
                  source={wallet}
                  resizeMode="cover"
                  style={styles.walletIcon}
                />
                {currency === 'Rupee' ? (
                  <Text style={[basicStyles.whiteColor, {fontSize: textSize}]}>
                    ₹ {availableBalance}
                  </Text>
                ) : (
                  <Text style={[basicStyles.whiteColor, {fontSize: textSize}]}>
                    $ {availableBalance}
                  </Text>
                )}
              </Pressable>

              {this.state.userNotificationCountStatus ? (
                <Touchable
                  style={styles.notifi_Icon}
                  onPress={this.handleNotification.bind(this)}>
                  <FastImage
                    source={notifi_2}
                    resizeMode="cover"
                    style={styles.notifiIcon}
                  />
                </Touchable>
              ) : (
                <Touchable
                  style={styles.notifi_Icon}
                  onPress={this.handleNotification.bind(this)}>
                  <FastImage
                    source={notifi}
                    resizeMode="cover"
                    style={styles.notifiIcon2}
                  />
                </Touchable>
              )}
            </View>
            {this.connectionState ? (
              <>
                <FlatList
                  data={this.state.categories}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  horizontal
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </>
            ) : null}
          </Shadow>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyCenter,
              styles.sortFilter,
            ]}>
            <Touchable
              style={[styles.sortButton]}
              onPress={this.handleMoreInfo}>
              <FastImage
                source={ic_sort}
                resizeMode="cover"
                style={styles.filterIcon}
              />
              <Text style={{fontSize: wp(2.5)}}>Popularity</Text>
            </Touchable>
            <Touchable
              style={[styles.filterButton]}
              onPress={this.handleFilterInfo}>
              <FastImage
                source={ic_filter_black}
                resizeMode="cover"
                style={styles.filterIcon}
              />
              <Text style={{fontSize: wp(2.5)}}>Filter</Text>
            </Touchable>
          </View>

          <View style={styles.contentContainer}>
            {this.state.todayLiveSchedule ? (
              <View style={styles.todaysLive}>
                <Text
                  style={[
                    basicStyles.paddingHorizontal,
                    basicStyles.headingLarge,
                  ]}>
                  Today's Live
                </Text>
                <FlatList
                  data={this.state.todayLiveSchedule}
                  renderItem={this.liveItem}
                  keyExtractor={this.keyExtractor}
                  horizontal
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={this.infoSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh.bind(this)}
                />
              </View>
            ) : null}
            {this.state.details && this.connectionState ? (
              <FlatList
                data={this.state.details}
                renderItem={this.consultantItem}
                keyExtractor={this.keyExtractor}
                numColumns="2"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer2}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh.bind(this)}
              />
            ) : null}
            {this.connectionState === false ? (
              <FastImage
                source={internetConnectionState}
                style={styles.networkIssue}
              />
            ) : null}
          </View>

          <FooterComponent nav={this.props.navigation} />
          {this.state.isLoading && <CustomLoader />}
          {showSortPopup && (
            <PopulartyPopupComponent
              closePopup={this.closePopup}
              nav={this.props.navigation}
              sortData={this.showHomeData}
            />
          )}

          {showFilterPopup && (
            <FilterPopupComponent
              closePopup={this.closePopup2}
              nav={this.props.navigation}
            />
          )}
        </SafeAreaView>
      </InternetConnectionAlert>
    );
  }
}

const mapStateToProps = state => ({
  isGetHome: homeSelectors.isGetHome(state),
  isGetCategories: homeSelectors.isGetCategories(state),
  isExpertSelect: homeSelectors.isExpertSelect(state),

  getSaveLiveData: liveStreamSelectors.getSaveLiveData(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  getAvailableBalance: availableBalanceSelectors.getAvailableBalance(state),
});
const mapDispatchToProps = {
  getHome: homeOperations.getHome,
  getCategories: homeOperations.getCategories,
  getExpertList: homeOperations.getExpertList,
  saveLiveData: liveStreamOperations.saveLiveData,

  getWalletBalance: transactionOperations.getWalletBalance,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
};
export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(HomeScreen),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainHeader: {
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#0003',
    shadowRadius: 5,
    borderRadius: wp(5),
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: '#fff',
    width: wp(100),
    height: homeShadowHeight,
  },

  todaysLive: {
    marginTop: 0,
    marginBottom: hp(2),
  },

  homeHeader: {
    height: hp(7),
    paddingHorizontal: wp(3),
    // backgroundColor: '#ccc',
  },
  contentContainer: {
    flex: 1,
    marginBottom: hp(9),
    // elevation: 8,
  },
  contentTile: {
    paddingHorizontal: wp(3),
    paddingTop: wp(4),
    fontSize: wp(4),
  },
  listContainer: {
    paddingTop: hp(1.5),
    paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
  },
  listContainer2: {
    // paddingVertical: wp(3),
    paddingHorizontal: wp(1),
    paddingBottom: wp(2),
  },
  separator: {
    height: wp(3),
  },
  userProfile: {
    backgroundColor: '#0098db',
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0098db',
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    borderRadius: wp(4),
    backgroundColor: '#0098db',
  },
  walletIcon: {
    width: wp(4),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
  },
  notifi_Icon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    borderRadius: wp(4),
    width: wp(8),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
  },
  notifiIcon: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    borderRadius: wp(4),
    width: wp(8),
    height: wp(15),
    marginRight: wp(2),
    // aspectRatio: 1 / 1,
  },
  notifiIcon2: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    borderRadius: wp(4),
    width: wp(5),
    // height: wp(7),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
  },
  tileStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(36),
    backgroundColor: '#ff648a',
    paddingVertical: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: 5,
  },
  sliderBoxContainer: {
    width: wp(90),
    aspectRatio: 2 / 1.1,
    paddingTop: wp(2),
    marginBottom: hp(1),
  },

  infoSeparator: {
    width: wp(2),
  },

  sliderCon: {
    borderRadius: 5,
    width: wp(94),
    height: wp(45),
    marginTop: 5,
    marginHorizontal: wp(2),
    borderWidth: 1,
  },
  tileContainer: {
    width: wp(94),
    height: wp(26.857),
    // flexDirection: 'row',
    borderRadius: 10,
  },
  videoBg: {
    width: wp(94),
    height: wp(26.857),
    borderRadius: 10,
    padding: wp(3),
    backgroundColor: '#45aae2',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp(3.2),
    fontWeight: '400',
    color: '#fff',
  },
  icon: {
    width: wp(10),
    aspectRatio: 1 / 1,
  },
  imgContainer: {
    // width:wp(30),
    flexDirection: 'column',
  },
  imageContainers: {
    width: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    borderWidth: 4,
    borderColor: '#ffffff80',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
  },
  Duration: {
    fontSize: wp(3.2),
    color: '#fff',
    fontWeight: '700',
    marginBottom: wp(1),
  },
  Duration2: {
    fontSize: wp(2.6),
    color: '#fff',
    fontWeight: '400',
    marginBottom: wp(1),
  },
  profileImage: {
    height: wp(8.6),
    aspectRatio: 1 / 1,
  },

  sortFilter: {
    paddingHorizontal: wp(3),
    paddingTop: wp(3),
    justifyContent: 'flex-end',
    marginBottom: wp(2),
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: wp(40),
    justifyContent: 'center',
    // borderWidth: 1,
    paddingVertical: wp(1),
    marginHorizontal: wp(2),
    borderRadius: hp(2),
  },
  filterIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: wp(40),
    justifyContent: 'center',
    // borderWidth: 1,
    paddingVertical: wp(1.5),
    marginHorizontal: wp(2),
    borderRadius: hp(2),
  },
  networkIssue: {
    height: hp(60),
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
