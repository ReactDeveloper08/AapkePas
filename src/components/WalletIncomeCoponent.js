import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Payments = props => (
  <View style={styles.paymentContainer}>
    <View style={styles.paymentBodyRow}>
      <Text style={styles.bodyInfo}>Date</Text>
      <Text style={styles.bodyInfo}>{props.item.date}</Text>
    </View>

    <View style={styles.paymentBodyRow}>
      <Text style={styles.bodyInfo}>Amount</Text>
      <Text style={styles.bodyInfo}>₹ {props.item.amount}</Text>
    </View>

    <View style={styles.paymentBodyRow}>
      <Text style={styles.bodyInfo}>Transaction ID</Text>
      <Text style={styles.bodyInfo}>{props.item.transactionId}</Text>
    </View>
  </View>
);

export default Payments;

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
  },
  paymentHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: wp(2),
  },
  expertName: {
    flex: 1,
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#231f20',
  },
  expertPay: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#ff638b',
  },
  paymentBodyRow: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyInfo: {
    fontSize: wp(3),
    color: '#231f20',
  },
});
