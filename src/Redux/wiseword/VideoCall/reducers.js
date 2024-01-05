import * as types from './types';
import {combineReducers} from 'redux';

const vcRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VC_REQUEST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const vcEndCallReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VC_ENDCALL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

// const saveVCDataReducer = (state = {}, action) => {
//   switch (action.type) {
//     case types.VC_SAVE_DATA:
//       return action.payload;

//     default:
//       return state;
//   }
// };

const reducer = combineReducers({
  vcRequest: vcRequestReducer,
  vcEndCall: vcEndCallReducer,
  // saveVCData: saveVCDataReducer,
});

export default reducer;
