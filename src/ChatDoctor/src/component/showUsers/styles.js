import {StyleSheet} from 'react-native';
import {color} from '../../utility';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default StyleSheet.create({
  cardStyle: {
    backgroundColor: color.WHITE,
    elevation: 8,
    // height: hp(20),
    // width: wp(100),
    // padding: wp(3),
    flex: 1,
    borderColor: color.WHITE,
    borderRadius: 10,
  },
  cardItemStyle: {
    // backgroundColor: color.SEMI_TRANSPARENT,
  },
  listImage: {
    height: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    borderWidth: 3,
    borderColor: '#fffcd5',
    //borderStyle: 'dashed',
    marginRight: wp(3),
  },
  messageContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoContainer: {
    // height: wp(10),
    // width: wp(10),
    borderColor: color.WHITE,
    borderWidth: 2,
    // borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: color.DARK_GRAY,
  },
  thumbnailName: {fontSize: 30, color: color.WHITE, fontWeight: 'bold'},
  profileName: {fontSize: wp(3.5), color: color.DARK_GRAY, fontWeight: '700'},
});
