import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import AstroDetailPhotoListComponent from 'components/AstroDetailPhotoListComponent';

import AstroExpertiseListComponent from 'components/AstroExpertiseListComponent';
import AstroReviewListComponent from 'components/AstroReviewListComponent';

// Styles
import basicStyles from 'styles/BasicStyles';

// Icons
import ic_voice_call from 'assets/icons/ic_voice_call.png';

// Material Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//insta facebook loader
// import {
//   FacebookLoader,
//   InstagramLoader,
// } from 'react-native-easy-content-loader';

import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';

export default class AstrologerDetailScreen extends Component {
  constructor(props) {
    super(props);
    const endDataResponse = this.props.navigation.getParam('endDataResponse');

    this.state = {
      ...endDataResponse,
      astrologerInfo: [],
      referralInfo: '',
      isSelected: false,
      contentLoading: true,
      follow: '',
    };
  }

  componentDidMount() {
    this.showAstrologerDetails();
  }

  showAstrologerDetails = async () => {
    // const userInfo = await getData(KEYS.USER_INFO);
    // const id = this.props.navigation.getParam('id', null);
    const params = null;
    const getProfile = await makeRequest(
      BASE_URL + 'api/Astrologers/astrologerProfile',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/astrologerProfile');
    if (getProfile) {
      const {success, message, isAuthTokenExpired} = getProfile;
      if (success) {
        const {astrologerInfo} = getProfile;
        this.setState({astrologerInfo, contentLoading: false});
        const {follow} = this.state.astrologerInfo;
        this.setState({follow});
      } else {
        this.setState({contentLoading: false});
        this.setState({message});
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

  listItem = ({item}) => (
    <AstroDetailPhotoListComponent
      item={item}
      nav={this.props.navigation}
      showImage={this.handleImageViewPopup}
      refresh={this.showAstrologerDetails}
    />
  );
  skillItem = ({item}) => {
    return (
      <View style={styles.voiceCallContainer}>
        <Image
          source={{uri: item.gift_icon}}
          resizeMode="cover"
          style={styles.skillIcon}
        />

        <Text style={[basicStyles.flexOne, basicStyles.heading]}>
          {item.gift_name}
        </Text>
        <Text style={[basicStyles.text]}>₹ {item.gift_price}</Text>
      </View>
    );
  };
  expertiseItem = ({item}) => (
    <AstroExpertiseListComponent item={item} nav={this.props.navigation} />
  );
  reviewItem = ({item}) => (
    <AstroReviewListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  reviewSeparator = () => <View style={styles.reviewSeparator} />;

  handleMoreInfo = () => {
    this.props.navigation.navigate('astro_Home');
  };

  render() {
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View
          style={[basicStyles.mainContainer, basicStyles.lightBackgroundColor]}>
          <View style={basicStyles.mainContainer}>
            <View style={styles.linearGradient}>
              <TouchableOpacity
                onPress={this.handleMoreInfo}
                style={styles.editIcon}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  color="#333"
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.astroInfoContainer}>
                <View style={styles.photoContainers}>
                  <Image
                    source={{uri: this.state.expertImage}}
                    resizeMode="cover"
                    style={styles.astroPhoto}
                  />
                </View>
                <View>
                  <Text style={styles.astroName}>{this.state.expertName}</Text>
                  <Text style={[basicStyles.text, basicStyles.textAlign]}>
                    Thank You For Your Hard Work
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.mainDetail}>
              <View style={styles.infoContainer}>
                <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                  <Text style={styles.value}>{this.state.totalViewer}</Text>
                  <Text style={[basicStyles.text, basicStyles.offWhiteColor]}>
                    Viewers
                  </Text>
                </View>
                <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                  <Text style={styles.value}>{this.state.followerCount}</Text>
                  <Text style={[basicStyles.text, basicStyles.offWhiteColor]}>
                    Followers
                  </Text>
                </View>
                <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                  <Text style={styles.value}>{this.state.totalCommission}</Text>
                  <Text style={[basicStyles.text, basicStyles.offWhiteColor]}>
                    Earning
                  </Text>
                </View>
                <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                  <Text style={styles.value}>{this.state.liveTime}</Text>
                  <Text style={[basicStyles.text, basicStyles.offWhiteColor]}>
                    Live Time
                  </Text>
                </View>
              </View>

              <View style={styles.mainDetail2}>
                <View style={[basicStyles.padding, basicStyles.offWhiteColor]}>
                  {/* <View
                    style={[
                      basicStyles.separatorHorizontal,
                      {marginBottom: hp(1.2)},
                    ]}
                  /> */}
                  <Text style={[styles.headings]}>Voice Call</Text>
                  <View style={styles.voiceCallContainer}>
                    <Image
                      source={ic_voice_call}
                      resizeMode="cover"
                      style={styles.skillIcon}
                    />

                    <Text style={[basicStyles.flexOne, basicStyles.heading]}>
                      Voice
                    </Text>
                    <Text style={[basicStyles.text]}>
                      X {this.state.totalVoice}
                    </Text>
                  </View>
                </View>

                <View>
                  {/* <View
                    style={[
                      basicStyles.separatorHorizontal,
                      {marginBottom: hp(1.2)},
                    ]}
                  /> */}
                  <Text style={[styles.headings, {paddingHorizontal: wp(3)}]}>
                    Gifts
                  </Text>
                  <FlatList
                    data={this.state.giftedList}
                    renderItem={this.skillItem}
                    keyExtractor={this.keyExtractor}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        {this.state.contentLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  followouter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(20),
    paddingHorizontal: wp(3),
    height: hp(4),
    borderRadius: hp(2),
    // backgroundColor: 'dodgerblue',
    borderColor: '#fff',
    // backgroundColor: '#bc0f17',
    backgroundColor: '#fff',
  },

  listContainer: {
    padding: wp(3),
    paddingTop: wp(1),
  },

  voiceCallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    marginBottom: wp(1),
    borderRadius: 5,
    backgroundColor: '#9bdbff',
    shadowColor: '#0006',
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  mainDetail: {
    backgroundColor: '#4cade2',
    flex: 1,
    borderTopRightRadius: wp(10),
    borderTopLeftRadius: wp(10),
  },

  mainDetail2: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopRightRadius: wp(10),
    borderTopLeftRadius: wp(10),
    paddingTop: wp(4),
    paddingHorizontal: wp(2),
  },

  unfollowouter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(20),
    paddingHorizontal: wp(3),
    height: hp(4),
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: '#fff',
    // backgroundColor: '#fff',
  },
  oldPrice: {
    fontSize: wp(3),
    color: '#a04f06',
    textDecorationLine: 'line-through',
    marginHorizontal: wp(1),
  },
  newPrice: {
    fontSize: wp(3),
    color: '#fffcd5',
    fontWeight: '700',
    marginHorizontal: wp(1),
  },
  linearGradient: {
    // height: hp(25),
    // backgroundColor: '#ccc',
    paddingTop: hp(3),
    // borderBottomRightRadius: wp(10),
    justifyContent: 'center',
  },
  astroInfoContainer: {
    padding: wp(3),
    marginBottom: hp(2),
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#ccc',
  },

  astroPhoto: {
    width: wp(25),
    backgroundColor: '#fff',
    aspectRatio: 1 / 1,
    borderRadius: wp(12.5),
    borderWidth: 2,
    borderColor: '#4cade2',
    marginRight: wp(2),
    marginBottom: wp(3),
  },
  astroName: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: wp(1),
  },
  followButton: {
    height: hp(4),
    backgroundColor: '#fff',
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  postButton: {
    height: hp(4),
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    marginLeft: wp(2),
  },
  infoContainer: {
    // backgroundColor: '#bc0f1780',
    // elevation: 5,
    flexDirection: 'row',
    paddingVertical: wp(5),
    marginHorizontal: wp(3),
    // marginBottom: wp(2),
    // marginTop: hp(-10),
    borderRadius: 5,
  },
  value: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#fff',
    marginBottom: wp(1),
  },

  headings: {
    marginBottom: hp(1),
    fontSize: wp(4),
    fontWeight: '700',
    color: '#333',
    // marginBottom: wp(1),
    // alignSelf: 'center',
    // backgroundColor: '#fd6c33',
  },
  verifiedIcon: {
    // backgroundColor: '#fd6c33',
    // width: wp(5),
    height: wp(10),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
  },
  verifiedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: wp(2),
  },
  reviewSeparator: {
    height: 1,
    backgroundColor: '#e9e5c5',
  },
  chatButton: {
    backgroundColor: '#fd6c33',
    height: hp(7),
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#fd8933',
    height: hp(7),
    alignItems: 'center',
  },
  iconRow: {
    marginRight: wp(2),
  },
  editIcon: {
    position: 'absolute',
    marginTop: 15,
    top: 0,
    right: 5,
    height: wp(8),
    width: wp(8),
    borderRadius: wp(3.5),
    // backgroundColor: '#e9e5c5',
    zIndex: 9,
    // textAlign: 'center',
    // textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    marginLeft: wp(3),
  },

  skillIcon: {
    width: wp(6),
    aspectRatio: 1 / 1,
    marginRight: wp(4),
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
