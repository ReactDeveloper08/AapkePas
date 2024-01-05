import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';

import basicStyles from 'styles/BasicStyles';
// Components
import OrderHistoryTabListComponent from 'components/OrderHistoryTabListComponent';

//components
import {showToast} from 'components/CustomToast';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData, getData, KEYS} from 'api/UserPreference';

class OrderAllTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      serviceHistory: '',
      isLoading: false,
      message: '',
      isListRefreshing: false,
      info: '',
    };
  }
  componentDidMount() {
    this.showHistoryOrder();
  }
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };
  showHistoryOrder = async () => {
    this.setState({isLoading: true});
    const params = {type: 'missed'};
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
          isLoading: false,
          isListRefreshing: false,
          info,
        });
      } else {
        this.setState({
          message,
          serviceHistory: '',
          isLoading: false,
          isListRefreshing: false,
          info,
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
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => (
    <View style={{height: 4, backgroundColor: '#f2f1f1'}} />
  );

  render() {
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
});

export default OrderAllTab;
