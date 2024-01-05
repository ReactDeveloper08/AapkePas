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
import Carousel from 'react-native-snap-carousel';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

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

// Components
import HeaderComponent from 'components/HeaderComponent';
import ExpertCallPopup from 'components/ExpertCallPopup';
import ProcessingLoader from 'components/ProcessingLoader';
import SkillsTilesComponents from 'components/SkillsTilesComponents';
//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

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
import {ChatOperations, ChatSelectors} from '../Redux/wiseword/chat';
import basicStyles from 'styles/BasicStyles';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class ExpertDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      expertInfo: '',
      carouselItems: '',
      output: '',
      currency: '',
      follow: '',
      isListRefreshing: false,
    };
  }

  componentDidMount = async () => {
    await this.fetchExpertDetails();
    await this.WalletBalance();
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
        const {reviews} = this.props.isExpertDetail;
        //this.setState({carouselItems: expertInfo.reviews});
        this.setState({
          expertInfo: this.props.isExpertDetail,
          carouselItems: reviews,
          currency,
          isLoading: false,
          isListRefreshing: false,
        });
        // await this.manageCallData();
      } else {
        this.setState({
          currency,
          expertInfo: null,
          carouselItems: null,
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
        // this.props.navigation.navigate('VideoCall');
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
      this.componentDidMount();
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
            onPress: this.handleLogin,
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

  render() {
    const {
      expertInfo,
      carouselItems,
      showDemoPopup,

      currency,
    } = this.state;
    const availableBalance = this.props.getAvailableBalance;
    const {
      name,
      expertUserId,
      expertise,
      qualification,
      charges,
      profile,
      actualCallCharges,
      actualVideoCharges,
      audio,
      badges,
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
      follow,
      followers,
      id,
      image,
      isCallAvailable,
      isChatAvailable,
      isLive,
      isVideoAvailable,
      languages,
      location,
      // mobile,
      profileImage,
      rating,
      reviews,
      served,
      skills,
      timing,
      totalRatings,
      working_days,
      isChatButtonDisabled,
      is_Disabled,
      email,
      isBusy,
      isCallButtonDisabled,
      isVideoCallButtonDisable,
    } = expertInfo;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Expert"
          navActionBack="back"
          showGradient
          symbol={currency}
          balance={availableBalance}
        />

        <View style={styles.expertBanner}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: profileImage}}
              resizeMode="cover"
              style={styles.userImage}
            />
          </View>
          <View style={[styles.infoContainer, basicStyles.flexOne]}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.designation}>{expertise}</Text>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
              ]}>
              <View style={styles.review}>
                <Image
                  source={ic_star}
                  resizeMode="cover"
                  style={styles.reviewIcon}
                />
                <Text style={styles.reviewText}>{rating}</Text>
              </View>
              <Text
                style={[
                  basicStyles.heading,
                  basicStyles.whiteColor,
                  basicStyles.flexOne,
                  basicStyles.marginLeft,
                ]}>
                {followers} Followers
              </Text>
              <Touchable
                style={styles.followButton}
                onPress={this.updateTitleStatus}>
                {follow === true ? (
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Following
                  </Text>
                ) : (
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Follow
                  </Text>
                )}
              </Touchable>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            }>
            <View style={basicStyles.marginVentricle}>
              <Text style={basicStyles.headingLarge}>Pricing</Text>
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
                    source={ic_callPrice}
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
                <View
                  style={[
                    basicStyles.marginRight,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                  ]}>
                  <Image
                    source={ic_chatPrice}
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
                <View
                  style={[
                    basicStyles.marginRight,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                  ]}>
                  <Image
                    source={ic_videoCall}
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

            <View style={basicStyles.separatorHorizontal} />

            <View style={basicStyles.paddingVentricle}>
              <Text
                style={[basicStyles.headingLarge, basicStyles.marginBottom]}>
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
                <Text style={styles.contentDetail}>{experience}</Text>
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
                  <Carousel
                    layout={'default'}
                    ref={ref => (this.carousel = ref)}
                    data={carouselItems}
                    sliderWidth={300}
                    itemWidth={300}
                    renderItem={this.renderItem}
                    onSnapToItem={index =>
                      this.setState({
                        activeIndex: index,
                      })
                    }
                  />
                </View>
              </View>
            ) : (
              <View />
            )}
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

            <View style={basicStyles.separatorHorizontal} />

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
            ) : (
              <View />
            )}

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
          </ScrollView>

          <View style={styles.buttonsContainer}>
            {isBusy !== true ? (
              isLive !== true ? (
                isChatButtonDisabled !== true ? (
                  isChatAvailable ? (
                    <Touchable
                      style={styles.chatButton}
                      onPress={this.handleChatBalInfo}
                      underlayColor="#ff648a80">
                      <View>
                        <Text style={styles.callButtonText}>Chat</Text>
                        {currency === 'Rupee' ? (
                          discountChatCharges ? (
                            <Text style={styles.call_ButtonText}>
                              ₹ {discountChatCharges}
                            </Text>
                          ) : (
                            <Text style={styles.call_ButtonText}>
                              ₹ {actualChatCharges}
                            </Text>
                          )
                        ) : discountDollarChatCharges ? (
                          <Text style={styles.call_ButtonText}>
                            $ {discountDollarChatCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            $ {actualDollarChatCharges}
                          </Text>
                        )}
                      </View>
                    </Touchable>
                  ) : null
                ) : null
              ) : (
                <Touchable
                  style={styles.LiveButton}
                  // onPress={this.handleChatBalInfo}
                  underlayColor="#ff648a80">
                  <View>
                    <Text style={styles.callButtonText}>Live</Text>
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
            )}

            {isBusy !== true ? (
              isLive !== true ? (
                isCallButtonDisabled !== true ? (
                  isCallAvailable ? (
                    <Touchable
                      style={styles.call_Button}
                      onPress={this.handleCallBalInfo}
                      underlayColor="#ff648a80">
                      <View>
                        <Text style={styles.callButtonText}>Call</Text>
                        {currency === 'Rupee' ? (
                          discountCallCharges ? (
                            <Text style={styles.call_ButtonText}>
                              ₹ {discountCallCharges}
                            </Text>
                          ) : (
                            <Text style={styles.call_ButtonText}>
                              ₹ {actualVideoCharges}
                            </Text>
                          )
                        ) : discountDollarCallCharges ? (
                          <Text style={styles.call_ButtonText}>
                            $ {discountDollarCallCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            $ {actualDollarCallCharges}
                          </Text>
                        )}
                      </View>
                    </Touchable>
                  ) : (
                    <View />
                  )
                ) : null
              ) : null
            ) : null}
            {isBusy !== true ? (
              isLive !== true ? (
                isVideoCallButtonDisable !== true ? (
                  isVideoAvailable ? (
                    <Touchable
                      style={styles.videoButton}
                      onPress={this.handleVideoPopup}
                      underlayColor="#4f000a80">
                      <View>
                        <Text style={styles.callButtonText}>Video Call</Text>
                        {currency === 'Rupee' ? (
                          discountVideoCharges ? (
                            <Text style={styles.call_ButtonText}>
                              ₹ {discountVideoCharges}
                            </Text>
                          ) : (
                            <Text style={styles.call_ButtonText}>
                              ₹ {actualCallCharges}
                            </Text>
                          )
                        ) : discountDollarVideoCharges ? (
                          <Text style={styles.call_ButtonText}>
                            $ {discountDollarVideoCharges}
                          </Text>
                        ) : (
                          <Text style={styles.call_ButtonText}>
                            $ {actualDollarVideoCharges}
                          </Text>
                        )}
                      </View>
                    </Touchable>
                  ) : null
                ) : null
              ) : null
            ) : null}
          </View>
        </View>

        {showDemoPopup && (
          <ExpertCallPopup
            item={this.state.output}
            closePopup={this.closePopup}
            nav={this.props.navigation}
            id={id}
          />
        )}
        {this.state.showWalletPopup && (
          <ImageViewPopUp
            closePopup={this.closeImagePopup}
            nav={this.props.navigation}
            image={image}
          />
        )}

        {this.state.showChatBalPopup && (
          <ChatBalancePopup
            closePopup={this.closeChatPopup}
            nav={this.props.navigation}
            image={image}
            chat={this.props.isChatRequest}
            id={id}
            guestUserId={expertUserId}
            guestName={name}
            guestImg={profileImage}
            actualChatCharges={actualChatCharges}
            discountChatCharges={discountChatCharges}
            actualDollarChatCharges={actualDollarChatCharges}
            discountDollarChatCharges={discountDollarChatCharges}
          />
        )}

        {this.state.showCallBalPopup && (
          <CallBalancePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            image={image}
            id={id}
            guestUserId={expertUserId}
            guestName={name}
            guestImg={profileImage}
            actualChatCharges={actualCallCharges}
            discountChatCharges={discountCallCharges}
            actualDollarChatCharges={actualDollarCallCharges}
            discountDollarChatCharges={discountDollarCallCharges}
          />
        )}
        {this.state.showVideoCallBalPopup && (
          <VideoCallBalancePopup
            closePopup={this.closeVideoCallPopup}
            nav={this.props.navigation}
            image={image}
            chat={this.props.isChatRequest}
            id={id}
            guestUserId={expertUserId}
            guestName={name}
            guestImg={profileImage}
            actualChatCharges={actualVideoCharges}
            discountChatCharges={discountVideoCharges}
            actualDollarChatCharges={actualDollarVideoCharges}
            discountDollarChatCharges={discountDollarVideoCharges}
          />
        )}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertDetail);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff648a',
  },
  expertBanner: {
    padding: wp(3),
    flexDirection: 'row',
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 10,
  },
  userImage: {
    height: wp(25),
    aspectRatio: 1 / 1,
    borderRadius: 8,
  },
  infoContainer: {
    padding: wp(2),
    justifyContent: 'center',
  },
  name: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
  },

  designation: {
    fontSize: wp(3),
    color: '#fff',
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: wp(1),
    height: hp(3.5),
    paddingHorizontal: wp(3),
    borderRadius: hp(2),
    alignSelf: 'flex-start',
  },

  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: wp(1),
    paddingHorizontal: wp(5),
    height: hp(3.5),
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
    fontSize: wp(3),
    marginLeft: wp(2),
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    padding: wp(3),
  },
  detailIcons: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
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
  detailList: {
    flexDirection: 'row',
    paddingVertical: wp(2),
    alignItems: 'center',
  },
  carouselContainer: {
    backgroundColor: '#f2f1f1',
    padding: wp(3),
    borderRadius: 5,
  },
  reviewTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  quoitIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  reviewDetail: {
    fontSize: wp(3),
  },
  reviewDate: {
    fontSize: wp(3),
    marginBottom: hp(0.5),
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
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
    fontSize: wp(3),
    textAlign: 'justify',
  },
  chatButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#ff648a',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  LiveButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#ea5454',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  call_Button: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#ffc77b',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  videoButton: {
    height: hp(6),
    alignItems: 'center',
    backgroundColor: '#4f000a',
    marginTop: wp(2),
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(1),
  },
  callButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  call_ButtonText: {
    fontSize: wp(3),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  ele: {
    elevation: 9,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});
