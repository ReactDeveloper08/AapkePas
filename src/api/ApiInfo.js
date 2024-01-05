'use strict';
import axios from 'axios';
import {encryptData} from './EncryptionUtility';

// User Preference
import {KEYS, getData} from './UserPreference';

// Base URL
export const BASE_URL = 'https://thewisewords.in/';

const AXIOS = axios.create({
  baseURL: BASE_URL,
  timeout: 4000,
  headers: {
    // add common headers here
    'content-type': 'multipart/form-data',
  },
});

// Methods
export const makeRequest = async (
  url,
  params = null,
  sendAuthorizationToken = false,
  isContentTypeJSON = false,
) => {
  try {
    // request info
    let info = {};
    info.url = url;
    if (params) {
      // request method
      info.method = 'POST';

      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);

        if (!userInfo) {
          // console.log('Unable to fetch user info');
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
        };
      }

      // request body
      // console.log("Request params:", params);
      if (isContentTypeJSON) {
        // request headers
        info.headers = {
          ...info.headers,
          'Content-Type': 'application/json',
        };

        const data = JSON.stringify(params);
        const payload = await encryptData(data);
        const requestBody = {payload};
        info.data = JSON.stringify(requestBody);
      } else {
        // preparing multipart/form-data
        const formData = new FormData();
        for (const key in params) {
          if (key === 'images' && Array.isArray(params[key])) {
            for (const Mem of Object.keys(params[key])) {
              formData.append(key + '[]', params[key][Mem]);
            }
          } else {
            formData.append(key, params[key]);
          }
        }
        info.data = formData;
      }
    } else {
      if (sendAuthorizationToken) {
        // fetching userInfo
        const userInfo = await getData(KEYS.USER_INFO);
        if (!userInfo) {
          // console.log('Unable to fetch user info');
          return null;
        }

        const {authToken} = userInfo;

        info.headers = {
          Authorization: 'Bearer ' + authToken,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      } else {
        // headers to prevent cache in GET request
        info.headers = {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        };
      }
    }

    const response = await AXIOS.request(info);
    console.log('Request URL:', url);

    console.log('Request Info:', info);

    // const response = await fetch(url, info);
    // console.log('Request Response:', response);

    const result = response.data;
    console.log('Request Result:', result);

    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
