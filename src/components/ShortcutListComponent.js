import React, {PureComponent} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

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

  handlePopup = () => {
    const {item} = this.props;
    this.props.handleEditPopup(item);
  };

  render() {
    const {userName} = this.props.item;

    return (
      <View style={[styles.feedsContainer]}>
        <Text
          style={[
            basicStyles.textLarge,
            basicStyles.flexOne,
            basicStyles.marginRight,
          ]}>
          {userName}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={this.handlePopup}
          underlayColor="#ff638b80">
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  feedsContainer: {
    backgroundColor: '#9bdbff',
    flexDirection: 'row',
    padding: wp(3),
    alignItems: 'center',
    borderRadius: 8,
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
    backgroundColor: '#4eade3',
    height: hp(4),
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    borderRadius: hp(2),
  },
});
