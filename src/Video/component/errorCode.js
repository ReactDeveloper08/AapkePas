import showToast from 'components/CustomToast';
export const errorCode = warn => {
  try {
    switch (warn) {
      case 1:
        showToast(
          'Warning Code- 1 errors\nA general error occurs.\n Try calling again',
        );
        break;
      case 1201:
        showToast(
          'Warning Code- 1201 errors\nThe current device does not support audio input',
        );
        break;
      case 1206:
        showToast('Warning Code- 1206 errors\nAudio Session fails to launch');
        break;
      case 1003:
        showToast(
          'warning code- 1003 The camera fails to start\nCheck whether the camera is already in use by another app, or try rejoining the channel',
        );
        break;
      case 1004:
        showToast(
          'Warning Code- 1004 errors\nThe video rendering module fails to start.',
        );
        break;
      case 1510:
        showToast(
          'warning code- 1510 Permission to access the camera is not granted\nCheck whether permission to access the camera permission is granted',
        );
        break;
      case 1512:
        showToast('Warning Code- 1512 errors\nThe camera is already in use.');
        break;
      case 8:
        showToast(
          'Warning Code- 8 errors\nThe specified view is invalid. The video call function requires a specified view',
        );
        break;
      case 16:
        showToast(
          'Warning Code- 16 the video call function, possibly due to a lack of resources\nusers cannot make a video call',
        );
        break;
      case 20:
        showToast(
          'Warning Code- 16 errors\nThe request is pending, usually because some modules are not ready',
        );
        break;
      case 103:
        showToast(
          'Warning Code- 103 errors\nNo channel resources are available, possibly because the server fails to allocate channel resources',
        );
        break;
      case 104:
        showToast(
          'Warning Code- 104 errors\nWhen receiving a request to join a channel \n This warning usually occurs when the network connection is too poor',
        );
        break;
      case 106:
        showToast(
          'Warning Code- 106 errors\nA timeout occurs when joining the channel. Once the specified channel is found',
        );
        break;
      case 107:
        showToast(
          'Warning Code- 107 errors\nThe server rejects the request to join the channel because the server cannot process this request or the request is illegal',
        );
        break;
      case 111:
        showToast(
          'Warning Code- 111 errors\nA timeout occurs when switching to the live video',
        );
        break;
      case 118:
        showToast(
          'Warning Code- 118 errors\nA timeout occurs when setting user roles in the live-streaming profile',
        );
        break;
      case 121:
        showToast(
          'Warning Code- 121 errors\nThe ticket to join the channel is invalid',
        );
        break;
      case 122:
        showToast(
          'Warning Code- 122 errors\nThe SDK is trying to connect to another server.',
        );
        break;
      case 131:
        showToast(
          'Warning Code- 131 errors\nThe channel connection cannot be recovered',
        );
        break;
      case 132:
        showToast('Warning Code- 132 errors', 'The IP address has changed');
        break;
      case 1031:
        showToast(
          'Warning Code- 1031 errors\nThe recording volume is too low. Check whether the users microphone is muted or whether the user has enabled microphone augmentation',
        );
        break;
      case 1040:
        showToast('Warning Code- 1040 errors', 'No audio data is available');
        break;
      case 1051:
        showToast(
          'Warning Code- 1051 errors\nAudio feedback is detected during recording',
        );
        break;
      case 1323:
        showToast(
          'Warning Code- 1323 errors\nNo playback device is available. Ensure that a proper audio device is connected',
        );
        break;
      case 1031:
        showToast(
          'Warning Code- 1031 Internet connection problem\nyour device internet connection is poor \n please connect with good connection',
        );
        break;
      case 1052:
        showToast(
          'Warning Code- 1052 Audio Device Module:\nAudio Device Module: The device is in the glitch state',
        );
        break;
      case 1042:
        showToast(
          'Warning Code- 1042 Audio device module:\nAudio device module: The audio recording device is different from the audio playback device',
        );
        break;
      case 1025:
        showToast(
          'Warning Code- 1025 call is interrupted\ncall is interrupted by system events such as phone call or SIRI etc',
        );
        break;
      case 105:
        showToast(
          'Warning Code- 105 server rejects the request\nThe server rejects the request to look up the channel. The server cannot process this request',
        );
        break;
      case 1031:
        showToast(
          'Warning Code- 1031 Internet connection problem\nyour device internet connection is poor \n please connect with good connection',
        );
        break;
      case 1019:
        showToast(
          'Warning Code- 1019 No data',
          'Check whether the microphone is already in use',
        );
        break;
      case 1020:
        showToast(
          'Warning Code- 1020 No data\nThe audio playback frequency is abnormal due to high CPU usage',
        );
        break;
      case 1021:
        showToast(
          'Warning Code- 1021 No data\nThe audio playback frequency is abnormal due to high CPU usage',
        );
        break;
      case 17:
        showToast(
          'Warning Code- 17 Connection problem\nThe request to join the channel is rejected',
        );
        break;
      default:
        showToast('Connection Establish', {
          cancelable: true,
        });
    }
  } catch (error) {
    console.warn('error while connection with the warn error handling');
  }
};
