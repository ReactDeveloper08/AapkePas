import {StyleSheet} from 'react-native';

import {
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const basicStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop1: {
    marginTop: hp(0.5),
  },
  goldColor: {
    color: '#db9058',
  },

  greenColor: {
    color: '#318956',
  },

  brownColor: {
    color: 'brown',
  },

  offlineColor: {
    color: '#ccc',
  },

  redColor: {
    color: 'red',
  },

  lightGreenColor: {
    color: '#00b8a9',
  },

  purpleColor: {
    color: '#853a77',
  },

  blackColor: {
    color: '#231f20',
  },

  grayColor: {
    color: '#334',
  },

  graysColor: {
    color: '#333',
  },

  orangeColor: {
    color: '#ff9000',
  },

  pinkColor: {
    color: '#f65472',
  },

  pinkBgColor: {
    backgroundColor: '#f65472',
  },
  blucolor: {
    backgroundColor: '#4faee4',
  },

  orangeBgColor: {
    backgroundColor: '#ff9000',
  },

  goldBgColor: {
    backgroundColor: '#db9058',
  },

  greenBgColor: {
    backgroundColor: '#318956',
  },

  purpleBgColor: {
    backgroundColor: '#853a77',
  },

  blackBgColor: {
    backgroundColor: '#231f20',
  },

  themeColor: {
    color: '#f57c00',
  },

  themeBgColor: {
    backgroundColor: '#f57c00',
  },

  button: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAlign: {
    textAlign: 'center',
  },
  textAlignVertical: {
    textAlignVertical: 'center',
  },
  mainContainer: {
    flex: 1,
    // borderWidth: 1,
  },

  themeTextColor: {
    color: '#00adef',
  },

  whiteColor: {
    color: '#fff',
  },

  whiteBackgroundColor: {
    backgroundColor: '#fff',
  },

  lightBackgroundColor: {
    backgroundColor: '#f2f1f1',
  },

  themeBackgroundColor: {
    backgroundColor: '#00adef',
  },

  flexOne: {
    flex: 1,
  },

  flexTow: {
    flex: 2,
  },

  flexThree: {
    flex: 3,
  },

  padding: {
    padding: wp(4),
  },

  paddingHorizontal: {
    paddingHorizontal: wp(4),
  },

  paddingHalfHorizontal: {
    paddingHorizontal: wp(2),
  },

  paddingVentricle: {
    paddingVertical: wp(4),
  },

  paddingHalfVentricle: {
    paddingVertical: wp(2),
  },

  paddingBottom: {
    paddingBottom: wp(4),
  },

  paddingTop: {
    paddingTop: wp(4),
  },

  paddingLeft: {
    paddingLeft: wp(4),
  },

  paddingRight: {
    paddingRight: wp(4),
  },
  margin: {
    margin: wp(4),
  },

  marginHorizontal: {
    marginHorizontal: wp(4),
  },

  marginVentricle: {
    marginVertical: wp(4),
  },

  marginVentricleHalf: {
    marginVertical: wp(2),
  },

  marginBottom: {
    marginBottom: wp(4),
  },

  marginBottomHalf: {
    marginBottom: wp(2),
  },

  marginTop: {
    marginTop: wp(4),
  },

  marginTopHalf: {
    marginTop: wp(1.5),
  },

  marginLeft: {
    marginLeft: wp(4),
  },

  marginLeftHalf: {
    marginLeft: wp(2),
  },

  marginRight: {
    marginRight: wp(4),
  },

  marginRightHalf: {
    marginRight: wp(2),
  },

  directionRow: {
    flexDirection: 'row',
  },

  directionColumn: {
    flexDirection: 'column',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  textSmall: {
    fontSize: textSmallSize,
    color: '#222',
  },

  text: {
    fontSize: textSize,
    color: '#222',
  },

  textLarge: {
    fontSize: textLargeSize,
    color: '#222',
  },

  headingSmall: {
    fontSize: headingSmallSize,
    fontWeight: '700',
    color: '#333',
  },

  heading: {
    fontSize: headingSize,
    fontWeight: '700',
    color: '#fff',
  },

  headingLarge: {
    fontSize: headingLargeSize,
    fontWeight: '700',
    color: '#333',
  },

  headingXLarge: {
    fontSize: headingLargeSize,
    fontWeight: '700',
    color: '#333',
  },

  textBold: {
    fontWeight: '700',
  },

  textCapitalize: {
    textTransform: 'capitalize',
  },

  iconRow: {
    width: hp(1.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  iconRowSmall: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  iconColumn: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  input: {
    color: '#fff',
    height: hp(5.5),
    flex: 1,
    borderRadius: 4,
    fontSize: textSize,
    lineHeight: 12,
  },
  separatorVertical: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
    height: '100%',
  },
  separatorHorizontal: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(2),
    width: '100%',
  },
  separatorHorizontal4: {
    height: 4,
    backgroundColor: '#ccc8',
    marginVertical: wp(2),
    width: '100%',
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: textSize,
    textAlign: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  vectorIconRow: {
    // width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  paddingHalf: {
    padding: wp(2),
  },
  paddingHalfTop: {
    paddingTop: wp(2),
  },
  paddingHalfRight: {
    padding: wp(2),
  },
  paddingHalfBottom: {
    paddingBottom: wp(1),
  },
  paddingHalfLeft: {
    paddingLeft: wp(2),
  },
  paddingHalfVertical: {
    padding: wp(2),
  },
  paddingHalfLeftHorizontal: {
    padding: wp(2),
  },

  redBgColor: {
    backgroundColor: '#bc0f17',
  },

  offWhiteBgColor: {
    backgroundColor: '#fffcd5',
  },

  offWhiteColor: {
    color: '#fffcd5',
  },

  textCenter: {
    textAlign: 'center',
  },

  redBgColorHalf: {
    backgroundColor: '#bc0f1780',
  },

  buttonRounded: {
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2.5),
    paddingHorizontal: wp(4),
  },

  darkColor: {
    color: '#333',
  },

  flexFour: {
    flex: 4,
  },

  marginHorizontalHalf: {
    marginHorizontal: wp(1),
  },

  alignStart: {
    alignItems: 'flex-start',
  },

  textXLarge: {
    fontSize: wp(5),
    color: '#222',
  },

  versionHeading: {
    fontSize: wp(2),
    fontWeight: '600',
    color: '#222',
  },

  textRight: {
    textAlign: 'right',
  },
});

export default basicStyles;
