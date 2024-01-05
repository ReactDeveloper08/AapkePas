import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

const EarningList = props => {
  const {actualPayment, tds, amount, time, status} = props.item;

  return (
    <View style={styles.listContainer}>
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          styles.tileRow,
        ]}>
        <Text style={basicStyles.headingLarge}>Actual Payment</Text>
        <Text style={basicStyles.headingLarge}>₹ {actualPayment}</Text>
      </View>
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          styles.tileRow,
        ]}>
        <Text style={basicStyles.textLarge}>TDS</Text>
        <Text style={basicStyles.textLarge}>₹ {tds}</Text>
      </View>

      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          styles.tileRow,
        ]}>
        <Text style={basicStyles.textLarge}>Amount</Text>
        <Text style={basicStyles.textLarge}>₹ {amount}</Text>
      </View>

      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          styles.tileRow,
        ]}>
        <Text style={basicStyles.textLarge}>Status</Text>
        <Text style={basicStyles.textLarge}>{status}</Text>
      </View>

      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          styles.tileRow,
        ]}>
        <Text style={basicStyles.textLarge}>Time</Text>
        <Text style={basicStyles.textLarge}>{time}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#ff648a10',
    padding: wp(2),
    borderRadius: 5,
  },
  tileRow: {
    paddingBottom: wp(1),
  },
});

export default EarningList;
