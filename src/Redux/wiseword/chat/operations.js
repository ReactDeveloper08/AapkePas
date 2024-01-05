import * as actions from './actions';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};

// import * as loaderActions from '../loader/actions';

// import {KEYS, setAsyncStorage} from 'views/AsyncStorage';

export const chatRequest = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/chatRequestNew',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/chatRequestNew');
    if (response) {
      const {success} = response;
      if (success) {
        dispatch(actions.chatRequest(response));
      } else {
        const {isAuthTokenExpired} = response;
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired \n Login Again to Continue!',
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
          return;
        }

        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
export const saveChatData = chatData => async dispatch => {
  try {
    await dispatch(actions.saveChatData(chatData));
  } catch (e) {
    console.log('error while save chat data ', e);
  }
};
export const docSaveChatData = params => async dispatch => {
  try {
    await dispatch(actions.docSaveChatData(params));
  } catch (e) {
    console.log('error while save chat data ', e);
  }
};
export const endChatRequest = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/endChatRequest',
      params,
      true,
      false,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/endChatRequest');
    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.endChatRequest(response));
      } else {
        const {isAuthTokenExpired} = response;
        if (isAuthTokenExpired === true) {
          Alert.alert(
            'Aapke Pass',
            'Your Session Has Been Expired \n Login Again to Continue!',
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
          return;
        }

        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const onlineAstrologer = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/onlineAstrologers',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/onlineAstrologers');
    if (response) {
      const {success} = response;

      if (success) {
        const {astrologers} = response;
        dispatch(actions.onlineAstrologer(astrologers));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
