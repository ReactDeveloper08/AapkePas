import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Vector Icons
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeInfo = props => {
  const iconContainer = {
    position: 'absolute',
    right: wp(-3),
    bottom: wp(-3),
    backgroundColor: props.bgColor,
    height: wp(6),
    width: wp(6),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  };
  const headerContainer = {
    backgroundColor: props.boxColor,
    width: wp(22),
    padding: wp(2),
    borderRadius: 3,
    borderTopRightRadius: wp(11.25),
    marginTop: hp(1),
  };

  return (
    <View style={headerContainer}>
      <TouchableOpacity style={styles.tileContainer}>
        <View>
          <View style={styles.tileIconsContainer}>
            <Image
              source={props.tileIcon}
              resizeMode="cover"
              style={styles.tileIcons}
            />
          </View>
          <View style={iconContainer}>
            <AntDesign
              name={props.icon}
              color="#fff"
              size={16}
              style={styles.icon}
            />
          </View>
          <Text style={[styles.title, basicStyles.whiteColor]}>
            {props.title}
          </Text>
          <Text
            style={[
              basicStyles.headingXLarge,
              basicStyles.whiteColor,
              basicStyles.marginTopHalf,
            ]}>
            {props.value}
          </Text>
          <Text style={[basicStyles.textLarge, basicStyles.whiteColor]}>
            {props.smallValue}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    right: wp(-2),
    bottom: wp(0),
    backgroundColor: '#ff648a',
    height: wp(8),
    width: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: wp(3.2),
    fontWeight: '700',
    minHeight: hp(4.5),
    // borderWidth: 1,
  },
  tileIconsContainer: {
    backgroundColor: '#fff6',
    height: wp(16),
    width: wp(16),
    borderRadius: wp(8),
    marginTop: hp(-5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(-3),
  },
  tileIcons: {
    height: wp(10),
    width: wp(10),
    borderRadius: wp(5),
  },
});

export default HomeInfo;
