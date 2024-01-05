import * as types from './types';

export const declineService = payload => ({
  type: types.DECLINE_SERVICE,
  payload,
});
