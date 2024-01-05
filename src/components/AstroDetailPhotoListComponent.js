import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class AstroDetailPhotoListComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {image} = this.props.item;
    return (
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={this.props.showImage}
        underlayColor="transparent">
        <Image
          source={{uri: image}}
          resizeMode="cover"
          style={styles.astroImage}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  photoContainer: {
    flexDirection: 'row',
    width: wp(18),
    backgroundColor: '#fffdc5',
    borderRadius: 5,
  },
  astroImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9,
    backgroundColor: '#fff',
    borderRadius: 9,
  },
});
