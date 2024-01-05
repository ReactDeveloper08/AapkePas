import React, {PureComponent} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
import {showToast} from './CustomToast';
// Style
import basicStyles from 'styles/BasicStyles';

class BlockListComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {isLoading: false};
  }

  handelUnBlock = async () => {
    this.setState({isLoading: true});
    const {userId} = this.props.item;
    const params = {userId};
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/unBlockUser',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        this.setState({isLoading: false});
        const refresh = this.props.refresh;
        refresh(message);
        showToast(message);
      } else {
        this.setState({message, isLoading: false});
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
  render() {
    const {userName, userImage} = this.props.item;

    return (
      <View style={[styles.feedsContainer]}>
        <Image
          source={{uri: userImage}}
          // source={liveAstro}
          resizeMode="cover"
          style={styles.userImage}
        />

        <View style={basicStyles.flexOne}>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.paddingHalfBottom,
              basicStyles.marginRight,
            ]}>
            {userName}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          underlayColor="#ff638b80"
          onPress={this.handelUnBlock}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Unblock
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default BlockListComponent;
const styles = StyleSheet.create({
  feedsContainer: {
    backgroundColor: '#4faee4',
    flexDirection: 'row',
    padding: wp(2),
    alignItems: 'center',
    borderRadius: wp(2),
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp(2),
  },

  newsFeedsImage: {
    width: hp(6),
    aspectRatio: 1 / 1,
    borderRadius: hp(3),
    marginRight: wp(3),
  },

  momentDate: {
    fontSize: wp(2.8),
    marginTop: wp(1.5),
    color: '#fff',
  },

  postImage: {
    width: wp(15),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#9bdbff',
    height: hp(4),
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    borderRadius: hp(2),
  },
  userImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
    borderWidth: 2,
    borderColor: '#ff638b20',
  },
});
