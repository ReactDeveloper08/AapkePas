import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
// Icons
import {TouchableOpacity} from 'react-native-gesture-handler';

const componentName = props => {
  // const handleDetail = () => {
  //   props.nav.push('HomeCategory');
  // };
  const {id} = props.item;
  const handleDetail = () => {
    if (id === 'explore') {
      props.nav.navigate('ExploreScreen');
    } else {
      props.nav.navigate('Exam', {info: {id}});
      // props.nav.navigate('ExpertsList', {info: {id}});
    }
  };

  // const handleExam = () => {
  //   props.nav.navigate('Exam');
  // };

  return (
    <TouchableOpacity
      style={styles.titleContainer}
      onPress={handleDetail.bind(this)}
      // onPress={handleExam}
    >
      <View style={styles.imgContainer}>
        <FastImage
          style={styles.tileIcon}
          source={{
            uri: props.item.icon,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />

        {/* <Image
          source={{uri: props.item.icon}}
          resizeMode="cover"
          style={styles.tileIcon}
        /> */}
      </View>
      <Text style={[styles.listTitle]}>{props.item.name}</Text>
    </TouchableOpacity>
  );
};
export default componentName;
const styles = StyleSheet.create({
  titleContainer: {
    width: wp(16),
    // minHeight: wp(12.5),
    // backgroundColor: '#ccc',
    marginHorizontal: wp(0.5),
    alignItems: 'center',
    paddingHorizontal: wp(0),
    // marginHorizontal: wp(1),
    // borderWidth: 1,
    // borderColor: '#333',
  },
  listTitle: {
    fontSize: wp(2.5),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  imgContainer: {
    // borderWidth: 2,
    // borderColor: '#ff648a80',
    // borderRadius: hp(5),
    marginBottom: wp(0.5),
  },

  tileIcon: {
    height: hp(6),
    borderRadius: hp(3),
    aspectRatio: 1 / 1,
    // borderWidth: 3,
    // borderColor: '#fff',
  },
});
