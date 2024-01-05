import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class HeaderComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBack = () => {
    this.props.nav.pop();
  };

  render() {
    return (
      <Touchable onPress={this.handleBack} underlayColor="transparent">
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back"
            color="#ffffff"
            size={18}
            style={styles.iconRow}
          />
          <Text style={styles.title}>{this.props.headerTitle}</Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(6),
    backgroundColor: '#9edafd',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  title: {
    color: '#ffffff',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  iconRow: {
    marginRight: wp(2),
  },
});

export default HeaderComponents;
