import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ImageBackground,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import clear from 'react-native-clear-cache-lcm';
import basicStyles from 'styles/BasicStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProcessingLoader from 'components/ProcessingLoader';
import database from '@react-native-firebase/database';
import chatPopup from 'assets/images/chatPopup.png';
import SoundPlayer from 'react-native-sound-player';
// import NotificationSounds from 'react-native-notification-sounds';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import RNVoipCallNativeModule from 'callLib/RNVoipCall';
// import RNVoipCall from 'react-native-voip-call';
import {showToast} from 'components/CustomToast';
import {
  LoginRequest,
  SignUpRequest,
  AddUser,
  isChatEnd,
  chatOperation,
  isAcceptChat,
} from '../../network';

import {setAsyncStorage, keys} from '../../asyncStorage';
import {nsNavigate} from 'routes/NavigationService';
import {connect} from 'react-redux';
import {ChatOperations, ChatSelectors} from 'Redux/wiseword/chat';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class CallConfirmScreen extends Component {
  constructor(props) {
    super(props);
    this.dataBody = props.navigation.state.params.dataBody;
    console.log(props, this.dataBody);
    this.state = {isLoading: false, declineChat: false};
    clear.runClearCache(() => {
      console.log('data clear');
    });
    RNVoipCallNativeModule.stopRingtune();
    RNVoipCallNativeModule.endAllCalls();
    // RNVoipCallNativeModule.removeEventListener('answerCall');
  }
  componentDidMount() {
    this.checkChatDecline();
    this.nameTap();
    // NotificationSounds.getNotifications('notification').then(soundsList => {
    //   SoundPlayer.playSoundFile('play', 'wav');
    // });
  }
  // componentWillUnmount() {
  //   this.nameTap();
  // }
  checkChatDecline = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      var dataBody = this.props.navigation.state.params.dataBody;
      var currentUserId = userInfo.userId;
      var guestUserId = dataBody.userId;
      let endNow = 0;
      let key_new = true;
      if (key_new === true) {
        database()
          .ref('endChat/')
          .on('value', dataSnapShot => {
            let consultantData = dataSnapShot.exists();
            if (consultantData && key_new === true) {
              let end_data = dataSnapShot
                .child(`${currentUserId}/${guestUserId}`)
                .exists();
              if (end_data && key_new === true) {
                let enddata = dataSnapShot
                  .child(`${currentUserId}/${guestUserId}`)
                  .val().endChat;
                if (
                  key_new === true &&
                  enddata === 1 &&
                  enddata !== 0 &&
                  this.state.declineChat !== true
                ) {
                  key_new = false;
                  this.setState({declineChat: true});
                  isChatEnd(0, currentUserId, guestUserId);
                  this.props.navigation.popToTop();
                  this.setState({declineChat: true});
                  SoundPlayer.stop();
                  Alert.alert('Aapke Pass!\nClient decline the chat request');
                }
              }
            }
          })
          .bind(this);
      }
    } catch (error) {
      console.log('error while checking chat decline by user', error);
    }
  };
  resetData = async enddata => {
    try {
      // this.setState({declineChat: true});
    } catch (error) {
      console.log('error while reset', error);
    }
  };

  nameTap = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const dataBody = this.props.navigation.state.params.dataBody;
      console.log('data on accept chat request', dataBody);
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
      var currentID = userInfo.userId;
      var guestId = dataBody.userId;
      let endNow = 0;
      let accept = 0;
      let extend = 0;
      let endMessage = '';
      // await isChatEnd(endMessage, endNow, currentID, guestId)
      //   .then(() => {})
      //   .catch(e => {
      //     console.log(e);
      //   });
      await isAcceptChat(accept, currentID, guestId);
      // await isExtendChat(extendChat, currentID, guestId);
      chatOperation(endMessage, extend, accept, endNow, currentID, guestId);
      SoundPlayer.stop();
      // this.props.navigation.navigate('StartChat');
      const params = {
        consultationId: dataBody.consultationId,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/acceptChat',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          const {availableMinutes} = response;
          SoundPlayer.stop();
          if (!profileImg) {
            this.setState({isLoading: false});
            const {
              navigation: {navigate},
            } = this.props;
            var now = new Date();
            const chatData = {
              name: clientName,
              imgText: clientName.charAt(0),
              guestUserId: guestId,
              currentUserId: currentID,
              dob: DOB,
              time: birthTime,
              date: birthPlace,
              userId,
              now,
              consultationId,
              availableMinutes,
              clientMobile,
            };
            await this.props.docSaveChatData(chatData).then(() => {
              navigate('Doc_Chat');
            });
          } else {
            this.setState({isLoading: false});
            const {
              navigation: {navigate},
            } = this.props;
            var now = new Date();
            const chatData = {
              name: clientName,
              img: profileImg,
              guestUserId: guestId,
              currentUserId: currentID,
              dob: DOB,
              time: birthTime,
              date: birthPlace,
              userId,
              now,
              consultationId,
              availableMinutes,
              clientMobile,
            };
            await this.props.docSaveChatData(chatData).then(() => {
              navigate('Doc_Chat');
            });
          }
        } else {
          this.setState({isLoading: false});
          showToast(message);
        }
      }
    } catch (e) {
      console.log('error in chat while navigate to doc side chat screen', e);
    }
  };

  render() {
    return (
      <ImageBackground
        source={require('assets/images/voiceCallBg.png')}
        resizeMode="cover"
        style={[
          basicStyles.container,
          basicStyles.alignCenter,
          basicStyles.justifyCenter,
        ]}>
        <View style={[styles.popUpContainer]}>
          <View
            style={[
              basicStyles.mainContainer,
              basicStyles.justifyCenter,
              {marginTop: hp(8)},
            ]}>
            <View style={styles.requestContainer}>
              <Image
                source={{uri: this.dataBody.userImage}}
                resizeMode="cover"
                style={styles.userImage}
              />
              <Text style={[styles.requestText]}>
                You have new Chat request from {this.dataBody.clientName}
              </Text>
            </View>
            <Image
              source={chatPopup}
              resizeMode="cover"
              style={styles.chatIcon}
            />
            <View style={[basicStyles.directionRow, basicStyles.justifyAround]}>
              {/* <TouchableOpacity
                onPress={this.handleDenile.bind(this)}
                underlayColor="transparent">
                <AntDesign
                  name="closecircle"
                  color={'red'}
                  size={45}
                // onPress={() => handleSend()}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.nameTap.bind(this)}
                underlayColor="transparent">
                <AntDesign
                  name="checkcircle"
                  color={'green'}
                  size={45}
                // onPress={() => handleSend()}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {this.state.isLoading && <ProcessingLoader />}
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => ({
  isDocChatDataSave: ChatSelectors.isDocChatDataSave(state),
});
const mapDispatchToProps = {
  docSaveChatData: ChatOperations.docSaveChatData,
};
export default connect(mapStateToProps, mapDispatchToProps)(CallConfirmScreen);

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
  requestContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    borderRadius: wp(5),

    shadowColor: '#0006',
    shadowRadius: 10,
    shadowOpacity: 0.6,
    elevation: 8,
    margin: wp(3),
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  requestText: {
    flex: 1,
    fontWeight: '700',
  },
  userImage: {
    height: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
    borderWidth: 4,
    borderColor: '#bc0f1780',
    marginRight: hp(2),
    // alignSelf: 'center',
  },
  chatIcon: {
    marginVertical: hp(4),
    alignSelf: 'center',
    height: wp(50),
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
