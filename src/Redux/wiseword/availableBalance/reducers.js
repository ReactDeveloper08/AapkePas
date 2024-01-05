import * as types from './types';

const availableBalanceReducer = (state = 0, action) => {
  switch (action.type) {
    case types.SAVE_AVAILABLE_BALANCE:
      return action.payload;

    default:
      return state;
  }
};

export default availableBalanceReducer;
