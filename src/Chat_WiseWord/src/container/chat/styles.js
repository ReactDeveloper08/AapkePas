import {StyleSheet} from 'react-native';
import {color, appStyle} from '../../utility';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default StyleSheet.create({
  sendMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    margin: wp(2),
    marginBottom: 0,
    backgroundColor: '#b1dcf2',
  },
  input: {
    backgroundColor: '#b1dcf2',
    height: hp(6),
    borderTopLeftRadius: hp(3),
    borderBottomLeftRadius: hp(3),
    flex: 1,
    color: '#333',
    fontSize: wp(3.2),
  },
  sendBtnContainer: {
    height: hp(6),
    paddingRight: wp(1),
    // backgroundColor: '#ccc',
    borderTopRightRadius: hp(3),
    borderBottomRightRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  headerButtons: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor: '#bc0f1780',
    height: hp(5),
    padding: wp(1),
  },
  typingIcon: {
    height: wp(3.5),
    aspectRatio: 5.12 / 1,
    marginBottom: wp(2),
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    position: 'relative',
    zIndex: 9999999,
  },
  headerSubTitle: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginLeft: wp(2),
  },
  headerSub: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#333',
  },
});
