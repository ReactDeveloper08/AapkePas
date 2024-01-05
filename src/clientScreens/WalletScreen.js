import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Modal,
  Button,
  Pressable,
  Platform,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//import Icon from 'react-native-vector-icons/AntDesign';
import SafeAreaView from 'react-native-safe-area-view';

//payment gateway
import RazorpayCheckout from 'react-native-razorpay';

// images
import walletBG from 'assets/images/walletBG.png';
import ic_down_white from 'assets/icons/ic_down_white.png';
import ic_delete_pink from 'assets/icons/ic_delete_pink.png';
import walletHistory from 'assets/icons/walletHistory.png';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import CustomLoader from 'components/CustomLoader';
import ProcessingLoader from 'components/ProcessingLoader';
import showToast from 'components/CustomToast';

//alert-pop-up

//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

//Redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from 'Redux/wiseword/wallet';
import {availableBalanceOperations} from 'Redux/wiseword/availableBalance';

//basic styles
import basicStyles from 'styles/BasicStyles';

// Vector Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  headingLargeXSize,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class WalletScreen extends Component {
  constructor(props) {
    super(props);
    const minimum = this.props.navigation.getParam('minimum');
    const code = this.props.navigation.getParam('code');
    this.state = {
      isProcessing: false,
      isLoading: true,
      walletBalance: 0,
      add_money: 0,
      amount: 0,
      code: code,
      minimum: minimum ? minimum : 0,
      currency: '',
      pickerSelection: code,
      pickerDisplayed: false,
      dataPicker: [],
    };
    this.showBalance = this.showBalance.bind(this);
    this.showMyConsultations = this.showMyConsultations.bind(this);
  }
  componentDidMount() {
    this.showBalance();
    this.showMyConsultations();
  }

  showMyConsultations = async () => {
    this.setState({isLoading: true});
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/couponsList',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      this.setState({isLoading: false});
      if (success) {
        const {coupons} = response;

        this.setState({
          dataPicker: coupons,
          isLoading: false,
        });
        console.log('dataPicker', this.state.dataPicker);
      } else {
        this.setState({message, coupons: null, isLoading: false});
      }
    }
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (info) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  showBalance = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      if (userInfo) {
        const {payloadId} = userInfo;
        const params = {
          payloadId,
        };
        await this.props.getWalletBalance(params);

        this.setState({
          walletBalance: this.props.isWalletBalance,
          currency,
          minimum: this.props.isMiniBalance,
          isLoading: false,
        });
        await this.props.saveAvailableBalance(this.state.walletBalance);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  select_amount = value => {
    this.setState({amount: value});
  };

  handleAdd_Money = async () => {
    try {
      var {amount, minimum, code} = this.state;

      if (!amount) {
        alert('Please choose a pack to add amount', [{text: 'OK'}]);
        return;
      }

      if (!(amount >= minimum)) {
        alert(`Please Add Minimum ${minimum} Rupees`, [{text: 'OK'}]);
        return;
      }
      if (!(amount <= 10000)) {
        alert('Please Add Money Below 10000', [{text: 'OK'}]);
        return;
      }
      // const userInfo = await getData(KEYS.USER_INFO);
      this.setState({isProcessing: true});
      if (code) {
        const params = {
          couponCode: code,
          amount,
        };
        await this.props.addBalance(params);

        const {success, message} = this.props.isBalanceAdded;
        if (success != undefined && success != false) {
          this.setState({isProcessing: false});
          const {output} = this.props.isBalanceAdded;
          const {
            orderId,
            onlineOrderId,
            onlineKeyId,
            orderAmount,
            currency,
            description,
            merchantLogo,
            merchantName,
          } = output;
          const info = {
            orderId,
            onlineOrderId,
            onlineKeyId,
            orderAmount,
            currency,
            description,
            merchantLogo,
            merchantName,
          };
          await this.handleOnlinePayment(info);
          // showToast(message);
          this.setState({amount: null});
        } else {
          this.setState({isProcessing: false});
          showToast(message);
        }
      } else {
        const params = {
          couponCode: '',
          amount,
        };
        await this.props.addBalance(params);
        const {success, message} = this.props.isBalanceAdded;
        if (success != undefined && success != false) {
          this.setState({isProcessing: false});
          const {output} = this.props.isBalanceAdded;
          const {
            orderId,
            onlineOrderId,
            onlineKeyId,
            orderAmount,
            currency,
            description,
            merchantLogo,
            merchantName,
          } = output;
          const info = {
            orderId,
            onlineOrderId,
            onlineKeyId,
            orderAmount,
            currency,
            description,
            merchantLogo,
            merchantName,
          };
          await this.handleOnlinePayment(info);
          // showToast(message);
          this.setState({amount: null});
        } else {
          this.setState({isProcessing: false});
          showToast(message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOnlinePayment = async info => {
    try {
      const {
        userId,
        orderId,
        onlineOrderId,
        onlineKeyId,
        orderAmount,
        currency,
        description,
        merchantLogo,
        merchantName,
      } = info;
      const options = {
        key: onlineKeyId,
        //amount: `${amount}`,
        amount: orderAmount,
        currency: currency,
        name: merchantName,
        order_id: onlineOrderId,
        description: description,
        image: merchantLogo,
        theme: {color: '#ff648a'},
      };

      // transferring control to payment gateway
      const paymentGatewayResponse = await RazorpayCheckout.open(options);

      // processing payment gateway response
      if (paymentGatewayResponse) {
        const {
          razorpay_order_id: onlineOrderId,
          razorpay_payment_id: onlinePaymentId = null,
          razorpay_signature: onlineSignature = null,
        } = paymentGatewayResponse;

        // preparing params
        const params = {
          orderId,
          onlineOrderId,
          onlinePaymentId,
          onlineSignature,
        };
        // calling api
        await this.props.getEarning(params);
        // processing response
        if (this.props.isEarning) {
          // updating cart item count
          //const {cartCount: cartItemCount} = response;
          //await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});
          // stopping loader
          const refresh = this.props.navigation.getParam('refresh');
          this.setState({isProcessing: false});
          await this.showBalance();
          showToast(this.props.isEarning);
          if (refresh) {
            refresh(this.props.isEarning);
            // navigating
            this.props.navigation.navigate('WalletHistory');
          } else {
            showToast(this.props.isEarning);
            // refresh(this.props.isEarning);
            // navigating
            this.props.navigation.navigate('WalletHistory');
          }
        }
      }
    } catch (error) {
      const {code, description} = error;

      if (code === 0 && description === 'Payment Cancelled') {
        // stopping loader
        this.setState({isProcessing: false});
      } else if (code === 2 && description === 'Payment cancelled by user') {
        // stopping loader
        this.setState({isProcessing: false});
      } else {
        console.log(error);
      }
    }
  };

  handelPassbook = () => {
    this.props.navigation.navigate('Passbook');
  };

  handlePack = () => {
    this.props.navigation.push('Coupons');
  };

  handleBack = () => {
    this.props.navigation.pop();
  };

  handlePackPop = () => {
    this.props.navigation.pop();
  };
  async setPickerValue(newValue) {
    await this.setState({
      pickerSelection: newValue,
      code: newValue,
    });
    this.handleShowSubCategory();
    this.togglePicker();
  }

  togglePicker() {
    this.setState({
      pickerDisplayed: !this.state.pickerDisplayed,
    });
  }

  handleShowSubCategory = () => {
    this.setState(prevState => ({
      showSubCategories: !prevState.showSubCategories,
    }));
  };

  handleWalletHistory = () => {
    this.props.navigation.navigate('WalletHistory');
  };

  render() {
    const {isLoading, isProcessing, code, currency, dataPicker} = this.state; // object destructuring
    if (isLoading) {
      return <CustomLoader />;
    }

    const {showSubCategories} = this.state;
    const walletPassbook =
      Platform.OS === 'ios'
        ? {
            position: 'absolute',
            top: wp(9),
            right: wp(4),
          }
        : {
            position: 'absolute',
            top: wp(5),
            right: wp(4),
          };
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Recharge Wallet"
          // showGradient
          nav={this.props.navigation}
        />

        <Touchable style={walletPassbook} onPress={this.handleWalletHistory}>
          <Image
            source={walletHistory}
            resizeMode="cover"
            style={basicStyles.iconColumn}
          />
        </Touchable>

        <View style={{height: hp(81.5)}}>
          <View style={styles.walletBack}>
            <View style={[styles.astroInfoContainer]}>
              <Text style={styles.walletTitle}>Wallet Balance</Text>
              {currency === 'Rupee' ? (
                <Text style={styles.walletAmount}>
                  ₹ {this.state.walletBalance}
                </Text>
              ) : (
                <Text style={styles.walletAmount}>
                  $ {this.state.walletBalance}
                </Text>
              )}
            </View>
          </View>

          <ScrollView>
            <View style={styles.addWallet}>
              <Text style={styles.rechargeTitle}>Recharge Wallet</Text>
              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor="#ccc"
                value={this.state.amount}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={value => this.select_amount(value)}
                style={styles.packs}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.rechargeTitle}>Coupons</Text>

              <View style={styles.packageContainer2}>
                <View style={styles.Wallet}>
                  <Text
                    style={[
                      {fontSize: headingSize, fontWeight: '700', color: '#ccc'},
                      basicStyles.flexOne,
                    ]}>
                    Coupon : {this.state.pickerSelection}
                  </Text>
                  {/* <Text>Coupon {this.state.pickerSelection}</Text> */}
                  <Pressable
                    onPress={() => {
                      this.togglePicker();
                      this.handleShowSubCategory();
                    }}
                    style={styles.buttons}>
                    <Image
                      source={ic_down_white}
                      resizeMode="cover"
                      style={styles.downIcon}
                    />
                    {/* <Text style={basicStyles.whiteColor}>@</Text> */}
                  </Pressable>
                </View>
                {/* <Modal
                  visible={this.state.pickerDisplayed}
                  animationType={'fade'}
                  transparent={true}> */}
                {showSubCategories && (
                  <ScrollView
                    contentContainerStyle={{
                      // marginHorizontal: wp(2),
                      padding: wp(2),
                      backgroundColor: '#f5f5f5',
                      // top: hp(63),
                      width: '100%',
                      left: 0,
                      right: 0,
                      alignItems: 'flex-start',
                      // position: 'absolute',
                      minHeight: hp(20),
                    }}>
                    <View
                      style={[
                        basicStyles.directionRow,
                        basicStyles.alignCenter,
                        styles.couponList,
                      ]}>
                      <View style={basicStyles.flexOne}>
                        <Text
                          style={{
                            textAlign: 'left',
                            fontWeight: '700',
                            color: '#333',
                          }}>
                          Please Select Coupon
                        </Text>
                        {dataPicker.map((value, index) => {
                          return (
                            <Touchable
                              underlayColor="#fd6c3380"
                              key={index}
                              onPress={() => this.setPickerValue(value.code)}
                              style={{paddingTop: 4, paddingBottom: 4}}>
                              <Text
                                style={{
                                  textAlign: 'left',
                                  fontWeight: '400',
                                  color: '#333',
                                }}>
                                {index + 1}: {value.code}
                              </Text>
                            </Touchable>
                          );
                        })}
                      </View>

                      <Touchable
                        underlayColor="#ff648a80"
                        onPress={() => this.togglePicker()}
                        style={
                          {
                            // paddingTop: 4,
                            // paddingBottom: 4,
                            // backgroundColor: '#ff648a',
                            // paddingHorizontal: wp(3),
                          }
                        }>
                        {/* <Text style={{color: '#ffffff', fontSize: wp(3)}}>
                        Cancel
                      </Text> */}
                        {/* <Image
                          source={ic_delete_pink}
                          resizeMode="cover"
                          style={styles.cancelIcon}
                        /> */}
                      </Touchable>
                    </View>
                  </ScrollView>
                )}
                {/* </Modal> */}
              </View>
            </View>
            <Touchable
              style={styles.rechargeButton}
              onPress={this.handleAdd_Money}
              underlayColor="#ff648a80">
              <Text style={styles.rechargeButtonText}>Proceed to Pay</Text>
            </Touchable>
          </ScrollView>
        </View>

        <FooterComponent nav={this.props.navigation} />
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isMiniBalance: transactionSelectors.isMiniBalance(state),
  isBalanceAdded: transactionSelectors.isBalanceAdded(state),
  isEarning: transactionSelectors.isEarning(state),
});

const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  addBalance: transactionOperations.addBalance,
  getEarning: transactionOperations.getEarning,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  buttons: {
    height: hp(5),
    width: hp(5),
    borderRadius: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4cade3',
  },

  couponList: {
    backgroundColor: '#fff',
    padding: wp(1.5),
    borderRadius: 5,
    marginBottom: 4,
  },

  cancelIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },

  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },

  downIcon: {
    height: wp(2),
    aspectRatio: 1 / 1,
  },

  headerHeading: {
    fontSize: wp(5),
    fontWeight: '700',
  },

  walletBack: {
    width: wp(92),
    height: wp(30.66),
    marginHorizontal: wp(4),
    backgroundColor: '#4cade3',
    borderRadius: wp(2),
  },
  astroInfoContainer: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  walletAmountContainer: {
    backgroundColor: '#ccc',
    width: wp(94),
    height: hp(25),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: wp(3),
  },
  walletIcon: {
    height: hp(10),
    aspectRatio: 1 / 1,
  },
  passbookIcon: {
    aspectRatio: 1 / 1,
    position: 'absolute',
    top: 12,
    right: 12,
    bottom: 0,
    width: wp(6),
    height: hp(6),
  },
  passbookImage: {
    position: 'absolute',
    top: 2,
    right: 10,
    //left: 2,
    bottom: 0,
    width: wp(8),
    height: hp(3),
  },
  walletTitle: {
    fontSize: textSize,
    fontWeight: '400',
    color: '#fff',
    marginBottom: wp(3),
    textTransform: 'uppercase',
  },

  walletAmount: {
    fontSize: headingLargeXSize,
    fontWeight: '700',
    color: '#fff',
  },
  addWallet: {
    // flex: 1,
    paddingVertical: hp(1),
    padding: wp(4),
  },
  rechargeTitle: {
    marginTop: wp(3),
    fontSize: headingLargeSize,
    marginBottom: wp(3),
    fontWeight: '700',
    color: '#333',
  },
  rechargeSubTitle: {
    fontSize: wp(3.5),
  },

  packageTile: {
    fontSize: wp(3),
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  rechargeButton: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4cade3',
    margin: wp(3),
    borderRadius: 5,
  },
  rechargeButtonText: {
    fontSize: headingSize,
    fontWeight: '700',
    color: '#fff',
  },
  margin: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: wp(21.225),
    height: hp(6),
    marginBottom: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  packs: {
    height: hp(5.5),
    borderColor: '#ccc',
    color: '#333',
    borderWidth: 1,
    paddingHorizontal: wp(3),
    borderRadius: 5,
    fontSize: textSize,
    // marginTop: hp(2),
  },

  infoContainer: {
    padding: wp(4),
    paddingTop: wp(0),
    marginTop: hp(0),
  },
  Wallet: {
    backgroundColor: '#f2f1f1',
    paddingVertical: wp(2.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#ff648a',
    borderRadius: hp(2),
    textAlign: 'center',
    lineHeight: hp(4),
  },
});
