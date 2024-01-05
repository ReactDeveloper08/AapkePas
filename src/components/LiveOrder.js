import React, {PureComponent} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Icons
import ic_live_order from 'assets/icons/ic_live_order.png';

export default class ServiceOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLiveOrder = () => {
    this.props.nav.navigate('LiveOrder');
  };

  render() {
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.marginTop,
          basicStyles.padding,
        ]}>
        <Image
          source={ic_live_order}
          resizeMode="cover"
          style={styles.parcelIcon}
        />
        <Text style={[basicStyles.textLarge, basicStyles.flexOne]}>
          Check your all live orders
        </Text>
        <TouchableOpacity
          onPress={this.handleLiveOrder}
          underlayColor="#fd6c3380"
          style={[basicStyles.buttonRounded, basicStyles.lightBackgroundColor]}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            View Live Orders
          </Text>
        </TouchableOpacity>
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
});
