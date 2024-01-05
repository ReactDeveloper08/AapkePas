import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from 'styles/BasicStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
// Image

import chatGra from 'assets/icons/chatGra.png';
import logo from 'assets/images/logo.png';
import SoundPlayer from 'react-native-sound-player';
// import NotificationSounds from 'react-native-notification-sounds';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import {showToast} from 'components/CustomToast';
import {
  LoginRequest,
  SignUpRequest,
  AddUser,
  isChatEnd,
  isAcceptChat,
} from '../../network';
import {setAsyncStorage, keys} from '../../asyncStorage';
import {nsNavigate} from 'routes/NavigationService';
import ProcessingLoader from 'components/ProcessingLoader';
// import CustomLoader from 'components/CustomLoader';

import {Body} from 'native-base';
import {isRequired} from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType';

export default class chatNotification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {isLoading: false};
  }
  componentDidMount() {
    // NotificationSounds.getNotifications('notification').then(soundsList => {
    //   // console.log('SOUNDS', soundsList);
    //   SoundPlayer.playSoundFile('play', 'wav');
    // });
  }
  componentDidUpdate() {
    // console.log('userIN didUpdate');
    SoundPlayer.resume();
  }
  handleDenile = async () => {
    try {
      const userInfo = await getData(KEYS.USER_DATA);

      var dataBody = '1111';
      this.setState({isLoading: true});
      const params = {
        consultationId: dataBody.consultationId,
      };
      // console.log('params are', params);
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/declineChat',
        params,
        true,
        false,
      );
      if (response) {
        const {success} = response;
        this.setState({isLoading: false});
        if (success) {
          // const {message} = response;
          SoundPlayer.stop();
          nsNavigate('Home');
          const {clientMobile} = dataBody;
          const {mobile} = userInfo;
          let endNow = 1;
          await isChatEnd(endNow, mobile, clientMobile)
            .then(() => {})
            .catch(e => {
              console.log(e);
            });
          let accept = 1;
          await isAcceptChat(accept, mobile, clientMobile);
        }
      }
    } catch (e) {}
  };
  //Auto Login User For Chat
  handleAccept = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const notification = this.props.navigation.getParam('notification', null);
    var dataBody = notification._data;
    const {clientName, clientMobile, DOB, birthTime, birthPlace} = dataBody;
    // console.log(clientName, clientMobile, DOB, birthTime, birthPlace);
    const {mobile, payloadId} = userInfo;
    const name = 'User' + payloadId;
    const email = mobile + '@pranamguruji.com';
    const password = mobile;
    // console.log('userInfo for chat ---<>', name, email, password);
    if (!email) {
      Alert.alert('Email is required');
    } else if (!password) {
      Alert.alert('Password is required');
    } else {
      this.setState({isLoading: true});

      LoginRequest(email, password)
        .then(res => {
          const {user, code, message} = res;
          // console.log('user IN Login----<>', res);
          if (user) {
            if (!res.additionalUserInfo) {
              this.setState({isLoading: false});
              Alert.alert(res);

              return;
            }
            this.setState({isLoading: false});
            this.nameTap();
            // console.log('user is Logged In for chat', keys.uuid, res.user.uid);
            setAsyncStorage(keys.uuid, res.user.uid);
            // setUniqueValue(res.user.uid);
            // showUser();
            // navigation.navigate('Live Chat');
            // setInitialState();
          } else {
            // Alert.alert(message, code);
            this.setState({isLoading: true});
            SignUpRequest(email, password).then(res => {
              // console.log('user in signUp block ', res);
              if (!res.additionalUserInfo) {
                this.setState({isLoading: true});
                alert(res);
                return;
              }
              // let uid = firebase.auth().currentUser.uid;
              let uid = mobile;
              let profileImg = '';
              AddUser(name, email, uid, profileImg)
                .then(() => {
                  setAsyncStorage(keys.uuid, uid);
                  // setUniqueValue(uid);
                  this.setState({isLoading: false});
                  this.nameTap();
                  // console.log(
                  //   'UserSuccessFullySignUp',
                  //   name,
                  //   email,
                  //   uid,
                  //   profileImg,
                  // );
                })
                .catch(err => {
                  this.setState({isLoading: false});
                  alert(err);
                });
            });
          }
        })
        .catch(res => {
          this.setState({isLoading: false});

          Alert.alert(res);
        });
    }
  };

  nameTap = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const notification = this.props.navigation.getParam('notification', null);
    var dataBody = notification._data;
    const {
      profileImg,
      clientName,
      clientMobile,
      DOB,
      birthTime,
      birthPlace,
      userId,
      consultationId,
    } = dataBody;
    const {mobile} = userInfo;
    let endNow = 0;
    isChatEnd(endNow, mobile, clientMobile)
      .then(() => {})
      .catch(e => {
        console.log(e);
      });
    let accept = 0;
    isAcceptChat(accept, mobile, clientMobile);
    // console.log(
    //   'on name tap for chat screen movement',
    //   clientName,
    //   clientMobile,
    //   DOB,
    //   birthTime,
    //   birthPlace,
    //   mobile, //uuid
    //   userId,
    //   consultationId,
    // );
    SoundPlayer.stop();
    // this.props.navigation.navigate('StartChat');
    try {
      this.setState({isLoading: true});
      const params = {
        consultationId: dataBody.consultationId,
      };
      // console.log('params are', params);
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/acceptChat',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        this.setState({isLoading: false});
        if (success) {
          // const {message} = response;
          SoundPlayer.stop();
          if (!profileImg) {
            const {
              navigation: {navigate},
            } = this.props;
            var now = new Date();
            // console.log('the start chat time', now);
            navigate('Chat', {
              name: clientName,
              imgText: clientName.charAt(0),
              guestUserId: clientMobile,
              currentUserId: mobile,
              dob: DOB,
              time: birthTime,
              date: birthPlace,
              userId,
              now,
              consultationId,
            });
          } else {
            const {
              navigation: {navigate},
            } = this.props;
            var now = new Date();
            // console.log('the start chat time', now);
            navigate('Chat', {
              name: clientName,
              img: profileImg,
              guestUserId: clientMobile,
              currentUserId: mobile,
              dob: DOB,
              time: birthTime,
              date: birthPlace,
              userId,
              now,
              consultationId,
            });
          }
        } else {
          showToast(message);
        }
      }
    } catch (e) {}
  };

  render() {
    if (this.state.isLoading) {
      return <ProcessingLoader />;
    }
    const notification = this.props.navigation.getParam('notification', null);
    var dataBody = notification._data;
    // console.log('}}}===--->', notification._data, dataBody);
    return (
      <ImageBackground
        source={require('assets/images/popupBg.png')}
        resizeMode="cover"
        style={basicStyles.container}>
        <View style={styles.popUpScreen}>
          <View
            style={[
              // basicStyles.container,
              basicStyles.offWhiteBgColor,
              styles.popUpContainer,
            ]}>
            <View
              style={[
                basicStyles.mainContainer,
                basicStyles.justifyCenter,
                basicStyles.offWhiteBgColor,
                {marginTop: hp(8)},
              ]}>
              <Image
                source={{uri: dataBody.userImage}}
                resizeMode="cover"
                style={styles.userImage}
              />
              <Text
                style={[basicStyles.textAlign, basicStyles.marginVentricle]}>
                You have new Chat request from {dataBody.clientName}
              </Text>
              <Image
                source={chatGra}
                resizeMode="cover"
                style={styles.chatIcon}
              />
              <View
                style={[basicStyles.directionRow, basicStyles.justifyAround]}>
                <Touchable
                  onPress={this.handleDenile}
                  underlayColor="transparent">
                  {/* <Image
                    source={closeButton}
                    resizeMode="cover"
                    style={styles.buttonIcon}
                  /> */}
                  <AntDesign
                    name="closecircle"
                    color={'red'}
                    size={45}
                    // onPress={() => handleSend()}
                  />
                </Touchable>
                <Touchable
                  onPress={this.handleAccept}
                  underlayColor="transparent">
                  {/* <Image
                    source={checkButton}
                    resizeMode="cover"
                    style={styles.buttonIcon}
                  /> */}
                  <AntDesign
                    name="checkcircle"
                    color={'green'}
                    size={45}
                    // onPress={() => handleSend()}
                  />
                </Touchable>
              </View>
            </View>
            <Image source={logo} resizeMode="cover" style={styles.screenLogo} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  popUpScreen: {
    backgroundColor: '#0008',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popUpContainer: {
    height: hp(70),
    width: wp(80),
    padding: wp(3),
    borderRadius: 8,
  },
  userImage: {
    height: wp(24),
    aspectRatio: 1 / 1,
    borderRadius: wp(12),
    borderWidth: 4,
    borderColor: '#bc0f1780',
    // marginTop: hp(5),
    alignSelf: 'center',
  },
  chatIcon: {
    marginVertical: hp(4),
    alignSelf: 'center',
    height: wp(30),
    aspectRatio: 1 / 1,
  },

  buttonIcon: {
    height: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
  },
  screenLogo: {
    height: wp(16),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    margin: wp(2),
  },
});
