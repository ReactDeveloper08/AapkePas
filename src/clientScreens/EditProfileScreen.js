import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ImagePicker from 'react-native-image-picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import RadioForm from 'react-native-simple-radio-button';
// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import ProcessingLoader from 'components/ProcessingLoader';

//safeAreaView
import SafeAreaView from 'react-native-safe-area-view';

//api
import {KEYS, getData, clearData} from 'api/UserPreference';
// import {BASE_URL, makeRequest} from 'api/ApiInfo';

// Icon
import ic_profile_user from 'assets/icons/ic_profile_user.png';
import ic_profile_phone from 'assets/icons/ic_profile_phone.png';
import ic_profile_mail from 'assets/icons/ic_profile_mail.png';

import ic_edit_profile_white from 'assets/icons/ic_edit_profile_white.png';

//Redux
import {connect} from 'react-redux';
import {profileOperations, profileSelectors} from 'Redux/wiseword/profile';

import {
  headingLargeXSize,
  headingLargeSize,
  headingSize,
  headingSmallSize,
  textLargeSize,
  textSize,
  textSmallSize,
  signupInputWidth,
} from '../../utility/styleHelper/appStyle';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    const userInfo = this.props.navigation.getParam('userInfo', null);
    const {name, email, mobile, gender, image} = userInfo;
    this.state = {
      isLoading: true,
      isProcessing: false,
      name: name,
      mobile: mobile !== 'null' ? mobile : 'Mobile No.',
      email: email,
      gender,
      value: gender === 'Male' ? 0 : gender === 'Other' ? 2 : 1,
      //image: image,
      userPic: '',
      userImage: image,
    };
    this.radio_props = [
      {label: 'Male', value: 'Male'},
      {label: 'Female', value: 'Female'},
      {label: 'Other', value: 'Other'},
    ];
  }

  onUpdateName = name => {
    this.setState({
      name,
    });
  };
  onUpdateMobile = mobile => {
    this.setState({
      mobile,
    });
  };
  onUpdateGender = gender => {
    this.setState({
      gender,
    });
  };
  onUpdateEmail = email => {
    this.setState({
      email,
    });
  };

  onUpdateImage = image => {
    this.setState({
      image,
    });
  };

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      });
      const result = await check(platformPermission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Camera" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  //image picker
  handleImagePick = async () => {
    try {
      const option = {
        skipBackup: true,
        includeBase64: true,
        mediaType: 'photo',
        quality: 0.4,
        maxWidth: 250,
        maxHeight: 250,
      };
      ImagePicker.showImagePicker(option, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (Platform.OS === 'android') {
            const imageData = {
              size: response.fileSize,
              type: response.type,
              name: response.fileName,
              fileCopyUri: response.uri,
              uri: response.uri,
            };
            this.setState({
              userPic: imageData,
              userImage: response.uri,
              userImageName: response.fileName,
            });
          } else if (Platform.OS === 'ios') {
            let imgName = response.name;
            if (typeof fileName === 'undefined') {
              const {uri} = response;
              // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
              var getFilename = uri.split('/');
              imgName = getFilename[getFilename.length - 1];
            }
            const imageData = {
              size: response.fileSize,
              type: response.type,
              name: imgName,
              fileCopyUri: response.uri,
              uri: response.uri,
            };
            this.setState({
              userPic: imageData,
              userImage: response.uri,
              userImageName: imgName,
            });
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateProfile = async () => {
    Keyboard.dismiss();
    const {name, mobile, email, gender, userPic} = this.state;
    try {
      this.setState({
        isProcessing: true,
      });
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {userId} = userInfo;
        const params = {
          userId,
          name,
          mobile,
          email,
          gender,
          image: userPic,
        };

        await this.props.updateProfile(params);
        if (this.props.isProfileUpdate) {
          const {success, message, isAuthTokenExpired} =
            this.props.isProfileUpdate;
          this.setState({
            isProcessing: false,
          });
          if (success) {
            const {pop, getParam} = this.props.navigation;
            const refreshCallback = getParam('refreshCallback', null);
            pop();
            await refreshCallback(message);
            Alert.alert('', message);
          } else {
            Alert.alert('', message);
            if (isAuthTokenExpired === true) {
              Alert.alert(
                'Session Expired',
                'Login Again to Continue!',
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
            }
          }
        }
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  handleSelectGender = value => {
    this.setState({gender: value});
  };
  render() {
    const {isProcessing} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Edit Profile"
          nav={this.props.navigation}
        />
        <View style={styles.profileContainer}>
          <Touchable
            style={styles.profileHeader}
            onPress={this.checkPermission}
            underlayColor="transparent">
            {this.state.userImage ? (
              <Image
                source={{
                  uri: this.state.userImage,
                }}
                style={styles.profileImage}
              />
            ) : null}
            <View style={styles.editIconContainer}>
              <Image
                source={ic_edit_profile_white}
                resizeMode="cover"
                style={styles.editIcon}
              />
            </View>
          </Touchable>

          <View style={styles.formContainer}>
            <ScrollView style={{paddingBottom: hp(3)}}>
              <View style={[styles.profileRow]}>
                <Image
                  source={ic_profile_user}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={this.state.name}
                  onChangeText={this.onUpdateName}
                  placeholder="Enter name for Update"
                />
              </View>

              <View style={[styles.profileRow]}>
                <Image
                  source={ic_profile_phone}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />
                {this.state.mobile && this.state.mobile !== 'null' ? (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter mobile Number"
                    maxLength={10}
                    keyboardType="numeric"
                    value={this.state.mobile}
                    onChangeText={this.onUpdateMobile}
                  />
                ) : (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter mobile Number"
                    maxLength={10}
                    keyboardType="numeric"
                    value={this.state.mobile}
                    onChangeText={this.onUpdateMobile}
                  />
                )}
              </View>

              <View style={styles.emailProfileRow}>
                <Image
                  source={ic_profile_mail}
                  resizeMode="cover"
                  style={styles.infoIcon}
                />

                <Text style={styles.textInput}>{this.state.email}</Text>
              </View>

              <View style={styles.profileRow2}>
                <RadioForm
                  value={this.state.gender}
                  initial={this.state.value}
                  radio_props={this.radio_props}
                  onPress={this.handleSelectGender}
                  buttonSize={10}
                  buttonColor={'#4daee2'}
                  selectedButtonColor={'#4daee2'}
                  labelColor={'#666'}
                  labelStyle={styles.radioButtonLabel}
                  style={styles.checkboxButton}
                  onChangeText={this.onUpdateGender}
                />
              </View>

              <Touchable
                style={styles.saveButtonContainer}
                underlayColor="#ff648a"
                onPress={this.handleUpdateProfile}>
                <Text style={styles.saveButtonText}> Update </Text>
              </Touchable>
            </ScrollView>
          </View>
        </View>

        <FooterComponent nav={this.props.navigation} />

        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isProfileUpdate: profileSelectors.isProfileUpdated(state),
});
const mapDispatchToProps = {
  updateProfile: profileOperations.updateProfile,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  textInput: {
    color: '#333',
    flex: 1,
    fontSize: textSize,
  },
  defaultText: {
    backgroundColor: '#eee',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    padding: wp(4),
    // paddingTop: hp(5),
    backgroundColor: '#fff',
    borderTopRightRadius: wp(5),
    borderTopLeftRadius: wp(5),
  },

  editIconImage: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(2),
    alignSelf: 'center',
  },
  profileImage: {
    height: wp(22),
    width: wp(22),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#ff648a20',
  },
  userName: {
    fontSize: wp(3.5),
    marginTop: hp(2),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    height: hp(6),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  emailProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    height: hp(6),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  profileRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: hp(6),
    marginTop: hp(1),
  },
  logoutRow: {
    flexDirection: 'row',
  },
  infoIcon: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  userText: {
    fontSize: wp(3.5),
  },
  saveButtonContainer: {
    backgroundColor: '#4daee2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: hp(5),
    paddingHorizontal: wp(6),
    top: hp(1.2),
    zIndex: 999,
    marginBottom: wp(3),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: headingSize,
    fontWeight: '700',
    textAlign: 'center',
  },
  radioButtonLabel: {
    fontSize: textSize,
    color: '#000',
    marginRight: wp(5),
  },
  checkboxButton: {
    flexDirection: 'row',
    marginLeft: wp(2),
    justifyContent: 'space-around',
  },
  editIconContainer: {
    backgroundColor: '#4daee2',
    height: wp(8),
    width: wp(8),
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(-4),
    alignSelf: 'center',
  },
  editIcon: {
    height: wp(4),
    width: wp(4),
  },
});
