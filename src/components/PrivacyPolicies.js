import React, {PureComponent} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

// import HTML from 'react-native-render-html';

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
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Privacy Policy"
          navAction="back"
        />

        <WebView source={{html: answer}} scalesPageToFit={true} />
      </SafeAreaView>
    );
  }
}

export default FaqQuestionDetail;
