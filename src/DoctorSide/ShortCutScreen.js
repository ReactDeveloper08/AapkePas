import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

import EditShortcutPopup from 'popup/EditShortcutPopup';

// Components
import HeaderComponents from 'components/HeaderComponents';
import ShortcutListComponent from 'components/ShortcutListComponent';
import CustomLoader from 'components/ProcessingLoader';
//vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Popup
import AddTemplatePopup from 'popup/AddTemplatePopup';
//Api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';

class Shortcuts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      templateList: '',
      isLoading: true,
      message: '',
      showQualityPopup: false,
    };
  }

  componentDidMount() {
    this.showTempLets();
  }

  showTempLets = async () => {
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/userTemplateList',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        const {templateList} = response;
        this.setState({templateList, message, isLoading: false});
      } else {
        this.setState({message, templateList: null, isLoading: false});
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
  handleEditPopup = item => {
    this.template = item;
    this.setState({showQualityPopup: true});
  };

  renderItem = ({item}) => (
    <ShortcutListComponent
      item={item}
      nav={this.props.navigation}
      handleEditPopup={this.handleEditPopup}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;
  handleWalletOption = () => {
    this.setState({showAddTempPopup: true});
  };
  closePopup = () => {
    this.setState({showQualityPopup: false});
  };
  closeAddTempPopup = () => {
    this.setState({showAddTempPopup: false});
  };

  render() {
    const {showQualityPopup, showAddTempPopup, isLoading} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponents headerTitle="Shortcuts" nav={this.props.navigation} />
        <View
          style={[basicStyles.mainContainer, basicStyles.lightBackgroundColor]}>
          {this.state.templateList ? (
            <FlatList
              data={this.state.templateList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              // horizontal={true}
              // numColumns="4"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={{padding: wp(3)}}
            />
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={{fontSize: 20}}>{this.state.message}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={this.handleWalletOption}
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              bottom: hp(2),
              right: wp(4),
            }}>
            <MaterialCommunityIcons
              name="plus-circle-outline"
              color="#4faee4"
              size={50}
            />
          </TouchableOpacity>
        </View>
        {showAddTempPopup && (
          <AddTemplatePopup
            closePopup={this.closeAddTempPopup}
            refresh={this.showTempLets}
          />
        )}
        {showQualityPopup === true && (
          <EditShortcutPopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            item={this.template}
            fetchCartCount={this.fetchCartCount}
            cartCountUpdate={this.cartCountUpdate}
            refresh={this.showTempLets}
          />
        )}
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

export default Shortcuts;
