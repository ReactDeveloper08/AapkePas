import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ic_calendar from 'assets/icons/ic_calendar.png';

const Payments = props => (
  <View style={styles.totalExpContainer}>
    <View style={styles.totalTimeContainer}>
      <Image
        source={ic_calendar}
        resizeMode="cover"
        style={styles.calendarIcon}
      />
      <Text style={styles.totalDate}>{props.item.date}</Text>
    </View>

    <View style={styles.totalIncome}>
      <Text style={styles.totalIncomeText}>Amount</Text>
      <Text style={styles.totalIncomeText}>₹{props.item.amount}.00</Text>
    </View>
    <View style={styles.totalIncome}>
      <Text style={styles.totalIncomeText}>ExpertName</Text>
      <Text style={styles.totalIncomeText}>{props.item.expertName}</Text>
    </View>
  </View>
);

export default Payments;

const styles = StyleSheet.create({
  totalExpContainer: {
    padding: wp(2),
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  calendarIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  totalDate: {
    fontSize: wp(3.5),
    flex: 1,
  },
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  balanceText: {
    fontSize: wp(3),
    color: '#056497',
  },
  totalIncome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
  },
  totalIncomeText: {
    fontSize: wp(3),
  },
});
