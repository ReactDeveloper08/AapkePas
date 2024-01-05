'use strict';

import {NativeModules, DeviceEventEmitter, Platform} from 'react-native';

import RNVoipPushKitNativeModule from './iosPushKit';
import RNVoipCallNativeModule from './RNVoipCall';

export const RNVoipPushKit = RNVoipPushKitNativeModule;

export default RNVoipCallNativeModule;
