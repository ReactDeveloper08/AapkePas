import React, {PureComponent} from 'react';

import {
  View,
  Alert,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import {StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import FooterComponent from 'components/FooterComponent';
// Components
import HeaderComponent from 'components/HeaderComponent';
// import {showToast} from 'pages/components/CustomToast';
import CustomLoader from 'components/CustomLoader';
import CallHistoryListComponent from 'components/CallHistoryListComponent';

// icons

import ic_recharge_rupee from 'assets/icons/ic_recharge_rupee.png';
import ic_recharge_dolor from 'assets/icons/ic_recharge_dolor.png';

// images
import walletBG from 'assets/images/walletBG.png';

// Styles
import basicStyles from 'styles/BasicStyles';
//api
import {KEYS, getData} from 'api/UserPreference';
//redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from '../Redux/wiseword/wallet';
import {userInfoSelectors} from '../Redux/wiseword/userDetails';
import {
  availableBalanceOperations,
  // availableBalanceSelectors,
} from '../Redux/wiseword/availableBalance';

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
class ViewProfileScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletBalance: 0,
      income: [],
      isLoading: true,
      message: '',
      currency: '',
    };
    this.handleDataReload = this.handleDataReload.bind(this);
  }

  componentDidMount() {
    this.handleDataReload();
  }

  handleDataReload = () => {
    this.showWalletBalance();
    this.showWalletData();
  };

  showWalletBalance = async () => {
    const currency = await getData(KEYS.NEW_CURRENCY);
    const params = null;
    await this.props.getWalletBalance(params);
    if (this.props.isWalletBalance) {
      const balance = this.props.isWalletBalance;
      this.props.saveAvailableBalance(balance);
      this.setState({
        walletBalance: balance,
        currency,
      });
    } else {
      this.setState({
        walletBalance: 0,
        currency,
      });
    }
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  showWalletData = async () => {
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
          cancelable: false,
        },
      );
      return;
    }
    const params = null;
    await this.props.getWalletSummary(params);
    if (this.props.isWalletSummary) {
      const {success} = this.props.isWalletSummary;
      if (success) {
        const {income} = this.props.isWalletSummary;
        this.setState({isLoading: false, income});
        this.showWalletBalance();
      } else {
        this.setState({isLoading: false, income: ''});
      }
    }
  };

  handleRechargeWallet = () => {
    const refresh = this.handleDataReload;
    const miniBalance = this.props.isMiniBalance;
    // this.props.navigation.navigate('Vault', {refresh, miniBalance});
    this.props.navigation.navigate('WalletHistory', {refresh, miniBalance});
  };

  listItem = ({item}) => (
    <CallHistoryListComponent
      item={item}
      nav={this.props.navigation}
      currency={this.state.currency}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const {isLoading, walletBalance, currency, income} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Wallet"
          // showGradient
          nav={this.props.navigation}
        />
        <View
          style={[basicStyles.mainContainer, basicStyles.whiteBackgroundColor]}>
          {/* <View style={styles.walletHeader}>
            <Touchable
              onPress={this.handleBack}
              underlayColor="transparent">
              <Image
                source={ic_back_black}
                resizeMode="cover"
                style={[basicStyles.iconColumn, basicStyles.marginRight]}
              />
            </Touchable>
            <Text style={styles.headerHeading}>Wallet</Text>
          </View> */}

          <View style={styles.walletBack}>
            {currency === 'Rupee' ? (
              <View style={[styles.astroInfoContainer]}>
                {/* <Image
                    source={ic_wallet}
                    resizeMode="cover"
                    style={styles.walletImage}
                  /> */}

                <Text style={styles.userName}>Wallet Balance</Text>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={styles.balance}>Rs. {walletBalance}</Text>
                  <Touchable
                    underlayColor="#f2f1f1"
                    style={styles.editProfileButton}
                    onPress={this.handleRechargeWallet.bind(this)}>
                    {/* <Image
                      source={ic_recharge_rupee}
                      resizeMode="cover"
                      style={styles.rechargeIcon}
                    /> */}

                    <Text style={[basicStyles.heading, {color: '#4eade3'}]}>
                      Recharge Wallet
                    </Text>
                  </Touchable>
                </View>
              </View>
            ) : (
              <View style={[styles.astroInfoContainer]}>
                {/* <Image
                  source={ic_wallet}
                  resizeMode="cover"
                  style={styles.walletImage}
                /> */}

                <Text style={styles.userName}>Wallet Balance</Text>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={styles.balance}>$ {walletBalance}</Text>
                  <Touchable
                    underlayColor="#f2f1f1"
                    style={styles.editProfileButton}
                    onPress={this.handleRechargeWallet.bind(this)}>
                    <Image
                      source={ic_recharge_dolor}
                      resizeMode="cover"
                      style={styles.rechargeIcon}
                    />

                    <Text style={[basicStyles.heading, basicStyles.pinkColor]}>
                      Recharge Wallet
                    </Text>
                  </Touchable>
                </View>
              </View>
            )}
          </View>

          <View style={basicStyles.flexOne}>
            <View style={styles.infoContainer}>
              <Text style={styles.rechargeTitle}>
                My Recharges and Refund History
              </Text>

              <View style={{flex: 1}}>
                {income ? (
                  <FlatList
                    data={income}
                    renderItem={this.listItem}
                    keyExtractor={this.keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                  />
                ) : (
                  <View style={styles.msgData}>
                    <Text>No Data Available</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  // isFetching: loaderSelectors.isFetching(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isMiniBalance: transactionSelectors.isMiniBalance(state),
  isWalletSummary: transactionSelectors.isWalletSummary(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});

const mapDispatchToProps = {
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
  getWalletBalance: transactionOperations.getWalletBalance,
  getWalletSummary: transactionOperations.getWalletSummary,
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linearGradient: {
    height: hp(15),
    justifyContent: 'center',
    borderRadius: wp(5),
    // borderBottomLeftRadius: wp(5),
    // borderBottomRightRadius: wp(5),
    position: 'relative',
    padding: wp(3),
    zIndex: 9,
    elevation: 5,
    margin: wp(3),
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  headerHeading: {
    fontSize: headingLargeXSize,
    fontWeight: '700',
  },
  astroInfoContainer: {
    padding: wp(3),
    // marginBottom: hp(2),
    // flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  walletImage: {
    // backgroundColor: '#fffcd5',
    height: wp(16),
    width: wp(16),
    //textAlign:'',
    // lineHeight: wp(12),
    marginBottom: hp(1),
    padding: wp(3),
  },
  userName: {
    fontSize: textSize,
    fontWeight: '400',
    color: '#fff',
    marginBottom: wp(3),
    textTransform: 'uppercase',
  },

  balance: {
    fontSize: headingLargeXSize,
    fontWeight: '700',
    color: '#fff',
  },

  editProfileButton: {
    backgroundColor: '#fff',
    height: hp(4.5),
    // width: hp(5),
    paddingHorizontal: wp(5),
    borderRadius: hp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  rechargeIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  infoContainer: {
    flex: 1,
    // padding: wp(4),
  },
  inputContainer: {
    alignItems: 'center',
    // paddingHorizontal: wp(2),
    marginBottom: wp(2),
    backgroundColor: '#f2f1f1',
    paddingHorizontal: wp(3),
    borderRadius: 5,
  },
  label: {
    width: wp(22),
    fontSize: textSize,
  },
  detailSeparator: {
    width: wp(6),
    fontSize: textSize,
  },
  info: {
    flex: 1,
    fontSize: textSize,
    // backgroundColor: '#cccccc80',
    height: hp(5.5),
    // lineHeight: hp(5.5),
    paddingHorizontal: wp(3),
  },

  iconRow: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#ff9933',
    borderRadius: hp(2),
    textAlign: 'center',
    // lineHeight: hp(4),
  },
  rechargeTitle: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(2),
    paddingHorizontal: wp(4),
    paddingTop: wp(4),
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
  walletBack: {
    width: wp(92),
    height: wp(30.66),
    marginHorizontal: wp(4),
    backgroundColor: '#4eaee3',
    borderRadius: wp(2),
  },
  msgData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
