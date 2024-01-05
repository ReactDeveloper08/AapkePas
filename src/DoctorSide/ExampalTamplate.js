import React, {PureComponent} from 'react';
import {View, Text, SafeAreaView} from 'react-native';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

class FollowingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={[
          basicStyles.container,
          basicStyles.offWhiteBgColor,
          basicStyles.padding,
        ]}>
        <HeaderComponents
          headerTitle="Total Payments"
          nav={this.props.navigation}
        />
        <View style={basicStyles.mainContainer}>
          <Text> ExampleTemplate </Text>
        </View>
      </SafeAreaView>
    );
  }
}

export default FollowingScreen;
