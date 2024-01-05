import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Ima

const FAQTile = props => {
  const {id, name, image} = props.item;
  const handleFAQList = () => {
    props.nav.navigate('QuestionList', {id});
  };
  return (
    <TouchableOpacity style={[styles.tileContainer]} onPress={handleFAQList}>
      <Image
        source={{uri: image}}
        resizeMode="cover"
        style={styles.tileImage}
      />
      <Text style={[basicStyles.heading, basicStyles.textCenter]}>{name}</Text>
    </TouchableOpacity>
  );
};

export default FAQTile;

const styles = StyleSheet.create({
  tileContainer: {
    width: wp(45.5),
    backgroundColor: '#9ddafd',
    margin: wp(1.5),
    alignItems: 'center',
    height: hp(15),
    justifyContent: 'center',
    borderRadius: 5,
    padding: wp(2),
  },
  tileImage: {
    height: hp(5),
    aspectRatio: 1 / 1,
    // width: wp(14),
    marginBottom: hp(1),
  },
});
