import * as types from './types';
import {combineReducers} from 'redux';

const walletBalanceReducer = (state = 0, action) => {
  switch (action.type) {
    case types.GET_WALLET_BALANCE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const miniBalanceReducer = (state = 0, action) => {
  switch (action.type) {
    case types.GET_MINI_BALANCE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const addBalanceReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_BALANCE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getHistoryReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_HISTORY:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getEarningReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EARNING:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const getWalletSummaryReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_WALLET_SUMMARY:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getWalletBalance: walletBalanceReducer,
  getMinBalance: miniBalanceReducer,
  addBalance: addBalanceReducer,
  getHistory: getHistoryReducer,
  getEarning: getEarningReducer,
  getWalletSummary: getWalletSummaryReducer,
});

export default reducer;
