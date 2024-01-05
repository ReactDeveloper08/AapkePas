import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// Vector Icons

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import upload_photo from 'assets/images/upload_photo.jpg';
//permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
// Document Picker Import
import DocumentPicker from 'react-native-document-picker';
// Vector Icons
import Entypo from 'react-native-vector-icons/Entypo';

// Styles
import basicStyles from 'styles/BasicStyles';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';

class EditProfileImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: '',
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
    };

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  handleShortcut = () => {
    this.props.nav.navigate('ShortCut');
  };

  handleBlockList = () => {
    this.props.nav.navigate('BlockList');
  };

  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
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
              this.handleUploadFile();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleUploadFile();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
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
  handleUploadFile = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
      });
      console.log(response);
      this.setState({uploadFile: response, uploadImage: response.uri});
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleUploadImages = async () => {
    const {uploadFile} = this.state;
    const params = {images: uploadFile};
    const uploadImage = await makeRequest(
      BASE_URL + 'api/Astrologers/uploadAstrologerImages',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/uploadAstrologerImages');
    if (uploadImage) {
      const {success, message, isAuthTokenExpired} = uploadImage;
      if (success) {
        showToast(message);
        const refresh = this.props.refresh;
        if (refresh) {
          refresh(message);
        }
        this.props.closePopup();
      } else {
        showToast(message);
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired\nLogin Again to Continue!',
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
  };
  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };
  listItem = ({item}) => {
    const {uri} = item;
    return (
      <Image
        source={{uri: uri}}
        resizeMode="cover"
        style={styles.listItemImage}
      />
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <SafeAreaView
            style={[basicStyles.container, basicStyles.offWhiteBgColor]}>
            <View style={basicStyles.mainContainer}>
              <KeyboardAwareScrollView
                contentContainerStyle={[
                  basicStyles.flexOne,
                  basicStyles.border,
                ]}>
                <View style={{flex: 1}}>
                  <FlatList
                    data={this.state.uploadFile}
                    renderItem={this.listItem}
                    keyExtractor={this.keyExtractor}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                  />
                </View>
                <TouchableOpacity
                  style={basicStyles.margin}
                  underlayColor="transparent"
                  onPress={this.handlePermission}>
                  <Image
                    source={upload_photo}
                    resizeModes="cover"
                    style={styles.uploadImage}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleUploadImages}>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.justifyCenter,
                    ]}>
                    <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                      Next
                    </Text>
                    <Entypo
                      name="chevron-right"
                      color="#fff"
                      size={18}
                      //   style={styles.iconRow}
                    />
                  </View>
                </TouchableOpacity>
                {/* <Text style={styles.heading}>Select next online time</Text> */}
              </KeyboardAwareScrollView>
            </View>
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  popupContainer: {
    width: wp(100),
    height: hp(75),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    backgroundColor: 'white',
    padding: wp(5),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  applyButton: {
    backgroundColor: '#fd6c33',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(1),
    alignItems: 'center',
    // marginTop: 'auto',
    // marginBottom: hp(2),
    // alignSelf: 'center',
    marginTop: wp(3),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: wp(3.2),
  },
  input: {
    height: hp(10),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
  },
  textareaInput: {
    height: hp(20),
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: wp(3.2),
    padding: wp(2),
  },
  uploadImage: {
    height: wp(15),
    aspectRatio: 1 / 1.152,
    borderWidth: 1,
    borderColor: '#eae7bb',
  },
  button: {
    backgroundColor: '#fd6c33',
    // paddingVertical: wp(2),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    // alignSelf: 'flex-start',
    margin: wp(2),
    // borderRadius: hp(2.75),
    marginTop: 'auto',
  },
  listItemImage: {
    height: wp(27),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(1),
    borderRadius: 5,
    marginBottom: wp(2),
  },
});

export default EditProfileImage;
