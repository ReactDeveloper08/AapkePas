import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import {
//   LoginManager,
//   AccessToken,
//   LoginButton,
//   UserData,
// } from 'react-native-fbsdk';
import {nsNavigate} from 'routes/NavigationService';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';
import {sessionOperations, sessionSelectors} from 'Redux/wiseword/session';
import {
  saveLocationSelectors,
  // saveLocationOperation,
} from 'Redux/wiseword/location';
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, storeData} from 'api/UserPreference';
import showToast from 'components/CustomToast';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      gettingLoginStatus: true,
    };
  }

  componentDidMount() {
    //initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '858940383315-rr32oocjm08msc9o83cjhhfumkrhum5l.apps.googleusercontent.com',
      // offlineAccess: true,
      offlineAccess: false,
      // forceCodeForRefreshToken: true,
    });
    //Check if user is already signed in
    this._isSignedIn();
  }

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      Alert.alert('User is already signed in');
      //Get the User details as user is already signed in
      await this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
    }
    this.setState({gettingLoginStatus: false});
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // this.props.navigation.navigate('Home');
      this.setState({userInfo: userInfo.user});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // Alert.alert('User has not signed in yet');
      } else {
        // Alert.alert("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      const {long_name} = this.props.getSaveLocation;
      const devId = await getData(KEYS.DEVICE_UNIQUE_ID);
      const {deviceId} = devId;
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const data = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );
      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
      // login with credential

      if (data) {
        const {user} = data;
        const {email, name, photo} = user;

        const params = {
          name,
          email,
          photo,
          deviceId: deviceId,
          location: long_name,
        };
        console.log(params);
        const response = await makeRequest(
          BASE_URL + 'api/Customer/googleSignIn',
          params,
        );
        console.log(this.props.nav);
        if (response) {
          const {success, message, userInfo} = response;

          if (success) {
            const {role} = userInfo;
            if (role === 'expert') {
              await storeData(KEYS.USER_INFO, userInfo);

              showToast('Welcome');
              nsNavigate('astro_Home');
              // this.props.nav.navigate('astro_Home');
            } else {
              await storeData(KEYS.USER_INFO, userInfo);

              showToast(message);
              nsNavigate('Homes');
              // this.props.nav.navigate('Homes');
            }
          }
        }
      }
      // this.props.navigation.navigate('Home');
      // this.setState({ userInfo: userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  // onFacebookButtonPress = async () => {
  //   // Attempt login with permissions
  //   const result = await LoginManager.logInWithPermissions([
  //     'public_profile',
  //     'email',
  //   ]);

  //   if (result.isCancelled) {
  //     throw 'User cancelled the login process';
  //   }

  //   // Once signed in, get the users AccessToken
  //   const data = await AccessToken.getCurrentAccessToken();
  //   const useData = await UserData;
  //   if (!data) {
  //     throw 'Something went wrong obtaining access token';
  //   }

  //   // Create a Firebase credential with the AccessToken
  //   const facebookCredential = auth()
  //     .FacebookAuthProvider.credential(data.accessToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(facebookCredential);
  // };

  _signOut = async () => {
    //Remove user session from the device.\
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userInfo: ''}); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    //returning Loader untill we check for the already signed in user
    if (this.state.gettingLoginStatus) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      if (this.state.userInfo !== '') {
        //Showing the User detail
        return (
          <View style={styles.container}>
            <Image
              source={{uri: this.state.userInfo.photo}}
              style={styles.imageStyle}
            />
            {/* <Text style={styles.text}>Name: {this.state.userInfo.name} </Text>
            <Text style={styles.text}>Email: {this.state.userInfo.email}</Text> */}
            <Touchable style={styles.button} onPress={this._signOut}>
              <Text>Logout</Text>
            </Touchable>
          </View>
        );
      } else {
        //For login showing the Signin button
        return (
          <View style={styles.container}>
            <GoogleSigninButton
              style={{width: 250, height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
            />

            {/* <LoginButton
              style={{
                width: 240,
                height: 40,
                alignItems: 'center',
                marginTop: 5,
                justifyContent: 'center',
              }}
              // size={GoogleSigninButton.Size.Wide}
              // color={GoogleSigninButton.Color.Light}
              onPress={this.onFacebookButtonPress}
            /> */}
          </View>
        );
      }
    }
  }
}
const mapStateToProps = state => ({
  getSaveLocation: saveLocationSelectors.isLocationGet(state),
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(App);
const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
  },
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 50,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 30,
  },
});
