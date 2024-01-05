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
  const {description, date} = props.item;

  return (
    <View style={styles.listContainer}>
      <Text style={[basicStyles.headingLarge, basicStyles.paddingHalfBottom]}>
        {description}
      </Text>
      <View>
        <Text style={[basicStyles.text]}>{date}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: 5,
  },
  tileRow: {
    paddingBottom: wp(1),
  },
});

export default EarningList;
