import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
// import ic_star from 'assets/icons/ic_review_white.png';
import ic_star from 'assets/icons/ic_star_gray.png';
import ic_call_expert from 'assets/icons/ic_call_expert.png';
import ic_chat_expert from 'assets/icons/ic_chat_expert.png';
import ic_video_expert from 'assets/icons/ic_video_expert.png';
import expertBg from 'assets/images/expertBg.jpg';

// Styles
import basicStyles from 'styles/BasicStyles';

//api
import {KEYS, getData} from 'api/UserPreference';

// Responsive

import {headingSmallSize} from '../../utility/styleHelper/appStyle';

const ConsultantTileComponent = props => {
  const [currency, setCurrency] = useState(props.currency);
  // const handleDetail = () => {
  //   props.nav.push('HomeCategory');
  // };
  useEffect(() => {
    Currency();
  }, []);
  const Currency = async () => {
    const money = await getData(KEYS.NEW_CURRENCY);
    setCurrency(money);
  };
  const {id} = props.item;
  const handleDetail = () => {
    props.nav.navigate('ExpertDetail', {info: {id}});
  };

  return (
    <TouchableHighlight
      style={styles.titleContainer}
      onPress={handleDetail.bind(this)}
      underlayColor="transparent">
      <View>
        <View style={styles.tileTop}>
          <View style={styles.imgBackground}>
            <View style={styles.imgContainer}>
              <FastImage
                style={styles.tileIcon}
                source={{
                  uri: props.item.image,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.justifyBetween,
              styles.reviewExp,
            ]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                styles.review,
              ]}>
              <FastImage
                source={ic_star}
                resizeMode="cover"
                style={styles.reviewIcon}
              />
              <Text style={{fontSize: headingSmallSize, color: '#989898'}}>
                {props.item.rating}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.contentContainer}>
            <Text
              style={{fontSize: wp(2.8), fontWeight: '700', color: '#4faee4'}}>
              {props.item.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: wp(2.2),
                color: '#333',
                marginVertical: wp(1),
                width: wp(40),
              }}>
              {props.item.skills}
            </Text>

            <Text style={[basicStyles.textSmall]}>{props.item.languages}</Text>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.justifyBetween,
                basicStyles.marginTopHalf,
              ]}>
              <View>
                {currency === 'Rupee' ? (
                  props.item.discountCharges ? (
                    <Text style={[basicStyles.headingSmall]}>
                      ₹ {props.item.discountCharges}
                    </Text>
                  ) : (
                    <Text style={[basicStyles.headingSmall]}>
                      ₹ {props.item.actualCharges}
                    </Text>
                  )
                ) : props.item.discountDollarCallCharges ? (
                  <Text style={[basicStyles.headingSmall]}>
                    $ {props.item.discountDollarCallCharges}
                  </Text>
                ) : (
                  <Text style={[basicStyles.headingSmall]}>
                    $ {props.item.actualDollarCallCharges}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.iconsContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={ic_call_expert}
              resizeMode="cover"
              style={styles.tileIcons}
            />
            <FastImage
              source={ic_chat_expert}
              resizeMode="cover"
              style={styles.tileIcons}
            />
            <FastImage
              source={ic_video_expert}
              resizeMode="cover"
              style={styles.tileIcons}
            />
          </View>

          <View style={{alignSelf: 'flex-end'}}>
            {props.item.isLive !== true ? (
              props.item.isBusy !== true ? (
                props.item.isOnline !== false ? (
                  <View style={styles.buttonContainer}>
                    <View style={styles.onlineStatus} />
                  </View>
                ) : (
                  <View style={styles.buttonContainer}>
                    <View style={styles.offlineStatus} />
                  </View>
                )
              ) : (
                <View style={styles.buttonContainer}>
                  <View style={styles.busyStatus} />
                </View>
              )
            ) : (
              <View style={styles.buttonContainer}>
                <View style={styles.liveButton}>
                  <View style={styles.liveStatus} />
                  <Text style={[basicStyles.heading, basicStyles.redColor]}>
                    Live
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default ConsultantTileComponent;
const styles = StyleSheet.create({
  titleContainer: {
    width: wp(47),
    marginHorizontal: wp(1),
    marginTop: wp(0),
    // backgroundColor: '#f6547240',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc8',
    paddingTop: wp(0),
    paddingBottom: wp(2),
    borderRadius: wp(3.5),
    overflow: 'hidden',
    // shadowColor: '#0006',
    // shadowRadius: 10,
    // shadowOpacity: 1,
    // elevation: 5,
    // shadowOffset: {
    //   width: 8,
    //   height: 4,
    // },
  },

  detailContainer: {
    paddingVertical: wp(2),
  },

  iconsContainer: {
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tileIcons: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  imgBackground: {
    height: hp(16),
    width: '100%',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4aace3',
  },

  tileTop: {
    // marginBottom: hp(1),
    padding: wp(0),
    borderRadius: wp(2),
  },

  imgContainer: {
    borderRadius: wp(10),

    marginTop: hp(0),
    alignSelf: 'center',

    width: wp(20),
    borderWidth: 3,
    borderColor: '#fff8',

    overflow: 'hidden',
    flexDirection: 'row',

    backgroundColor: '#f2f1f1',
  },

  tileIcon: {
    width: wp(20),
    borderRadius: wp(10),
    aspectRatio: 1 / 1,
  },

  reviewExp: {
    paddingHorizontal: wp(1),
    position: 'absolute',
    width: '98%',
    left: 0,
    right: 0,
    marginLeft: wp(0),
    bottom: wp(2),
  },

  exp: {
    backgroundColor: '#f65472',
    paddingHorizontal: wp(2),
    borderRadius: wp(3),
    marginVertical: wp(1),
    color: '#fff',
    fontSize: headingSmallSize,
    fontWeight: '700',
    height: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: wp(5),
  },

  review: {
    backgroundColor: '#FFF',
    alignSelf: 'center',
    paddingHorizontal: wp(2),
    height: wp(5),
    // paddingVertical: wp(1),
    borderRadius: wp(4),
    // marginTop: wp(-7),
  },
  reviewIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },

  contentContainer: {
    paddingHorizontal: wp(2),
  },

  listTitle: {
    fontSize: wp(2.8),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  buttonContainer: {
    alignItems: 'center',
  },
  tileButton: {
    backgroundColor: '#f65472',
    height: hp(3),
    borderRadius: hp(2),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000080',
    // width: wp(30),
    paddingHorizontal: wp(3),
  },
  liveButton: {
    backgroundColor: '#fff',
    height: hp(3),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: hp(2),
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000080',
    // width: wp(30),
    paddingHorizontal: wp(3),
  },
  offlineTileButton: {
    backgroundColor: '#fff',
    height: hp(3),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: hp(2),
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000080',
    // width: wp(30),
    paddingHorizontal: wp(3),
  },
  busyTileButton: {
    backgroundColor: '#fff',
    height: hp(3),
    borderRadius: hp(2),
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000080',
    // width: wp(30),
    paddingHorizontal: wp(3),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'brown',
    borderWidth: 1,
  },
  onlineStatus: {
    backgroundColor: '#40ca4d',
    height: 14,
    width: 14,
    borderRadius: 7,
    marginRight: wp(0),
    borderWidth: 3,
    borderColor: '#87d08e40',
  },
  liveStatus: {
    backgroundColor: '#df2525',
    height: 14,
    width: 14,
    borderRadius: 7,
    marginRight: wp(0),
    borderWidth: 3,
    borderColor: '#df252520',
  },
  offlineStatus: {
    backgroundColor: '#999999',
    height: 14,
    width: 14,
    borderRadius: 7,
    marginRight: wp(0),
    borderWidth: 3,
    borderColor: '#99999940',
  },
  busyStatus: {
    backgroundColor: 'brown',
    height: 6,
    width: 6,
    borderRadius: 3,
    marginRight: wp(2),
  },
});
