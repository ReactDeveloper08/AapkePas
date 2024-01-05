import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

// Style
import basicStyles from 'styles/BasicStyles';

export default class ExploreList extends PureComponent {
  constructor(props) {
    super(props);
    const {followStatus} = props.item;
    this.state = {
      followStatus,
    };
  }

  handleFollow = () => {
    const {followStatus} = this.state;
    if (followStatus === true) {
      this.setState({followStatus: false});
    } else {
      this.setState({followStatus: true});
    }
  };

  handleVendorPage = () => {
    this.props.nav.push('CuVendors');
  };

  handelHeart = () => {};

  render() {
    const {expertName, expertImage, description, postTime, mediaUrl, likes} =
      this.props.item;
    const {followStatus} = this.state;

    return (
      <View style={styles.feedsContainer}>
        <View style={styles.contentContainer}>
          <FastImage
            style={styles.newsFeedsImage}
            source={{
              uri: expertImage,
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={basicStyles.flexOne}>
            <Text style={[basicStyles.heading]}>{expertName}</Text>
            <Text style={[styles.locationText]}>{postTime}</Text>
          </View>
        </View>

        <Text
          style={[
            basicStyles.text,
            basicStyles.paddingHorizontal,
            basicStyles.paddingBottom,
          ]}>
          {description}
        </Text>

        <View style={[basicStyles.directionRow, basicStyles.paddingHorizontal]}>
          <FastImage
            style={styles.newsFeedImage}
            source={{
              uri: mediaUrl[0],
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.padding,
            basicStyles.alignCenter,
          ]}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.flexOne,
              // basicStyles.padding,
            ]}>
            <TouchableOpacity
              onPress={this.handelHeart}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Material
                name="heart-outline"
                color="#ccc"
                size={21}
                style={styles.iconRow}
              />
              <Text style={[basicStyles.text, basicStyles.marginLeft]}>
                {likes} Likes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    // backgroundColor: '#318956',
    paddingVertical: wp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(2.5),
    borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ff9933',
    marginRight: wp(2),
  },
  followingButton: {
    width: wp(22),
    paddingVertical: wp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(2.5),
    borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#318956',
  },
  nameText: {
    padding: wp(0.8),
    fontSize: wp(3.2),
  },
  buttonText: {
    color: '#fff',
  },

  newsFeedsImage: {
    width: hp(6),
    aspectRatio: 1 / 1,
    borderRadius: hp(3),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  locationText: {
    fontSize: wp(2.8),
  },
  newsFeedImage: {
    width: '100%',
    aspectRatio: 2 / 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc8',
  },
  // feedsContainer: {
  //   borderBottomColor: '#ccc',
  //   borderBottomWidth: 1,
  // },
});
