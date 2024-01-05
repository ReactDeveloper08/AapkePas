import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isEmpty} from 'lodash';
// Icons

import ic_chat_white from 'assets/icons/ic_chat_white.png';
import ic_star_border from 'assets/icons/ic_star_border.png';

import basicStyles from 'styles/BasicStyles';

import {headingLargeSize, textSize} from '../../utility/styleHelper/appStyle';

const Payments = props => {
  const {item, currency} = props;
  const {
    giftName,
    chargeDeductedInr,
    chargeDeductedUsd,
    consultationId,
    expertName,
    review,
    rating,
    callDuration,

    date,
    type,
    expertId,
  } = item;

  const handleReview = () => {
    props.nav.navigate('Review', {consultationId, expertId});
  };

  const handleChat = () => {
    props.nav.navigate('chatHistory', item);
  };

  return (
    <View style={styles.paymentContainer}>
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.paddingHalfBottom,
        ]}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.flexOne,
          ]}>
          <View style={styles.iconContainer}>
            {type === 'Gift' ? (
              <Image
                source={require('assets/images/gift.png')}
                resizeMode="cover"
                style={styles.calendarIcon}
              />
            ) : type === 'Live Call' ? (
              <Image
                source={require('assets/images/phone-call.png')}
                resizeMode="cover"
                style={styles.calendarIcon}
              />
            ) : type === 'Icall' ? (
              <Image
                source={require('assets/images/phone-call.png')}
                resizeMode="cover"
                style={styles.calendarIcon}
              />
            ) : type === 'Vccall' ? (
              <Image
                source={require('assets/images/video-camera.png')}
                resizeMode="cover"
                style={styles.calendarIcon}
              />
            ) : (
              <Image
                source={require('assets/images/chat.png')}
                resizeMode="cover"
                style={styles.calendarIcon}
              />
            )}
          </View>
          <Text style={[styles.bodyInfo]}>{date}</Text>
        </View>

        <View>
          {type === 'Gift' ? (
            <View style={styles.paymentBodyRow}>
              <Text style={styles.bodyInfo}>Gift {giftName}</Text>
              {currency === 'Rupee' ? (
                <Text style={styles.bodyInfo}>Rs. {chargeDeductedInr}</Text>
              ) : (
                <Text style={styles.bodyInfo}>$ {chargeDeductedUsd}</Text>
              )}
            </View>
          ) : type === 'Live Call' ? (
            <View style={styles.paymentBodyRow}>
              <Text style={styles.bodyInfo2}>Duration : </Text>
              <Text style={styles.bodyInfo}>{callDuration}</Text>
            </View>
          ) : type === 'Icall' ? (
            <View style={styles.paymentBodyRow}>
              <Text style={styles.bodyInfo2}>Duration : </Text>
              <Text style={styles.bodyInfo}>{callDuration}</Text>
            </View>
          ) : type === 'Vccall' ? (
            <View style={styles.paymentBodyRow}>
              <Text style={styles.bodyInfo2}>Duration : </Text>
              <Text style={styles.bodyInfo}>{callDuration}</Text>
            </View>
          ) : (
            <View style={styles.paymentBodyRow}>
              <Text style={styles.bodyInfo2}>Duration : </Text>
              <Text style={styles.bodyInfo}>{callDuration}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.paymentBodyRowHead]}>
        <View style={{flex: 1}}>
          <Text style={[styles.bodyInfoHead]}>{expertName}</Text>

          {rating !== '0.0' ? (
            <View style={[styles.paymentBodyRow]}>
              <Text
                style={[
                  styles.bodyInfo,
                  {fontWeight: '700', marginRight: wp(4)},
                ]}>
                Rating:
              </Text>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Image
                  source={require('assets/icons/ic_star.png')}
                  style={styles.iconStyle2}
                />
                <Text style={[styles.bodyInfo]}>{rating}</Text>
              </View>
            </View>
          ) : null}

          {review != 'null' && review ? (
            <View>
              <Text
                style={[
                  styles.bodyInfo,
                  {fontWeight: '700', marginRight: wp(4)},
                ]}>
                Review:
              </Text>
              <Text
                style={[
                  styles.bodyInfo,
                  basicStyles.flexOne,
                  {textAlign: 'auto'},
                ]}>
                {review}
              </Text>
            </View>
          ) : null}

          {type !== 'Gift' ? (
            type === 'Live Call' ? (
              <View style={styles.paymentBodyRow}>
                <Text style={[styles.bodyInfo3]}>Live Call Charges : </Text>
                {currency == 'Rupee' ? (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    Rs. {chargeDeductedInr}
                  </Text>
                ) : (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    $ {chargeDeductedUsd}
                  </Text>
                )}
              </View>
            ) : type === 'Icall' ? (
              <View style={styles.paymentBodyRow}>
                <Text style={[styles.bodyInfo3]}>Call Charges : </Text>
                {currency == 'Rupee' ? (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    Rs. {chargeDeductedInr}
                  </Text>
                ) : (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    $ {chargeDeductedUsd}
                  </Text>
                )}
              </View>
            ) : type === 'Vccall' ? (
              <View style={styles.paymentBodyRow}>
                <Text style={[styles.bodyInfo3]}>Video Call Charges : </Text>
                {currency == 'Rupee' ? (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    Rs. {chargeDeductedInr}
                  </Text>
                ) : (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    $ {chargeDeductedUsd}
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.paymentBodyRow}>
                <Text style={[styles.bodyInfo3]}>Chat Charges : </Text>
                {currency == 'Rupee' ? (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    Rs. {chargeDeductedInr}
                  </Text>
                ) : (
                  <Text style={[styles.bodyInfo3, styles.more2]}>
                    $ {chargeDeductedUsd}
                  </Text>
                )}
              </View>
            )
          ) : null}
        </View>

        <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
          {/* <Text style={[styles.bodyInfo, basicStyles.marginRight]}>
            {expertName}
          </Text> */}

          {type !== 'Icall' &&
          type !== 'Live Call' &&
          type !== 'Gift' &&
          type != 'Vccall' ? (
            <TouchableOpacity
              onPress={handleChat}
              style={[basicStyles.marginRight, styles.tileIconContainer]}>
              <Image source={ic_chat_white} style={styles.iconStyle} />
            </TouchableOpacity>
          ) : null}
          {isEmpty(review) ? (
            <TouchableOpacity
              onPress={handleReview}
              style={[styles.tileIconContainer]}>
              <Image source={ic_star_border} style={styles.iconStyle} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  paymentContainer: {
    backgroundColor: '#9cdbfe',
    padding: wp(4),
    borderRadius: wp(2),
  },
  iconContainer: {
    // backgroundColor: '#ff417b40',
    // width: wp(7),
    // height: wp(7),
    borderRadius: wp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  calendarIcon: {
    height: wp(4.5),
    aspectRatio: 1 / 1,
  },
  paymentBodyRowHead: {
    paddingBottom: wp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentBodyRow: {
    flexDirection: 'row',
    // width: '100%',
    marginVertical: wp(1),
  },
  bodyInfoHead: {
    fontSize: headingLargeSize,
    color: '#231f20',
    fontWeight: '700',
    paddingVertical: wp(1),
  },
  bodyInfo: {
    fontSize: wp(2.5),
    color: '#231f20',
  },
  bodyInfo3: {
    fontSize: textSize,
    color: '#777',
  },
  bodyInfo2: {
    fontSize: wp(2.5),
    color: '#231f20',
    fontWeight: '700',
  },
  lineSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(0.5),
  },
  more1: {
    fontWeight: '700',
    color: '#333',
  },
  more2: {
    fontWeight: '700',
    color: '#333',
    fontSize: textSize,
  },

  iconStyle: {
    height: wp(4),
    aspectRatio: 1 / 1,
    margin: wp(1),
  },
  iconStyle2: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
  tileIconContainer: {
    height: wp(8),
    width: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(4),
    backgroundColor: '#49ace5',
  },
});
