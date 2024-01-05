import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_view_white from 'assets/icons/ic_view_white.png';
import ic_call from 'assets/icons/ic_call.png';
import ic_live_icon from 'assets/icons/ic_live_icon.png';
// import busy_expert from 'assets/icons/busy_expert.png';
import busy_expert from 'assets/icons/expert_busy.png';
import ic_star from 'assets/icons/ic_star_white.png';

import basicStyles from 'styles/BasicStyles';

import {
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ExpertList = props => {
  const {currency} = props;

  const {id} = props.item;
  const handleExpertDetail = () => {
    props.nav.push('ExpertDetail', {info: {id}});
  };

  return (
    <Touchable style={styles.expertInfoContainer} onPress={handleExpertDetail}>
      <View style={styles.topContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.imageOuter}>
            <Image
              source={{uri: props.item.image}}
              resizeMode="cover"
              style={styles.expertImage}
            />
          </View>
        </View>

        <View style={basicStyles.flexOne}>
          <View style={styles.topButtons}>
            <View style={styles.review}>
              <Image
                source={ic_star}
                resizeMode="cover"
                style={styles.reviewIcon}
              />
              <Text style={styles.reviewText}>{props.item.rating}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {props.item.isBusy !== true &&
              props.item.isLive !== true &&
              props.item.isPending !== true ? (
                props.item.isOnline ? (
                  <View style={[styles.buttons, basicStyles.directionRow]}>
                    <Touchable
                      style={styles.viewIcon}
                      underlayColor="#2cae1680">
                      <Image source={ic_view_white} style={styles.buttonIcon} />
                    </Touchable>

                    <Touchable style={styles.live} underlayColor="#25aee480">
                      <Image source={ic_live_icon} style={styles.buttonIcon} />
                    </Touchable>

                    <Touchable
                      style={styles.bookIcon}
                      underlayColor="#ff658b80">
                      <Image source={ic_call} style={styles.buttonIcon} />
                    </Touchable>
                  </View>
                ) : null
              ) : (
                <View style={styles.buttons}>
                  <Touchable style={styles.busyIcon}>
                    <Image source={busy_expert} style={styles.busyButtonIcon} />
                  </Touchable>
                </View>
              )}
            </View>
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{props.item.name}</Text>
            {props.item.expertise ? (
              <Text style={[styles.expertise]}>{props.item.expertise}</Text>
            ) : null}

            {currency === 'Rupee' ? (
              props.item.discountCharges ? (
                <Text style={[styles.info2]}>
                  ₹ {props.item.discountCharges}
                </Text>
              ) : (
                <Text style={[styles.info2]}>₹ {props.item.actualCharges}</Text>
              )
            ) : props.item.discountDollarCallCharges ? (
              <Text style={[styles.info2]}>
                $ {props.item.discountDollarCallCharges}
              </Text>
            ) : (
              <Text style={[styles.info2]}>
                $ {props.item.actualDollarCallCharges}
              </Text>
            )}

            <Text style={styles.languages}>
              <Text style={[styles.title]}>Language: </Text>
              {props.item.languages}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.info}>
          <Text style={[styles.title]}>Qualification: </Text>
          {props.item.qualification}
        </Text>
      </View>
    </Touchable>
  );
};
export default ExpertList;

const styles = StyleSheet.create({
  expertInfoContainer: {
    padding: wp(3),
    paddingTop: hp(5),
  },
  topContainer: {
    flexDirection: 'row',
    backgroundColor: '#5477f710',
    borderTopRightRadius: wp(3),
    borderTopLeftRadius: wp(3),
    // marginTop: wp(3),
    paddingLeft: wp(2),
    // elevation: 5,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(-4.2),
    marginBottom: wp(2),
  },
  // buttons: {
  //   flexDirection: 'row',
  // },
  bottomContainer: {
    // flexDirection: 'row',
    backgroundColor: '#5477f710',
    borderBottomRightRadius: wp(3),
    borderBottomLeftRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingBottom: wp(2),
  },
  imageContainer: {
    // backgroundColor: '#ccc',
    alignItems: 'center',
    marginTop: hp(-4.5),
  },
  imageOuter: {
    borderWidth: 3,
    borderColor: '#9ddafe',
    borderRadius: wp(3.7),
    backgroundColor: '#f2f1f1',
  },
  expertImage: {
    height: wp(25),
    aspectRatio: 1 / 1,
    borderRadius: wp(3),
    // borderWidth: 3,
    // borderColor: '#ff658b20',
  },
  details: {
    flex: 1,
    paddingHorizontal: wp(2),
    // backgroundColor: '#5477f710',
    borderRadius: wp(3),
  },
  name: {
    // flex: 1,
    fontSize: wp(3.2),
    color: '#333',
    fontWeight: '700',
  },
  info: {
    fontSize: textSize,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: wp(1),
    marginTop: wp(1),
  },
  expertise: {
    fontSize: textSize,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: wp(0.5),
    marginTop: wp(0.5),
  },
  languages: {
    fontSize: textSize,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: wp(0.5),
    // marginTop: wp(0.5),
  },
  title: {
    fontSize: headingSize,
    color: '#666',
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: wp(0.5),
    marginTop: wp(0.5),
  },
  info2: {
    fontSize: headingSize,
    color: '#4faee4',
    textTransform: 'capitalize',
    marginBottom: wp(0.5),
    marginTop: wp(0.5),
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingRight: wp(3),
  },
  viewIcon: {
    backgroundColor: '#4faee4',
    width: wp(7),
    height: wp(7),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  busyIcon: {
    // backgroundColor: '#2cae16',
    width: wp(7),
    height: wp(7),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  live: {
    backgroundColor: '#4faee4',
    width: wp(7),
    height: wp(7),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  bookIcon: {
    backgroundColor: '#4faee4',
    width: wp(7),
    height: wp(7),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  buttonIcon: {
    height: wp(4),
    aspectRatio: 1 / 1,
  },
  busyButtonIcon: {
    height: wp(7),
    aspectRatio: 1 / 1,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4faee4',
    alignSelf: 'flex-start',
    padding: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: wp(3),
    marginLeft: wp(2),
    marginBottom: wp(1),
  },
  reviewIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
  },
  reviewText: {
    fontSize: textSize,
    marginLeft: wp(2),
    color: '#fff',
  },
});
