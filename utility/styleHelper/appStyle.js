import {Dimensions} from 'react-native';
// import * as color from '../colors';
import {smallDeviceHeight} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const {height: deviceHeight, width: deviceWidth} =
  Dimensions.get('window');

const box = {};

const getFieldDimesions = () => {
  if (deviceHeight > smallDeviceHeight) {
    return {
      backgroundColor: '#333',
      homeShadowHeight: hp(18),
      headingLargeXSize: wp(5.5),
      headingLargeSize: wp(3.6),
      headingExtraLargeSize: wp(4.5),
      headingSize: wp(2.8),
      headingSmallSize: wp(3),
      textLargeSize: wp(3.2),
      textSize: wp(2.8),
      textSmallSize: wp(2.4),
      signupInputWidth: wp(75),
      myAccountListIcon: wp(5.5),
    };
  } else {
    return {
      backgroundColor: 'red',
      homeShadowHeight: hp(20),
      headingLargeXSize: wp(5),
      headingLargeSize: wp(3.3),
      headingExtraLargeSize: wp(4),
      headingSize: wp(2.6),
      headingSmallSize: wp(2.7),
      textLargeSize: wp(3),
      textSize: wp(2.6),
      textSmallSize: wp(2.2),
      signupInputWidth: wp(90),
      myAccountListIcon: wp(4.5),
    };
  }
};

export const backgroundColor = getFieldDimesions().backgroundColor;
export const homeShadowHeight = getFieldDimesions().homeShadowHeight;
export const headingLargeXSize = getFieldDimesions().headingLargeXSize;
export const headingLargeSize = getFieldDimesions().headingLargeSize;
export const headingSize = getFieldDimesions().headingSize;
export const headingSmallSize = getFieldDimesions().headingSmallSize;
export const textLargeSize = getFieldDimesions().textLargeSize;
export const textSize = getFieldDimesions().textSize;
export const textSmallSize = getFieldDimesions().textSmallSize;
export const signupInputWidth = getFieldDimesions().signupInputWidth;
export const myAccountListIcon = getFieldDimesions().myAccountListIcon;
