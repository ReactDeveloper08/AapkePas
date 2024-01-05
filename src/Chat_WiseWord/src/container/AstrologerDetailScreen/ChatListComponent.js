import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
// import RadialGradient from 'react-native-radial-gradient';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_star from 'assets/icons/ic_star.png';

import Feather from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

// styles
import basicStyles from 'styles/BasicStyles';
const LiveList = props => {
  const {
    id,
    name,
    experience,
    qualification,
    image,
    skills,
    languages,
    actualCharges,
    discountCharges,
    isBusy,
    maxWaitTime,
    rating,
    isCallAvailable,
    isChatAvailable,
  } = props.item;
  const handleAstroDetail = () => {
    const {currentUserId} = props;

    props.nav.navigate('AstrologerChat', {id, currentUserId});
  };

  return (
    <TouchableOpacity onPress={handleAstroDetail}>
      <LinearGradient
        colors={['#ff9933', '#fd6c33', '#fd6c33']}
        style={styles.linearGradient}>
        <View style={styles.listContainer}>
          <View style={[basicStyles.justifyCenter]}>
            <Image
              source={{uri: image}}
              resizeMode="cover"
              style={styles.listImage}
            />
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
                style={basicStyles.iconRow}
              />
              <Text style={[styles.text, basicStyles.whiteColor]}>
                {rating}
              </Text>
            </View>
          </View>

          <View style={basicStyles.flexOne}>
            <Text style={styles.listHeading}>{name}</Text>
            {/* <Image
              source={list_live_text}
              resizeMode="cover"
              style={styles.liveTex}
            /> */}
            <Text style={styles.ListTime}>{languages}</Text>
            {discountCharges === null ? (
              <View style={[basicStyles.directionRow]}>
                {/* <Text style={styles.oldPrice}>₹ {discountCharges}</Text> */}
                <Text style={styles.newPrice}>₹{actualCharges}</Text>
              </View>
            ) : (
              <View style={[basicStyles.directionRow]}>
                <Text style={styles.oldPrice}>₹{actualCharges}</Text>
                <Text style={styles.newPrice}>₹ {discountCharges}</Text>
              </View>
            )}
          </View>

          <View style={basicStyles.alignCenter}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              {isChatAvailable ? (
                <TouchableOpacity
                  style={[basicStyles.offWhiteBgColor, styles.callIcon]}>
                  <Material
                    name="chat-processing-outline"
                    color="#000"
                    size={24}
                    style={styles.iconRow}
                  />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
              {isCallAvailable ? (
                <TouchableOpacity
                  style={[basicStyles.offWhiteBgColor, styles.callIcon]}>
                  <Feather
                    name="phone-call"
                    color="#000"
                    size={18}
                    style={styles.iconRow}
                  />
                </TouchableOpacity>
              ) : (
                <View></View>
              )}
            </View>
            {isBusy ? (
              <TouchableOpacity style={styles.BusyButton}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Online
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.liveButton}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Live
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* <Text
          style={[
            basicStyles.test,
            basicStyles.whiteColor,
            basicStyles.paddingBottom,
          ]}>
          I wish to carry the light of this divine science and the true dignity
          of it to the next generation.
        </Text> */}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default LiveList;
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 5,
    paddingHorizontal: wp(3),
  },
  listContainer: {
    flexDirection: 'row',
    height: hp(20),
    alignItems: 'center',
    // justifyContent: 'center',
  },
  listImage: {
    height: wp(26),
    aspectRatio: 1 / 1,
    borderRadius: wp(13),
    borderWidth: 3,
    borderColor: '#fffcd5',
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
    fontSize: wp(5),
    color: '#fffcd5',
    fontWeight: '700',
  },
  liveTex: {
    height: hp(4),
    aspectRatio: 5 / 1,
    marginVertical: hp(0.5),
  },
  ListTime: {
    fontSize: wp(4),
    color: '#fffcd5',
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
    color: '#fffcd5',
    fontWeight: '700',
    marginHorizontal: wp(1),
  },
  reviewView: {
    backgroundColor: '#ae3800',
    alignSelf: 'center',
    borderRadius: hp(2),
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
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
