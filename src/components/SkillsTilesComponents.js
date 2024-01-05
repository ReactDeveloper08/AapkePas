import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from 'styles/BasicStyles';
export default class SkillsTilesComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.skillContainer}>
        <Text style={[basicStyles.heading]}>{this.props.item.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  skillContainer: {
    backgroundColor: '#4daee3',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(3),
    marginRight: wp(2),
  },
});
