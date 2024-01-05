import React, {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from 'styles/BasicStyles';

export default class AstroDetailPhotoListComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.skillContainer}>
        <Text style={[basicStyles.heading, basicStyles.offWhiteColor]}>
          {this.props.item}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  skillContainer: {
    flexDirection: 'row',
    height: hp(5),
    backgroundColor: '#bc0f1780',
    paddingHorizontal: wp(4),
    marginBottom: wp(1),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  skillIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
});
