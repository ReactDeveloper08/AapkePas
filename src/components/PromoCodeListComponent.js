import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PromoCodeListComponent = props => {
  const {item, radioButton} = props;
  // const {id, code, description} = item;

  return <View style={styles.listContainer}>{radioButton}</View>;
};

export default PromoCodeListComponent;

const styles = StyleSheet.create({
  listContainer: {
    // backgroundColor: '#ff648a10',
    backgroundColor: '#f5f5f5',
    height: hp(5.5),
    borderRadius: 5,
    marginBottom: wp(4),
    alignItems: 'center',
    paddingHorizontal: wp(3),
    flexDirection: 'row',
  },
  separator: {
    backgroundColor: '#ccc',
    height: 1,
    marginVertical: hp(0.5),
  },
  description: {
    fontSize: wp(3),
  },
});
