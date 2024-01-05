import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
    const {userImage, userName, description, postDate, postImage} =
      this.props.item;
    const {followStatus} = this.state;

    return (
      <View style={[styles.feedsContainer]}>
        <View style={styles.contentContainer}>
          <Image
            source={{uri: userImage}}
            resizeMode="cover"
            style={styles.newsFeedsImage}
          />

          <View style={basicStyles.flexOne}>
            <Text style={[basicStyles.heading, basicStyles.offWhiteColor]}>
              {userName}
            </Text>
            <View
              style={[
                basicStyles.marginTop,
                basicStyles.directionRow,
                {color: '#000'},
              ]}>
              <Image
                source={{uri: postImage}}
                resizeMode="cover"
                style={styles.postImage}
              />
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.text, basicStyles.offWhiteColor]}>
                  {description}
                </Text>
              </View>
            </View>
            <Text style={[styles.momentDate, basicStyles.offWhiteColor]}>
              {postDate}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  feedsContainer: {
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
    backgroundColor: '#4daee3',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp(2),
  },

  newsFeedsImage: {
    width: hp(6),
    aspectRatio: 1 / 1,
    borderRadius: hp(3),
    marginRight: wp(3),
  },

  momentDate: {
    fontSize: wp(2.8),
    marginTop: wp(1.5),
    color: '#999',
  },

  postImage: {
    width: wp(15),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
});
