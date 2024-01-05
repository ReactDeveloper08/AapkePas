import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class ServiceOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOrder = () => {
    const missed = this.props.missed;
    const {isMissedCall} = missed;
    if (isMissedCall === true) {
      this.props.nav.navigate('OrderHistory', {missed: 'missed'});
    } else {
      this.props.nav.navigate('OrderHistory', {missed});
    }
  };

  render() {
    const {isMissedCall} = this.props.missed;
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.marginTop,
          // basicStyles.padding,
        ]}>
        {isMissedCall ? (
          <TouchableOpacity
            onPress={this.handleOrder}
            underlayColor="#bc0f1780"
            style={[
              basicStyles.pinkBgColor,
              basicStyles.flexOne,
              styles.buttonHandle,
            ]}>
            <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
              Check it
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={this.handleOrder}
            underlayColor="#ff648a"
            style={[basicStyles.flexOne, styles.buttonHandle]}>
            <Text style={[basicStyles.heading]}>View All Orders</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parcelIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  buttonHandle: {
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    backgroundColor: '#9cdaff',
    // elevation: 10,
  },
});
