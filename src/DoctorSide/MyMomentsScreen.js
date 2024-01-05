import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

//components
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, clearData} from 'api/UserPreference';
// Icons
import ic_add_post from 'assets/icons/ic_add_post.png';

// Components
import HeaderComponents from 'components/HeaderComponents';
import MyMomentsListComponent from 'components/MyMomentsListComponent';

class FollowingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      moments: '',
      message: '',
    };
  }
  componentDidMount() {
    this.showMyMoments();
  }
  showMyMoments = async () => {
    this.setState({isLoading: true});
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/moments',
      params,
      true,
      false,
    );
    if (response && response.success) {
      const {moments} = response;
      this.setState({moments, isLoading: false});
    } else {
      const {message} = response;
      this.setState({message, moments: null, isLoading: false});
    }
  };
  renderItem = ({item}) => (
    <MyMomentsListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleAddPost = () => {
    this.props.navigation.navigate('writePost');
  };

  render() {
    const {isLoading} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents headerTitle="Moments" nav={this.props.navigation} />
        {this.state.moments ? (
          <View style={basicStyles.mainContainer}>
            <FlatList
              data={this.state.moments}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <View style={styles.momentContainer}>
            <Text style={styles.txtMessage}>{this.state.message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.addIconContainer}
          onPress={this.handleAddPost}
          underlayColor="#ff648a80">
          <Image
            source={ic_add_post}
            resizeMode="cover"
            style={styles.addPostIcon}
          />
        </TouchableOpacity>
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    // height: 1,
    backgroundColor: '#f2f1f1',
    height: 4,
  },
  addIconContainer: {
    backgroundColor: '#9bdbff',
    height: wp(15),
    width: wp(15),
    borderRadius: wp(7.5),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: hp(3),
    right: wp(4),
  },
  addPostIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  listContainer: {},
  txtMessage: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '700',
  },
  momentContainer: {
    flex: 1,
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowingScreen;
