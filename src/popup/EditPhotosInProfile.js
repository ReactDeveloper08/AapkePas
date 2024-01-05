import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

//multipleDropDown
import MultiSelect from 'react-native-multiple-select';
//component
import {showToast} from 'components/CustomToast';
// Document Picker Import
import DocumentPicker from 'react-native-document-picker';
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

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images

// Vector Icons
import Entypo from 'react-native-vector-icons/Entypo';

// Styles
import basicStyles from 'styles/BasicStyles';

class EditPhotosInProfile extends PureComponent {
  constructor(props) {
    super(props);
    const {
      name,
      experience,
      skills,
      expertises,
      languages,
      languageList,
      categoryList,
      expertiseList,
      qualification,
      email,
      rating,
      followers,
      served,
      description,
      profileImage,
      actualCallCharges,
      discountCallCharges,
      actualChatCharges,
      discountChatCharges,
      isCallAvailable,
      isChatAvailable,
      uploadFile,
    } = this.props.astroInfo;
    this.state = {
      name,
      mobile: '',
      email: email,
      chatRate: '',
      callRate: '',
      discountCallRate: '',
      discountChatRate: '',
      education: qualification,
      language: languageList,
      experience: experience,
      expertise: expertiseList,
      uploadCertificate: '',
      uploadFile: '',
      image: '',
      City: '',
      skills: categoryList,
      address: '',
      categories: '',
      languages: '',
      expertises: '',
      message: '',
      vendorCode: '',
    };

    this.parentView = null;
  }

  componentDidMount() {
    this.showCategoriesData();
    this.showExpertData();
    this.showLanguagesData();
  }

  showCategoriesData = async () => {
    const params = null;
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(BASE_URL + 'api/Astrologers/getCategoriesList', params),
      );
      reject(response);
    })
      .then(response => {
        const {categories, message} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({categories, message, isLoading: false});
      })
      .catch(message => {
        this.setState({message, categories: null, isLoading: false});
        showToast(message);
      });
  };
  showExpertData = async () => {
    const params = null;
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(BASE_URL + 'api/Astrologers/getExpertisesList', params),
      );
      reject(response);
    })
      .then(response => {
        const {expertises, message} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({expertises, message, isLoading: false});
      })
      .catch(message => {
        this.setState({message, expertises: null, isLoading: false});
        showToast(message);
      });
  };
  showLanguagesData = async () => {
    const params = null;
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(BASE_URL + 'api/Astrologers/getLanguagesList', params),
      );
      reject(response);
    })
      .then(response => {
        const {languages, message} = response;
        // storeData(KEYS.WALLET_BALANCE, walletBalance);
        this.setState({languages, message, isLoading: false});
      })
      .catch(message => {
        this.setState({message, languages: null, isLoading: false});
        showToast(message);
      });
  };

  handleNameChange = name => {
    this.setState({name});
  };
  handleEmailChange = email => {
    this.setState({email});
  };
  handleChatRateChange = chatRate => {
    this.setState({chatRate});
  };
  handleCallRateChange = callRate => {
    this.setState({callRate});
  };
  handleDiscountCallRateChange = discountCallRate => {
    this.setState({discountCallRate});
  };
  handleDiscountChatRateChange = discountChatRate => {
    this.setState({discountChatRate});
  };
  handleEducationChange = education => {
    this.setState({education});
  };
  handleExperienceChange = experience => {
    this.setState({experience});
  };
  handleLanguageChange = language => {
    this.setState({language});
  };
  handleExpertiseChange = expertise => {
    this.setState({expertise});
  };
  handleSkillsChange = skills => {
    this.setState({skills});
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
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
      });
      console.log(response);
      this.setState({uploadFile: response, image: response.uri});
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleApply = async () => {
    const {
      name,
      email,
      callRate,
      chatRate,
      discountCallRate,
      discountChatRate,
      education,
      language,
      experience,
      expertise,
      skills,
      uploadFile,
    } = this.state;
    //validation
    if (name.trim() === '') {
      Alert.alert('', 'Please Enter Name', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (email.trim() === '') {
      Alert.alert('', 'Please Enter email', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (callRate.trim() === '') {
      Alert.alert('', 'Please Enter Call Rate', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (chatRate.trim() === '') {
      Alert.alert('', 'Please Enter Chat Rate', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (parseInt(discountCallRate) >= parseInt(callRate)) {
      Alert.alert(
        '',
        'Please Enter Correct Price Your Discounted Price is Higher than Actual Call Price',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (parseInt(discountChatRate) >= parseInt(chatRate)) {
      Alert.alert(
        '',
        'Please Enter Correct Price Your Discounted Price is Higher than Actual Chat Price',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }
    if (education.trim() === '') {
      Alert.alert('', 'Please Enter Education', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (experience.trim() === '') {
      Alert.alert('', 'Please Enter Experience', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (language.length === 0) {
      Alert.alert('', 'Please Select Language', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (expertise.length === 0) {
      Alert.alert('', 'Please Select Expertise', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (skills.length === 0) {
      Alert.alert('', 'Please Select Skills', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    const params = {
      name,
      email,
      callRate,
      chatRate,
      education,
      languages: JSON.stringify(language),
      categories: JSON.stringify(skills),
      expertise: JSON.stringify(expertise),
      experience,
      discountCallRate,
      discountChatRate,
      profileImage: uploadFile,
    };

    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/editProfile',
          params,
          true,
          false,
        ),
      );
      reject(response);
    })
      .then(response => {
        this.setState({isLoading: false});
        const {message} = response;
        const refresh = this.props.refresh;
        if (refresh) {
          refresh(message);
        }
        this.props.closePopup();
        showToast(message);
      })
      .catch(message => {
        this.setState({isLoading: false});
        showToast(message);
      });
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
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

  render() {
    const {
      name,
      experience,
      skills,
      expertises,
      languages,
      charges,
      rating,
      followers,
      served,
      description,
      reviews,
      location,
      follow,
      badges,
      profileImage,
      image,
      actualCallCharges,
      discountCallCharges,
      actualChatCharges,
      discountChatCharges,
      isCallAvailable,
      isChatAvailable,
      uploadFile,
    } = this.props.astroInfo;

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={{height: hp(20)}}></View>

        <ScrollView>
          <View style={styles.popupContainer}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={basicStyles.margin}
                underlayColor="transparent"
                onPress={this.handlePermission}>
                {this.state.uploadFile ? (
                  <Image
                    source={{uri: this.state.image}}
                    resizeModes="cover"
                    style={styles.uploadImage}
                  />
                ) : (
                  <Image
                    source={{uri: profileImage}}
                    resizeModes="cover"
                    style={styles.uploadImage}
                  />
                )}
              </TouchableOpacity>
              <View
                style={{
                  marginRight: wp(2),
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input}
                  placeholder={name}
                  placeholderTextColor="#666"
                  value={this.state.name}
                  onChangeText={this.handleNameChange}
                />
                <View style={{height: wp(2)}}></View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email"
                  placeholderTextColor="#666"
                  value={this.state.email}
                  onChangeText={this.handleEmailChange}
                />
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Chat Price
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder={actualChatCharges}
                  placeholderTextColor="#666"
                  maxLength={4}
                  keyboardType="number-pad"
                  // numberOfLines={2}
                  value={this.state.chatRate}
                  onChangeText={this.handleChatRateChange}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Dis.Chat Price
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder={discountChatCharges}
                  placeholderTextColor="#666"
                  maxLength={4}
                  keyboardType="number-pad"
                  // numberOfLines={2}
                  value={this.state.discountChatRate}
                  onChangeText={this.handleDiscountChatRateChange}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Call Price
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder={actualCallCharges}
                  placeholderTextColor="#666"
                  maxLength={4}
                  keyboardType="number-pad"
                  // numberOfLines={2}
                  value={this.state.callRate}
                  onChangeText={this.handleCallRateChange}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Dis.Call Price
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder={discountCallCharges}
                  placeholderTextColor="#666"
                  maxLength={4}
                  keyboardType="number-pad"
                  // numberOfLines={2}
                  value={this.state.discountCallRate}
                  onChangeText={this.handleDiscountCallRateChange}
                />
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Experience
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder="Enter Experience"
                  placeholderTextColor="#666"
                  //keyboardType="number-pad"
                  value={this.state.experience}
                  onChangeText={this.handleExperienceChange}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.input,
                    basicStyles.text,
                    {lineHeight: hp(3), flex: 1},
                  ]}>
                  Education
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    basicStyles.flexOne,
                    basicStyles.marginLeft,
                    {flex: 2},
                  ]}
                  placeholder="Enter Education"
                  placeholderTextColor="#666"
                  //keyboardType="number-pad"
                  value={this.state.education}
                  onChangeText={this.handleEducationChange}
                />
              </View>
            </View>
            <View style={styles.SelectDropDown}>
              <MultiSelect
                hideTags
                items={this.state.languages}
                uniqueKey="id"
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.handleLanguageChange}
                selectedItems={this.state.language}
                selectText="Select Language"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={text => console.log(text)}
                altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#555"
                selectedItemIconColor="red"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#333"
                submitButtonText="Submit"
              />
            </View>

            <View style={styles.SelectDropDown}>
              <MultiSelect
                hideTags
                items={this.state.expertises}
                uniqueKey="id"
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.handleExpertiseChange}
                selectedItems={this.state.expertise}
                selectText="Select Expertise"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={text => console.log(text)}
                altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#555"
                selectedItemIconColor="red"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#333"
                submitButtonText="Submit"
              />
            </View>
            <View style={styles.SelectDropDown}>
              <MultiSelect
                hideTags
                items={this.state.categories}
                uniqueKey="id"
                ref={component => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.handleSkillsChange}
                selectedItems={this.state.skills}
                selectText="Select Skills"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={text => console.log(text)}
                altFontFamily="ProximaNova-Light"
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#555"
                selectedItemIconColor="red"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#333"
                submitButtonText="Submit"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={this.handleApply}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                ]}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Update Profile
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SelectDropDown: {
    // flex: 1,
    borderWidth: 1,
    borderColor: '#f2f1f1',
    borderRadius: hp(3),
    marginBottom: wp(2),
    marginHorizontal: wp(4),
  },
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
    // flex: 1,
    marginBottom: wp(2),
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
    height: wp(35),
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
    // marginTop: 'auto',
  },
});

export default EditPhotosInProfile;
