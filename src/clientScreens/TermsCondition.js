import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';

export default class TermsCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {terms: ''};
  }

  componentDidMount() {
    this.termsCondition();
  }

  termsCondition = async () => {
    try {
      const response = await makeRequest(BASE_URL + 'termsAndConditions');
      if (response) {
        const {success, message} = response;
        if (success) {
          const {terms} = response;
          this.setState({terms});
        } else {
          this.setState({terms: null, message});
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  redirectLogin = () => {
    this.props.navigation.pop();
  };
  render() {
    const {terms, message} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.textstyle}> Terms & Conditions </Text>
        {terms ? (
          <WebView
            // source={{
            //   uri: 'http://relief.ezypayroll.in/api/Mobile/termsAndConditions',
            // }}
            source={{html: terms}}
            scalesPageToFit={true}
            style={styles.webview}
          />
        ) : (
          <Text>{message}</Text>
        )}
        <TouchableOpacity
          style={styles.agreeButton}
          onPress={this.redirectLogin}>
          <Text style={styles.agreeText}>I Agree</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textstyle: {
    textAlign: 'center',
    paddingVertical: 2,
    //marginTop: hp(3),
    fontSize: wp(5),
  },
  webview: {
    //marginTop: 10,
    //marginBottom: 10,
  },
  agreeButton: {
    backgroundColor: '#0082e7',
    height: hp(6),
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: hp(1),
  },
  agreeText: {
    color: 'white',
  },
});
