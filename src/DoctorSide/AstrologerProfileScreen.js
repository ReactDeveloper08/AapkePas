import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  SafeAreaView,
  ScrollView,
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

// share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

// Components
import HeaderComponents from 'components/HeaderComponents';
import AstroDetailPhotoListComponent from 'components/AstroDetailPhotoListComponent';
import AstroSkillListComponent from 'components/AstroSkillListComponent';
import AstroExpertiseListComponent from 'components/AstroExpertiseListComponent';
import AstroReviewListComponent from 'components/AstroReviewListComponent';

// Styles
import basicStyles from 'styles/BasicStyles';
import ic_star from 'assets/icons/ic_star.png';
import ic_experience from 'assets/icons/ic_experience.png';
import ic_timing from 'assets/icons/ic_timing.png';
import ic_location from 'assets/icons/ic_location.png';
import ic_language from 'assets/icons/ic_language.png';

// Popup
import ScheduleOnlineTimePopup from 'popup/EditProfileImage';
import EditPhotosInProfile from 'popup/EditPhotosInProfile';
import ImageViewPopUp from 'popup/ImageViewPopUp';
//insta facebook loader
// import {
//   FacebookLoader,
//   InstagramLoader,
// } from 'react-native-easy-content-loader';
//components
// import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
export default class AstrologerDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      astrologerInfo: [],
      referralInfo: '',
      isSelected: false,
      contentLoading: true,
      follow: '',
      userInfo: '',
    };
  }

  componentDidMount() {
    this.showAstrologerDetails();
  }

  showAstrologerDetails = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    // const id = this.props.navigation.getParam('id', null);
    const params = null;
    const getProfile = await makeRequest(
      BASE_URL + 'api/Astrologers/astrologerProfile',
      params,
      true,
      false,
    );
    if (getProfile) {
      const {success, message, isAuthTokenExpired} = getProfile;
      if (success) {
        const {astrologerInfo} = getProfile;
        this.setState({astrologerInfo, contentLoading: false, userInfo});
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
  //*astrologer share
  fetchReferralInfo = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }

      // starting loader
      this.setState({isLoading: true});

      let params = null;

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/referralCode',
        params,
        true,
        true,
      );

      if (response) {
        const {success, message} = response;

        if (success) {
          const {output} = response;
          this.setState({referralInfo: output, isLoading: false});
          this.handleShare();
        } else {
          console.log('the referral message', message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleShare = async () => {
    try {
      const {referralInfo} = this.state;

      const {
        astoName,
        astoExpertises,
        title,
        message,
        image,
        ForAstroPleasevisitText,
        ForAstroPleasevisitURL,
        androidUrl,
      } = referralInfo.shareInfo;

      const {url: url, extension} = image;

      const base64ImageData = await this.encodeImageToBase64(url);
      // const base64Image = await this.encodeImage(astoImage);

      if (!base64ImageData) {
        return;
      }

      const shareOptions = {
        title: astoName,
        subject: astoExpertises,
        message: `${astoName}\n\nExpertise:${astoExpertises}\n\n${message}\n${ForAstroPleasevisitText}:${ForAstroPleasevisitURL}\nExpertise:${astoExpertises}\nFor Mobile App,Please Visit:${androidUrl}\n`,
        url: `data:image/${extension};base64,${base64ImageData}`,
        // url: `data:image/${extension};base64,${base64Image}`,
      };

      // stopping loader
      this.setState({showProcessingLoader: false});

      await Share.open(shareOptions);
    } catch (error) {
      console.log(error.message);
    }
  };

  encodeImage = async astoImage => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', astoImage);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };
  encodeImageToBase64 = async url => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  handleFollow = () => {};

  handlePost = () => {
    // this.props.navigation.navigate('AstroPost');
    this.props.navigation.navigate('MyPosts');
  };

  listItem = ({item}) => (
    <AstroDetailPhotoListComponent
      item={item}
      nav={this.props.navigation}
      showImage={this.handleImageViewPopup}
      refresh={this.showAstrologerDetails}
    />
  );
  skillItem = ({item}) => (
    <AstroSkillListComponent item={item} nav={this.props.navigation} />
  );
  expertiseItem = ({item}) => (
    <AstroExpertiseListComponent item={item} nav={this.props.navigation} />
  );
  reviewItem = ({item}) => (
    <AstroReviewListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  reviewSeparator = () => <View style={styles.reviewSeparator} />;
  badgesImg = ({item}) => {
    const {badgeImage, title} = item;

    return (
      <View style={styles.verifiedContainer}>
        <Image
          source={{uri: badgeImage}}
          resizeMode="cover"
          style={styles.verifiedIcon}
        />
        <Text style={[basicStyles.text]}>{title}</Text>
      </View>
    );
  };

  handleMoreInfo = () => {
    this.setState({showEditProfilePopup: true});
  };

  closeEditProfilePopup = () => {
    this.setState({showEditProfilePopup: false});
  };
  handlePhotosInfo = () => {
    this.setState({showWalletPopup: true});
  };

  closePopup = () => {
    this.setState({showWalletPopup: false});
  };
  handleImageViewPopup = () => {
    this.setState({showImageViewPopup: true});
  };

  closeImagePopup = () => {
    this.setState({showImageViewPopup: false});
  };

  render() {
    const {
      name,
      experience,
      skills,
      expertises,
      languages,
      rating,
      followers,
      served,
      description,
      reviews,
      badges,
      profileImage,
      image,
      actualCallCharges,
      charges,
      location,
      follow,
      discountCallCharges,
      isCallAvailable,
      isChatAvailable,
      actualVideoCharges,
      discountVideoCharges,
      totalRatings,
      expertise,
      qualification,
      profile,
      audio,
      actualChatCharges,
      actualDollarChatCharges,
      discountChatCharges,
      discountDollarChatCharges,
      actualDollarCallCharges,
      actualDollarVideoCharges,
      discountDollarCallCharges,
      discountDollarVideoCharges,
      id,
      isLive,
      isVideoAvailable,
      // mobile,
      timing,
      working_days,
    } = this.state.astrologerInfo;
    // const updateSearchStatus = (index) => this.setState({selected: index});
    const {showWalletPopup, showEditProfilePopup, userInfo} = this.state;
    const {currency} = userInfo;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View
          style={[basicStyles.mainContainer, basicStyles.lightBackgroundColor]}>
          <HeaderComponents
            nav={this.props.navigation}
            headerTitle="Expert Detail"
          />

          <ScrollView style={basicStyles.mainContainer}>
            <View style={[styles.linearGradient, basicStyles.blucolor]}>
              <View style={styles.astroInfoContainer}>
                <View>
                  {/* <Touchable
                      onPress={this.handleMoreInfo}
                      style={styles.editIcon}>
                      <MaterialCommunityIcons
                        name="pencil"
                        color="#ff648a"
                        size={18}
                      />
                    </Touchable> */}
                  <Image
                    source={{uri: profileImage}}
                    resizeMode="cover"
                    style={styles.astroPhoto}
                  />
                </View>
                <View style={basicStyles.flexOne}>
                  <Text style={styles.astroName}>{name}</Text>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {languages}
                  </Text>
                </View>

                <Touchable
                  style={styles.postButton}
                  onPress={this.handlePost}
                  underlayColor="#ffffff80">
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Posts
                  </Text>
                </Touchable>
                <Touchable
                  style={styles.postButton}
                  onPress={this.fetchReferralInfo}
                  underlayColor="#ffffff80">
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Share
                  </Text>
                </Touchable>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <Text style={styles.value}>{rating}</Text>
                <Text style={[basicStyles.text]}>Ratings</Text>
              </View>
              <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <Text style={styles.value}>{followers}</Text>
                <Text style={[basicStyles.text]}>Followers</Text>
              </View>
              <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <Text style={styles.value}>{experience}</Text>
                <Text style={[basicStyles.text]}>Exp. (Years)</Text>
              </View>
              <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
                <Text style={styles.value}>{served}</Text>
                <Text style={[basicStyles.text]}>Served</Text>
              </View>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                basicStyles.paddingHorizontal,
              ]}>
              <View style={basicStyles.flexOne}>
                <Text style={styles.headings}>Pricing</Text>
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.marginRight,
                    ]}>
                    <Image
                      style={[basicStyles.iconRow]}
                      source={require('assets/icons/ic_callPrice.png')}
                    />

                    {currency === 'Rupee' ? (
                      discountCallCharges ? (
                        <Text style={styles.ChatPrice}>
                          ₹ {discountCallCharges}
                        </Text>
                      ) : (
                        <Text style={styles.ChatPrice}>
                          ₹ {actualVideoCharges}
                        </Text>
                      )
                    ) : discountDollarCallCharges ? (
                      <Text style={styles.ChatPrice}>
                        $ {discountDollarCallCharges}
                      </Text>
                    ) : (
                      <Text style={styles.ChatPrice}>
                        $ {actualDollarCallCharges}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.marginRight,
                    ]}>
                    <Image
                      style={[basicStyles.iconRow]}
                      source={require('assets/icons/ic_chatPrice.png')}
                    />

                    {currency === 'Rupee' ? (
                      discountChatCharges ? (
                        <Text style={styles.ChatPrice}>
                          ₹ {discountChatCharges}
                        </Text>
                      ) : (
                        <Text style={styles.ChatPrice}>
                          ₹ {actualChatCharges}
                        </Text>
                      )
                    ) : discountDollarChatCharges ? (
                      <Text style={styles.ChatPrice}>
                        $ {discountDollarChatCharges}
                      </Text>
                    ) : (
                      <Text style={styles.ChatPrice}>
                        $ {actualDollarChatCharges}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.marginRight,
                    ]}>
                    <Image
                      style={[basicStyles.iconRow]}
                      source={require('assets/icons/ic_videoCall.png')}
                    />

                    {currency === 'Rupee' ? (
                      discountVideoCharges ? (
                        <Text style={styles.ChatPrice}>
                          ₹ {discountVideoCharges}
                        </Text>
                      ) : (
                        <Text style={styles.ChatPrice}>
                          ₹ {actualCallCharges}
                        </Text>
                      )
                    ) : discountDollarVideoCharges ? (
                      <Text style={styles.ChatPrice}>
                        $ {discountDollarVideoCharges}
                      </Text>
                    ) : (
                      <Text style={styles.ChatPrice}>
                        $ {actualDollarVideoCharges}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={{alignSelf: 'flex-end'}}>
                <FlatList
                  data={badges}
                  renderItem={this.badgesImg}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            </View>

            <View style={basicStyles.separatorHorizontal} />

            <View style={[basicStyles.padding]}>
              <Text style={[styles.headings]}>Skills</Text>
              <FlatList
                data={skills}
                renderItem={this.skillItem}
                keyExtractor={this.keyExtractor}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            </View>
            <View style={basicStyles.separatorHorizontal} />

            <View style={[basicStyles.padding, styles.detailList]}>
              <Image
                source={ic_location}
                resizeMode="cover"
                style={styles.detailIcons}
              />
              <View style={styles.detailTitle}>
                <Text style={styles.contentTile}>Location:</Text>
                <Text style={styles.contentDetail}>{location}</Text>
              </View>
            </View>
            <View style={basicStyles.separatorHorizontal} />
            <View style={[basicStyles.padding, styles.detailList]}>
              <Image
                source={ic_language}
                resizeMode="cover"
                style={styles.detailIcons}
              />
              <View style={styles.detailTitle}>
                <Text style={styles.contentTile}>Qualification: </Text>
                <Text style={styles.contentDetail}>{qualification}</Text>
              </View>
            </View>
            <View style={basicStyles.separatorHorizontal} />

            <View style={[basicStyles.padding, styles.detailList]}>
              <Image
                source={ic_experience}
                resizeMode="cover"
                style={styles.detailIcons}
              />
              <View style={styles.detailTitle}>
                <Text style={styles.contentTile}>Experience: </Text>
                <Text style={styles.contentDetail}>{experience}</Text>
              </View>
            </View>

            <View style={basicStyles.separatorHorizontal} />

            <View style={[basicStyles.padding, styles.detailList]}>
              <Image
                source={ic_timing}
                resizeMode="cover"
                style={styles.detailIcons}
              />
              <View style={styles.detailTitle}>
                <Text style={styles.contentTile}>Timing: </Text>
                <Text style={styles.contentDetail}>{working_days}</Text>
                <Text style={[styles.contentDetail, basicStyles.marginLeft]}>
                  {timing}
                </Text>
                {/* <Text style={styles.contentDetail}>{postTiming}</Text> */}
              </View>
            </View>
            {expertises ? (
              <View style={[basicStyles.padding, styles.detailList]}>
                <View style={basicStyles.separatorHorizontal} />
                <Text style={[styles.headings]}>Expertise</Text>
                <FlatList
                  data={expertises}
                  renderItem={this.expertiseItem}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            ) : (
              <View />
            )}
            {image ? (
              <View style={[basicStyles.paddingHorizontal]}>
                <View style={basicStyles.separatorHorizontal} />
                <View style={{flexDirection: 'row'}}>
                  <Touchable
                    onPress={this.handleImageViewPopup}
                    style={basicStyles.marginBottom}>
                    <Text style={[styles.headings]}>Photos</Text>
                  </Touchable>
                  {/* <Touchable
                      onPress={this.handlePhotosInfo}
                      style={{flexDirection: 'row', marginLeft: wp(2)}}>
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        color="#fff"
                        size={22}
                      />
                    </Touchable> */}
                </View>
                <FlatList
                  data={image}
                  renderItem={this.listItem}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            ) : (
              <View />
            )}

            <View style={basicStyles.separatorHorizontal} />

            <View style={[basicStyles.paddingHorizontal]}>
              <Text style={[styles.headings]}>Description</Text>
              <Text style={[basicStyles.text]}>{description}</Text>
            </View>

            <View style={basicStyles.separatorHorizontal} />
            {reviews ? (
              <View style={[basicStyles.paddingHorizontal]}>
                <Text style={[styles.headings]}>Reviews</Text>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginBottom,
                  ]}>
                  <Image
                    source={ic_star}
                    resizeMode="cover"
                    style={basicStyles.iconRow}
                  />
                  <Text style={[basicStyles.heading]}>{totalRatings}</Text>
                  {/* <Text style={basicStyles.text}>(2896 Ratings)</Text> */}
                </View>

                <FlatList
                  data={reviews}
                  renderItem={this.reviewItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  // horizontal={true}
                  ItemSeparatorComponent={this.reviewSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            ) : (
              <View />
            )}
          </ScrollView>
        </View>
        {showWalletPopup && (
          <ScheduleOnlineTimePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            refresh={this.showAstrologerDetails}
          />
        )}
        {showEditProfilePopup && (
          <EditPhotosInProfile
            closePopup={this.closeEditProfilePopup}
            nav={this.props.navigation}
            astroInfo={this.state.astrologerInfo}
            refresh={this.showAstrologerDetails}
          />
        )}
        {this.state.showImageViewPopup && (
          <ImageViewPopUp
            closePopup={this.closeImagePopup}
            nav={this.props.navigation}
            image={image}
          />
        )}
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
    borderColor: '#fff',
    backgroundColor: '#fff',
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
    height: hp(20),
    borderBottomRightRadius: wp(10),
    justifyContent: 'center',
  },
  astroInfoContainer: {
    padding: wp(3),
    marginBottom: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  astroPhoto: {
    width: wp(18),
    aspectRatio: 1 / 1,
    borderRadius: wp(9),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: wp(2),
    backgroundColor: '#fff',
  },
  astroName: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
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
    backgroundColor: '#fff',
    // elevation: 5,
    flexDirection: 'row',
    paddingVertical: wp(5),
    marginHorizontal: wp(3),
    marginBottom: wp(2),
    marginTop: hp(-5),
    borderRadius: 5,
    elevation: 5,
  },
  value: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#333',
    marginBottom: wp(1),
  },

  headings: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#333',
    marginBottom: wp(1),
  },
  verifiedIcon: {
    // backgroundColor: '#ff648a',
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
    backgroundColor: '#ff648a',
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
    left: 0,
    bottom: 0,
    height: wp(7),
    width: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: '#e9e5c5',
    zIndex: 9,
    // textAlign: 'center',
    // textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    marginLeft: wp(3),
  },
  detailList: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    alignItems: 'center',
  },
  detailIcons: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  detailTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentTile: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginRight: wp(2),
  },
  contentDetail: {
    fontSize: wp(3.5),
    textAlign: 'justify',
    fontWeight: '700',
  },
});
