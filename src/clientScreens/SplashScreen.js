import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LinearGradient from 'react-native-linear-gradient';

// images
// import logo from 'assets/images/logo.png';
import logo from '../assets/appIcon/logoforapppngtransp.png';
const componentName = props => (
  <View
    // colors={['#ffffff', '#ffffff', '#ffffff']}
    // colors={['#ff539b', '#ff628c', '#ff727c']}
    style={styles.container}>
    <Image source={logo} resizeMode="cover" style={styles.logo} />
  </View>
);

export default componentName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0098db',
  },
  logo: {
    height: hp(30),
    width: hp(25),
    // aspectRatio: 1 / 2,
  },
});
