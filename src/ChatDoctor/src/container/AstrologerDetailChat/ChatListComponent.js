import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_star from 'assets/icons/ic_star_white.png';

// styles
import basicStyles from 'styles/BasicStyles';
const LiveList = props => {
  const {userName, image, ratings} = props.item;
  const {onNameTap} = props;

  return (
    <TouchableOpacity onPress={onNameTap} underlayColor="#fff">
      <View style={styles.listContainer}>
        <View style={[basicStyles.justifyCenter]}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.listImage}
          />
        </View>

        <View style={basicStyles.flexOne}>
          <Text style={[styles.listHeading]}>{userName}</Text>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyCenter,
            styles.reviewView,
          ]}>
          <Image
            source={ic_star}
            resizeMode="cover"
            style={{width: wp(4), aspectRatio: 1 / 1, marginRight: wp(2)}}
          />
          <Text style={[styles.text, basicStyles.whiteColor]}>{ratings}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LiveList;
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    elevation: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: wp(3),
  },
  listContainer: {
    flexDirection: 'row',
    // height: hp(20),
    backgroundColor: '#4daee3',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: wp(2),
    borderRadius: wp(4),
  },
  listImage: {
    height: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    borderWidth: 3,
    borderColor: '#ff648a80',
    // borderStyle: 'dashed',
    marginRight: wp(3),
  },
  liveIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(1),
  },
  BusyButton: {
    backgroundColor: '#ae3800',
    width: wp(16),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    paddingVertical: wp(1),
  },
  liveButton: {
    backgroundColor: '#0ecc00',
    width: wp(16),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    paddingVertical: wp(1),
  },
  shareIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
  },
  shareButton: {
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: wp(6),
    marginVertical: hp(1),
  },
  listHeading: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: '700',
  },
  liveTex: {
    height: hp(4),
    aspectRatio: 5 / 1,
    marginVertical: hp(0.5),
  },
  ListTime: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
  },
  oldPrice: {
    fontSize: wp(4),
    color: '#ae3800',
    textDecorationLine: 'line-through',
    marginHorizontal: wp(1),
  },
  newPrice: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
    marginHorizontal: wp(1),
  },
  reviewView: {
    backgroundColor: '#9bdbff',
    alignSelf: 'center',
    borderRadius: hp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginVertical: wp(1),
  },
  callIcon: {
    height: wp(8),
    width: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(0.5),
  },
});
