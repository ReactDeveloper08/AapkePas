import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Entypo from 'react-native-vector-icons/Entypo';
import styles from '../Style';

class CallBalancePopup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
      enableButton: true,
    };

    this.parentView = null;
  }

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
  handleAllSet = async value => {
    this.setState({enableButton: false});
    if (value === 1) {
      const {answer} = this.props;
      await answer();
      await this.props.closePopup();
    } else {
      const {decline} = this.props;
      await decline();
      await this.props.closePopup();
    }
  };
  rechargeWallet = () => {
    this.props.nav.navigate('RechargeWallet');
  };
  // handleAllSet = async () => {

  //   this.props.nav.navigate('AllSetPopup', {call});
  // };

  render() {
    const {client_name} = this.props;
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text
            style={{fontWeight: '700', marginTop: wp(5), marginBottom: wp(2)}}>
            You Have Call Request from {client_name}
          </Text>

          <View style={styles.buttonAnswer}>
            <TouchableOpacity
              style={[styles.popupButton, {marginRight: wp(2)}]}
              onPress={() => this.handleAllSet(1)}>
              <Entypo
                name="mobile"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Answer</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.popupButton,
                {marginLeft: wp(2), backgroundColor: '#f65472'},
              ]}>
              <Entypo
                name="mobile"
                color="#fff"
                size={18}
                style={styles.iconRow}
              />
              <Text style={styles.popupButtonText}>Decline</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  }
}

export default CallBalancePopup;
