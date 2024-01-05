import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, Alert, FlatList} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

// icons
import ic_income_exp from 'assets/icons/ic_income_exp.png';
import ic_expenses_exp from 'assets/icons/ic_expenses_exp.png';
import ic_total_exp from 'assets/icons/ic_total_exp.png';

// Components
import WalletIncomeCoponent from 'components/WalletIncomeCoponent';
import showToast from 'components/CustomToast';

export default class WalletExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isLoading: true,
      isListRefreshing: true,
      walletBalance: null,
      walletIncome: null,
      walletExpense: null,
      listItems: null,
      date: null,
      amount: null,
      transactionId: null,
      status: 'No Transaction Found.',
    };
  }
  componentDidMount() {
    this.showIncomeDetails();
    this.showBalance();
  }

  showBalance = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {userId} = userInfo;
        const params = {
          userId,
        };
        this.setState({isLoading: false});
        const response = await makeRequest(
          BASE_URL + 'walletBalance',
          params,
          true,
          false,
        );

        if (response) {
          const {success, isAuthTokenExpired} = response;
          if (success) {
            const {walletBalance, walletIncome, walletExpense} = response;
            this.setState({walletBalance, walletIncome, walletExpense});
          } else {
            if (isAuthTokenExpired === true) {
              Alert.alert(
                'Session Expired',
                'Login Again to Continue!',
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
        }
      }
    } catch (error) {
      Alert.alert(error.message);
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

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.showIncomeDetails();
    } catch (error) {
      console.log(error.message);
    }
  };

  showIncomeDetails = async () => {
    const {listItems} = this.state;
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {userId} = userInfo;
        const params = {
          userId,
        };
        this.setState({isLoading: false});
        const response = await makeRequest(
          BASE_URL + 'walletIncome',
          params,
          true,
          false,
        );

        if (response) {
          const {success, message, isAuthTokenExpired} = response;
          if (success) {
            const {income} = response;
            this.setState({listItems: income, isListRefreshing: false});
          } else {
            this.setState({
              status: message,
              isListRefreshing: false,
            });
            showToast(message);

            if (isAuthTokenExpired === true) {
              Alert.alert(
                'Session Expired',
                'Login Again to Continue!',
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
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  renderItem = ({item}) => (
    <WalletIncomeCoponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {
      listItems,
      walletBalance,
      isListRefreshing,
      status,
      walletExpense,
      walletIncome,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dailyExpTop}>
          <View style={styles.dailyExpTopTitle}>
            <Image
              source={ic_income_exp}
              resizeMode="cover"
              style={styles.titleText}
            />
            <View>
              <Text style={styles.dailyTopTitle}>Income</Text>
              <Text style={styles.dailyTopAmount}>₹{walletIncome}.00</Text>
            </View>
          </View>
          <View style={styles.dailyExpTopTitle}>
            <Image
              source={ic_expenses_exp}
              resizeMode="cover"
              style={styles.titleText}
            />
            <View>
              <Text style={styles.dailyTopTitle}>Expenses</Text>
              <Text style={styles.dailyTopAmount}>₹{walletExpense}.00</Text>
            </View>
          </View>
          <View style={styles.dailyExpTopTitle}>
            <Image
              source={ic_total_exp}
              resizeMode="cover"
              style={styles.titleText}
            />
            <View>
              <Text style={styles.dailyTopTitle}>Total</Text>
              <Text style={styles.dailyTopAmount}>₹{walletBalance}.00</Text>
            </View>
          </View>
        </View>

        {listItems ? (
          <View style={styles.totalExpContainer}>
            <FlatList
              data={listItems}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : (
          <View style={styles.noDataStyle}>
            <Text style={styles.noDataTextStyle}>{status}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
  },
  dailyExpTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: wp(2),
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
  },
  dailyExpTopTitle: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(1),
  },
  titleText: {
    width: wp(7),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
  },
  dailyTopTitle: {
    fontSize: wp(2.5),
  },
  dailyTopAmount: {
    fontSize: wp(3.5),
  },
  totalExpContainer: {
    padding: wp(2),
    flex: 1,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  calendarIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  totalDate: {
    fontSize: wp(3.5),
    flex: 1,
  },
  totalIncome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
  },
  totalIncomeText: {
    fontSize: wp(3),
  },
  balance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  balanceText: {
    fontSize: wp(3),
    color: '#056497',
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
