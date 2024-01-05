import React, {useState, useEffect} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/dist/Ionicons';

import {Shadow} from 'react-native-neomorph-shadows';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Icons
import ic_back from 'assets/icons/ic_back.png';
import ic_home_white from 'assets/icons/ic_home_white.png';
// import ic_header_notification from 'assets/icons/ic_wallet_pink.png';
import ic_header_notification from 'assets/icons/wallet.png';
//style
import basicStyles from 'styles/BasicStyles';
//api
import {KEYS, getData} from 'api/UserPreference';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const HeaderComponent = props => {
  const [currency, setMoney] = useState('');
  const {
    showGradient,
    headerTitle,
    nav,
    navAction,
    navActionBack,
    symbol,
    balance,
  } = props;

  useEffect(() => {
    currencySVG();
  }, []);

  const toggleDrawer = () => {
    console.log('You Press');
  };

  const handleBack = () => {
    nav.pop();
  };
  const handleHomeBack = () => {
    props.nav.navigate('Homes');
  };

  let handleNavAction = toggleDrawer;
  let navIcon = ic_home_white;

  if (navAction === 'back') {
    handleNavAction = handleBack;
    navIcon = ic_back;
  }
  if (navActionBack === 'back') {
    handleNavAction = handleHomeBack;
    navIcon = ic_back;
  }

  const handleNotification = () => {
    props.nav.navigate('WalletHistory');
  };
  const handleLoginWallet = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const wallet = {userInfo};
    props.nav.navigate('Login');
    // console.log('wallet call' + wallet);
  };
  const handleWallet = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        // props.nav.navigate('WalletHistory');
        props.nav.navigate('Vault');
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
    } catch (e) {}
  };
  const currencySVG = async () => {
    const money = await getData(KEYS.NEW_CURRENCY);
    setMoney(money);
  };
  return showGradient ? (
    <View style={styles.headerContainer}>
      <Shadow style={styles.mainHeader}>
        <Touchable underlayColor="transparent" onPress={handleNavAction}>
          <Icon name="chevron-back-sharp" size={20} color="#333" />
        </Touchable>
      </Shadow>

      <Text style={styles.headerTitle}>{headerTitle}</Text>

      <Touchable
        onPress={handleWallet}
        style={[
          basicStyles.directionRow,
          styles.walletButton,
          basicStyles.alignCenter,
        ]}>
        <Image
          source={ic_header_notification}
          resizeMode="cover"
          style={basicStyles.iconRow}
        />
        {currency === 'Rupee' ? (
          <Text style={{color: '#fff'}}>₹ {balance} </Text>
        ) : (
          <Text style={{color: '#fff'}}>$ {balance} </Text>
        )}
      </Touchable>
    </View>
  ) : (
    <View style={styles.headerContainer}>
      <Shadow style={styles.mainHeader}>
        <Touchable underlayColor="transparent" onPress={handleNavAction}>
          <Icon name="chevron-back-sharp" size={26} color="#333" />
        </Touchable>
      </Shadow>

      <Text style={styles.headerTitle}>{headerTitle}</Text>
    </View>
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(8),

    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    // colors: '#ff539b',
  },

  mainHeader: {
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#0002',
    shadowRadius: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: '#fff',
    width: wp(8),
    height: wp(8),
    marginRight: wp(3),
  },
  headerIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
    // marginRight: wp(3),
  },
  headerTitle: {
    fontSize: wp(3.8),
    color: '#333',
    fontWeight: '700',
    flex: 1,
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: wp(0.5),
    borderRadius: wp(4),
  },
  walletIcon: {
    width: wp(5),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
  },
  walletButton: {
    backgroundColor: '#4baee9',
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    borderRadius: hp(2.75),
    height: hp(4),
  },
});
