import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

//components
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';

// Icons
import ic_add_post from 'assets/icons/ic_add_post.png';

// Components
import HeaderComponents from 'components/HeaderComponents';
import MyPostListComponent from 'components/MyPostListComponent';

class MyPosts extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
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
      BASE_URL + 'api/Astrologers/expertGalleryListing',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        const {posts} = response;
        this.setState({posts, message, isLoading: false});
      } else {
        this.setState({message, posts: [], isLoading: false});
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
  renderItem = ({item}) => (
    <MyPostListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleMoments = () => {
    this.props.navigation.navigate('MyMoments');
  };

  handleAddPost = () => {
    this.props.navigation.navigate('writePost');
  };

  render() {
    const {isLoading} = this.state;
    const viewStyle =
      Platform.OS === 'ios'
        ? {
            backgroundColor: '#4cade2',
            position: 'absolute',
            marginTop: wp(5),
            right: wp(3),
            height: hp(4),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: wp(4),
            borderRadius: hp(2),
            top: hp(1),
          }
        : {
            backgroundColor: '#4cade2',
            position: 'absolute',
            right: wp(3),
            height: hp(4),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: wp(4),
            borderRadius: hp(2),
            top: hp(1),
          };
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents headerTitle="My Posts" nav={this.props.navigation} />
        <TouchableOpacity
          style={viewStyle}
          onPress={this.handleMoments}
          underlayColor="#fff">
          <Text style={basicStyles.heading}>View Moments</Text>
        </TouchableOpacity>
        <View style={basicStyles.mainContainer}>
          {/* {this.state.posts.length !== 0 ? ( */}
          <FlatList
            data={this.state.posts}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
          {/* ) : (
              <View style={styles.msgNoData}>
                <Text>{this.state.message}</Text>
              </View>
            )} */}

          <TouchableOpacity
            style={styles.addIconContainer}
            onPress={this.handleAddPost}
            underlayColor="#ff648a">
            <Image
              source={ic_add_post}
              resizeMode="cover"
              style={styles.addPostIcon}
            />
          </TouchableOpacity>
        </View>
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  addIconContainer: {
    backgroundColor: '#4cade2',
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
  separator: {
    height: 4,
    backgroundColor: '#f2f1f1',
  },
  msgNoData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPosts;
