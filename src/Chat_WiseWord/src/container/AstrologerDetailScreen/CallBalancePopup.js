import React, {PureComponent} from 'react';
import {View, Alert, Text, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './styles';
//api calling
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';

//redux
import {connect} from 'react-redux';
import {
  userInfoSelectors,
  userInfoOperations,
} from 'reduxPranam/ducks/userInfo';
import {sessionOperations} from 'reduxPranam/ducks/session';
import {
  CallToAstroOperations,
  CallToAstroSelectors,
} from 'reduxPranam/ducks/callToAstro';
import {availableBalanceSelectors} from 'reduxPranam/ducks/availableBalance';
import {availableBalanceOperations} from 'reduxPranam/ducks/availableBalance';
import {
  transactionOperations,
  transactionSelectors,
} from 'reduxPranam/ducks/transaction';
import {showToast} from 'pages/components/CustomToast';

class CallBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Balance: 0,
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
      enableButton: true,
    };

    this.parentView = null;
  }
  componentDidMount() {
    this.walletInfo();
  }

  walletInfo = async () => {
    try {
      await this.props.getWalletBalance();

      if (this.props.isWalletBalance !== 0) {
        this.setState({
          Balance: this.props.isWalletBalance,
        });
        // console.log(this.props.isWalletBalance);
      }
    } catch (e) {}
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
  handleAllSet = async () => {
    const {userInfo} = this.props;
    const guestImg = this.props.guestImg;
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
    const walletBalance = this.state.Balance;
    const {discountCallCharges, actualCallCharges} = this.props;
    // console.log('charges for call ', discountCallCharges, actualCallCharges);
    var charges = 0,
      callTime = 0;
    if (discountCallCharges != null) {
      charges = discountCallCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualCallCharges.split('/')[0];
      callTime = walletBalance / charges;
    }
    if (callTime < 3) {
      // console.log('time chat is in 3 min');
      if (callTime >= 0 && callTime < 3) {
        Alert.alert(
          'Aapke Pass',
          'Insufficient Balance \n' + 'Please Recharge Your Wallet For Call',
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
    }
    const id = this.props.id;
    this.setState({enableButton: false});
    const {deviceId} = userInfo;
    const params = {
      expertId: id,
      deviceId,
    };
    await this.props.getCall(params);
    if (this.props.isCallStart) {
      const {success, isLogOut, message} = this.props.isCallStart;
      if (isLogOut !== true) {
        if (success) {
          this.props.nav.navigate('AllSetPopup', {guestImg});
          // console.log('for call', this.props.isCallStart);
          showToast(message);
        } else {
          showToast(message);
          this.props.nav.navigate('AllSetPopup', {guestImg});
          // console.log('for call', this.props.isCallStart);
        }
      } else {
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
        this.handleLogoutFromDevice();
        return;
      }
    }
  };
  // handleAllSet = async () => {
  //Logout From Device
  handleLogoutFromDevice = async () => {
    const userInfo = await this.props.userInfo;
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
  //   this.props.nav.navigate('AllSetPopup', {call});
  // };

  render() {
    const {enableButton} = this.state;
    const {image} = this.props;

    if (image != null) {
      var obj = image.map(key => ({url: key.image}));
    }
    const walletBalance = this.state.Balance;
    const {discountCallCharges, actualCallCharges} = this.props;
    // console.log('charges for call ', discountCallCharges, actualCallCharges);
    var charges = 0,
      callTime = 0;
    if (discountCallCharges != null) {
      charges = discountCallCharges.split('/')[0];
      callTime = walletBalance / charges;
    } else {
      charges = actualCallCharges.split('/')[0];
      callTime = walletBalance / charges;
    }
    const {userInfo} = this.props;
    const {mobile} = userInfo;
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
              <Text>{callTime.toFixed(2)} Mins</Text>
            </View>
          </View>
          {enableButton ? (
            <TouchableOpacity
              style={styles.popupButton}
              onPress={this.handleAllSet}>
              <Entypo
                name="mobile"
                color="#fffdc5"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Call with Phone</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.popupButton2} onPress={this.handleAllSet}>
              <Entypo
                name="mobile"
                color="#fffdc5"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>
                Call Request in Process Please Wait...
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // isFetching: loaderSelectors.isFetching(state),
  availableBalance: availableBalanceSelectors.getAvailableBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isCallStart: CallToAstroSelectors.isCallStart(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});

const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  saveBalance: availableBalanceOperations.saveAvailableBalance,
  getCall: CallToAstroOperations.getCall,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
};
export default connect(mapStateToProps, mapDispatchToProps)(CallBalancePopup);
