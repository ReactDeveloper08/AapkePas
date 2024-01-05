import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';

// Vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
// Images
import ic_star from 'assets/icons/ic_star.png';

import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
import CustomLoader from './CustomLoader';
import {showToast} from './CustomToast';
import {nsNavigate} from 'routes/NavigationService';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
export default class OrderHistoryTabListComponent extends PureComponent {
  constructor(props) {
    super(props);
    const userData = this.props.userData;
    const {currency} = userData;
    this.state = {
      reply: '',
      isLoading: false,
      currency,
      userData,
    };
  }
  handleMoreInfo = moreInfo => () => {
    this.setState(prevState => ({[moreInfo]: !prevState[moreInfo]}));
  };
  handleOrderList = () => {};
  handleChat = () => {
    const item = this.props.item;

    nsNavigate('chat_History', item);
    // this.props.nav.navigate('Chat');
  };
  handleCall = () => {
    const item = this.props.item;

    nsNavigate('call_History', item);
  };
  keyExtractor = (item, index) => index.toString();
  handleChangeReviewText = reply => {
    this.setState({reply});
  };
  itemSeparator = () => <View style={styles.separator} />;

  handleReplyToReview = async () => {
    this.setState({isLoading: true});
    const {reply} = this.state;
    const {ratingDetails} = this.props.item;
    const {reviewId} = ratingDetails;

    const params = {
      reviewId,
      reply,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/replyToReview',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        this.setState({message, isLoading: false});

        showToast(message);
      } else {
        this.setState({message, isLoading: false});
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
  handleRefund = async () => {
    const {consultationId, orderType} = this.props.item;
    const params = {
      consultationId,
    };
    if (orderType !== 'Live Call') {
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/refundRequest',
        params,
        true,
        false,
      );
      if (response) {
        const {success, isAuthTokenExpired} = response;
        if (success) {
          const {message} = response;
          const refresh = this.props.refresh;
          refresh(message);
          showToast(message);
        } else {
          const {message} = response;
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
    } else {
      const params = {
        consaltationId: consultationId,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/liveRefund',
        params,
        true,
        false,
      );
      if (response) {
        const {success, isAuthTokenExpired} = response;
        if (success) {
          const {message} = response;
          const refresh = this.props.refresh;
          refresh(message);
          showToast(message);
        } else {
          const {message} = response;
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
    }
  };

  render() {
    const {
      consultationId,
      date,
      giftName,
      orderType,
      userName,
      userImage,
      minutes,
      clientPaid,
      totalEarnings,
      ratingDetails,
      refundStatus,
      type,
    } = this.props.item;
    const {moreInfo, isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    var currency = 'Rupee';
    var symbol = '₹';
    var {currency} = this.state.userData;
    currency === 'Rupee' ? (symbol = '₹') : (symbol = '$');

    return (
      <Touchable
        underlayColor="#ff648a10"
        onPress={this.handleOrderList}
        style={styles.listContainer}>
        <View>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <Image
              source={{uri: userImage}}
              resizeMode="cover"
              style={styles.userImage}
            />
            <Text style={{flex: 1, fontSize: wp(3.6), color: '#000'}}>
              {userName}
            </Text>

            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <Text
                style={{
                  fontSize: wp(3.6),
                  fontWeight: '700',
                  color: '#000',
                }}>
                {this.props.item.status}
              </Text>
              <Text
                style={{
                  fontSize: wp(3.6),
                  fontWeight: '700',
                  color: '#000',
                  textAlign: 'right',
                }}>
                #{consultationId}
              </Text>
              <MaterialCommunityIcons
                name={this.props.item.icon}
                color="#000"
                size={16}
                style={styles.icon}
              />
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: '#000',
              marginVertical: wp(2),
              width: '100%',
            }}
          />

          <View
            style={[basicStyles.directionRow, basicStyles.marginBottomHalf]}>
            <Text style={{fontSize: wp(3.6), color: '#000', flex: 1}}>
              Time
            </Text>

            <Text style={{flex: 0.5, color: '#000'}}>-</Text>

            <View style={[basicStyles.flexTow, basicStyles.directionRow]}>
              <MaterialCommunityIcons
                name="calendar-blank"
                color="#000"
                size={14}
                style={basicStyles.marginRightHalf}
              />
              <Text style={{fontSize: wp(3.2), color: '#000'}}>{date}</Text>
            </View>
          </View>
          {orderType !== 'Gift' ? (
            <View
              style={[basicStyles.directionRow, basicStyles.marginBottomHalf]}>
              <Text style={{fontSize: wp(3.6), color: '#000', flex: 1}}>
                Time Spent
              </Text>
              <Text style={{flex: 0.5, color: '#000'}}>-</Text>
              <Text style={{fontSize: wp(3.6), color: '#000', flex: 2}}>
                {minutes}
              </Text>
            </View>
          ) : null}

          <View
            style={[basicStyles.directionRow, basicStyles.marginBottomHalf]}>
            <Text style={{fontSize: wp(3.6), color: '#000', flex: 1}}>
              Client Paid
            </Text>
            <Text style={{flex: 0.5, color: '#000'}}>-</Text>
            <Text style={{fontSize: wp(3.6), color: '#000', flex: 2}}>
              {symbol} {clientPaid}
            </Text>
          </View>

          <View
            style={[basicStyles.directionRow, basicStyles.marginBottomHalf]}>
            <Text style={{fontSize: wp(3.6), color: '#000', flex: 1}}>
              Total Earning
            </Text>
            <Text style={{flex: 0.5, color: '#000'}}>-</Text>
            <Text style={{fontSize: wp(3.6), color: '#000', flex: 2}}>
              {symbol} {totalEarnings}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: '#000',
              marginVertical: wp(2),
              width: '100%',
            }}
          />

          <View style={[basicStyles.directionRow, basicStyles.justifyEnd]}>
            {ratingDetails ? (
              <Touchable
                style={styles.buttons}
                onPress={this.handleMoreInfo('moreInfo')}
                underlayColor="transparent">
                <Text style={[basicStyles.text, {color: '#000'}]}>Review</Text>
              </Touchable>
            ) : (
              <View />
            )}
            {/* <Touchable style={styles.buttons}>
              <Text style={[basicStyles.text]}>Have Doubts?</Text>
            </Touchable> */}

            {orderType === 'Chat' ? (
              <Touchable
                style={styles.button}
                onPress={this.handleChat}
                underlayColor="#ff648a80">
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    color="#fff"
                    size={14}
                    style={basicStyles.marginRightHalf}
                  />
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {orderType}
                  </Text>
                </View>
              </Touchable>
            ) : orderType === 'Live Call' ? (
              <Touchable style={styles.button} underlayColor="#ff648a80">
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Ionicons
                    name="call"
                    color="#fff"
                    size={14}
                    style={basicStyles.marginRightHalf}
                  />
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {orderType}
                  </Text>
                </View>
              </Touchable>
            ) : orderType === 'Gift' ? (
              <Touchable style={styles.button} underlayColor="#ff648a80">
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Ionicons
                    name="gift"
                    color="#000"
                    size={14}
                    style={basicStyles.marginRightHalf}
                  />
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {orderType}
                  </Text>
                </View>
              </Touchable>
            ) : (
              <Touchable
                style={styles.button}
                underlayColor="#ff648a80"
                onPress={this.handleCall}>
                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <Ionicons
                    name="call"
                    color="#fff"
                    size={14}
                    style={basicStyles.marginRightHalf}
                  />
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {orderType}
                  </Text>
                </View>
              </Touchable>
            )}

            {orderType !== 'Gift' ? (
              refundStatus ? (
                <Touchable style={styles.buttons} underlayColor="transparent">
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Refunded
                  </Text>
                </Touchable>
              ) : type === 'Completed' ? (
                <Touchable
                  style={styles.buttons}
                  underlayColor="transparent"
                  onPress={this.handleRefund}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Refund
                  </Text>
                </Touchable>
              ) : null
            ) : null}
          </View>
          {moreInfo && (
            <View style={[styles.moreInfoContainer]}>
              <View>
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
                  <Text style={[basicStyles.heading]}>
                    {ratingDetails.rating}{' '}
                  </Text>
                </View>
                <Text style={[basicStyles.flexOne, basicStyles.text]}>
                  {ratingDetails.review}
                </Text>
                {ratingDetails.reply == null ? (
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignEnd,
                      styles.PostReview,
                    ]}>
                    <TextInput
                      placeholder="Review"
                      placeholderTextColor="#333"
                      multiline
                      style={styles.reviewInput}
                      value={this.state.reply}
                      onChangeText={this.handleChangeReviewText}
                    />
                    <Touchable
                      style={styles.postButton}
                      onPress={this.handleReplyToReview}>
                      <Text style={[basicStyles.text]}>Post</Text>
                    </Touchable>
                  </View>
                ) : (
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    {ratingDetails.reply}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  postButton: {
    backgroundColor: '#ff648a',
    paddingHorizontal: wp(5),
    height: hp(3),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  PostReview: {
    borderWidth: 1,
    borderColor: '#cccccc80',
    padding: wp(2),
    borderRadius: 5,
    marginTop: wp(2),
  },

  reviewInput: {
    height: hp(10),
    padding: wp(2),
    color: '#000',
    textAlignVertical: 'top',
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#9ddafd',
    padding: wp(2),
    borderRadius: wp(2),
  },
  icon: {
    marginLeft: wp(2),
  },
  userImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
  },
  button: {
    // borderWidth: 1,

    // backgroundColor: '#ff648a',
    backgroundColor: '#4cade2',
    paddingHorizontal: wp(5),
    height: hp(3),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    // borderWidth: 1,
    // borderColor: '#ff648a',
    backgroundColor: '#4cade2',
    paddingHorizontal: wp(5),
    height: hp(3),
    borderRadius: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
});
