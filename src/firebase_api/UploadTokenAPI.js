import {getUniqueId} from 'react-native-device-info';
import {Alert, Platform} from 'react-native';
//Location
import GetLocation from 'react-native-get-location';
// API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
// Permissions
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
// User Preference
import {KEYS, storeData} from 'api/UserPreference';
//* Geolocation Services

const checkLocationPermission = async () => {
  try {
    const platformPermission = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });

    const result = await check(platformPermission);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        // this.isLocationPermissionBlocked = true;
        Alert.alert(
          'Location Services Not Available',
          'Press OK, then check and enable the Location Services in your Privacy Settings',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: handleOpenSettings(),
            },
          ],
          {cancelable: false},
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        const requestResult = await request(platformPermission);
        switch (requestResult) {
          case RESULTS.GRANTED:
        }
        break;
      case RESULTS.GRANTED:
        return result;
      case RESULTS.BLOCKED:
        // isLocationPermissionBlocked = true;

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
              onPress: handleOpenSettings(),
            },
          ],
          {cancelable: false},
        );
    }
  } catch (error) {
    console.log(error.message);
  }
};

const handleOpenSettings = async () => {
  try {
    await openSettings();
  } catch (error) {
    console.log('Unable to open App Settings:', error);
  }
};
export const uploadToken = async fcmToken => {
  try {
    await checkLocationPermission().then(async response => {
      if (response === 'granted') {
        var latitude = '';
        var longitude = '';
        let code = '';
        let message = '';
        await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        })
          .then(location => {
            latitude = location.latitude;
            longitude = location.longitude;
          })
          .catch(error => {
            code = error.code;
            message = error.message;
            console.warn('location Error', code, message);
          });
        let uniqueId = getUniqueId();
        if (latitude && longitude) {
          if (uniqueId !== 'unknown') {
            // preparing params
            const params = {
              latitude,
              longitude,
              uniqueDeviceId: uniqueId,
              token: fcmToken,
            };
            // calling api
            const userDevID = await makeRequest(
              BASE_URL + 'api/Customer/uploadToken',
              params,
            );
            if (userDevID) {
              const {success} = userDevID;
              if (success) {
                const {userInfo} = userDevID;
                const {deviceId, location, currency} = userInfo;
                // persisting deviceInfo
                await storeData(KEYS.DEVICE_UNIQUE_ID, {deviceId});
                await storeData(KEYS.NWE_LOCATION, location);
                await storeData(KEYS.NEW_CURRENCY, currency);
              } else {
                console.log('userInfo in upload Token', userDevID);
              }
            }
          }
        }
      } else {
        let uniqueId = getUniqueId();
        if (uniqueId !== 'unknown') {
          // preparing params
          const params = {
            uniqueDeviceId: uniqueId,
            token: fcmToken,
          };
          // calling api
          const userDevID = await makeRequest(
            BASE_URL + 'api/Customer/uploadToken',
            params,
          );
          if (userDevID) {
            const {success} = userDevID;
            if (success) {
              const {userInfo} = userDevID;
              const {deviceId, location, currency} = userInfo;
              // persisting deviceInfo
              await storeData(KEYS.DEVICE_UNIQUE_ID, {deviceId});
              await storeData(KEYS.NWE_LOCATION, location);
              await storeData(KEYS.NEW_CURRENCY, currency);
            } else {
              console.log('userInfo in upload Token', userDevID);
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};
