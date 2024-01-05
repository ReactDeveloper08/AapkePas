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
    padding: wp(2),
    height: hp(7),
    marginBottom: 0,
    // backgroundColor: 'red',
  },
  input: {
    height: hp(6),
    borderTopLeftRadius: hp(3),
    borderBottomLeftRadius: hp(3),
    backgroundColor: '#f2f1f1',
    flex: 1,
    fontSize: wp(3.2),
    color: '#333',
  },

  sendBtnContainer: {
    height: hp(6),
    paddingRight: wp(1),
    backgroundColor: '#f2f1f1',
    borderTopRightRadius: hp(3),
    borderBottomRightRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  headerButtons: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chatBottomOption: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    justifyContent: 'space-around',
  },
  moreData: {
    backgroundColor: '#ff648a10',
    padding: wp(2),
  },
  preDefineText: {
    color: '#333',
    paddingHorizontal: wp(1),
    // paddingVertical: wp(2),
    // borderBottomColor: '#ffffff80',
    // borderBottomWidth: 1,
  },
  typingIcon: {
    height: wp(3),
    aspectRatio: 5.12 / 1,
    marginBottom: wp(2),
  },
  headerSubTitle: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginLeft: wp(2),
  },
  headerSub: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#ff648a',
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    position: 'relative',
    zIndex: 9999999,
  },
});
