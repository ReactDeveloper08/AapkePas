import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from 'styles/BasicStyles';

// icons
import ic_star from 'assets/icons/ic_star.png';

export default class AstroDetailPhotoListComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.skillContainer}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.paddingHalfVertical,
            basicStyles.alignCenter,
          ]}>
          <Image
            source={{uri: this.props.item.userImage}}
            resizeMode="cover"
            style={styles.userImage}
          />
          <View style={basicStyles.flexOne}>
            <Text style={{fontSize: wp(3.2), fontWeight: '700', color: '#000'}}>
              {this.props.item.userName}
            </Text>
            <Text style={[basicStyles.text]}>{this.props.item.reviewDate}</Text>
          </View>
          <View style={basicStyles.directionRow}>
            <Image
              source={ic_star}
              resizeMode="cover"
              style={basicStyles.iconRow}
            />
            <Text>{this.props.item.rating}</Text>
          </View>
        </View>
        {this.props.item.review !== 'null' ? (
          <Text style={[basicStyles.text, {alignSelf: 'flex-start'}]}>
            {this.props.item.review}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  skillContainer: {
    // flexDirection: 'row',
    // height: hp(5),
    // paddingHorizontal: wp(4),
    marginTop: hp(1),
    marginBottom: wp(1),
    borderRadius: 5,
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
  },

  skillIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  userImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderWidth: 1,
    backgroundColor: '#000',
    marginRight: wp(2),
    borderRadius: wp(5),
  },
});
