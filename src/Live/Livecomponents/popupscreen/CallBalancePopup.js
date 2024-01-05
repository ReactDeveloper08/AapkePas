import React, {PureComponent} from 'react';
import {View, Alert, Text, TouchableOpacity} from 'react-native';
import CustomLoader from 'components/ProcessingLoader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from '../Style';
import {KEYS, getData} from 'api/UserPreference';
// import {showToast} from 'pages/components/CustomToast';

class CallBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currency: '',
      enableButton: true,
    };

    this.parentView = null;
  }
  UNSAFE_componentWillMount() {
    this.showCurrency();
  }
  showCurrency = async () => {
    const currency = await getData(KEYS.NEW_CURRENCY);
    this.setState({currency, isLoading: false});
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
    this.setState({enableButton: false});
    const {call, showForm} = this.props;
    await call();
    // await showForm();
    await this.props.closePopup();
  };
  rechargeWallet = () => {
    const {miniBalance} = this.props;

    this.props.nav.navigate('RechargeWallet', {miniBalance});
  };
  // handleAllSet = async () => {

  //   this.props.nav.navigate('AllSetPopup', {call});
  // };

  render() {
    const {enableButton, isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    const {image, Balance, liveCharge, call} = this.props;
    const {live_call_duration, live_call_charges, live_call_charges_dollar} =
      liveCharge;
    if (image != null) {
      var obj = image.map(key => ({url: key.image}));
    }
    if (Balance > live_call_charges) {
      var balButton = true;
    } else {
      var balButton = false;
    }
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text
            style={{fontWeight: '700', marginTop: wp(5), marginBottom: hp(2)}}>
            Live Call
          </Text>
          <View style={styles.listContainerMain}>
            {this.state.currency === 'Rupee' ? (
              <View style={styles.listContainer}>
                <FontAwesome5
                  name="rupee-sign"
                  color="#333"
                  size={20}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                <Text>₹ {Balance}</Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                <FontAwesome5
                  name="dollar-sign"
                  color="#333"
                  size={20}
                  style={styles.iconRow}
                />
                <Text style={{flex: 1}}>Wallet Balance</Text>
                <Text>$ {Balance}</Text>
              </View>
            )}
            <View style={styles.listContainer}>
              <Ionicons
                name="time"
                color="#333"
                size={20}
                style={styles.iconRow}
              />
              {this.state.currency === 'Rupee' ? (
                <Text style={{flex: 1}}>
                  Live Call Charge Rs {live_call_charges}
                </Text>
              ) : (
                <Text style={{flex: 1}}>
                  Live Call Charge $ {live_call_charges_dollar}
                </Text>
              )}

              <Text> {live_call_duration} Mins</Text>
            </View>
          </View>
          {balButton ? (
            enableButton ? (
              <TouchableOpacity
                style={styles.popupButton}
                onPress={this.handleAllSet}>
                <Entypo
                  name="mobile"
                  color="#fff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={styles.popupButtonText}>Call with Phone</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.popupButton00} onPress={this.handleAllSet}>
                <Entypo
                  name="mobile"
                  color="#fff"
                  size={18}
                  style={styles.iconRow}
                />
                <Text style={styles.popupButtonText}>
                  Call Request in Process Please Wait...
                </Text>
              </View>
            )
          ) : (
            <TouchableOpacity
              style={styles.popupButton}
              onPress={this.rechargeWallet}>
              <Entypo
                name="mobile"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Recharge</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default CallBalancePopup;
