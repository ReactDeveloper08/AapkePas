import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_live_btn from 'assets/icons/ic_live_btn.png';
import ic_share_live from 'assets/icons/ic_share_live.png';

// styles
import basicStyles from 'styles/BasicStyles';

const LiveList = props => {
  const {
    secheduleName,
    isLive,
    expertName,
    expertImage,
    secheduleTime,
    startTime,
    EndTime,
  } = props.item;
  // console.log('the props are', props.item);
  const onShare = () => {
    const {handleShare} = props;
    handleShare();
  };
  const LiveSession = async () => {
    const liveData = props.item;
    const {handleShowLive} = props;
    handleShowLive(liveData);
  };

  return (
    <View>
      {isLive ? (
        <TouchableOpacity onPress={LiveSession}>
          <View style={styles.listContainer}>
            <View style={[basicStyles.justifyCenter, styles.nameContainer]}>
              <Image
                source={{uri: expertImage}}
                resizeMode="cover"
                style={styles.listImage}
              />
            </View>

            <View style={basicStyles.flexOne}>
              <Text style={styles.listHeading}>{secheduleName}</Text>
              <Text style={[basicStyles.textLarge]}>{expertName}</Text>

              <Text style={styles.ListTime}>Start: {startTime}</Text>
              {/* <Text style={styles.ListTime}>Start: {secheduleTime}</Text> */}
            </View>

            <View style={basicStyles.alignCenter}>
              <Image
                source={ic_live_btn}
                resizeMode="cover"
                style={styles.liveIcon}
              />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.listContainer}>
          <View style={[basicStyles.justifyCenter, styles.nameContainer]}>
            <Image
              source={{uri: expertImage}}
              resizeMode="cover"
              style={styles.listImage}
            />
          </View>

          <View style={basicStyles.flexOne}>
            <Text style={[styles.listHeading, {marginVertical: wp(0.5)}]}>
              {secheduleName}
            </Text>
            <Text
              style={[
                basicStyles.textLarge,
                basicStyles.textBold,
                {marginVertical: wp(0.5)},
              ]}>
              {expertName}
            </Text>

            <Text style={styles.ListTime}>Start: {startTime}</Text>
            <Text style={styles.ListTime}>Start: {secheduleTime}</Text>
            {EndTime ? (
              <Text style={styles.ListTime}>End: {EndTime}</Text>
            ) : null}
          </View>

          <View style={styles.iconContainer}>
            <Image
              source={ic_live_btn}
              resizeMode="cover"
              style={styles.liveIcon}
            />
            {EndTime !== '' ? null : (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={onShare}
                underlayColor="transparent">
                <Image
                  source={ic_share_live}
                  resizeMode="cover"
                  style={styles.shareIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default LiveList;
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 5,
    paddingHorizontal: wp(3),
  },
  listContainer: {
    flexDirection: 'row',
    // backgroundColor: '#fff',
    // justifyContent: 'center',
    padding: wp(3),
    alignItems: 'center',
    borderRadius: 10,
    // borderWidth: wp(2),
    // borderColor: '#ccc4',
  },
  listImage: {
    height: wp(24),
    aspectRatio: 1 / 1,
    borderRadius: wp(12),
    // borderStyle: 'dashed',
  },
  liveIcon: {
    height: wp(14),
    aspectRatio: 1 / 1,
    // marginBottom: wp(1),
    marginTop: wp(-4),
    marginBottom: wp(4),
  },
  liveButton: {
    // backgroundColor: '#ff2a00',
    // height: wp(16),
    // width: wp(16),
    // borderRadius: wp(8),
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
  shareIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  shareButton: {
    marginBottom: wp(-2),
  },
  listHeading: {
    fontSize: wp(4.5),
    color: '#4cade2',
    fontWeight: '700',
  },
  liveTex: {
    width: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(1.5),
  },
  ListTime: {
    fontSize: wp(3.2),
    color: '#333',
    fontWeight: '400',
  },
  nameContainer: {
    borderWidth: 3,
    borderColor: '#99d9fb',
    marginRight: wp(3),
    borderRadius: wp(12),
    height: wp(24),
    width: wp(24),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveSess: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  sessionContainer: {
    backgroundColor: '#ff727c',
    alignSelf: 'flex-start',
    marginVertical: wp(0.5),
    paddingHorizontal: wp(1),
    borderRadius: 3,
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
