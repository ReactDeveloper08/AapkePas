import * as types from './types';

export const vcRequest = payload => ({
  type: types.VC_REQUEST,
  payload,
});

export const vcEndCall = payload => ({
  type: types.VC_ENDCALL,
  payload,
});

// export const saveVCData = payload => ({
//   type: types.VC_SAVE_DATA,
//   payload,
// });
