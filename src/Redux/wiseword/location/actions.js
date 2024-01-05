import * as types from './types';

export const saveLocation = payload => ({
  type: types.SAVE_LOCATION,
  payload,
});

export const resetLocation = () => ({
  type: types.RESET_LOCATION,
});
