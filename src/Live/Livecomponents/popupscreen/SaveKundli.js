import React, {PureComponent} from 'react';
import {View, Alert, Image, Text, FlatList} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import styles from '../Style';
// Components

import CustomLoader from 'components/ProcessingLoader';

// Styles
import basicStyles from 'styles/BasicStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';

//firebase
// import {UpdateUserData} from 'screens/Chat/src/network/user';

// import Entypo from 'react-native-vector-icons/Entypo';
//API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';
import {send} from '../../../Live/firebase/message';
import RNFetchBlob from 'rn-fetch-blob';
//Redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from 'Redux/wiseword/wallet';
import {
  userInfoSelectors,
  userInfoOperations,
} from 'Redux/wiseword/userDetails';
import {availableBalanceOperations} from 'Redux/wiseword/availableBalance';
import {sessionOperations} from 'Redux/wiseword/session';
// import {showToast} from 'components/CustomToast';

class ReportLive extends PureComponent {
  constructor(props) {
    super(props);
    const data = this.props.data;
    this.parentView = null;
    this.state = {
      isLoading: true,
      data,
      currency: '',
    };
  }

  componentDidMount() {
    this.handleCurrency();
  }

  handleCurrency = async () => {
    const curre = await getData(KEYS.NEW_CURRENCY);
    this.setState({currency: curre, isLoading: false});
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };
  //* for login
  handleLogin = async () => {
    const {leaveChanel} = this.props;
    await leaveChanel();
  };
  //* for login
  handleRecharge = () => {
    const {miniBalance} = this.props;
    this.props.nav.navigate('RechargeWallet', {miniBalance});
    // this.props.nav.navigate('Wallet');
    // nsNavigate('RechargeWallet',);
  };
  handleGiftPay = async item => {
    try {
      const {expertId, channelId, Balance, channelName, uid} = this.props;
      const {price, id, image} = item;

      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You need to Login first.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      } else if (Balance < price) {
        Alert.alert(
          'Aapke Pass',
          'Please Recharge !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'Recharge',
              onPress: this.handleRecharge,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }

      const base64ImageData = await this.encodeImageToBase64(image);
      let url = `data:image/jpeg;base64,${base64ImageData}`;
      const {name, payloadId, deviceId} = userInfo;

      const params = {
        expertId,
        channelId,
        giftId: id,
        deviceId,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Customer/giftToExpertNew',
        params,
        true,
        false,
      );

      if (response) {
        const {success, isLogOut, message} = response;
        if (isLogOut !== true) {
          if (success) {
            var date = Date();
            // let source = 'data:image/jpg;base64,' + base64ImageData;
            send(
              '',
              channelName,
              uid,
              date,
              payloadId,
              name,
              '',
              url,
              true,
              url,
            )
              .then(() => {})
              .catch(err => Alert.alert(err));

            this.handleApply();
            showToast(message);
          } else {
            showToast(message);
          }
        } else {
          Alert.alert(
            'Aapke Pass',
            `${message}`,
            [
              {
                text: 'OK',
              },
            ],
            {
              cancelable: false,
            },
          );
          this.handleLogoutFromDevice();
          return;
        }
      }
    } catch (e) {
      console.warn('error message', e);
    }
  };
  //*Logout From Device
  handleLogoutFromDevice = async () => {
    const userInfo = await this.props.userInfo;
    const {mobile} = userInfo;
    const m_No = parseInt(mobile, 10);

    try {
      const params = {
        mobile: m_No,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Customer/logOut',
        params,
      );
      if (response && response.success) {
        const {message} = response;

        clearData();
        this.props.resetLoggedInUser();
        this.props.resetBalance();
        this.props.logout();
        await this.props.navigation.navigate('Home');
      } else {
        console.log('logout not possible at this time');
      }
    } catch (e) {
      console.log('error in logout', e);
    }
  };
  //*Image Encoder
  encodeImageToBase64 = async url => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {data} = this.state;
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupKundaliContainer}>
          <Text style={{fontWeight: '700', paddingVertical: wp(3)}}>Gifts</Text>
          <View>
            <FlatList
              data={data}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    underlayColor="#fd6c3380"
                    style={[
                      basicStyles.flexOne,
                      basicStyles.alignCenter,
                      {
                        borderWidth: 1,
                        borderColor: '#ccc',
                        margin: wp(0.5),
                        paddingVertical: wp(2),
                      },
                    ]}
                    onPress={() => this.handleGiftPay(item)}>
                    <View>
                      <Image
                        source={{uri: item.image}}
                        style={styles.astroImage}
                      />
                      <Text
                        style={[basicStyles.heading, basicStyles.textAlign]}>
                        {item.name}
                      </Text>
                      {this.state.currency === 'Rupee' ? (
                        <Text
                          style={[basicStyles.heading, basicStyles.textAlign]}>
                          ₹ {item.price}
                        </Text>
                      ) : (
                        <Text
                          style={[basicStyles.heading, basicStyles.textAlign]}>
                          $ {item.dollar_price}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              inverted
              numColumns={5}
              // contentContainerStyle={basicStyles.padding}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  isMiniBalance: transactionSelectors.isMiniBalance(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});

const mapDispatchToProps = {
  getWalletBalance: transactionOperations.getWalletBalance,
  resetLoggedInUser: userInfoOperations.resetLoggedInUser,
  logout: sessionOperations.logout,
  resetBalance: availableBalanceOperations.resetBalance,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportLive);
