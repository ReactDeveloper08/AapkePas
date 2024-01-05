import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Ima

const FAQTile = props => {
  const {question, answer} = props.item;
  const handleFAQList = () => {
    props.nav.navigate('FaqQuestionDetail', {answer});
  };
  return (
    <TouchableOpacity style={[styles.tileContainer]} onPress={handleFAQList}>
      <Text style={[basicStyles.text]}>{question}</Text>
    </TouchableOpacity>
  );
};

export default FAQTile;

const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: '#ff648a10',
    padding: wp(3),
    borderRadius: 5,
  },
  tileImage: {
    height: hp(5),
    aspectRatio: 1 / 1,
    marginBottom: hp(1),
  },
});
