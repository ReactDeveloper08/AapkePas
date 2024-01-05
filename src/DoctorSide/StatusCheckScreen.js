import React, {PureComponent} from 'react';
import {
  Alert,
  View,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

// Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

//network Info
import NetInfo from '@react-native-community/netinfo';
import {measureConnectionSpeed} from 'react-native-network-bandwith-speed';

//permission
//permission
import {
  check,
  // checkMultiple,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

class StatusCheck extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isGranted: false,
      isConnected: '',
      connectionType: '',
      metric: '',
      speed: '',
    };
  }
  componentDidMount() {
    this.handlePermission();
    this.CheckConnectivity();
    this.getNetworkBandwidth();
  }
  getNetworkBandwidth = async () => {
    try {
      const networkSpeed = await measureConnectionSpeed();
      const {metric, speed} = networkSpeed;
      this.setState({metric, speed});
      // console.log(networkSpeed); // Network bandwidth speed
    } catch (err) {
      console.log(err);
    }
  };
  //network data finder
  CheckConnectivity = () => {
    // For Android devices
    if (Platform.OS === 'android') {
      NetInfo.fetch().then(state => {
        const {isConnected, type} = state;
        if (isConnected) {
          this.setState({
            isConnected: isConnected,
            connectionType: type,
          });
          // Alert.alert('You are online!');
        } else {
          // Alert.alert('You are offline!');
        }
      });
    } else {
      // For iOS devices
      NetInfo.fetch().then(state => {
        const {isConnected, type} = state;
        if (isConnected) {
          this.setState({
            isConnected: isConnected,
            connectionType: type,
          });
          // Alert.alert('You are online!');
        } else {
          // Alert.alert('You are offline!');
        }
      });
    }
  };

  handleFirstConnectivityChange = isConnected => {
    // NetInfo.removeEventListener(
    //   'connectionChange',
    //   this.handleFirstConnectivityChange,
    // );

    if (isConnected === false) {
      this.setState({
        isConnected: false,
      });
      // Alert.alert('You are offline!');
    } else {
      this.setState({
        isConnected: true,
      });
      // Alert.alert('You are online!');
    }
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
              this.setState({isGranted: true});
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.setState({isGranted: true});
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
  render() {
    const {isGranted, speed} = this.state;
    const nSpeed = parseFloat(speed).toFixed(2);
    if (nSpeed <= 2.5) {
      var nContinue = 'Not Applicable';
      var IntSpd = false;
    } else {
      var IntSpd = true;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents
          headerTitle="Status Check"
          nav={this.props.navigation}
        />
        <View style={[basicStyles.mainContainer]}>
          <TouchableOpacity
            style={styles.buttonList}
            onPress={this.unsubscribe}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.headingLarge]}>
                  Allow Aapke Pass run with "{this.state.connectionType}"
                </Text>
                <Text style={[basicStyles.text]}>
                  Connection Type {this.state.connectionType}
                </Text>
              </View>
              {this.state.isConnected ? (
                <Ionicons
                  name="checkmark-sharp"
                  color="#333"
                  size={22}
                  style={styles.icon}
                />
              ) : (
                <View></View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonList}
            onPress={this.unsubscribe}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.headingLarge]}>
                  Internet Connectivity for Live Stream
                </Text>
                <Text style={[basicStyles.text]}>
                  The Internet speed : {nSpeed}
                  {this.state.metric}
                </Text>
              </View>
              {IntSpd ? (
                <Ionicons
                  name="checkmark-sharp"
                  color="#333"
                  size={26}
                  style={styles.icon}
                />
              ) : (
                <View>
                  <Text>{nContinue}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonList}
            onPress={this.handlePermission}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.headingLarge]}>
                  Allow Aapke Pass to run at the background
                </Text>
                <Text style={[basicStyles.text]}>
                  Receive important notification in time
                </Text>
              </View>
              {isGranted ? (
                <Ionicons
                  name="checkmark-sharp"
                  color="#333"
                  size={26}
                  style={styles.icon}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonList}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.headingLarge]}>
                  Allow Aapke Pass to popup the interface above when needed
                </Text>
                <Text style={[basicStyles.text]}>
                  Receive chat notification in time
                </Text>
              </View>
              <Ionicons
                name="checkmark-sharp"
                color="#333"
                size={26}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonList}>
            <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
              <View style={basicStyles.flexOne}>
                <Text style={[basicStyles.headingLarge]}>
                  Allow Aapke Pass to display notifications
                </Text>
                <Text style={[basicStyles.text]}>
                  Receive normal push notification
                </Text>
              </View>
              <Ionicons
                name="checkmark-sharp"
                color="#333"
                size={26}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonList: {
    backgroundColor: '#fff',
    padding: wp(3),
    marginBottom: wp(2),
    borderBottomWidth: 4,
    borderBottomColor: '#f2f1f1',
  },
  icon: {
    width: wp(10),
  },
});

export default StatusCheck;
