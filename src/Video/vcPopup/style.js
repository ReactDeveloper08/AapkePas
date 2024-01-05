import {Dimensions, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  // PopUp Screen
  popUpScreen: {
    backgroundColor: '#0008',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popUpContainer: {
    minHeight: hp(40),
    width: wp(80),
    padding: wp(3),
    borderRadius: 8,
  },

  chatIcon: {
    marginVertical: hp(4),
    alignSelf: 'center',
    height: wp(50),
    aspectRatio: 1 / 1,
  },

  buttonIcon: {
    height: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
  },
  screenLogo: {
    height: wp(16),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    margin: wp(2),
  },
  requestContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    borderRadius: wp(5),

    shadowColor: '#0006',
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    margin: wp(3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  userImage: {
    height: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
    borderWidth: 4,
    borderColor: '#bc0f1780',
    marginRight: hp(2),
    // alignSelf: 'center',
  },
  requestText: {
    flex: 1,
    fontWeight: '700',
  },

  // after accept

  max: {
    flex: 1,
  },
  buttonHolder: {
    flex: 1,
    bottom: wp(10),
    borderRadius: 50,
    marginHorizontal: wp(2),
    paddingLeft: wp(3),
    alignItems: 'center',
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    justifyContent: 'space-between',
    borderRadius: 25,
  },
  Iconbutton: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
    justifyContent: 'space-between',
    borderRadius: 25,
  },
  buttonText: {
    // color: '#fff',
    width: wp(9),
    height: wp(9),
    // aspectRatio: 1 / 1,
  },
  buttonIcon: {
    // color: '#fff',
    width: wp(8),
    height: wp(8),
    // aspectRatio: 1 / 1,
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
  },
  remoteContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: wp(10),
    left: wp(70),
    borderRadius: 25,
  },
  remote: {
    width: wp(25),
    height: hp(25),
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  container: {
    flex: 1,
    backgroundColor: '#fffcd5',
  },
  liveStreamButton: {
    backgroundColor: '#34495e',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 25,
    marginBottom: 15,
  },
  textButton: {
    color: 'white',
    fontSize: 25,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 25,
    fontSize: 23,
    fontWeight: '600',
  },
  flatList: {
    padding: wp(3),
  },
  welcomeText: {
    fontSize: wp(3.5),
    color: '#333',
    fontWeight: 'bold',
  },
  welcomeText2: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    fontSize: wp(4),
    color: 'black',
    fontWeight: '700',
    marginHorizontal: wp(3),
  },
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  bcgImg: {
    flex: 1,
    width: wp(100),
  },
  buttonStyle: {
    position: 'absolute',
    top: 3,
    left: 0,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: '#00000095',
    borderRadius: 50,
    alignItems: 'center',

    paddingRight: wp(3),
  },
  profileButton: {
    padding: wp(2),
    borderRadius: 50,
  },
  endIcon: {
    height: hp(4.6),
    aspectRatio: 1 / 1,
  },
  liveCount: {
    color: '#fff',
    marginLeft: wp(1),
  },
  buttonEnd: {
    position: 'absolute',
    top: 3,
    right: 0,
    padding: wp(2),
    borderRadius: 50,
  },
  callDialerContainer: {
    borderWidth: 1,
    backgroundColor: '#00000095',
    borderRadius: 50,
    position: 'absolute',
    top: hp(16),
    left: wp(1),
    zIndex: 99999,
  },
  DialerContainer: {
    flexDirection: 'row',
    padding: wp(2),
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
