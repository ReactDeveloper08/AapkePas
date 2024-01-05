import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Style
import basicStyles from 'styles/BasicStyles';

export default class ExploreList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChat = () => {
    this.props.nav.navigate('Chat');
  };

  render() {
    const {blockUser, userImage, time, messageNo, msg} = this.props.item;

    return (
      <TouchableOpacity
        style={[styles.feedsContainer]}
        onPress={this.handleChat}>
        <Image source={userImage} resizeMode="cover" style={styles.userImage} />

        <View style={basicStyles.flexOne}>
          <Text
            style={[
              basicStyles.headingLarge,
              basicStyles.paddingHalfBottom,
              basicStyles.marginRight,
            ]}>
            {blockUser}
          </Text>
          <Text
            style={[
              basicStyles.text,
              //   basicStyles.flexOne,
              basicStyles.marginRight,
            ]}>
            {msg}
          </Text>
        </View>

        <View>
          <Text style={basicStyles.text}>{time}</Text>
          <Text style={styles.no}>{messageNo}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  feedsContainer: {
    // borderBottomColor: '#ccc',
    // borderBottomWidth: 1,
    backgroundColor: '#ffffff80',
    flexDirection: 'row',
    padding: wp(3),
    alignItems: 'center',
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
  editButton: {
    // borderWidth: 1,
    // borderColor: '#fd6c33',
    backgroundColor: '#fd6c33',
    height: hp(4),
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    borderRadius: hp(2),
  },
  userImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  no: {
    backgroundColor: '#fd6c33',
    padding: wp(1),
    minWidth: wp(5),
    fontSize: wp(2.5),
    borderRadius: wp(3),
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
  },
});
