import React, {PureComponent} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
// import HTML from 'react-native-render-html';

// Components
import HeaderComponent from 'pages/components/CustomerSideComponents/HeaderComponent';

class FaqQuestionDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const answer = this.props.navigation.getParam('answer', null);

    return (
      <View>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="FAQ Question Ans."
        />
        <View style={{width: '100%', height: '100%'}}>
          <WebView source={{html: `${answer}`}} />
        </View>
      </View>
    );
  }
}

export default FaqQuestionDetail;
