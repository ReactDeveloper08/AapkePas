import {StyleSheet} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff648a05',
  },

  tabButton: {
    backgroundColor: '#fff',
    height: hp(5),
    borderRadius: 8,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
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
    fontSize: wp(5),
    color: '#333',
  },
  welcomeText2: {
    fontSize: wp(5),
    color: '#4cade2',
    fontWeight: 'bold',
  },
  title: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
    marginHorizontal: wp(3),
  },
  separator: {
    height: 4,
    backgroundColor: '#ccc4',
  },
  listContainer: {
    paddingVertical: wp(2),
    // paddingHorizontal: wp(3),
  },
  orderTab: {
    flex: 1,
    alignSelf: 'flex-start',
    padding: wp(2),
    alignItems: 'center',
  },
  tabMainContainer: {
    flexDirection: 'row',
    // backgroundColor: '#f2f1f1',
    // marginTop: hp(-3),
    alignItems: 'center',
    // justifyContent: 'space-around',
    padding: wp(3),
    paddingTop: wp(1),
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    width: 10,
    marginTop: 8,
    marginBottom: 8,
    // backgroundColor: '#ff648a20',
    alignSelf: 'center',
  },
  headingLarge: {
    color: '#666',
    fontSize: wp(3.5),
    fontWeight: '700',
    textAlign: 'center',
  },
  userNameContainer: {
    // backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  tabCon: {
    backgroundColor: '#fff',
    paddingVertical: wp(1.5),
    borderTopRightRadius: wp(10),
    borderTopLeftRadius: wp(10),
    paddingTop: wp(1),
  },
});

export default styles;
