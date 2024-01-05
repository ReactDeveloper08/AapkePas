import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';

// import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {Shadow} from 'react-native-neomorph-shadows';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Icons
import ic_star from 'assets/icons/ic_star.png';
import ic_experience from 'assets/icons/ic_experience.png';
import ic_timing from 'assets/icons/ic_timing.png';
import ic_review from 'assets/icons/ic_review.png';
import ic_quote from 'assets/icons/ic_quote.png';
import ic_location from 'assets/icons/ic_location.png';
import ic_language from 'assets/icons/ic_language.png';
import ic_expertise from 'assets/icons/ic_expertise.png';
import ic_summery from 'assets/icons/ic_summery.png';
import ic_callPrice from 'assets/icons/ic_callPrice.png';
import ic_chatPrice from 'assets/icons/ic_chatPrice.png';
import ic_videoCall from 'assets/icons/ic_videoCall.png';
import ic_video_black from 'assets/icons/ic_video_black.png';
import ic_callPrice_white from 'assets/icons/ic_callPrice_white.png';
import ic_chatPrice_white from 'assets/icons/ic_chatPrice_white.png';
import ic_videoCall_white from 'assets/icons/ic_videoCall_white.png';
import ic_video_white from 'assets/icons/ic_video_white.png';

// Components
import HeaderComponent from 'components/HeaderComponent';
import ExpertCallPopup from 'components/ExpertCallPopup';
import ProcessingLoader from 'components/ProcessingLoader';
import SkillsTilesComponents from 'components/SkillsTilesComponents';
import ExploreListComponent from 'components/ExploreListComponent';
//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import clear from 'react-native-clear-cache-lcm';
//toast
import showToast from 'components/CustomToast';
//popup
import ChatBalancePopup from './ExpertDetailScreen/ChatBalancePopup';
import VideoCallBalancePopup from './ExpertDetailScreen/VideoCallBalancePopup';
import CallBalancePopup from './ExpertDetailScreen/CallBalancePopup';
import ImageViewPopUp from './ExpertDetailScreen/ImageViewPopUp';
//redux
import {connect} from 'react-redux';
import {
  expertDetailOperations,
  expertDetailSelectors,
} from '../Redux/wiseword/expertDetail';
import {
  transactionOperations,
  transactionSelectors,
} from '../Redux/wiseword/wallet';
import {
  availableBalanceOperations,
  availableBalanceSelectors,
} from '../Redux/wiseword/availableBalance';
import {
  liveStreamOperations,
  liveStreamSelectors,
} from 'Redux/wiseword/liveStream';
import {ChatOperations, ChatSelectors} from '../Redux/wiseword/chat';
import basicStyles from 'styles/BasicStyles';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
import {withNavigation} from 'react-navigation';
import {
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';
const Touchable = withPreventDoubleClick(TouchableOpacity);

class ExpertDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: ['Info', 'Reviews', 'Post'],
      currentSection: 'Info',
      isLoading: true,
      expertInfo: '',
      carouselItems: '',
      output: '',
      currency: '',
      follow: '',
      todayLiveSchedule: '',
      isListRefreshing: false,
      postData: [],
      Default_Rating: 2.5,
      //To set the default Star Selected
      Max_Rating: 5,
    };
    this.fetchExpertDetails = this.fetchExpertDetails.bind(this);
    this.WalletBalance = this.WalletBalance.bind(this);
    clear.runClearCache(() => {
      // console.log('data clear');
    });
    //Filled Star. You can also give the path from local
    this.Star =
      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';

    //Empty Star. You can also give the path from local
    this.Star_With_Border =
      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.handelDefault();
    });
  }

  componentDidMount() {}

  componentWillUnmount() {
    this._subscribe.remove();
  }

  //* handle default api calling
  handelDefault = () => {
    this.fetchExpertDetails();
    this.WalletBalance();
  };
  //*Wallet Balance
  WalletBalance = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      const location = await getData(KEYS.NWE_LOCATION);
      if (userInfo) {
        const {payloadId} = userInfo;
        const params = {
          payloadId,
        };
        await this.props.getWalletBalance(params);
        this.setState({
          walletBalance: this.props.isWalletBalance,
          isLoading: false,
          usrInfo: userInfo,
          currency,
          location,
        });
        await this.props.saveAvailableBalance(this.state.walletBalance);
      } else {
        await this.props.saveAvailableBalance(0);
        this.setState({
          isLoading: false,
          usrInfo: userInfo,
          currency,
          location,
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  //* expert Detail Profile
  fetchExpertDetails = async () => {
    try {
      const info = this.props.navigation.getParam('info', null);
      const currency = await getData(KEYS.NEW_CURRENCY);
      const userInfo = await getData(KEYS.USER_INFO);
      const {id} = info;

      // Preparing Params
      if (userInfo) {
        const {userId} = userInfo;

        var params = {
          astrologerId: id,
          payloadId: userId,
        };
      } else {
        var params = {
          astrologerId: id,
        };
      }
      await this.props.getExpertDetail(params);
      if (this.props.isExpertDetail) {
        const {astrologerInfo, todayLiveSchedule, Posts} =
          this.props.isExpertDetail;
        const {reviews} = astrologerInfo;

        this.setState({
          todayLiveSchedule,
          expertInfo: astrologerInfo,
          carouselItems: reviews,
          currency,
          postData: Posts,
          isLoading: false,
          isListRefreshing: false,
        });
        // await this.manageCallData();
      } else {
        this.setState({
          currency,
          expertInfo: null,
          carouselItems: null,
          postData: [],
          isLoading: false,
          isListRefreshing: false,
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  //*Review
  renderItem = ({item, index}) => {
    let React_Native_Rating_Bar = [];

    //Array to hold the filled or empty Stars
    for (var i = 1; i <= this.state.Max_Rating; i++) {
      React_Native_Rating_Bar.push(
        <TouchableOpacity activeOpacity={0.7} key={i}>
          <Image
            style={styles.StarImage}
            source={
              i <= item.rating ? {uri: this.Star} : {uri: this.Star_With_Border}
            }
          />
        </TouchableOpacity>,
      );
    }

    return (
      <View style={styles.carouselContainer}>
        <View style={styles.reviewTitleContainer}>
          <Image
            source={ic_quote}
            resizeMode="cover"
            style={styles.quoitIcon}
          />
          <Text style={styles.reviewTitle}>{item.userName}</Text>
        </View>
        <Text style={styles.reviewDate}>{item.reviewDate}</Text>
        <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
          {React_Native_Rating_Bar}
        </View>
        {item.review !== 'null' ? (
          <Text style={styles.reviewDetail}>{item.review}</Text>
        ) : null}
      </View>
    );
  };
  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };
  manageCallData = async () => {
    const info = this.props.navigation.getParam('info', null);
    const {id} = info;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {userId} = userInfo;

        const params = {
          userId,
          expertId: id,
        };

        const response = await makeRequest(
          BASE_URL + 'callNow',
          params,
          true,
          false,
        );

        if (response) {
          const {success, isAuthTokenExpired} = response;
          if (success) {
            const {output} = response;
            this.setState({
              output,
              isLoading: false,
            });
            //await this.handleCallToExpert();
          } else {
            this.setState({isLoading: false});
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
      console.log(error.message);
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

  //* follow Expert
  updateTitleStatus = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first \nPress LOGIN to continue !',
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
    const info = this.props.navigation.getParam('info', null);
    const {id} = info;
    let {follow} = this.state;
    if (follow == false) {
      follow = true;
      this.setState({follow});
    } else {
      follow = false;
      this.setState({follow});
    }

    const params = {
      expertId: id,
      follow,
    };
    await this.props.getFollowAstro(params);
    if (this.props.isAstroFollow) {
      this.fetchExpertDetails();
      showToast(this.props.isAstroFollow);
    }
  };

  handleCallToExpert = async () => {
    try {
      const info = this.props.navigation.getParam('info', null);
      const {id} = info;
      const params = {
        expertId: id,
      };
      const response = await makeRequest(
        BASE_URL + 'callToExpert',
        params,
        true,
        false,
      );
      if (response) {
        const {message} = response;
      }
    } catch (error) {
      alert(error);
    }
  };

  handleCallPopup = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        this.setState({showDemoPopup: true});
      } else {
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  handleVideoPopup = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (userInfo) {
        this.setState({showVideoCallBalPopup: true});
      } else {
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  closePopup = () => {
    this.setState({showDemoPopup: false});
  };

  tileItem = ({item}) => (
    <SkillsTilesComponents item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.fetchExpertDetails();
      this.WalletBalance();
    } catch (error) {
      console.log(error.message);
    }
  };

  //* Popups
  handlePhotosInfo = () => {
    this.setState({showWalletPopup: true});
  };

  closeImagePopup = () => {
    this.setState({showWalletPopup: false});
  };
  handleChatBalInfo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    // const {name} = this.state.userDetail;

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first \nPress LOGIN to continue !',
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

    this.setState({showChatBalPopup: true});
  };
  closeChatPopup = () => {
    this.setState({showChatBalPopup: false});
  };

  closeVideoCallPopup = () => {
    this.setState({showVideoCallBalPopup: false});
  };
  handleCallBalInfo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first\nPress LOGIN to continue !',
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

    this.setState({showCallBalPopup: true});
  };
  closePopup = () => {
    this.setState({showCallBalPopup: false});
  };

  //* Calling Functionality
  handleProceedCall = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You need to Login first\nPress LOGIN to continue !',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'LOGIN',
            onPress: this.handleLogin.bind(this),
          },
        ],
        {
          cancelable: false,
        },
      );
      return;
    }
    const item = this.props.navigation.getParam('info', null);
    const {id} = item;
    const params = {
      expertId: id,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Customer/callToExpert',
      params,
      true,
      false,
    );
    if (response) {
      const {success} = response;
      if (success) {
        const {message} = response;
        showToast(message);
      } else {
        const {isAuthTokenExpired} = response;
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired \n Login Again to Continue!',
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
          return;
        }

        this.setState({follow: false});
      }
    }
  };

  //*handle Live stream video
  handleVideo = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const liveData = this.state.todayLiveSchedule[0];
      const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
      const {deviceId} = devId;
      if (userInfo) {
        var {name} = userInfo;
        var initialData = name;
      } else {
        var initialData = 'Visitor' + ` ${deviceId}`;
        Alert.alert(
          'Alert!',
          'You need to Login first \nPress LOGIN to continue !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: false,
          },
        );
        return;
      }
      console.log(liveData, initialData);
      const refreshCallBack = this.fetchExpertDetails.bind(this);
      const tabActive = () => {
        this.setState({tabActive: 'Completed'});
      };
      await this.props.saveLiveData(liveData).then(() => {
        this.props.navigation.navigate('Customer_Viewer', {
          initialData,
          refreshCallBack,
          tabActive,
        });
      });
    } catch (e) {
      console.log('error in live schedule', e);
    }
  };

  // handleText = () => {
  //   this.props.navigation.navigate('Test');
  // };

  postItem = ({item, index}) => {
    return (
      <ExploreListComponent
        item={item}
        nav={this.props.navigation}
        refresh={() => this.showExploreData()}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  moveToSetion = section => {
    // scroll view to section
    this.scrollView.scrollTo({x: 0, y: this.state[section], animated: true});
    // set state to current section
    this.setState({currentSection: section});
  };
  onItemLayout = (
    {
      nativeEvent: {
        layout: {x, y, width, height},
      },
    },
    section,
  ) => {
    // setting each items position
    this.setState({[section]: y});
  };
  onScroll = ({
    nativeEvent: {
      contentOffset: {y, x},
    },
  }) => {
    let _currentSection;
    // loop sections to calculate which section scrollview is on
    this.state.sections.forEach(section => {
      // adding 15 to calculate Text's height
      if (y + 15 > this.state[section]) _currentSection = section;
    });
    // settint the currentSection to the calculated current section
    this.setState({currentSection: _currentSection});
  };
  Item = props => {
    const {expertInfo, carouselItems, currency} = this.state;
    const {
      actualCallCharges,
      actualVideoCharges,
      description,
      actualChatCharges,
      actualDollarChatCharges,
      discountChatCharges,
      discountDollarChatCharges,
      actualDollarCallCharges,
      actualDollarVideoCharges,
      discountCallCharges,
      discountDollarCallCharges,
      discountDollarVideoCharges,
      discountVideoCharges,
      experience,
      expertises,
      languages,
      location,
      skills,
      timing,
      working_days,
    } = expertInfo;
    return props.index === 'Info' ? (
      <View onLayout={e => props.onItemLayout(e, props.index)}>
        <View style={basicStyles.paddingHorizontal}>
          <View style={[basicStyles.marginVentricle, styles.pricingContainer]}>
            <Text
              style={{
                fontSize: headingLargeSize,
                fontWeight: '700',
                color: '#fff',
              }}>
              Pricing
            </Text>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTop,
              ]}>
              <View
                style={[
                  basicStyles.marginRight,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Image
                  source={ic_callPrice_white}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                {currency === 'Rupee' ? (
                  discountCallCharges ? (
                    <Text style={basicStyles.heading}>
                      ₹ {discountCallCharges}
                    </Text>
                  ) : (
                    <Text style={basicStyles.heading}>
                      ₹ {actualVideoCharges}
                    </Text>
                  )
                ) : discountDollarCallCharges ? (
                  <Text style={basicStyles.heading}>
                    $ {discountDollarCallCharges}
                  </Text>
                ) : (
                  <Text style={basicStyles.heading}>
                    $ {actualDollarCallCharges}
                  </Text>
                )}
              </View>
              {/* <View style={basicStyles.separatorVertical} /> */}
              <View
                style={[
                  basicStyles.marginRight,
                  basicStyles.marginLeft,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Image
                  source={ic_chatPrice_white}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                {currency === 'Rupee' ? (
                  discountChatCharges ? (
                    <Text style={basicStyles.heading}>
                      ₹ {discountChatCharges}
                    </Text>
                  ) : (
                    <Text style={basicStyles.heading}>
                      ₹ {actualChatCharges}
                    </Text>
                  )
                ) : discountDollarChatCharges ? (
                  <Text style={basicStyles.heading}>
                    $ {discountDollarChatCharges}
                  </Text>
                ) : (
                  <Text style={basicStyles.heading}>
                    $ {actualDollarChatCharges}
                  </Text>
                )}
              </View>
              {/* <View style={basicStyles.separatorVertical} /> */}
              <View
                style={[
                  basicStyles.marginRight,
                  basicStyles.marginLeft,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Image
                  source={ic_video_white}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                {currency === 'Rupee' ? (
                  discountVideoCharges ? (
                    <Text style={basicStyles.heading}>
                      ₹ {discountVideoCharges}
                    </Text>
                  ) : (
                    <Text style={basicStyles.heading}>
                      ₹ {actualCallCharges}
                    </Text>
                  )
                ) : discountDollarVideoCharges ? (
                  <Text style={basicStyles.heading}>
                    $ {discountDollarVideoCharges}
                  </Text>
                ) : (
                  <Text style={basicStyles.heading}>
                    $ {actualDollarVideoCharges}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <Text style={[basicStyles.headingLarge, basicStyles.marginBottom]}>
            Skills
          </Text>
          <FlatList
            data={skills}
            renderItem={this.tileItem}
            keyExtractor={this.keyExtractor}
            // numColumns="2"
            horizontal
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer2}
          />
        </View>

        <View style={basicStyles.separatorHorizontal} />

        <View style={styles.detailList}>
          <Image
            source={ic_experience}
            resizeMode="cover"
            style={styles.detailIcons}
          />
          <View style={styles.detailTitle}>
            <Text style={styles.contentTile}>Experience: </Text>
            <Text style={styles.contentDetail}>{experience} Years</Text>
          </View>
        </View>

        <View style={basicStyles.separatorHorizontal} />

        <View style={styles.detailList}>
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

        <View style={basicStyles.separatorHorizontal} />

        <View style={styles.detailList}>
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

        <View style={styles.detailList}>
          <Image
            source={ic_language}
            resizeMode="cover"
            style={styles.detailIcons}
          />
          <View style={styles.detailTitle}>
            <Text style={styles.contentTile}>Languages Spoken: </Text>
            <Text style={styles.contentDetail}>{languages}</Text>
          </View>
        </View>

        {expertises != null ? (
          <View style={styles.detailList}>
            <Image
              source={ic_expertise}
              resizeMode="cover"
              style={styles.detailIcons}
            />
            <View style={styles.detailTitle}>
              <Text style={styles.contentTile}>Expertise</Text>
              <Text style={styles.contentDetail}>{expertises}</Text>
            </View>
          </View>
        ) : null}
        <View style={basicStyles.separatorHorizontal} />
        <View style={styles.detailList}>
          <Image
            source={ic_summery}
            resizeMode="cover"
            style={styles.detailIcons}
          />
          <View style={styles.detailTitle}>
            <Text style={styles.contentTile}>Profile Summary</Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    ) : props.index === 'Reviews' ? (
      <View onLayout={e => props.onItemLayout(e, props.index)}>
        {carouselItems != null ? (
          <View style={basicStyles.separatorHorizontal} />
        ) : null}
        {carouselItems != null ? (
          <View>
            <View style={styles.detailList}>
              <Image
                source={ic_review}
                resizeMode="cover"
                style={styles.detailIcons}
              />
              <View style={styles.detailTitle}>
                <Text style={styles.contentTile}>Reviews</Text>
              </View>
            </View>
            <View style={styles.ele}>
              <FlatList
                data={carouselItems}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                extraData={this.state}
              />
            </View>
          </View>
        ) : null}

        <View style={basicStyles.separatorHorizontal} />
      </View>
    ) : props.index === 'Post' ? (
      <View onLayout={e => props.onItemLayout(e, props.index)}>
        <View style={styles.detailList}>
          <Image
            source={ic_summery}
            resizeMode="cover"
            style={styles.detailIcons}
          />
          <View style={styles.detailTitle}>
            <Text style={styles.contentTile}>Post</Text>
          </View>
        </View>

        <View style={styles.exploreContainer}>
          <FlatList
            data={this.state.postData}
            renderItem={this.postItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
            extraData={this.state}
          />
        </View>
      </View>
    ) : null;
  };

  renderHeaderPart() {
    const {expertInfo} = this.state;
    const {name, expertise, follow, followers, profileImage, rating} =
      expertInfo;
    return (
      <>
        <View style={styles.expertBanner}>
          <Shadow
            // inner // <- enable inner shadow
            // useArt // <- set this prop to use non-native shadow on ios
            style={styles.imageContainer}>
            <FastImage
              style={styles.userImage}
              source={{
                uri: profileImage,
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </Shadow>
          <View style={[styles.infoContainer, basicStyles.flexOne]}>
            <Text style={styles.name}>{name}</Text>
            {expertise ? (
              <Text style={[styles.expertise]}>{expertise}</Text>
            ) : null}

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
              ]}>
              <Shadow
                // inner // <- enable inner shadow
                // useArt // <- set this prop to use non-native shadow on ios
                style={styles.review}>
                <Image
                  source={ic_star}
                  resizeMode="cover"
                  style={styles.reviewIcon}
                />
                {/* </View> */}
              </Shadow>
              <View style={[basicStyles.flexOne, {marginLeft: wp(3)}]}>
                <Text style={styles.reviewText}>{rating}</Text>
                <Text style={[basicStyles.headingSmall]}>
                  {followers} Followers
                </Text>
              </View>

              <Touchable
                style={styles.followButton}
                onPress={this.updateTitleStatus.bind(this)}>
                {follow === true ? (
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.alignCenter,
                    ]}>
                    <MaterialCommunityIcons
                      name="check-all"
                      color="#4cade2"
                      size={18}
                      style={basicStyles.marginRightHalf}
                    />
                    <Text style={[basicStyles.heading, {color: '#4cade2'}]}>
                      Following
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: headingSize,
                      fontWeight: '700',
                      color: '#000',
                    }}>
                    Follow
                  </Text>
                )}
              </Touchable>
            </View>
          </View>
        </View>
      </>
    );
  }

  renderButton() {
    return (
      <>
        <View style={styles.buttonContainer}>
          {this.state.sections.map(section => (
            <TouchableOpacity
              onPress={() => this.moveToSetion(section)}
              style={
                this.state.currentSection === section
                  ? styles.tabActiveButton
                  : styles.tabButton
              }>
              <Text
                style={
                  this.state.currentSection === section
                    ? styles.tabActiveButtonText
                    : styles.tabButtonText
                }>
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }

  renderScreenContent() {
    return (
      <>
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.scrollView}
          ref={ref => (this.scrollView = ref)}
          scrollEventThrottle={100}
          onScroll={this.onScroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh.bind(this)}
            />
          }>
          {this.state.sections.map(section => (
            <this.Item
              key={section}
              index={section}
              onItemLayout={this.onItemLayout}
            />
          ))}
        </ScrollView>
      </>
    );
  }

  renderRequestButton() {
    const {expertInfo, currency} = this.state;
    return (
      <View style={styles.buttonsContainer}>
        {expertInfo.isLive !== true ? (
          expertInfo.isBusy !== true ? (
            expertInfo.isOnline !== false ? (
              expertInfo.isChatButtonDisabled !== true ? (
                expertInfo.isChatAvailable ? (
                  <Touchable
                    style={styles.chatButton}
                    onPress={this.handleChatBalInfo}
                    underlayColor="#ff648a80">
                    <Image
                      source={ic_chatPrice_white}
                      resizeMode="cover"
                      style={basicStyles.iconRow}
                    />
                    <View>
                      <Text style={styles.callButtonText}>Chat</Text>
                      {currency === 'Rupee' ? (
                        expertInfo.discountChatCharges ? (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.discountChatCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.actualChatCharges}
                          </Text>
                        )
                      ) : expertInfo.discountDollarChatCharges ? (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.discountDollarChatCharges}
                        </Text>
                      ) : (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.actualDollarChatCharges}
                        </Text>
                      )}
                    </View>
                  </Touchable>
                ) : null
              ) : null
            ) : (
              <Touchable
                style={styles.offlineButton}
                // onPress={this.handleChatBalInfo}
                underlayColor="#ff648a80">
                <View>
                  <Text style={styles.callButtonText}>Offline</Text>
                </View>
              </Touchable>
            )
          ) : (
            <Touchable
              style={styles.LiveButton}
              // onPress={this.handleChatBalInfo}
              underlayColor="#ff648a80">
              <View>
                <Text style={styles.callButtonText}>Expert Busy</Text>
              </View>
            </Touchable>
          )
        ) : (
          <Touchable
            style={styles.LiveButton}
            onPress={this.handleVideo}
            underlayColor="#ff648a80">
            <Image
              source={ic_videoCall_white}
              resizeMode="cover"
              style={basicStyles.iconRow}
            />
            <View>
              <Text style={styles.callButtonText}>Live</Text>
            </View>
          </Touchable>
        )}

        {expertInfo.isLive !== true ? (
          expertInfo.isBusy !== true ? (
            expertInfo.isOnline !== false ? (
              expertInfo.isCallButtonDisabled !== true ? (
                expertInfo.isCallAvailable ? (
                  <Touchable
                    style={styles.call_Button}
                    onPress={this.handleCallBalInfo}
                    underlayColor="#ff648a80">
                    <Image
                      source={ic_callPrice_white}
                      resizeMode="cover"
                      style={basicStyles.iconRow}
                    />
                    <View>
                      <Text style={styles.callButtonText}>Call</Text>
                      {currency === 'Rupee' ? (
                        expertInfo.discountCallCharges ? (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.discountCallCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.actualVideoCharges}
                          </Text>
                        )
                      ) : expertInfo.discountDollarCallCharges ? (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.discountDollarCallCharges}
                        </Text>
                      ) : (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.actualDollarCallCharges}
                        </Text>
                      )}
                    </View>
                  </Touchable>
                ) : (
                  <View />
                )
              ) : null
            ) : null
          ) : null
        ) : null}
        {expertInfo.isLive !== true ? (
          expertInfo.isBusy !== true ? (
            expertInfo.isOnline !== false ? (
              expertInfo.isVideoCallButtonDisable !== true ? (
                expertInfo.isVideoAvailable ? (
                  <Touchable
                    style={styles.videoButton}
                    onPress={this.handleVideoPopup}
                    underlayColor="#b5250980">
                    <Image
                      source={ic_video_white}
                      resizeMode="cover"
                      style={basicStyles.iconRow}
                    />
                    <View>
                      <Text style={styles.callButtonText}>Video Call</Text>
                      {currency === 'Rupee' ? (
                        expertInfo.discountVideoCharges ? (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.discountVideoCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            ₹ {expertInfo.actualCallCharges}
                          </Text>
                        )
                      ) : expertInfo.discountDollarVideoCharges ? (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.discountDollarVideoCharges}
                        </Text>
                      ) : (
                        <Text style={styles.call_ButtonText}>
                          $ {expertInfo.actualDollarVideoCharges}
                        </Text>
                      )}
                    </View>
                  </Touchable>
                ) : null
              ) : null
            ) : null
          ) : null
        ) : null}
      </View>
    );
  }
  renderPopupData() {
    const {expertInfo} = this.state;

    return (
      <>
        {this.state.showDemoPopup && (
          <ExpertCallPopup
            item={this.state.output}
            closePopup={this.closePopup}
            nav={this.props.navigation}
            id={expertInfo.id}
          />
        )}
        {this.state.showWalletPopup && (
          <ImageViewPopUp
            closePopup={this.closeImagePopup}
            nav={this.props.navigation}
            image={expertInfo.image}
          />
        )}

        {this.state.showChatBalPopup && (
          <ChatBalancePopup
            closePopup={this.closeChatPopup}
            nav={this.props.navigation}
            image={expertInfo.image}
            chat={this.props.isChatRequest}
            id={expertInfo.id}
            guestUserId={expertInfo.expertUserId}
            guestName={expertInfo.name}
            guestImg={expertInfo.profileImage}
            actualChatCharges={expertInfo.actualChatCharges}
            discountChatCharges={expertInfo.discountChatCharges}
            actualDollarChatCharges={expertInfo.actualDollarChatCharges}
            discountDollarChatCharges={expertInfo.discountDollarChatCharges}
          />
        )}

        {this.state.showCallBalPopup && (
          <CallBalancePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            image={expertInfo.image}
            id={expertInfo.id}
            guestUserId={expertInfo.expertUserId}
            guestName={expertInfo.name}
            guestImg={expertInfo.profileImage}
            actualChatCharges={expertInfo.actualCallCharges}
            discountChatCharges={expertInfo.discountCallCharges}
            actualDollarChatCharges={expertInfo.actualDollarCallCharges}
            discountDollarChatCharges={expertInfo.discountDollarCallCharges}
          />
        )}
        {this.state.showVideoCallBalPopup && (
          <VideoCallBalancePopup
            closePopup={this.closeVideoCallPopup}
            nav={this.props.navigation}
            image={expertInfo.image}
            chat={this.props.isChatRequest}
            id={expertInfo.id}
            guestUserId={expertInfo.expertUserId}
            guestName={expertInfo.name}
            guestImg={expertInfo.profileImage}
            actualChatCharges={expertInfo.actualVideoCharges}
            discountChatCharges={expertInfo.discountVideoCharges}
            actualDollarChatCharges={expertInfo.actualDollarVideoCharges}
            discountDollarChatCharges={expertInfo.discountDollarVideoCharges}
          />
        )}
      </>
    );
  }

  render() {
    const {currency} = this.state;
    const availableBalance = this.props.getAvailableBalance;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Expert"
          navAction="back"
          showGradient
          symbol={currency}
          balance={availableBalance}
        />
        {this.renderHeaderPart()}
        {this.renderButton()}
        <View style={styles.contentContainer}>
          {this.renderScreenContent()}
          {this.renderRequestButton()}
        </View>
        {this.renderPopupData()}

        {this.state.isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isExpertDetail: expertDetailSelectors.isExpertDetail(state),
  isWalletBalance: transactionSelectors.isWalletBalance(state),
  isAstroFollow: expertDetailSelectors.isAstroFollow(state),
  isChatRequest: ChatSelectors.isChatRequest(state),
  getAvailableBalance: availableBalanceSelectors.getAvailableBalance(state),
});

const mapDispatchToProps = {
  getExpertDetail: expertDetailOperations.getExpertDetail,
  getWalletBalance: transactionOperations.getWalletBalance,
  getFollowAstro: expertDetailOperations.getFollowAstro,
  saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
  chatRequest: ChatOperations.chatRequest,
  saveLiveData: liveStreamOperations.saveLiveData,
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(ExpertDetail),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pricingContainer: {
    backgroundColor: '#4daee3',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
  },
  expertBanner: {
    padding: wp(3),
    flexDirection: 'row',
  },
  StarImage: {
    width: wp(3.5),
    height: wp(3.5),
    resizeMode: 'cover',
  },
  scrollSpy: {
    flexDirection: 'row',
    padding: wp(1),
    paddingBottom: wp(2),
  },

  spyButton: {
    // width: wp(28),
    flex: 1,
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#ccc',
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  expertise: {
    marginBottom: wp(1),
  },

  imageContainer: {
    width: wp(20),
    height: wp(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#e9e9e9',
    borderRadius: hp(2),
    // margin: wp(3),

    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000010',
    borderWidth: 1,
    borderColor: '#ccc8',
    shadowRadius: 1,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    // borderBottomRightRadius: wp(20),
    // borderBottomLeftRadius: wp(20),
    // ...include most of View/Layout styles
  },

  userImage: {
    height: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: hp(2),
  },
  infoContainer: {
    padding: wp(2),
    marginLeft: wp(2),
    justifyContent: 'center',
  },
  name: {
    fontSize: headingLargeSize,
    color: '#333',
    fontWeight: '700',
    marginBottom: wp(1),
  },

  designation: {
    fontSize: textSize,
    color: '#333',
  },
  review: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#333',
    // paddingVertical: wp(1),
    // height: hp(3.5),
    // width: hp(3.5),
    // paddingHorizontal: wp(3),
    // borderRadius: 4,
    // alignSelf: 'flex-start',

    height: hp(3.5),
    width: hp(3.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#e9e9e9',
    borderRadius: 4,
    // margin: wp(3),

    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000030',
    shadowRadius: 5,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    // borderBottomRightRadius: wp(20),
    // borderBottomLeftRadius: wp(20),
    // ...include most of View/Layout styles
  },

  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    paddingVertical: wp(1),
    paddingHorizontal: wp(3),

    borderRadius: hp(2),
    alignSelf: 'flex-start',
  },
  detailTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
  },
  reviewText: {
    fontSize: headingSize,
    color: '#333',
    fontWeight: '700',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    // padding: wp(3),
  },
  detailIcons: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  contentTile: {
    fontSize: headingSize,
    fontWeight: '400',
    marginRight: wp(2),
  },
  contentDetail: {
    fontSize: headingSize,
    textAlign: 'justify',
    fontWeight: '400',
  },
  detailList: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    paddingHorizontal: wp(3),
    alignItems: 'center',
  },
  carouselContainer: {
    backgroundColor: '#4eade3',
    padding: wp(3),
    borderRadius: 5,
  },
  reviewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: headingSize,
    fontWeight: '700',
    marginBottom: hp(0.5),
    color: '#fff',
  },
  quoitIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  reviewDetail: {
    fontSize: textSize,
    color: '#fff',
  },
  reviewDate: {
    fontSize: textSize,
    marginBottom: hp(0.5),
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    marginBottom: wp(2),
  },
  tabButton: {
    backgroundColor: '#ccc8',
    flex: 1,
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    borderRadius: wp(1),
  },
  tabActiveButton: {
    backgroundColor: '#4cade2',
    flex: 1,
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    borderRadius: wp(1),
  },
  tabButtonText: {
    color: '#333',
    fontSize: wp(3.5),
  },
  tabActiveButtonText: {
    color: '#fff',
    fontSize: wp(3.5),
  },

  ReviewButton: {
    flex: 1,
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f9741',
    margin: wp(3),
    borderRadius: hp(2.5),
  },
  callButton: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff648a',
    margin: wp(3),
    borderRadius: hp(3),
    flex: 1,
  },
  description: {
    fontSize: wp(2.5),
    textAlign: 'justify',
    paddingHorizontal: wp(3),
  },
  chatButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#4eaee3',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
    flexDirection: 'row',
  },
  LiveButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#4eaee3',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
    flexDirection: 'row',
  },
  offlineButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#9bdbff',
    marginTop: wp(2),
    flexDirection: 'row',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  call_Button: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#4eaee3',
    flexDirection: 'row',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  videoButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#4eaee3',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
    flexDirection: 'row',
  },
  callButtonText: {
    fontSize: headingSize,
    color: '#fff',
    textAlign: 'left',
    fontWeight: '700',
  },
  call_ButtonText: {
    fontSize: headingSize,
    color: '#fff',
    textAlign: 'left',
    fontWeight: '700',
  },
  ele: {
    elevation: 9,
    paddingHorizontal: wp(3),
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: wp(3),
  },
  separator: {
    height: wp(2),
  },
  iconStyle2: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
});
