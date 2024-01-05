import React, {PureComponent} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList, Text} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';
import FollowingListComponent from 'components/FollowingListComponent';

// Popup
import EditTemplatePopup from 'popup/EditTemplatePopup';

class FollowingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      followersList: [],
      isLoading: false,
      message: '',
    };
  }
  componentDidMount() {
    this.showFolloingData();
  }

  showFolloingData = async () => {
    this.setState({isLoading: true});
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/followersList',
      params,
      true,
      false,
    );
    if (response && response.success) {
      const {followersList, message} = response;
      // storeData(KEYS.WALLET_BALANCE, walletBalance);
      this.setState({followersList, message, isLoading: false});
    } else {
      const {message} = response;
      this.setState({message, followersList: null, isLoading: false});
      showToast(message);
    }
  };

  earningItem = ({item}) => (
    <FollowingListComponent
      item={item}
      nav={this.props.navigation}
      refresh={this.showFolloingData}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  handleWalletOption = () => {
    this.setState({showWalletPopup: true});
  };

  closePopup = () => {
    this.setState({showWalletPopup: false});
  };

  render() {
    const {showWalletPopup, followersList, isLoading, message} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents headerTitle="Followers" nav={this.props.navigation} />
        <View style={basicStyles.mainContainer}>
          {followersList != null ? (
            <View style={basicStyles.flexOne}>
              <FlatList
                data={followersList}
                renderItem={this.earningItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={basicStyles.padding}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.messageTxt}>
              <Text style={styles.messageStyle}>{message}</Text>
            </View>
          )}
        </View>
        {showWalletPopup && <EditTemplatePopup closePopup={this.closePopup} />}
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: '#fd6c33',
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    marginTop: wp(2),
    alignSelf: 'flex-end',
    marginRight: wp(2),
    borderRadius: wp(5),
  },
  iconRow: {
    marginRight: wp(1),
  },
  messageTxt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageStyle: {
    fontWeight: '700',
    fontSize: 15,
    fontStyle: 'italic',
  },
});

export default FollowingScreen;
