import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Platform,
} from 'react-native';

import {Shadow} from 'react-native-neomorph-shadows';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//api
import {KEYS, getData} from 'api/UserPreference';

// Icon
import ic_home_black from 'assets/icons/ic_home_black.png';
import ic_live from 'assets/icons/ic_live.png';
// import ic_footer_wallet from 'assets/icons/ic_footer_wallet.png';
import ic_footer_order from 'assets/icons/ic_footer_expenses.png';
import ic_expenses from 'assets/icons/ic_expenses.png';
import ic_profile_user from 'assets/icons/ic_profile_user.png';
import ic_footer_profile from 'assets/icons/ic_footer_profile.png';

import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const FooterComponent = props => {
  const [usrInfo, setUsrInfo] = useState([]);
  const [buttonPress, setButtonPress] = useState('Home');
  const info = async () => {
    const currency = await getData(KEYS.NEW_CURRENCY);
    setUsrInfo(currency);
  };
  useEffect(() => {
    info();
    return () => {};
  }, []);

  const handelHome = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        console.log('in userFile');
        props.nav.navigate('Homes');
      } else {
        console.log('without userFile');
        props.nav.navigate('Home');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLoginWallet = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const wallet = {userInfo};
    props.nav.navigate('Login', {wallet});
    console.log('wallet call' + wallet);
  };
  const handleLoginAccount = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const account = {userInfo};
    props.nav.navigate('Login', {account});
    console.log('account call' + account);
  };

  const handelWallet = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      // console.log(userInfo);
      if (userInfo) {
        props.nav.push('Orders');
        // props.nav.navigate('Wallet');
      } else {
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'LOGIN', onPress: handleLoginWallet},
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // const handleExpert = () => {
  //   props.nav.navigate('Experts');
  // };
  const handelAccount = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        props.nav.navigate('MyAccount');
      } else {
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'LOGIN', onPress: handleLoginAccount},
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.error(error.message);
    }
    //props.nav.navigate('MyAccount');
  };

  const handleLive = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
    const {deviceId} = devId;
    if (userInfo) {
      var {name} = userInfo;
      var payloadId = name;
    } else {
      var payloadId = 'Visitor' + ` ${deviceId}`;
    }
    props.nav.navigate('Lives', {payloadId});
    // console.log('live pressed', payloadId);
  };

  const icon = usrInfo == 'Rupee' ? ic_expenses : ic_footer_order;

  const footerStyle =
    Platform.OS === 'ios'
      ? {
          padding: hp(1.5),
          // margin: wp(2),
          position: 'absolute',
          bottom: 0,
          // backgroundColor: '#fff',
        }
      : {
          padding: hp(1.5),
          // margin: wp(2),
          position: 'absolute',
          bottom: 0,
          // backgroundColor: '#fff',
        };

  return (
    <View style={footerStyle}>
      <Shadow
        // inner // <- enable inner shadow
        // useArt // <- set this prop to use non-native shadow on ios
        style={styles.footerContainer}>
        <Pressable
          delayLongPress={150}
          style={styles.footerBottom}
          onPress={handelHome.bind(this)}
          // onLongPress={() => {
          //   Alert.alert(
          //     `Alert!`,
          //     `you can press only once `,
          //     [
          //       {
          //         text: 'Ok',
          //         // onPress: () => block(),
          //       },
          //     ],
          //     {cancelable: true},
          //   );
          // }}
        >
          <View style={styles.footerBottomContainer}>
            <Image source={ic_home_black} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Home</Text>
          </View>
        </Pressable>

        <Pressable
          delayLongPress={150}
          style={styles.footerBottom}
          onPress={handleLive.bind(this)}
          // onLongPress={() => {
          //   Alert.alert(
          //     `Alert!`,
          //     `you can press only once `,
          //     [
          //       {
          //         text: 'Ok',
          //         // onPress: () => block(),
          //       },
          //     ],
          //     {cancelable: true},
          //   );
          // }}
        >
          <View style={styles.footerBottomContainer}>
            <Image source={ic_live} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Live</Text>
          </View>
        </Pressable>

        <Pressable
          delayLongPress={150}
          style={styles.footerBottom}
          onPress={handelWallet.bind(this)}
          // onLongPress={() => {
          //   Alert.alert(
          //     `Alert!`,
          //     `you can press only once `,
          //     [
          //       {
          //         text: 'Ok',
          //         // onPress: () => block(),
          //       },
          //     ],
          //     {cancelable: true},
          //   );
          // }}
        >
          <View style={styles.footerBottomContainer}>
            <Image source={icon} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>Orders</Text>
          </View>
        </Pressable>
        <Pressable
          delayLongPress={150}
          style={styles.footerBottom}
          onPress={handelAccount.bind(this)}
          // onLongPress={() => {
          //   Alert.alert(
          //     `Alert!`,
          //     `you can press only once `,
          //     [
          //       {
          //         text: 'Ok',
          //         // onPress: () => block(),
          //       },
          //     ],
          //     {cancelable: true},
          //   );
          // }}
        >
          <View style={styles.footerBottomContainer}>
            <Image source={ic_footer_profile} style={styles.footerMenuIcon} />
            <Text style={styles.menuTitle}>My Account</Text>
          </View>
        </Pressable>
      </Shadow>
    </View>
  );
};
export default FooterComponent;

const styles = StyleSheet.create({
  footerContainer: {
    height: hp(7.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',

    borderRadius: hp(3.75),

    elevation: 8,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000020',
    shadowRadius: 10,

    width: wp(94),
  },
  footerBottom: {
    flex: 1,
    borderRadius: hp(3.75),
  },
  footerBottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerMenuIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  menuTitle: {
    fontSize: wp(2.2),
    color: '#333',
  },
});
