import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

// Images
// import ic_rupee_pink from 'assets/icons/ic_rupee_pink.png';
import ic_rupee_pink from 'assets/icons/ic_wallet_rupee.png';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from 'styles/BasicStyles';

import {headingLargeSize, textSize} from '../../utility/styleHelper/appStyle';

const Payments = props => {
  const {item} = props;
  const {date, amount, couponReward, totalAmount, transactionId, currency} =
    item;

  return (
    <View style={styles.paymentContainer}>
      <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
        <View style={styles.iconContainer}>
          <Image
            source={ic_rupee_pink}
            resizeMode="cover"
            style={styles.rupeeIcon}
          />
        </View>

        <View style={styles.paymentBodyRow}>
          <Text style={styles.bodyInfo}>{transactionId}</Text>
          <Text style={styles.bodyInfo}>{date}</Text>
          {couponReward ? (
            <View>
              <Text style={styles.bodyInfo}>Coupon Reward {couponReward}</Text>
              {/* <Text style={styles.bodyInfo}></Text> */}
              <Text style={styles.bodyInfo}>Rs. {amount}</Text>
            </View>
          ) : (
            <View />
          )}
        </View>

        <View>
          {currency === 'Rupee' ? (
            <Text style={[styles.bodyInfo, styles.more2]}>
              Rs. {totalAmount}
            </Text>
          ) : (
            <Text style={[styles.bodyInfo, styles.more2]}>$ {totalAmount}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#afdaf2',
    borderRadius: 4,
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    // elevation: 8,
  },
  iconContainer: {
    backgroundColor: '#4eaee3',
    height: wp(11),
    width: wp(11),
    borderRadius: wp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  paymentBodyRow: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    flex: 1,
  },
  bodyInfo: {
    fontSize: textSize,
    color: '#ffff',
    paddingVertical: wp(0.5),
  },
  lineSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(0.5),
  },
  more1: {
    fontWeight: '700',
    color: '#fff',
  },
  more2: {
    fontWeight: '700',
    color: '#fff',
    fontSize: headingLargeSize,
  },
});
