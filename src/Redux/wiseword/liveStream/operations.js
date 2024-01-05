import * as actions from './actions';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {nsNavigate} from 'routes/NavigationService';
import database from '@react-native-firebase/database';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

export const liveStart = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/liveAstologers',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/liveAstologers');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.liveStart(response));
      } else {
        dispatch(actions.liveStart(response));
      }
    }
  } catch (e) {
    console.log('error in liveStart', e);
  }
};

export const liveUserCount = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/liveUsercount',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/liveUsercount');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.liveUserCount(response));
      } else {
        dispatch(actions.liveUserCount(response));
      }
    }
  } catch (e) {
    console.log('error in liveUserCount', e);
  }
};

export const liveFollow = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/LiveFollow',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/LiveFollow');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.liveFollow(response));
      } else {
        dispatch(actions.liveFollow(response));
      }
    }
  } catch (e) {
    console.log('error in liveFollow', e);
  }
};

export const callToExpert = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/callToExpertLiveNew',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/callToExpertLiveNew');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.callToExpert(response));
      } else {
        dispatch(actions.callToExpert(response));
      }
    }
  } catch (e) {
    console.log('error in callToExpert', e);
  }
};

export const endLiveCall = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/endLiveCall',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/endLiveCall');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.endLiveCall(response));
      } else {
        dispatch(actions.endLiveCall(response));
      }
    }
  } catch (e) {
    console.log('error in endLiveCall', e);
  }
};

export const liveShare = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/LiveShare',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Astrologers/LiveShare');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.liveShare(response));
      } else {
        dispatch(actions.liveShare(response));
      }
    }
  } catch (e) {
    console.log('error in liveShare', e);
  }
};

export const checkCallBusy = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/checkAstroBusy',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/checkAstroBusy');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.checkCallBusy(response));
      } else {
        dispatch(actions.checkCallBusy(response));
      }
    }
  } catch (e) {
    console.log('error in checkCallBusy', e);
  }
};
export const giftList = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/giftList',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/giftList');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.giftList(response));
      } else {
        dispatch(actions.giftList(response));
      }
    }
  } catch (e) {
    console.log('error in  giftList', e);
  }
};

export const saveLiveData = liveData => async dispatch => {
  try {
    await dispatch(actions.saveLiveData(liveData));
  } catch (e) {
    console.log('error in  saveLiveData', e);
  }
};

export const saveLiveCallFirebase = params => async dispatch => {
  try {
    const {channelName, expertID} = params;
    database()
      .ref('LiveCall/')
      .on('value', async snapshot => {
        var a = snapshot.exists(); // true
        var b = snapshot.child(channelName).exists(); // true
        if (a && b !== false) {
          var c = snapshot.child(channelName + '/' + expertID).exists(); // true
          if (b === true && c === true) {
            const call = snapshot
              .child(channelName + '/' + expertID)
              .val().call;
            const userId = snapshot
              .child(channelName + '/' + expertID)
              .val().userId;
            const response = {call, userId};
            await dispatch(actions.saveLiveCallFirebase(response));
          }
        }
      });
  } catch (e) {
    console.log('error in  saveLiveData', e);
  }
};
