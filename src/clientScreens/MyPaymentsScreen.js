import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

//styles
import basicStyles from 'styles/BasicStyles';
//api
import {KEYS, getData, clearData} from 'api/UserPreference';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import PaymentComponents from 'components/PaymentComponents';
import CustomLoader from 'components/ProcessingLoader';
//Redux
import {connect} from 'react-redux';
import {
  transactionOperations,
  transactionSelectors,
} from '../Redux/wiseword/wallet';
import {userInfoSelectors} from '../Redux/wiseword/userDetails';
import {availableBalanceOperations} from 'Redux/wiseword/availableBalance';

import {
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';

class WalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isListRefreshing: false,
      isLoading: true,
      walletBalance: 0,
      consultationsInfo: '',
      currency: '',
    };
  }

  componentDidMount() {
    this.showBalance();
  }
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.showBalance();
    } catch (error) {
      console.log(error.message);
    }
  };
  showBalance = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const currency = await getData(KEYS.NEW_CURRENCY);
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
          cancelable: false,
        },
      );
      return;
    }
    const params = null;
    await this.props.getHistory(params);
    if (this.props.isHistoryUpdated) {
      const {success} = this.props.isHistoryUpdated;
      if (success) {
        const {consultationsInfo, walletBalance} = this.props.isHistoryUpdated;
        this.setState({
          isLoading: false,
          isListRefreshing: false,
          currency,
          walletBalance: walletBalance,
          consultationsInfo: consultationsInfo,
        });
        await this.props.saveAvailableBalance(walletBalance);
      } else {
        const {walletBalance} = this.props.isHistoryUpdated;
        await this.props.saveAvailableBalance(walletBalance);
        this.setState({
          walletBalance: walletBalance,
          consultationsInfo: '',
          isLoading: false,
          isListRefreshing: false,
        });
      }
    } else {
      this.setState({
        consultationsInfo: '',
        isLoading: false,
        isListRefreshing: false,
      });
    }
  };
  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  renderItem = ({item}) => (
    <PaymentComponents
      item={item}
      nav={this.props.navigation}
      currency={this.state.currency}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {walletBalance, consultationsInfo, currency, isLoading} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="My Consultations"
          showGradient
          symbol={currency}
          balance={walletBalance}
          nav={this.props.navigation}
        />
        {consultationsInfo ? (
          <View style={styles.addWallet}>
            <View style={styles.packageContainer}>
              <FlatList
                data={consultationsInfo}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            </View>
          </View>
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>
              No Consultation Data
            </Text>
          </View>
        )}
        <FooterComponent nav={this.props.navigation} />
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isHistoryUpdated: transactionSelectors.isHistoryUpdated(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});

const mapDispatchToProps = {
  getHistory: transactionOperations.getHistory,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
const styles = StyleSheet.create({
  listContainer: {
    padding: wp(3),
    paddingTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },
  walletAmountContainer: {
    backgroundColor: '#ccc',
    width: wp(94),
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    borderRadius: 15,
    marginVertical: wp(3),
  },
  walletIcon: {
    width: wp(13),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  walletTitle: {
    fontSize: wp(4),
    color: '#fff',
  },
  walletAmount: {
    fontSize: wp(5),
    color: '#fff',
    fontWeight: '700',
  },
  addWallet: {
    flex: 1,
  },
  rechargeTitle: {
    fontSize: wp(4),
  },
  rechargeSubTitle: {
    fontSize: wp(3.5),
  },

  separator: {
    height: wp(2),
    // backgroundColor: '#f2f1f1',
  },
  msgData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
