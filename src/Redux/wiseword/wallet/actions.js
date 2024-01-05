import * as types from './types';

export const getWalletBalance = payload => ({
  type: types.GET_WALLET_BALANCE,
  payload,
});
export const getMinBalance = payload => ({
  type: types.GET_MINI_BALANCE,
  payload,
});

export const addBalance = payload => ({
  type: types.ADD_BALANCE,
  payload,
});

export const getHistory = payload => ({
  type: types.GET_HISTORY,
  payload,
});

export const getEarning = payload => ({
  type: types.GET_EARNING,
  payload,
});

export const getWalletSummary = payload => ({
  type: types.GET_WALLET_SUMMARY,
  payload,
});

export const error = payload => ({
  type: types.ERROR,
  payload,
});
