import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderComponent from 'components/HeaderComponents';
import CustomLoader from 'components/ProcessingLoader';

// Styles
import basicStyles from 'styles/BasicStyles';
import {TouchableOpacity} from 'react-native-gesture-handler';

// Vector Icons

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';
// import uploadToken from '../firebase_api/UploadTokenAPI';
import VersionInfo from 'react-native-version-info';

export default class SettingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {referralInfo: '', isLoading: false};
  }

  handlePolicy = async () => {
    this.setState({isLoading: true});
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/privacyPolicy',
      params,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        const answer = description;
        this.props.navigation.navigate('PrivacyPolicy', {answer});
        this.setState({isLoading: false});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };
  handleTerms = async () => {
    this.setState({isLoading: true});
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/termsAndConditions',
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        const answer = description;
        this.props.navigation.navigate('TermsConditions', {answer});
        this.setState({isLoading: false});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };

  handleContact = async () => {
    this.setState({isLoading: true});
    const response = await makeRequest(BASE_URL + 'api/Customer/contactUs');
    if (response) {
      const {success, message} = response;
      if (success) {
        const {description} = response;
        const answer = description;
        this.props.navigation.navigate('Contact', {answer});
        this.setState({isLoading: false});
      } else {
        this.setState({description: null, message, isLoading: false});
        showToast(message);
      }
    }
  };

  handleLogin = async () => {
    await clearData();
    // await uploadToken();
    this.props.navigation.navigate('Login');
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent nav={this.props.navigation} headerTitle="Settings" />
        <View style={[basicStyles.mainContainer, basicStyles.padding]}>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.handleContact()}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Contact Us
            </Text>
            <MaterialIcons
              name="navigate-next"
              color="#fff"
              size={18}
              style={styles.iconRow}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.handlePolicy()}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Privacy Policy
            </Text>
            <MaterialIcons
              name="navigate-next"
              color="#fff"
              size={18}
              style={styles.iconRow}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listContainer}
            onPress={() => this.handleTerms()}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Terms & Conditions
            </Text>
            <MaterialIcons
              name="navigate-next"
              color="#fff"
              size={18}
              style={styles.iconRow}
            />
          </TouchableOpacity>

          <View style={styles.listContainer}>
            <Text style={[basicStyles.heading, basicStyles.flexOne]}>
              Aapke Pass
            </Text>
            {/* <MaterialIcons
              name="navigate-next"
              color="#333"
              size={18}
              style={styles.iconRow}
            /> */}
            <Text style={[basicStyles.heading]}>
              Version: {VersionInfo.appVersion}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={() => this.handleLogin()}>
            <MaterialIcons
              name="logout"
              color="#fff"
              size={16}
              style={basicStyles.marginRight}
            />
            <Text
              style={[
                basicStyles.heading,
                basicStyles.flexOne,
                basicStyles.whiteColor,
              ]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#4eade3',
    paddingHorizontal: wp(2),
    paddingVertical: wp(3),
    borderRadius: 5,
    marginBottom: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutContainer: {
    backgroundColor: '#4eade3',
    paddingHorizontal: wp(2),
    paddingVertical: wp(3),
    borderRadius: 5,
    marginBottom: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
