import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {clearData} from 'api/UserPreference';
import CustomLoader from './CustomLoader';
import {showToast} from './CustomToast';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
let isLoading = false;

const EarningList = props => {
  const BlockUser = async () => {
    isLoading = true;
    const {userId} = props.item;
    const params = {
      userId,
    };
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/blockUser',
      params,
      true,
      false,
    );
    if (response) {
      const {success, message, isAuthTokenExpired} = response;
      if (success) {
        isLoading = false;
        const refresh = props.refresh;
        refresh(message);
        showToast(message);
      } else {
        isLoading = false;
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
          handleTokenExpire();
        }
      }
    }
  };
  const handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };
  const {userName, userImage, isBlocked} = props.item;
  if (isLoading) {
    return <CustomLoader />;
  }
  return (
    <View style={styles.listContainer}>
      <FastImage
        style={styles.followImage}
        source={{
          uri: userImage,
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={[basicStyles.flexOne]}>
        <Text style={[basicStyles.textLarge, styles.tileRow]}>{userName}</Text>
      </View>
      {isBlocked ? (
        <Touchable style={styles.blockButton}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Blocked
          </Text>
        </Touchable>
      ) : (
        <Touchable style={styles.blockButton} onPress={BlockUser}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Block
          </Text>
        </Touchable>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  blockButton: {
    backgroundColor: '#4cade2',
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    borderRadius: wp(4),
  },
  listContainer: {
    backgroundColor: '#9cdaff',
    padding: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  tileRow: {
    paddingBottom: wp(1),
  },
  followImage: {
    width: wp(13),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    borderRadius: wp(6.5),
  },
  iconRow: {
    marginRight: wp(1),
  },
  flagIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
  },
});

export default EarningList;
