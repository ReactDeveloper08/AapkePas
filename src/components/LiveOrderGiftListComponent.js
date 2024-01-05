import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

// Vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class OrderHistoryTabListComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOrderList = () => {};
  handleChat = () => {
    this.props.nav.navigate('Chat');
  };

  render() {
    return (
      <TouchableOpacity
        underlayColor="transparent"
        onPress={this.handleOrderList}
        style={styles.listContainer}>
        <View>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.flexOne,
                basicStyles.textRight,
              ]}>
              Live Session ID: {this.props.item.orderID}
            </Text>
            <MaterialCommunityIcons
              name={this.props.item.icon}
              color="#333"
              size={18}
              style={styles.icon}
            />
          </View>

          <View style={basicStyles.separatorHorizontal} />

          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <Image
              source={this.props.item.userImage}
              resizeMode="cover"
              style={styles.userImage}
            />
            <MaterialCommunityIcons
              name="video"
              color="#333"
              size={18}
              style={{marginRight: wp(1)}}
            />
            <Text style={[basicStyles.headingLarge, basicStyles.flexOne]}>
              {this.props.item.userName}
            </Text>
          </View>

          <View style={basicStyles.separatorHorizontal} />

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.justifyBetween,
            ]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginBottomHalf,
              ]}>
              <MaterialCommunityIcons
                name="calendar-month"
                color="#333"
                size={16}
                style={basicStyles.marginRightHalf}
              />
              <Text style={[basicStyles.textLarge]}>
                {this.props.item.orderDate}
              </Text>
            </View>

            <View
              style={[basicStyles.directionRow, basicStyles.marginBottomHalf]}>
              <Text
                style={[basicStyles.textLarge, basicStyles.marginRightHalf]}>
                Gift Spending:
              </Text>
              <Text style={[basicStyles.headingLarge]}>
                ₹ {this.props.item.callDuration}
              </Text>
            </View>
          </View>

          <View style={basicStyles.separatorHorizontal} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    padding: wp(2),
  },
  icon: {
    marginLeft: wp(2),
  },
  userImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
  },
  button: {
    // borderWidth: 1,
    // borderColor: '#fd6c33',
    backgroundColor: '#fd6c33',
    paddingHorizontal: wp(5),
    height: hp(3),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    borderWidth: 1,
    borderColor: '#fd6c33',
    paddingHorizontal: wp(5),
    height: hp(3),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  giftIcon: {
    width: wp(7),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
});
