import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
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

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {clearData, getData, KEYS} from 'api/UserPreference';

class OrderAllTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      serviceHistory: null,
      isLoading: false,
      message: '',
      isListRefreshing: false,
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
    const params = {type: 'ongoing'};
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/callHistory',
          params,
          true,
          false,
        ),
      );
      reject(response);
    })
      .then(response => {
        const {serviceHistory, message} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({
          serviceHistory,
          message,
          isLoading: false,
          isListRefreshing: false,
        });
      })
      .catch(message => {
        this.setState({
          message,
          serviceHistory: null,
          isLoading: false,
          isListRefreshing: false,
        });
        showToast(message);
      });
  };
  chatItem = ({item}) => (
    <OrderHistoryTabListComponent item={item} nav={this.props.nav} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  render() {
    return (
      <View style={basicStyles.container}>
        <ScrollView
          contentContainerStyle={basicStyles.flexOne}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <FlatList
            data={this.state.serviceHistory}
            renderItem={this.chatItem}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.itemSeparator}
            showsHorizontalScrollIndicator={false}
            refreshing={this.state.isListRefreshing}
            onRefresh={this.handleListRefresh}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default OrderAllTab;
