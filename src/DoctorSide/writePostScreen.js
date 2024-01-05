import React, {PureComponent} from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import FastImage from 'react-native-fast-image';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//component
import {showToast} from 'components/CustomToast';
import CustomLoader from 'components/ProcessingLoader';
// Document Picker Import
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
//permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

// Images
import upload_photo from 'assets/images/upload_photo.jpg';

class WrightPost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      userPic: '',
      userImage: '',
      uploadFile: '',
      image: '',
      description: '',
      isLoading: false,
    };
    this.handlePermission();
  }
  handleDescription = description => {
    this.setState({description});
  };
  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
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
              this.handleCamera();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleCamera();
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
  // handleUploadFile = async () => {
  //   try {
  //     // Pick a single file
  //     const response = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
  //     });
  //     console.log(response);
  //     this.setState({ uploadFile: response, image: response.uri });
  //   } catch (error) {
  //     if (!DocumentPicker.isCancel(error)) {
  //       console.log(error);
  //     }
  //   }
  // };

  //*CAMERA
  handleCamera = () => {
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
  };

  handleAddPost = async () => {
    const {description, userPic} = this.state;
    //validation
    if (description.trim() === '') {
      Alert.alert('', 'Please enter your thought', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (userPic.length === 0) {
      Alert.alert('', 'Please Upload Picture', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    this.setState({isLoading: true});
    const params = {
      description,
      file: userPic,
    };
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/addGallery',
          params,
          true,
          false,
        ),
      );
      reject();
    })
      .then(response => {
        this.setState({isLoading: false});
        const {message} = response;
        this.props.navigation.pop();
        showToast(message);
      })
      .catch(message => {
        this.setState({isLoading: false});
        showToast(message);
      });
  };

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents
          headerTitle="Write Post"
          nav={this.props.navigation}
        />
        <View style={basicStyles.mainContainer}>
          <KeyboardAwareScrollView
            contentContainerStyle={[basicStyles.flexOne, basicStyles.border]}>
            <TextInput
              placeholder="What are you thinking?"
              placeholderTextColor="#333"
              multiline
              style={styles.textareaInput}
              value={this.state.description}
              onChangeText={this.handleDescription}
            />

            <TouchableOpacity
              style={basicStyles.margin}
              underlayColor="transparent"
              onPress={this.handleCamera}>
              {this.state.uploadFile ? (
                <FastImage
                  style={styles.uploadImage}
                  source={{
                    uri: this.state.userImage,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              ) : (
                <Image
                  source={upload_photo}
                  resizeModes="cover"
                  style={styles.uploadImage}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleAddPost}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                ]}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Add Post
                </Text>
                {/* <Entypo
                  name="chevron-right"
                  color="#fff"
                  size={18}
                  //   style={styles.iconRow}
                /> */}
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
        {this.state.isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textareaInput: {
    height: hp(20),
    backgroundColor: '#ccc4',
    textAlignVertical: 'top',
    fontSize: wp(3.2),
    padding: wp(2),
    borderWidth: 0,
    margin: wp(2),
    color: '#333',
  },
  uploadImage: {
    height: wp(35),
    aspectRatio: 1 / 1.152,
  },
  button: {
    backgroundColor: '#4faee4',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    margin: wp(2),
    marginTop: 'auto',
  },
});

export default WrightPost;
