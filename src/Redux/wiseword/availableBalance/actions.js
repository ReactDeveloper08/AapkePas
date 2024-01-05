import * as types from './types';

export const saveAvailableBalance = payload => ({
  type: types.SAVE_AVAILABLE_BALANCE,
  payload,
});

export const resetBalance = () => ({
  type: types.RESET_BALANCE,
});
