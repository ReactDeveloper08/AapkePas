import * as actions from './actions';
import {Alert} from 'react-native';
import {clearData} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {nsNavigate} from 'routes/NavigationService';

const handleTokenExpire = async () => {
  await clearData();
  nsNavigate('Login');
};
export const getQuestion = params => async dispatch => {
  try {
    const response = await makeRequest(
      BASE_URL + 'api/Customer/getQuestionAnswer',
      params,
    );
    //Alert.alert('', BASE_URL + 'api/Customer/getQuestionAnswer');
    if (response) {
      dispatch(actions.getQuestion(response));
    }
  } catch (error) {
    console.warn('error when fetch get Question api', error);
  }
};
export const getScore = params => async dispatch => {
  try {
    const response = await makeRequest(BASE_URL + 'api/Customer/score', params);
    //Alert.alert('', BASE_URL + 'api/Customer/score');
    if (response) {
      dispatch(actions.getScore(response));
    }
  } catch (error) {
    console.warn('error when fetch get Question api', error);
  }
};
