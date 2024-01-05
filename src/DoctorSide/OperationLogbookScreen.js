import React, {PureComponent} from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';
import LogbookListComponent from 'components/LogbookListComponent';

//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, getData} from 'api/UserPreference';

class OperationOutlook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      logs: [],
      earningData: [
        {
          status: 'Switched Call to OFFLINE',
          dateTime: '04:15 PM 17/12/2020',
        },
      ],
    };
  }
  componentDidMount() {
    this.showOperationLogsData();
  }

  showOperationLogsData = async () => {
    this.setState({isLoading: true});
    const params = null;
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/operationLogs',
          params,
          true,
          false,
        ),
      );
      reject(response);
    })
      .then(response => {
        const {logs, message} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({logs, message, isLoading: false});
      })
      .catch(message => {
        this.setState({message, logs: null, isLoading: false});
        showToast(message);
      });
  };
  earningItem = ({item}) => (
    <LogbookListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => (
    <View style={{height: 4, backgroundColor: '#f2f1f1'}} />
  );

  render() {
    const {isLoading} = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.lightBackgroundColor]}>
        <HeaderComponents
          headerTitle="Operation Logbook"
          nav={this.props.navigation}
        />
        <View style={basicStyles.mainContainer}>
          <View style={basicStyles.flexOne}>
            <FlatList
              data={this.state.logs}
              renderItem={this.earningItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              // contentContainerStyle={{padding: wp(2)}}
            />
          </View>
        </View>
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

export default OperationOutlook;
