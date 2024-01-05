import React, {PureComponent} from 'react';
import {
  Text,
  Alert,
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//snap carousel
import Carousel from 'react-native-snap-carousel';

// VectorIcons

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

// Style
import basicStyles from 'styles/BasicStyles';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';
import showToast from 'components/CustomToast';
import {nsNavigate} from 'routes/NavigationService';
import FastImage from 'react-native-fast-image';
import {textSmallSize} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
const DATA = [];
for (let i = 0; i < 10; i++) {
  DATA.push(i);
}
export default class ExploreList extends PureComponent {
  constructor(props) {
    super(props);
    const {follow, expertId, likeStatus} = props.item;
    this._renderItem = this._renderItem.bind(this);
    this.state = {
      follow,
      expertId,
      like: likeStatus,
      message: '',
      index: 0,
    };
  }
  handleLogin = () => {
    this.props.nav.navigate('Reg');
  };
  handleFollow = async () => {
    // const {follow} = this.state;
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
    const {expertId} = this.props.item;

    let {follow} = this.state;
    if (follow == false) {
      follow = true;
      this.setState({follow});
    } else {
      follow = false;
      this.setState({follow});
    }

    const params = {
      expertId,
      follow,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Customer/followVendor',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {refresh} = this.props;
        refresh(message);
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

  handleVendorPage = () => {
    this.props.nav.push('CuVendors');
  };
  _renderItem({item}) {
    return (
      <View style={styles.itemContainer}>
        <FastImage
          style={{
            width: '100%',
            height: '100%',

            resizeMode: 'contain',
            backgroundColor: '#f2f1f1',
          }}
          source={{
            uri: item,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  }
  handelHeart = async () => {
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
    const {postId} = this.props.item;
    const {refresh} = this.props;

    let {like} = this.state;
    if (like == false) {
      like = true;
      this.setState({like});
    } else {
      like = false;
      this.setState({like});
    }

    const params = {
      postId,
      like,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Customer/likePost',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        refresh(message);
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

  handleTokenExpire = async () => {
    await clearData();
    nsNavigate('Login');
  };

  render() {
    const {
      expertName,
      image,
      description,
      psotDate,
      postTime,
      mediaUrl,
      likes,
      likeStatus,
    } = this.props.item;
    // const {followStatus} = this.state;

    return (
      <View style={[styles.feedsContainer]}>
        <View style={styles.contentContainer}>
          <View style={styles.imgContainer}>
            <Image
              source={{uri: image}}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
          </View>
          <View style={basicStyles.flexOne}>
            <Text style={basicStyles.heading}>{expertName}</Text>
            {/* <Text style={styles.locationText}>{feedProfileSubTitle}</Text> */}
            <Text style={styles.locationText}>
              {psotDate} | {postTime}
            </Text>
          </View>

          <Touchable onPress={this.handleFollow}>
            {this.state.follow ? (
              <View style={styles.followingButton}>
                <Icon name="check-all" size={16} color="#fff" />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: wp(3),
                    marginLeft: wp(1),
                  }}>
                  Following
                </Text>
              </View>
            ) : (
              <View style={styles.followButtonTrue}>
                <Text style={{color: '#333', fontSize: wp(3)}}>Follow</Text>
              </View>
            )}
          </Touchable>
        </View>

        <View style={styles.imageBorder}>
          <Carousel
            ref={c => (this.carousel = c)}
            data={mediaUrl}
            renderItem={this._renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            containerCustomStyle={styles.carouselContainer}
            inactiveSlideShift={0}
            // onSnapToItem={(index) => this.setState({index})}
            useScrollView={true}
          />
          {/* <Text style={styles.counter}>{this.state.index}</Text> */}
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.paddingHalfHorizontal,
            basicStyles.marginBottomHalf,
            basicStyles.alignCenter,
          ]}>
          {likeStatus ? (
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.flexOne,
                // basicStyles.padding,
              ]}>
              <Touchable
                onPress={this.handelHeart}
                style={[
                  basicStyles.marginRight,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Material
                  name="cards-heart"
                  color="#f75473"
                  size={21}
                  style={styles.TrueIconRow}
                />
                <Text style={[basicStyles.text, basicStyles.marginLeftHalf]}>
                  {likes} Likes
                </Text>
              </Touchable>
            </View>
          ) : (
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.flexOne,
                // basicStyles.padding,
              ]}>
              <Touchable
                onPress={this.handelHeart}
                style={[
                  basicStyles.marginRight,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                ]}>
                <Material
                  name="heart-outline"
                  color="#000"
                  size={21}
                  style={styles.iconRow}
                />
                <Text style={[basicStyles.text, basicStyles.marginLeft]}>
                  {likes} Likes
                </Text>
              </Touchable>
            </View>
          )}
        </View>

        <Text
          style={[
            basicStyles.text,
            basicStyles.paddingHorizontal,
            basicStyles.paddingBottom,
          ]}>
          {description}
        </Text>
      </View>
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
  imageBorder: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#ccc',
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
  },
  carouselContainer: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    // width: wp(90),
  },
  itemContainer: {
    // width: ITEM_WIDTH,
    width: wp(90),
    // height: ITEM_HEIGHT,
    minHeight: 210,
    marginBottom: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
  },

  textStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },

  pmTextStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },

  vectorIconRow: {
    width: 24,
    textAlign: 'center',
    marginRight: wp(1),
  },
  followButton: {
    width: wp(22),
    backgroundColor: '#f75473',
    paddingVertical: wp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(2.5),
    borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#ff9933',
    marginRight: wp(2),
  },
  followButtonTrue: {
    // width: wp(22),
    // backgroundColor: '#ff9933',
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
    // borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4eaee3',
    marginRight: wp(2),
  },
  followingButton: {
    // width: wp(22),
    backgroundColor: '#4eaee3',
    paddingVertical: wp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomRightRadius: wp(2.5),
    // borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#318956',
  },
  nameText: {
    padding: wp(0.8),
    fontSize: wp(3.2),
  },
  buttonText: {
    color: '#fff',
  },
  imgContainer: {
    borderWidth: wp(0.5),
    borderColor: '#4eaee3',
    borderRadius: hp(3.5),
    marginRight: wp(2),
  },
  newsFeedsImage: {
    width: hp(6),
    aspectRatio: 1 / 1,
    borderRadius: hp(3),
  },
  locationText: {
    fontSize: textSmallSize,
  },
  newsFeedImage: {
    width: '100%',
    aspectRatio: 2 / 1,
    borderRadius: 5,
  },
  feedsContainer: {
    marginBottom: wp(3),
    marginTop: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc4',
    borderRadius: wp(5),
  },
});
