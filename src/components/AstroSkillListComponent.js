import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
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
        <Image
          source={{uri: this.props.item.icon}}
          resizeMode="cover"
          style={styles.skillIcon}
        />
        <View>
          <Text style={[basicStyles.heading]}>{this.props.item.name}</Text>
          {/* <Text style={[basicStyles.text]}>{this.props.item.tags}</Text> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  skillContainer: {
    flexDirection: 'row',
    width: wp(47),
    backgroundColor: '#9edafd',
    padding: wp(2),
    // elevation: 5,
    marginBottom: wp(1),
    borderRadius: 5,
  },

  skillIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
});
