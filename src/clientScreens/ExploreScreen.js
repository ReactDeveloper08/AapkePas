import React, {PureComponent} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';

// Loader
import CustomLoader from 'components/ProcessingLoader';
import {showToast} from 'components/CustomToast';
// Components
import ExploreListComponent from 'components/ExploreListComponent';
// import HomeExploreScreen from '../HomeExploreScreen';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class HomeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      post: '',
      isLoading: false,
      isListRefreshing: false,
    };
  }
  componentDidMount() {
    this.showExploreData();
  }
  showExploreData = async () => {
    this.setState({isLoading: true});
    const userInfo = await getData(KEYS.USER_INFO);
    if (userInfo) {
      const {userId} = userInfo;
      const params = {payloadId: userId};
      const response = await makeRequest(
        BASE_URL + 'api/Customer/newsFeed',
        params,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          const {posts} = response;
          this.setState({posts, isLoading: false, isListRefreshing: false});
        } else {
          this.setState({
            posts: '',
            message,
            isLoading: false,
            isListRefreshing: false,
          });
          showToast(message);
        }
      }
    } else {
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Customer/newsFeed',
        params,
      );
      if (response) {
        const {success, message} = response;

        if (success) {
          const {posts} = response;
          this.setState({posts, isLoading: false, isListRefreshing: false});
        } else {
          this.setState({message, isLoading: false, isListRefreshing: false});
          showToast(message);
        }
      }
    }
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.showExploreData();
    } catch (error) {
      console.log(error.message);
    }
  };
  renderItem = ({item}) => (
    <ExploreListComponent
      item={item}
      nav={this.props.navigation}
      refresh={() => this.showExploreData()}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Explore"
          navAction="back"
        />
        <View style={[basicStyles.mainContainer]}>
          <View style={styles.exploreContainer}>
            {this.state.posts ? (
              <FlatList
                data={this.state.posts}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                //   horizontal={true}
                // numColumns="4"
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : (
              <View style={styles.msgData}>
                <Text>No Posts</Text>
              </View>
            )}
          </View>

          <FooterComponent nav={this.props.navigation} />
        </View>
        {this.state.isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  exploreContainer: {
    // backgroundColor: '#fffcd5',
    flex: 1,
    // padding: wp(3),
  },
  msgData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    // borderBottomColor: '#f2f1f1',
    // borderBottomWidth: 4,
  },
  listContainer: {
    padding: wp(3),
  },
});
