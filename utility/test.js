// if (!isEmpty(dataBody) && dataBody.isChat != undefined) {
//   console.log('u r in chat block');
//   console.log('Chat ', 'Deveice Id', deviceId, notification);
//   // Build an action

//   RNVoipCallNativeModule.displayIncomingCall(ChatOptions)
//     .then(data => {
//       console.log('recived the call', data);
//     })
//     .catch(e => console.log(e));
//   RNVoipCallNativeModule.onAnswerChat(data => {
//     console.log('Chat answear', data);
//     this.RequestType = 'ChatAccept';
//   });
//   RNVoipCallNativeModule.onEndChat(data => {
//     console.log('Chat decline', data);
//     // RNVoipCallNativeModule.stopRingtune();
//     // RNVoipCallNativeModule.endAllCalls();
//     this.RequestType = 'ChatDecline';
//   });
//   // nsNavigate('CallConfirm', { dataBody });
//   // clearNotifications();
// } else if (!isEmpty(dataBody) && dataBody.isVideo != undefined) {
//   console.log('u r in videocall block');
//   var currentUserId = userInfo.userId;
//   var guestUserId = dataBody.userId;
//   let key_next = true;
//   if (key_next === true) {
//     database()
//       .ref('endVC')
//       .child(`${currentUserId}`)
//       .child(`${guestUserId}`)
//       .on('value', async dataSnapShot => {
//         // let consultantData = dataSnapShot.exists();
//         // if (consultantData && key_next === true) {
//         console.log('user in C B 1');
//         const enddata = dataSnapShot.val().endVC;
//         console.log('user in C B 2', enddata);
//         if (key_next === true && enddata === 1) {
//           console.log('user in C B 3');
//           key_next = false;
//           this.declineChat = true;
//           let endNow = 0;
//           isVCEnd(endNow, currentUserId, guestUserId);
//           Alert.alert(
//             'WiseWord!',
//             'Client declined Video Call',
//             [
//               {
//                 text: 'Ok',
//                 // onPress: () => ,
//               },
//             ],
//             {
//               cancelable: false,
//             },
//           );
//           resetData();
//         }
//         // }
//       });
//   }
//   // Build an action
//   const VideoOptions = {
//     callerId: dataBody.consultationId, // Important uuid must in this format
//     // callerId: data.uuid, // Important uuid must in this format
//     ios: {
//       phoneNumber: '12344', // Caller Mobile Number
//       name: ' is Calling...', // caller Name
//       hasVideo: false,
//     },
//     android: {
//       ringtuneSound: true, // defualt true
//       ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw --Formats--> mp3,wav
//       duration: 30000, // defualt 30000
//       vibration: true, // defualt is true
//       channel_name: 'call', //
//       notificationId: 1123,
//       notificationTitle: 'Incomming Video Call',
//       notificationBody: `${dataBody.clientName} is Calling...`,
//       answerActionTitle: 'Accept',
//       declineActionTitle: 'Decline',
//     },
//   };
//   RNVoipCallNativeModule.displayIncomingCall(VideoOptions)
//     .then(data => {
//       console.log('recived the call', data);
//     })
//     .catch(e => console.log(e));
//   RNVoipCallNativeModule.onVCAnswer(data => {
//     console.log('Vcall answear', data);
//     this.RequestType = 'VCAccept';
//   });
//   RNVoipCallNativeModule.onEndVC(data => {
//     console.log('Vcall decline', data);
//     this.RequestType = 'VCDecline';
//   });
// } else if (!isEmpty(dataBody) && dataBody.isCall != undefined) {
//   console.log('dataRecive 1');
//   console.log('u r in call block');
//   var currentUserId = userInfo.userId;
//   var guestUserId = dataBody.userId;
//   let key_new = true;
//   if (key_new === true) {
//     database()
//       .ref('endCall')
//       .child(`${currentUserId}`)
//       .child(`${guestUserId}`)
//       .on('value', async dataSnapShot => {
//         const enddata = dataSnapShot.val().endCall;
//         if (key_new === true && enddata === 1) {
//           this.declineChat = true;
//           key_new = false;
//           let endNow = 0;
//           isCallEnd(endNow, currentUserId, guestUserId);
//           Alert.alert(
//             'WiseWord!',
//             'Client declined Call',
//             [
//               {
//                 text: 'Ok',
//                 // onPress: () => this.resetData(),
//               },
//             ],
//             {
//               cancelable: false,
//             },
//           );
//           resetData();
//         } else {
//         }
//       });
//   }
//   const callOptions = {
//     callerId: dataBody.consultationId, // Important uuid must in this format
//     // callerId: data.uuid, // Important uuid must in this format
//     ios: {
//       phoneNumber: '12344', // Caller Mobile Number
//       name: ' is Calling...', // caller Name
//       hasVideo: false,
//     },
//     android: {
//       ringtuneSound: true, // defualt true
//       ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw --Formats--> mp3,wav
//       duration: 30000, // defualt 30000
//       vibration: true, // defualt is true
//       channel_name: 'call', //
//       notificationId: 1123,
//       notificationTitle: 'Incomming Call',
//       notificationBody: `${dataBody.clientName} is Calling...`,
//       answerActionTitle: 'Accept',
//       declineActionTitle: 'Decline',
//     },
//   };
//   RNVoipCallNativeModule.displayIncomingCall(callOptions)
//     .then(dataM => {
//       console.log('call did display data', dataM);
//     })
//     .catch(e => console.log(e));
//   RNVoipCallNativeModule.onCallAnswer(data => {
//     console.log('call answear', data);
//     this.RequestType = 'CallAccept';
//     nsNavigate('callPopUp', {dataBody});
//   });
//   RNVoipCallNativeModule.onEndCall(data => {
//     console.log('call decline', data);
//     this.RequestType = 'CallDecline';
//   });
// }
// console.log('hello');

// var a = 5,
//   b = 3;

// console.log('a', a, 'b', b);

// var c = a + b;
// console.log('c', c);

// var d = a > b;
// var e = a < b;
// var f = !(a > b);
// var g = !(a < b);
// var h = (a += 1);
// var i = (a -= 1);
// var fun = a > 5 && b > 3;
// var fun1 = a > 5 || b > 3;
// var fun2 = !(a > b);

// console.log('d', d, 'e', e, 'f', f, 'g', g, 'h', h, 'i', i);
// console.log('fun', fun, 'fun1', fun1, 'fun2', fun2);
// var con = 4;
// switch (con) {
//   case 1:
//     console.log('con', con);
//     break;
//   case 2:
//     console.log('con', con);
//     break;
//   case 3:
//     console.log('con', con);
//     break;
//   default:
//     console.log('con break', con);
// }

// var i = 5,
//   t = 0;

// for (i = 0; i < 5; i++) {
//   if (i % 2 == 0) {
//     t += i;
//   }
// }
// console.log('t', t);

// while (i <= 20) {
//   console.log('i', i);
//   i++;
// }

// do {
//   console.log('i', i);
//   i++;
// } while (i <= 20);

// var i = 1,
//   t = '';

// for (i = 0; i < 10; i++) {
//   for (var j = 0; j < 10; j++) {
//     if (j >= 10 - i) {
//       process.stdout.write('*');
//     } else {
//       process.stdout.write(' ');
//     }
//   }
//   console.log();
// }

// while (i < 10) {
//   var j = 0;
//   while (j < i) {
//     if (j <= i) {
//       process.stdout.write('' + j);
//     } else {
//       process.stdout.write(' ');
//     }
//     j++;
//   }
//   console.log();
//   i++;
// }

const a = [
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
];
const b = Array();
const c = a.fill(1);
console.log(c, '\n', a);
