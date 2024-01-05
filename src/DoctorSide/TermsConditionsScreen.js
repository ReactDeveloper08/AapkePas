import React, {PureComponent} from 'react';
import {View, SafeAreaView} from 'react-native';

import {WebView} from 'react-native-webview';
// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

class TermsConditions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const answer = this.props.navigation.getParam('answer', null);
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.offWhiteBgColor]}>
        <HeaderComponents
          headerTitle="Terms & Conditions"
          nav={this.props.navigation}
        />
        {/* <View style={[basicStyles.mainContainer, basicStyles.padding]}> */}
        <WebView source={{html: answer}} scalesPageToFit={true} />
        {/* </View> */}
      </SafeAreaView>
    );
  }
}

export default TermsConditions;
