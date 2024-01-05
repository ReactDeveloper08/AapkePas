import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Images
import callCut from 'assets/icons/callCut.png';
import acceptCallIcon from 'assets/icons/acceptCallIcon.png';
import videoCallBG from 'assets/images/videoCallBG.png';
import userAlert from 'assets/images/userAlert.png';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
export default class VideoCallScreen extends Component {
  constructor(props) {
    super(props);
    const channelDeta2 = this.props.navigation.getParam('channelDeta2');
    this.state = {};
  }

  handleCut = () => {
    this.props.navigation.navigate('Home');
  };
  handleAccept = async () => {
    // console.log('video call start');
    const channelDeta2 = await this.props.navigation.getParam('channelDeta2');
    const {appID, channelName} = channelDeta2;
    const rtcProps = {
      appId: appID,
      channel: channelName,
    };
    console.log('jdsy67dtva6tee86bvffvf', rtcProps);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={videoCallBG}
          resizeMode="cover"
          style={styles.bgContainer}>
          <View style={styles.mainContainer}>
            <Image
              source={userAlert}
              resizeMode="cover"
              style={styles.userImage}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Touchable
              style={styles.CallCutButton}
              onPress={this.handleCut}
              underlayColor="#bb000080">
              <Image source={callCut} resizeMode="cover" style={styles.icon} />
            </Touchable>
            <Touchable
              style={styles.acceptCallButton}
              onPress={this.handleAccept}
              underlayColor="#49841580">
              <Image
                source={acceptCallIcon}
                resizeMode="cover"
                style={styles.icon}
              />
            </Touchable>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: wp(10),
  },

  CallCutButton: {
    backgroundColor: '#bb0000',
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptCallButton: {
    backgroundColor: '#498415',
    height: wp(14),
    width: wp(14),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    height: wp(8),
    aspectRatio: 1 / 1,
  },
  bgContainer: {
    flex: 1,
  },
  userImage: {
    height: wp(55),
    aspectRatio: 1 / 1,
    marginTop: wp(30),
  },
});
