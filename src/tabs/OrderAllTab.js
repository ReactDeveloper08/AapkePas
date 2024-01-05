import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
// Components
import OrderHistoryTabListComponent from 'components/OrderHistoryTabListComponent';

//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData, getData, KEYS} from 'api/UserPreference';

class OrderAllTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      serviceHistory: '',
      isLoading: false,
      isListRefreshing: false,
      message: '',
      info: '',
    };
  }

  componentDidMount() {
    this.showHistoryOrder();
  }
  handleListRefresh = () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.showHistoryOrder();
    } catch (error) {
      console.log(error.message);
    }
  };
  showHistoryOrder = async () => {
    this.setState({isLoading: true});
    const params = {type: 'all'};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/callHistory',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/callHistory');
    const info = await getData(KEYS.USER_INFO);
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        const {serviceHistory} = response;
        this.setState({
          serviceHistory,
          message,
          info,
          isLoading: false,
          isListRefreshing: false,
        });
      } else {
        this.setState({
          message,
          info,
          serviceHistory: '',
          isLoading: false,
          isListRefreshing: false,
        });
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
    }
  };
  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };
  chatItem = ({item}) => (
    <OrderHistoryTabListComponent
      item={item}
      nav={this.props.nav}
      userData={this.state.info}
      refresh={this.showHistoryOrder}
    />
  );

  keyExtractor = (item, index) => item.toString();

  itemSeparator = () => (
    <View style={{height: wp(2), backgroundColor: '#fff'}} />
  );

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <View style={basicStyles.container}>
        <View style={basicStyles.flexOne}>
          {this.state.serviceHistory ? (
            <FlatList
              data={this.state.serviceHistory}
              renderItem={this.chatItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsHorizontalScrollIndicator={false}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.msgData}>
              <Text>{this.state.message}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  msgData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: wp(3),
  },
});

export default OrderAllTab;
