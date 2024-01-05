import React, {PureComponent} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

import {WebView} from 'react-native-webview';

class ContactScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const answer = this.props.navigation.getParam('answer', null);
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.offWhiteBgColor]}>
        <HeaderComponents
          headerTitle="Contact Us"
          nav={this.props.navigation}
        />
        {/* <View style={[basicStyles.mainContainer, basicStyles.padding]}> */}
        <WebView
          source={{html: answer}}
          javaScriptEnabled
          scalesPageToFit={true}
        />
        {/* </View> */}
      </SafeAreaView>
    );
  }
}

export default ContactScreen;
