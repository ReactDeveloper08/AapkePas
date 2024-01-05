// import React, {useState, useEffect, useRef} from 'react';
// import {
//   Alert,
//   View,
//   Image,
//   Text,
//   SafeAreaView,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   TouchableOpacity,
//   BackHandler,
//   // Image,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import ImagePicker from 'react-native-image-picker';
// import CountDown from 'react-native-countdown-component';
// import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {globalStyle, color} from '../../utility';
// import styles from './styles';
// import basicStyles from 'styles/BasicStyles';
// import {InputField, BoxChat} from '../../component';
// import firebase from '../../firebase/config';
// import {
//   senderMsg,
//   recieverMsg,
//   isTyping,
//   isChatEnd,
//   isAcceptChat,
//   ChatOperation,
//   remove,
// } from '../../network';
// import {deviceHeight} from '../../utility/styleHelper/appStyle';
// import {smallDeviceHeight} from '../../utility/constants';

// //api
// import {BASE_URL, makeRequest} from 'api/ApiInfo';
// // import {KEYS, getData} from 'api/UserPreference';

// import get from 'lodash/get';
// import dot from 'assets/images/3dot.gif';
// import EndChat from 'assets/icons/endChat.png';
// import {nsNavigate, nsPop} from 'routes/NavigationService';
// import clear from 'react-native-clear-cache-lcm';

// const Chat = ({navigation}) => {
//   const [endCallFire, setEndCallFire] = useState(false);
//   const [msgValue, setMsgValue] = useState('');
//   const [messeges, setMesseges] = useState([]);
//   // const [time, setTime] = useState('');
//   let [type, setTyping] = useState(false);
//   const [isExtendTime, setIsExtendTime] = useState(false);
//   const [valueChange, setValueChange] = useState(0);
//   const [newExtendedTime, setNewExtendedTime] = useState(false);
//   // const [endChatMsg, setEndChatMsg] = useState('');
//   // const [extendsChat, setExtendedChat] = useState(0);
//   // const [isExtended, setIsExtended] = useState(false);
//   // const [isSetTime, setIsSetTime] = useState(false);
//   let params = get(navigation, 'state.params', '');
//   const {
//     name,
//     guestUserId,
//     currentUserId,
//     now,
//     response,
//     timeChat,
//     img,
//     imgText,
//   } = params;
//   const {availableMinutes, extendTime, consultationId} = response;
//   const callRef = useRef(endCallFire);
//   // console.log('welcome to chat', navigation.state);
//   // console.log('the chat time start *****---', params);

//   // * backhandler
//   useEffect(() => {
//     const backAction = () => {
//       Alert.alert('Wise Word!', 'Are you sure you want to End Chat?', [
//         {
//           text: 'Cancel',
//           onPress: () => null,
//           style: 'cancel',
//         },
//         {text: 'YES', onPress: () => endChat()},
//       ]);
//       return true;
//     };
//     // BackHandler.exitApp()
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, []);

//   useEffect(() => {
//     try {
//       firebase
//         .database()
//         .ref('messeges')
//         .child(currentUserId)
//         .child(guestUserId)
//         .on('value', dataSnapshot => {
//           let msgs = [];
//           dataSnapshot.forEach(child => {
//             msgs.push({
//               timer: child.val().messege.time,
//               sendBy: child.val().messege.sender,
//               recievedBy: child.val().messege.reciever,
//               msg: child.val().messege.msg,
//               img: child.val().messege.img,
//             });
//           });
//           setMesseges(msgs.reverse());
//           // console.log('chat response are false', msgs.reverse());
//           setTyping(false);
//         });

//       return chatChecker();
//     } catch (error) {
//       alert(error);
//     }
//   }, []);

//   const chatChecker = () => {
//     checkIsTyping();
//     checkIsEndChat();
//     // checkIsExtendChat();
//   };

//   //*checking Typing
//   const checkIsTyping = () => {
//     firebase
//       .database()
//       .ref('typing')
//       .child(guestUserId)
//       .child(currentUserId)
//       .on('value', data => {
//         if (data.key === guestUserId) {
//           setTyping(false);
//         } else {
//           setTyping(true);
//         }
//       });
//   };

//   //*checking EndChat
//   const checkIsEndChat = () => {
//     firebase
//       .database()
//       .ref('chatOperation')
//       .child(guestUserId)
//       .child(currentUserId)
//       .on('value', async dataSnapshot => {
//         let chatOperationMsg = [];
//         dataSnapshot.forEach(child => {
//           chatOperationMsg.push({
//             accept: child.val().chatOperation.accept,
//             endMessage: child.val().chatOperation.endMessage,
//             endNow: child.val().chatOperation.endNow,
//             extendChat: child.val().chatOperation.extendChat,
//           });
//         });
//         let newChatOperation = chatOperationMsg.reverse();
//         if (newChatOperation.length !== 0 && callRef.current != true) {
//           if (
//             newChatOperation[0].endNow === 2 &&
//             newChatOperation[0].endMessage !== '' &&
//             endCallFire != true
//           ) {
//             await setEndCallFire(!endCallFire);
//             // await remove(guestUserId, currentUserId);
//             clear.runClearCache(() => {
//               console.log('data clear');
//             });
//             nsPop();
//             Alert.alert(
//               `The Consultation Charges `,
//               `${newChatOperation[0].endMessage}`,
//               [
//                 {
//                   text: 'Ok',
//                   // onPress: () => nsPop(),
//                 },
//               ], //() => navigation.popToTop()
//               {
//                 cancelable: false,
//               },
//             );
//             console.log('endChat by doctor', endCallFire);
//           }
//           if (newChatOperation[0].extendChat === 1) {
//             setIsExtendTime(true);
//           }
//         }
//       });
//   };

//   // //*extendChat
//   // const checkIsExtendChat = () => {
//   //   firebase
//   //     .database()
//   //     .ref('extendChat')
//   //     .child(guestUserId)
//   //     .child(currentUserId)
//   //     .on('value', async data => {
//   //       const valueResponse = data.val().extendChat;
//   //       if (valueResponse === 1) {
//   //         setIsExtendTime(true);
//   //       }
//   //       // console.log('extend Chat response', valueResponse);
//   //     });
//   // };

//   //*endChat Function
//   const endChatConfirm = () => {
//     Alert.alert(
//       'Wise Word',
//       'Are You Sure You Want To End Chat ?',
//       [
//         {
//           text: 'NO',
//           style: 'cancel',
//         },
//         {
//           text: 'YES',
//           onPress: endChat,
//         },
//       ],
//       {
//         cancelable: false,
//       },
//     );
//   };

//   const endChat = async value => {
//     // console.log('the end chat time in chat duration ========>', value, time);
//     const endTime = new Date();
//     const totalTime = endTime - now;
//     var inSec = totalTime / 1000;
//     const endchatParam = {
//       consultationId: consultationId,
//       balanceMinutes: inSec,
//     };
//     // console.log('endcharParam', endchatParam);
//     const typing = 0;
//     isTyping(typing, currentUserId, guestUserId);
//     const endResponse = await makeRequest(
//       BASE_URL + 'api/Customer/endChatRequest',
//       endchatParam,
//       true,
//       false,
//     );
//     // console.log('endResponse======>', endResponse);
//     if (endResponse && endResponse.success) {
//       const {success, message} = endResponse;
//       if (success) {
//         await setTyping(false);
//         await setEndCallFire(!endCallFire);
//         params = {};
//         Alert.alert(`The Consultation Charges with ${name}`, `${message}`);
//         let endNow = 3;
//         let accept = 1;
//         let extend = 0;
//         let endMessage = message;
//         ChatOperation(
//           endMessage,
//           extend,
//           accept,
//           endNow,
//           guestUserId,
//           currentUserId,
//         );
//         nsPop();
//         clear.runClearCache(() => {
//           console.log('data clear');
//         });
//       }
//     } else if (endResponse && endResponse.success === false) {
//       const {message} = endResponse;
//       setTyping(false);
//       Alert.alert(
//         `The Consultation Charges with ${name}`,
//         `${message}`,
//         [{text: 'Ok', onPress: () => nsPop()}], //() => navigation.popToTop()
//         {
//           cancelable: false,
//         },
//       );
//     }
//   };

//   //*endChat dataRequest
//   // const requestEnd = async message => {
//   // await isChatEnd(endMessage, endNow, currentUserId, guestUserId)
//   //   .then(() => {})
//   //   .catch(e => {
//   //     console.log(e);
//   //   });
//   // await isAcceptChat(accept, guestUserId, currentUserId);
//   // };

//   const handleSend = () => {
//     const typing = 0;
//     isTyping(typing, currentUserId, guestUserId)
//       .then(() => {})
//       .catch(error => {
//         console.log(error);
//       });
//     setTyping(false);
//     setMsgValue('');
//     var eTime = new Date();
//     // var date = new Date();
//     // var year = date.getFullYear();
//     // var month = date.getMonth() + 1;
//     // var day = date.getDate();
//     // var hours = date.getHours();
//     // var minutes = date.getMinutes();
//     // var seconds = date.getSeconds();
//     // var eTime =
//     //   year +
//     //   '-' +
//     //   month +
//     //   '-' +
//     //   day +
//     //   ' ' +
//     //   hours +
//     //   ':' +
//     //   minutes +
//     //   ':' +
//     //   seconds;
//     if (msgValue) {
//       senderMsg(msgValue, currentUserId, guestUserId, '', eTime)
//         .then(() => {})
//         .catch(err => alert(err));

//       // * guest user

//       recieverMsg(msgValue, currentUserId, guestUserId, '', eTime)
//         .then(() => {})
//         .catch(err => alert(err));
//     }
//   };

//   //*CAMERA
//   const handleCamera = () => {
//     const option = {
//       skipBackup: true,
//       includeBase64: true,
//       mediaType: 'photo',
//       quality: 0.4,
//       maxWidth: 250,
//       maxHeight: 250,
//     };

//     ImagePicker.launchCamera(option, response => {
//       if (response.didCancel) {
//         console.log('User cancel image picker');
//       } else if (response.error) {
//         console.log(' image picker error', response.error);
//       } else {
//         // Base 64
//         const eTime = Date();
//         let source = 'data:image/jpeg;base64,' + response.data;

//         senderMsg(msgValue, currentUserId, guestUserId, source, eTime)
//           .then(() => {})
//           .catch(err => alert(err));

//         // * guest user

//         recieverMsg(msgValue, currentUserId, guestUserId, source, eTime)
//           .then(() => {})
//           .catch(err => alert(err));
//       }
//     });
//   };

//   const handleOnChange = text => {
//     try {
//       const typing = 1;
//       isTyping(typing, currentUserId, guestUserId)
//         .then(() => {})
//         .catch(error => {
//           console.log(error);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//     if (text.length > 0) {
//       setTyping(true);
//     } else if (text.length === 0) {
//       const typing = 0;
//       isTyping(typing, currentUserId, guestUserId)
//         .then(() => {})
//         .catch(error => {
//           console.log(error);
//         });
//       setTyping(false);
//     }
//     checkIsTyping();
//     setMsgValue(text);
//   };

//   //   * On image tap
//   const imgTap = chatImg => {
//     console.log('user tap on image', chatImg);
//     navigation.navigate('ShowFullImg', {name, img: chatImg});
//   };

//   // console.log('the type response', type, time);
//   // console.log(
//   //   'My Available Time is  ----========----=====----=<>',
//   //   availableMinutes,
//   // );
//   const remainTime = async remainingTime => {
//     // console.log(remainingTime);

//     if (isExtendTime === true) {
//       // console.log(
//       //   'hey remaining time',
//       //   remainingTime.remainingTime,
//       //   valueChange,
//       // );
//       const bTime = extendTime * 60;
//       const tTime = remainingTime.remainingTime + bTime;
//       await setValueChange(tTime);
//       await setNewExtendedTime(true);
//     }
//   };
//   // console.log('hey remaining time99999', newExtendedTime, valueChange);
//   return (
//     <SafeAreaView style={[globalStyle.flex1, {backgroundColor: '#fffcd5'}]}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerSubTitle}> {name} </Text>
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <View
//             style={{
//               backgroundColor: '#ff638b',
//               height: 8,
//               width: 8,
//               borderRadius: 4,
//             }}
//           />
//           {newExtendedTime ? (
//             <CountDown
//               until={valueChange}
//               size={12}
//               running={true}
//               onFinish={value => endChat(value)}
//               digitStyle={{backgroundColor: '#FFF'}}
//               digitTxtStyle={{color: '#c0c0c0'}}
//               timeToShow={['M', 'S']}
//               timeLabels={{m: null, s: null}}
//             />
//           ) : (
//             <CountdownCircleTimer
//               isPlaying
//               duration={availableMinutes * 60}
//               size={45}
//               strokeWidth={0}
//               trailStrokeWidth={0}
//               onComplete={() => {
//                 endChat();
//               }}
//               colors={[
//                 ['#F7B801', 0.4],
//                 ['#c0c0c0', 0.2],
//                 ['#004777', 0.4],
//               ]}
//               renderAriaTime={remainingTime => {
//                 remainTime(remainingTime);
//               }}>
//               {({remainingTime, children, animatedColor}) => (
//                 <Animated.Text
//                   style={{
//                     color: '#333',
//                     fontWeight: '700',
//                     fontSize: wp(3),
//                   }}>
//                   {parseInt(remainingTime / 60, 10) % 60}:
//                   {parseInt(remainingTime % 60)}
//                 </Animated.Text>
//               )}
//             </CountdownCircleTimer>
//           )}
//         </View>
//         <TouchableOpacity
//           style={basicStyles.marginLeft}
//           onPress={endChatConfirm}>
//           <Image source={EndChat} style={{height: hp(4), aspectRatio: 1 / 1}} />
//         </TouchableOpacity>
//       </View>

//       <View style={basicStyles.flexOne}>
//         <KeyboardAvoidingView
//           keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 100 : 90}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={[globalStyle.flex1, {backgroundColor: '#fff'}]}>
//           <View style={[globalStyle.flex1]}>
//             <View style={[globalStyle.flex1]}>
//               <FlatList
//                 inverted
//                 data={messeges}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({item}) => (
//                   <
//                     msg={item.msg}
//                     userId={item.sendBy}
//                     img={item.img}
//                     onImgTap={() => imgTap(item.img)}
//                     uuid={currentUserId}
//                     typing={type}
//                     timer={item.timer}
//                   />
//                 )}
//                 style={styles.chatFlatListStyle}
//                 contentContainerStyle={styles.children}
//               />
//               {type === true || type ? (
//                 <Image source={dot} style={styles.typingIcon} />
//               ) : null}
//               {/* Send Message */}
//               <View style={styles.sendMessageContainer}>
//                 <InputField
//                   placeholder="Type Here"
//                   placeholderTextColor="#333"
//                   numberOfLines={10}
//                   inputStyle={styles.input}
//                   value={msgValue}
//                   onChangeText={text => handleOnChange(text)}
//                 />
//                 <View style={styles.sendBtnContainer}>
//                   <MaterialCommunityIcons
//                     name="send"
//                     color={color.PinkColor}
//                     size={34}
//                     onPress={() => handleSend()}
//                   />
//                 </View>
//                 <View style={styles.sendBtnContainer}>
//                   <MaterialCommunityIcons
//                     name="camera"
//                     color={color.PinkColor}
//                     size={34}
//                     onPress={() => handleCamera()}
//                   />
//                 </View>
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Chat;

// {
//   /* <View style={basicStyles.flexOne}>
//         <KeyboardAvoidingView
//           keyboardVerticalOffset={deviceHeight > smallDeviceHeight ? 90 : 90}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={[globalStyle.flex1, {backgroundColor: '#fffcd5'}]}>
//           <View style={basicStyles.flexOne}>
//             <View style={basicStyles.flexOne}>
//               <FlatList
//                 inverted
//                 data={messeges}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({item}) => (
//                   <ChatBox
//                     msg={item.msg}
//                     userId={item.sendBy}
//                     img={item.img}
//                     onImgTap={() => imgTap(item.img)}
//                     uuid={currentUserId}
//                     timer={item.timer}
//                   />
//                 )}
//               />
//             </View>
//             {type === true || type ? (
//               <Image source={dot} style={styles.typingIcon} />
//             ) : null}

//             <View style={styles.sendMessageContainer}>
//               <InputField
//                 placeholder="Type Here"
//                 numberOfLines={10}
//                 inputStyle={styles.input}
//                 value={msgValue}
//                 onChangeText={text => handleOnChange(text)}
//               />
//               <View style={styles.sendBtnContainer}>
//                 <MaterialCommunityIcons
//                   name="send-circle"
//                   color={color.WHITE}
//                   size={35}
//                   onPress={() => handleSend()}
//                 />
//               </View>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </View> */
// }
