import React, {PureComponent} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/CustomLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
// Components
import HeaderComponents from 'components/HeaderComponents';
import TotalPaymentListComponent from 'components/TotalPaymentListComponent';

class TotalPaymentScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      paymentInfo: [],
      message: '',
    };
  }
  componentDidMount() {
    this.showTotalPayment();
  }

  showTotalPayment = async () => {
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/paymentHistory',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        const {paymentInfo} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({paymentInfo, message, isLoading: false});
      } else {
        this.setState({message, paymentInfo: null, isLoading: false});
        showToast(message);
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
            [
              {
                text: 'OK',
              },
            ],
            {
              cancelable: false,
            },
          );
          this.handleTokenExpire();
        }
      }
    } else {
      this.setState({message: 'No Payment History Available'});
    }
  };
  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };
  earningItem = ({item}) => (
    <TotalPaymentListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  render() {
    const {paymentInfo, message, isLoading} = this.state;

    if (paymentInfo) {
      var {totalPayment, paymentDetails} = paymentInfo;
    } else {
    }

    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents
          headerTitle="Total Payments"
          nav={this.props.navigation}
        />
        {paymentInfo ? (
          <View style={basicStyles.mainContainer}>
            <View
              style={[
                // basicStyles.marginTop,
                // basicStyles.marginHorizontal,
                basicStyles.padding,
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.whiteBackgroundColor,
              ]}>
              <Text style={basicStyles.heading}>Total Payment</Text>
              <Text style={[basicStyles.heading, {color: '#ff648a'}]}>
                ₹ {paymentInfo.totalPayment}
              </Text>
            </View>
            <View style={basicStyles.flexOne}>
              <FlatList
                data={paymentInfo.paymentDetails}
                renderItem={this.earningItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={basicStyles.padding}
              />
            </View>
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageTxt}>{message}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  messageTxt: {
    fontSize: 20,
  },
});

export default TotalPaymentScreen;
