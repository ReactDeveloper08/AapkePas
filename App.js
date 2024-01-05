'use strict';
import React, {PureComponent} from 'react';
import {Alert} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {enableScreens} from 'react-native-screens';
// Splash Screen
import SplashScreen from './src/clientScreens/SplashScreen';

// User Preference
import {BASE_URL, makeRequest} from './src/api/ApiInfo';
import {KEYS, getData} from './src/api/UserPreference';

// Routes
import {createRootNavigator} from 'routes/Routes';
// import {createRootNavigator} from 'routes/testRoutes';

//Firebase
import {nsSetTopLevelNavigator} from 'routes/NavigationService';
import {RootSiblingParent} from 'react-native-root-siblings';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
// Firebase API
import {
  checkPermission,
  createOnTokenRefreshListener,
  removeOnTokenRefreshListener,
  createNotificationListeners,
  removeNotificationListeners,
} from './src/firebase_api/FirebaseAPI';
//safe area context
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {LogBox} from 'react-native';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['Require cycle:']);

// Ignore all log notifications:
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    // Adding firebase listeners
    checkPermission();
    createOnTokenRefreshListener(this);
    createNotificationListeners(this);
    setTimeout(this.initialSetup, 2000);
  }

  componentWillUnmount() {
    // Removing firebase listeners
    removeOnTokenRefreshListener(this);
    removeNotificationListeners(this);
  }

  initialSetup = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      this.firebaseCallback();
      // Fetching userInfo
      this.setState({isLoggedIn: userInfo, isLoading: false});
    } catch (error) {
      console.log(error.message);
    }
  };

  firebaseCallback = async () => {
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/getDataFromFirebase',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/getDataFromFirebase');
    if (response) {
      const {success} = response;
      if (success) {
        // console.log('firebase call back api response', response);
      } else {
        const {isAuthTokenExpired} = response;
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass !',
            'Your Session Has Been Expired \n Login Again to Continue!',
            [
              {
                text: 'OK',
              },
            ],
            {
              cancelable: false,
            },
          );
          this.handleTokenExpire();
          return;
        }
      }
    }
  };
  handleTokenExpire = async () => {
    this.props.navigation.navigate('Login');
  };

  // setNavigatorRef = ref => {
  //   nsSetTopLevelNavigator(ref);
  // };

  render() {
    const {isLoading, isLoggedIn} = this.state;
    if (isLoading) {
      return <SplashScreen />;
    }
    enableScreens();
    const RootNavigator = createRootNavigator(isLoggedIn);
    const AppContainer = createAppContainer(RootNavigator);
    return (
      <InternetConnectionAlert>
        <RootSiblingParent>
          <SafeAreaProvider>
            <AppContainer
              ref={nsSetTopLevelNavigator}
              // onReady={() => {
              //   isReadyRef.current = true;
              // }}
            />
          </SafeAreaProvider>
        </RootSiblingParent>
      </InternetConnectionAlert>
    );
  }
}
