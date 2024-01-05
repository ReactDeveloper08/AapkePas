// API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, storeData} from 'api/UserPreference';
import clear from 'react-native-clear-cache-lcm';
const CheckChat = async constId => {
  try {
    clear.runClearCache(() => {
      console.log('data clear');
    });
    // preparing params
    const params = {
      consultationId: constId,
    };
    // calling api
    const response = await makeRequest(
      BASE_URL + 'api/Astrologers/checkChatStatus',
      params,
      true,
      false,
    );
    if (response) {
      const {success} = response;
      if (success) {
        return response;
      } else {
        const consultationId = '';
        await storeData(KEYS.CONSULTATION_ID, consultationId);
        return response;
      }
    }
  } catch (error) {
    return null;
  }
};
export default CheckChat;
