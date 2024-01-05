import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
// Components

import HeaderComponent from 'components/HeaderComponent';

class FaqQuestionDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const answer = this.props.navigation.getParam('answer', null);

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          nav={this.props.navigation}
          navAction="back"
          headerTitle="FAQ Question Ans."
        />
        <View style={{width: '100%', height: '100%'}}>
          <WebView source={{html: `${answer}`}} />
        </View>
        {/* <ScrollView style={{flex: 1}}>
          <HTML source={{html: htmlContent}} />
        </ScrollView> */}
      </SafeAreaView>
    );
  }
}

export default FaqQuestionDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
