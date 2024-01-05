import {PermissionsAndroid, Platform, Alert} from 'react-native';
// Permissions
import {
  check,
  request,
  requestMultiple,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
export async function requestCameraAndAudioPermissionIOS() {
  try {
    let result = null;
    const platformPermission = checkMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then(async statuses => {
      result = await requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]).then(statuses => {
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('FaceID', statuses[PERMISSIONS.IOS.MICROPHONE]);
      });
    });

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
  } catch (err) {
    console.warn(err);
  }
}

const handleOpenSettings = async () => {
  try {
    await openSettings();
  } catch (error) {
    console.log('Unable to open App Settings:', error);
  }
};
