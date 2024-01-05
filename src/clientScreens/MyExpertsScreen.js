import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from 'components/HeaderComponent';
import MyExpertsListComponent from 'components/MyExpertsListComponent';
import ProcessingLoader from 'components/ProcessingLoader';

// import ExpertsListComponent from 'components/ExpertsListComponent';
//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  signupInputWidth,
} from '../../utility/styleHelper/appStyle';

export default class ExpertsListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: null,
      isLoading: true,
      name: null,
      id: null,
      expertise: null,
      qualification: null,
      image: null,
      languages: null,
      status: null,
      isListRefreshing: false,
      currency: '',
    };
  }

  componentDidMount() {
    this.myExpertListScreen();
  }

  myExpertListScreen = async () => {
    try {
      try {
        const info = await getData(KEYS.USER_INFO);
        const currency = await getData(KEYS.NEW_CURRENCY);
        // this.setState({isLoading: true});
        if (info) {
          const {userId} = info;
          const params = {
            userId,
          };
          const response = await makeRequest(
            BASE_URL + 'api/Customer/followingList',
            params,
            true,
            false,
          );
          if (response) {
            const {success, message, isAuthTokenExpired} = response;
            if (success) {
              // const {name, expertise, qualification, image, languages} = response;
              const {astrologers} = response;
              this.setState({
                listItems: astrologers,
                status: message,
                currency,
                isLoading: false,
                isListRefreshing: false,
              });
            } else {
              this.setState({
                listItems: null,
                status: message,
                currency,
                isLoading: false,
                isListRefreshing: false,
              });
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
        console.error('error in code');
      }
    } catch (error) {
      Alert.alert('No expert was choosen by Patient');
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
      this.myExpertListScreen();
    } catch (error) {
      console.log(error.message);
    }
  };
  renderItem = ({item}) => (
    <MyExpertsListComponent
      item={item}
      nav={this.props.navigation}
      currency={this.state.currency}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {status, listItems} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Followings"
          navAction="back"
          // showGradient
          nav={this.props.navigation}
        />
        {listItems ? (
          <View style={styles.contentContainer}>
            <FlatList
              data={this.state.listItems}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : (
          <View style={styles.noDataStyle}>
            <Text style={styles.noDataTextStyle}>{status}</Text>
          </View>
        )}

        <View />
        {this.state.isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchCategory: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: wp(10),
    paddingHorizontal: wp(3),
    margin: wp(3),
    marginTop: hp(3),
    alignItems: 'center',
    height: 36,
  },
  input: {
    height: 36,
    fontSize: wp(3.5),
    flex: 1,
  },
  searchIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  separator: {
    marginBottom: wp(3),
  },
  listContainer: {},
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
