import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class PopulartyPopupComponenet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
    };
    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  handleShortcut = () => {
    this.props.nav.navigate('ShortCut');
  };

  handleBlockList = () => {
    this.props.nav.navigate('BlockList');
  };

  render() {
    return (
      <SafeAreaView
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={[basicStyles.marginBottom, basicStyles.headingLarge]}>
            Sort By
          </Text>
          <Touchable
            onPress={() => {
              this.props.sortData('popularity');
              this.props.closePopup();
            }}
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingVentricle,
            ]}>
            <View style={styles.indicator} />
            <Text>Popularity</Text>
          </Touchable>
          <View style={basicStyles.separatorHorizontal} />
          <Touchable
            onPress={() => {
              this.props.sortData('premium');
              this.props.closePopup();
            }}
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingVentricle,
            ]}>
            <View style={styles.indicator} />
            <Text>Premium</Text>
          </Touchable>
          <View style={basicStyles.separatorHorizontal} />
          <Touchable
            onPress={() => {
              this.props.sortData('budget');
              this.props.closePopup();
            }}
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingVentricle,
            ]}>
            <View style={styles.indicator} />
            <Text>Budget</Text>
          </Touchable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  popupContainer: {
    width: wp(100),
    backgroundColor: 'white',
    padding: wp(5),
    height: hp(40),
    borderTopRightRadius: wp(6),
    borderTopLeftRadius: wp(6),
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff648a',
    marginRight: wp(3),
  },
});

export default PopulartyPopupComponenet;
