// import React, {useEffect, useState} from 'react';
// import {
//   Alert,
//   Platform,
//   Animated,
//   Image,
//   Text,
//   ImageBackground,
//   TouchableOpacity,
//   View,
//   TextInput,
//   FlatList,
//   LogBox,
//   BackHandler,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   // heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// //user for BroadCasting and live Streaming
// import RtcEngine, {
//   ChannelProfile,
//   ClientRole,
//   VideoRenderMode,
//   RtcRemoteView,
//   RtcLocalView,
//   VideoFrameRate,
//   VideoOutputOrientationMode,
//   AudienceLatencyLevelType,
//   RtcChannel,
// } from 'react-native-agora';

// import requestCameraAndAudioPermission from '../Livecomponents/Permission';

// import styles from '../Livecomponents/Style';
// import background from '../Livecomponents/assets/Ocean4.jpeg';
// import endChat from '../Livecomponents/assets/power.webp';
// import userImages from '../Livecomponents/assets/user.png';
// import ic_startV from 'Livecomponents/assets/ic_startV.png';

// // firebse for chat room
// import database from '@react-native-firebase/database';
// import {send, receiveCall, liveCount} from '../firebase/message';

// // screen Awake
// import KeepAwake from 'react-native-keep-awake';

// //counter
// import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

// //Api
// import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, getData} from 'api/UserPreference';

// //share
// import Share from 'react-native-share';
// import RNFetchBlob from 'rn-fetch-blob';

// //Popup screen
// import CallBalancePopup from '../Livecomponents/popupscreen/CallBalancePopup';
// import ReportLive from '../Livecomponents/popupscreen/ReportLive';
// import SaveKundli from '../Livecomponents/popupscreen/SaveKundli';
// //Redux
// import {connect} from 'react-redux';
// import {
//   liveStreamOperations,
//   liveStreamSelectors,
// } from 'Redux/wiseword/liveStream';
// import {
//   transactionOperations,
//   transactionSelectors,
// } from 'reduxPranam/ducks/transaction';
// import {userInfoSelectors} from 'reduxPranam/ducks/userInfo';

// const Viewer_ag = props => {
//   var _engine = RtcEngine;
//   const liveData = props.navigation.getParam('liveData', null);
//   const {
//     appCertificate,
//     appID,
//     astrologerId,
//     astrologerName,
//     channelId,
//     channelName,
//     channelTocken,
//     id,
//     image,
//     live_call_charges,
//     live_call_duration,
//   } = liveData;
//   //* react hooks
//   const [openMicrophone, setOpenMicrophone] = useState(true);
//   const [enableSpeakerphone, setEnableSpeakerPhone] = useState(true);
//   const [isLowAudio, setIsLowAudio] = useState(true);
//   const [count, setCount] = useState([]);
//   const [data, setData] = useState({queue: 1});
//   const [isProcessed, setIsProcessed] = useState(false);
//   const [usName, setUsName] = useState('');
//   const [gift, setGift] = useState('');
//   const [onCall, setOnCall] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [joinSucceed, setJoinSuccess] = useState(false);
//   const [peerIds, setPeerIds] = useState([]);
//   const [peerIdss, setPeerIdss] = useState([]);
//   const [msgValue, setMsgValue] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [uid, setUid] = useState(1234);
//   const [isFloat, setIsFloat] = useState(false);
//   const [isCall, setIsCall] = useState(false);
//   const [Balance, setBalance] = useState(0);
//   const [miniBalance, setMinBalance] = useState(0);
//   const [consultationData, setConsultationData] = useState('');
//   const [showGrace, setShowGrace] = useState(false);
//   const [giftList, setGiftList] = useState('');
//   const [giftImg, setGiftImg] = useState('');
//   const [giftUser, setGiftUser] = useState('');
//   const [isGiftGiven, setIsGiftGiven] = useState(false);

//   //* PopUps
//   const [showCallBalPopup, setShowCallBalPopup] = useState(false);
//   const [showReportPopup, setShowReportPopup] = useState(false);
//   const [showFormPopup, setShowFormPopup] = useState(false);

//   useEffect(() => {
//     init();
//     messageList();
//     walletBalance();
//     handle_Call();

//     BackHandler.addEventListener('hardwareBackPress', backAction);

//     return () =>
//       BackHandler.removeEventListener('hardwareBackPress', backAction);
//   }, []);

//   //* Agora Stream
//   const init = async () => {
//     // _engine = await RtcEngine.createWithConfig(new RtcEngineConfig(appID));
//     _engine = await RtcChannel.create(appID);
//     // Enable the video module.
//     // if (state.onCall === false) {
//     await _engine.enableVideo();
//     // }
//     await _engine?.enableAudio();
//     // Set the channel profile as live streaming.
//     await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
//     // Set the usr role as host.
//     await _engine.setClientRole(ClientRole.Audience);

//     // adding listener
//     _engine?.addListener('Warning', warningCode => {
//       console.info('Warning', warningCode);
//     });
//     _engine?.addListener('Error', errorCode => {
//       console.info('Error', errorCode);
//     });
//     await _initListeners();
//     await startCall();
//     KeepAwake.activate();
//   };

//   //* Video stream listener as Audience
//   const _initListeners = async () => {
//     await _engine?.addListener(
//       'JoinChannelSuccess',
//       (channel, uid, elapsed) => {
//         console.info('JoinChannelSuccess', channel, uid, elapsed);
//         // RtcLocalView.SurfaceView must render after engine init and channel join
//         setJoinSuccess(true);
//         setUid(uid);
//       },
//     );
//     // await _engine.muteAllRemoteVideoStreams(true);

//     await _engine?.addListener('UserJoined', async (uid, elapsed) => {
//       console.info('UserJoined', uid, elapsed);

//       setPeerIds([...peerIds, uid]);
//     });
//     await _engine?.addListener('UserOffline', (uid, reason) => {
//       console.info('UserOffline', uid, reason);

//       setPeerIds(peerIds.filter(id => id !== uid));
//       setUid(uid);
//     });
//   };

//   //* handle audio call
//   const _audioCall = async () => {
//     await _engine.enableLocalAudio(true);
//     await _engine.enableLocalVideo(false);
//     await _engine.enableAudio();
//     await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
//     await _engine.setClientRole(ClientRole.Broadcaster);
//     _addListeners();
//   };

//   //* call listener
//   const _addListeners = async () => {
//     _engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
//       console.info('JoinChannelSuccess', channel, uid, elapsed);
//       setJoinSuccess(true);
//     });
//     _engine?.addListener('LeaveChannel', stats => {
//       console.info('LeaveChannel', stats);
//       setJoinSuccess(false);
//     });
//     await _engine?.joinChannel(channelTocken, channelId, null, 0);
//   };

//   //* live count
//   const handleLive = async () => {
//     try {
//       const deviceId = await getData(KEYS.DEVICE_UNIQUE_ID);
//       const userInfo = await getData(KEYS.USER_DATA, null);
//       if (userInfo) {
//         const {role} = userInfo;

//         var params = {
//           channelId: channelId,
//           deviceId: deviceId.deviceId,
//           role: role,
//         };
//       } else {
//         var params = {
//           channelId: channelId,
//           deviceId: deviceId.deviceId,
//           role: 'guest',
//         };
//       }
//       const response = await makeRequest(
//         BASE_URL + 'api/Customer/liveUsercount',
//         params,
//       );
//       if (response) {
//         const {liveUserCount} = response;

//         setPeerIdss(liveUserCount);
//         await liveCounter();
//       }
//       // this.liveCount();
//     } catch (e) {
//       console.log('error response in live', e);
//     }
//   };

//   // shouldComponentUpdate() {}
//   const setFloatHeart = () => {
//     setIsFloat(false);
//   };
//   // shouldComponentUpdate() {}
//   const showGifts = () => {
//     setIsGiftGiven(false);
//   };

//   //* handle check the call is recive or not
//   const handle_Call = async () => {
//     try {
//       await database()
//         .ref('LiveCall')
//         .on('value', async snapshot => {
//           var a = snapshot.exists(); // true
//           var b = snapshot.child(channelName).exists(); // true

//           if (b !== false) {
//             var c = snapshot.child(channelName + '/' + astrologerId).exists(); // true

//             if (b === true && c === true) {
//               const call = snapshot
//                 .child(channelName + '/' + astrologerId)
//                 .val().call;
//               const userId = snapshot
//                 .child(channelName + '/' + astrologerId)
//                 .val().userId;

//               if (call === 1 && userId === userName) {
//                 // this.setState({handleAnswer: true, call_to});

//                 await handleCallToAstro();
//               }
//             }
//           }
//         });
//     } catch (e) {
//       console.log('the log message', e);
//     }
//   };

//   //* message list
//   const messageList = () => {
//     try {
//       database()
//         .ref('chatRoom')
//         .child(channelName)
//         .on('value', dataSnapshot => {
//           let msgs = [];

//           let recMsg = [];

//           dataSnapshot.forEach(child => {
//             msgs.push({
//               msg: child.val().message.msg,
//               chName: child.val().message.chName,
//               userId: child.val().message.userId,
//               date: child.val().message.date,
//               usId: child.val().message.usId,
//               usName: child.val().message.usName,
//               heart: child.val().message.heart,
//               img: child.val().message.img,
//               gift: child.val().message.gift,
//               giftImg: child.val().message.giftImg,
//             });
//             if (child.val().message.msg !== '') {
//               recMsg.push({
//                 msg: child.val().message.msg,
//                 chName: child.val().message.chName,
//                 userId: child.val().message.userId,
//                 date: child.val().message.date,
//                 usId: child.val().message.usId,
//                 usName: child.val().message.usName,
//                 heart: child.val().message.heart,
//                 img: child.val().message.img,
//                 gift: child.val().message.gift,
//                 giftImg: child.val().message.giftImg,
//               });
//             }
//           });
//           let newMsg = msgs.reverse();
//           // let newCount = liveCount.reverse();
//           if (newMsg.length !== 0) {
//             if (newMsg[0].heart !== '') {
//               setIsFloat(true);

//               setTimeout(setFloatHeart, 4000);
//             }
//             if (newMsg[0].gift !== '') {
//               setIsGiftGiven(true);

//               setGiftImg(newMsg[0].giftImg);
//               setGiftUser(newMsg[0].usName);

//               setTimeout(showGifts, 3000);
//             }
//           }

//           setMessages(recMsg.reverse());
//         });
//       handleLive();
//     } catch (e) {
//       console.log('Error in retrieve messages', e);
//     }
//   };

//   //*send live count data
//   const liveCounter = async () => {
//     const time = live_call_duration;
//     const live = peerIdss;

//     liveCount(channelName, live, time);
//   };
//   //*wallet Balance
//   const walletBalance = async () => {
//     try {
//       await props.getWalletBalance();
//       const userInfo = await getData(KEYS.USER_DATA);
//       const {name} = userInfo;
//       setUserName(name);

//       if (props.isWalletBalance !== 0) {
//         setBalance(props.isWalletBalance);
//         setMinBalance(props.isMiniBalance);
//       }
//       setMinBalance(props.isMiniBalance);
//     } catch (e) {}
//   };
//   /**
//    * @name startCall
//    * @description Function to start the call
//    */
//   const startCall = async () => {
//     // Join Channel using null token and channel name
//     await _engine?.joinChannel(channelTocken, channelName, null, 0, undefined);
//   };

//   //* Back handler
//   const backAction = () => {
//     if (isCall) {
//       Alert.alert(
//         'Wise Word',
//         'Are you sure, you want to leave?, You are in call with astrologer',
//         [{text: 'Leave', onPress: endTheCall}],
//         {
//           cancelable: true,
//         },
//       );
//     } else {
//       Alert.alert(
//         'Wise Word',
//         'Are you sure, you want to leave?',
//         [
//           {text: 'Follow & Leave', onPress: handleFollowLeave},
//           {text: 'Leave', onPress: leaveChannel},
//         ],
//         {
//           cancelable: true,
//         },
//       );
//     }
//     return true;
//   };

//   //*End Stream by button press
//   const endCall = () => {
//     if (isCall) {
//       Alert.alert(
//         'Wise Word',
//         'Are you sure, you want to leave?, You are in call with astrologer',
//         [{text: 'Leave', onPress: endTheCall}],
//         {
//           cancelable: true,
//         },
//       );
//     } else {
//       Alert.alert(
//         'Wise Word',
//         'Are you sure, you want to leave?',
//         [
//           {text: 'Follow & Leave', onPress: handleFollowLeave},
//           {text: 'Leave', onPress: leaveChannel},
//         ],
//         {
//           cancelable: true,
//         },
//       );
//     }
//   };

//   //*leave Channel
//   const leaveChannel = async () => {
//     await _engine?.leaveChannel();
//     setPeerIds([]);
//     setJoinSuccess(false);
//     KeepAwake.deactivate();
//     props.navigation.pop();
//   };

//   //*handleFollow and leave
//   const handleFollowLeave = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);

//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }
//     const params = {
//       expertId: astrologerId,
//       channelId: channelId,
//     };
//     const response = await makeRequest(
//       BASE_URL + 'api/Customer/LiveFollow',
//       params,
//       true,
//       false,
//     );
//     //Alert.alert('', BASE_URL + 'api/Customer/LiveFollow');
//     if (response) {
//       const {success, message} = response;
//       if (success) {
//         await _engine?.leaveChannel();
//         setPeerIds([]);
//         setJoinSuccess(false);
//         KeepAwake.deactivate();
//         props.navigation.pop();
//         Alert.alert(`${message}`);
//       } else {
//         await _engine?.leaveChannel();
//         setPeerIds([]);
//         setJoinSuccess(false);
//         KeepAwake.deactivate();
//         props.navigation.pop();
//         Alert.alert(`${message}`);
//       }
//     }
//   };

//   //*handleProfile
//   const handleProfile = () => {
//     props.navigation.navigate('EditProfile');
//   };

//   //* Call TO Astrologer
//   const handleCallToAstro = async () => {
//     try {
//       const userInfo = await getData(KEYS.USER_DATA);
//       var {name} = userInfo;
//       setIsProcessed(true);
//       setShowCallBalPopup(false);

//       if (name === 'visitor') {
//         Alert.alert(
//           '${name}',
//           'You need to Update Profile first.\nPress Update to Update Profile. !',
//           [
//             {text: 'NO', style: 'cancel'},
//             {
//               text: 'LOGIN',
//               onPress: handleProfile,
//             },
//           ],
//           {
//             cancelable: false,
//           },
//         );
//         return;
//       }

//       const params = {
//         expertId: astrologerId,
//         channelId: channelId,
//       };

//       const response = await makeRequest(
//         BASE_URL + 'api/Customer/callToExpertLive',
//         params,
//         true,
//         false,
//       );

//       if (response && response.success == true) {
//         const {success, message} = response;
//         if (success) {
//           const {output} = response;
//           setConsultationData(output);

//           await _audioCall();

//           setOnCall(true);
//           setIsCall(true);
//           setIsProcessed(false);
//           setShowGrace(false);
//           setShowCallBalPopup(false);
//         }
//       }
//     } catch (e) {
//       console.log('error', e);
//     }
//   };
//   //* call end functionality
//   const endTheCall = async () => {
//     try {
//       const userInfo = await getData(KEYS.USER_DATA);
//       const {payloadId} = userInfo;

//       const call = 3;
//       const {consultationId} = consultationData;

//       const params = {consultationId};
//       const response = await makeRequest(
//         BASE_URL + 'api/Customer/endLiveCall',
//         params,
//         true,
//       );
//       if (response) {
//         const {success, message} = response;
//         if (success) {
//           await init();
//           // await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
//           await receiveCall(channelName, astrologerId, payloadId, call);
//           // await _engine.muteLocalVideoStream(false);
//           setIsCall(false);
//           setOnCall(false);
//           setShowGrace(false);
//           setIsProcessed(false);

//           Alert.alert(`${message}`);
//         } else {
//           console.log(message);
//         }
//       }
//     } catch (e) {}
//   };

//   //* message Value change
//   const onValueChange = msgValue => {
//     setMsgValue(msgValue);
//   };

//   //* send message to firebase
//   const sendMessage = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);

//     if (!userInfo) {
//       var id = Math.random().toFixed(2).toString();
//       var payloadId = id;
//       var name = 'visitor' + `${id}`;
//     } else {
//       var {name, payloadId, userImage} = userInfo;
//     }

//     const base64ImageData = await encodeImageToBase64(userImage);

//     setMsgValue('');

//     var date = Date();
//     let url = `data:image/jpeg;base64,${base64ImageData}`;
//     // let source = 'data:image/jpg;base64,' + base64ImageData;
//     if (msgValue) {
//       send(msgValue, channelName, uid, date, payloadId, name, '', url, '', '')
//         .then(() => {})
//         .catch(err => Alert.alert(err));

//       messageList();
//     } else {
//       messageList();
//       setMsgValue('');
//     }
//   };

//   //* Floating Heart
//   const handleFlotinghearts = async () => {
//     var date = Date();
//     var id = Math.random().toFixed(2);
//     var name = 'visitor' + `${id}`;
//     const heart = true;
//     await send('', channelName, uid, date, id, name, heart, '', '', '');
//     setIsFloat(true);

//     setTimeout(setFloatHeart, 4000);
//   };

//   //*share the astroinfo
//   const fetchReferralInfo = async () => {
//     try {
//       const userInfo = await getData(KEYS.USER_DATA);

//       if (!userInfo) {
//         Alert.alert(
//           'Alert!',
//           'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
//           [
//             {text: 'NO', style: 'cancel'},
//             {
//               text: 'LOGIN',
//               onPress: handleLogin,
//             },
//           ],
//           {
//             cancelable: true,
//           },
//         );
//         return;
//       }
//       let params = null;

//       // calling api
//       const response = await makeRequest(
//         BASE_URL + 'api/Astrologers/LiveShare',
//         params,
//         true,
//         false,
//       );

//       if (response) {
//         const {success} = response;

//         if (success) {
//           const {output} = response;
//           // this.setState({referralInfo: output});
//           // this.handleShare();

//           // const {referralInfo} = this.state;
//           const {shareInfo} = output;
//           const {title, message, image, ForAstroPleasevisitURL, androidUrl} =
//             shareInfo;

//           const {url: url, extension} = image;

//           const base64ImageData = await encodeImageToBase64(url);

//           if (!base64ImageData) {
//             return;
//           }

//           const shareOptions = {
//             title,
//             subject: title,
//             message: `${title}\n${message}\n${ForAstroPleasevisitURL}\n${androidUrl}`,
//             url: `data:image/${extension};base64,${base64ImageData}`,
//           };

//           //* stopping loader
//           // this.setState({showProcessingLoader: false});

//           await Share.open(shareOptions);
//         } else {
//           const {message} = response;
//         }
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   //*Image Encoder
//   const encodeImageToBase64 = async url => {
//     try {
//       const fs = RNFetchBlob.fs;
//       const rnFetchBlob = RNFetchBlob.config({fileCache: true});

//       const downloadedImage = await rnFetchBlob.fetch('GET', url);
//       const imagePath = downloadedImage.path();
//       const encodedImage = await downloadedImage.readFile('base64');
//       await fs.unlink(imagePath);
//       return encodedImage;
//     } catch (error) {
//       return null;
//     }
//   };

//   //* chat message data
//   const renderItem = ({item}) => {
//     const {msg, usName, img} = item;
//     let images = '';
//     let imgGiven = false;
//     if (img === `data:image/jpeg;base64,null`) {
//       images = userImages;
//       imgGiven = true;
//     } else {
//       images = img;
//       imgGiven = false;
//     }
//     return (
//       <View style={styles.chatItem}>
//         <View>
//           {imgGiven ? (
//             <Image source={images} style={styles.avatar} />
//           ) : (
//             <Image source={{uri: images}} style={styles.avatar} />
//           )}

//           {/* <Image
//             source={require('components/assets/ic_heart_pop.gif')}
//             style={styles.avatar}
//           /> */}
//         </View>
//         <View style={styles.messageItem}>
//           <Text style={styles.name}>{usName}</Text>
//           <Text style={styles.content}>{msg}</Text>
//         </View>
//       </View>
//     );
//   };
//   //* for login
//   const handleLogin = () => {
//     props.navigation.navigate('Login');
//   };
//   //* call base Popup
//   const handleCallBalInfo = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }
//     walletBalance();
//     setShowCallBalPopup(true);
//   };
//   const handleCallCheck = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     const {name} = userInfo;

//     const call = 0;
//     const params = {
//       expertId: astrologerId,
//       channelId: channelId,
//     };
//     const response = await makeRequest(
//       BASE_URL + 'api/Customer/checkAstroBusy',
//       params,
//       true,
//       false,
//     );
//     //Alert.alert('', BASE_URL + 'api/Customer/checkAstroBusy');
//     if (response) {
//       const {success, message} = response;
//       if (success) {
//         const {userId} = response;
//         await receiveCall(channelName, astrologerId, name, call);
//       } else {
//         Alert.alert(message);
//         setIsCall(false);
//       }
//     }
//   };
//   //* call base closer
//   const closePopup = () => {
//     setShowCallBalPopup(false);
//   };
//   //* auto Grace Period
//   const autoGrace = () => {
//     setShowGrace(true);
//   };
//   //*Report Popup
//   const handleReportPopup = () => {
//     setShowReportPopup(true);
//   };
//   //*
//   const closeReportPopup = () => {
//     setShowReportPopup(false);
//   };

//   //*show Kundli_Form
//   const handleFormPopup = () => {
//     setShowFormPopup(true);
//   };
//   //*
//   const closeFormPopup = () => {
//     setShowFormPopup(false);
//   };

//   //*GiftItem for astrologer
//   const handleGiftBox = async () => {
//     try {
//       const response = await makeRequest(
//         BASE_URL + 'api/Customer/giftList',
//         null,
//       );
//       if (response) {
//         const {success, message} = response;
//         if (success) {
//           const {giftList} = response;
//           setGiftList(giftList);
//         } else {
//           console.log(message);
//         }
//       }

//       setShowFormPopup(true);
//     } catch (e) {}
//   };

//   //*
//   const closeGiftPopup = () => {
//     setShowFormPopup(false);
//   };

//   const _renderVideos = () => {
//     // liveCounter();
//     return joinSucceed ? _renderRemoteVideos() : null;
//   };

//   const _renderRemoteVideos = () => {
//     return (
//       <View
//         style={styles.remoteContainer}
//         contentContainerStyle={{paddingHorizontal: 2.5}}
//         horizontal={true}>
//         {peerIds.map(value => {
//           return (
//             <RtcRemoteView.SurfaceView style={styles.remote} uid={value} />
//           );
//         })}
//       </View>
//     );
//   };

//   const liveCallData = {live_call_duration, live_call_charges};
//   const liveCnt = peerIdss + 1;
//   return (
//     <View style={styles.max}>
//       <ImageBackground source={background} style={styles.bcgImg}>
//         {_renderVideos()}
//         <View style={styles.buttonStyle}>
//           <TouchableOpacity onPress={startCall} style={styles.profileButton}>
//             <Image source={{uri: image}} style={styles.endIcon} />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.liveCount}>{astrologerName}</Text>
//             <Text style={styles.liveCount}>Live : {liveCnt}</Text>
//           </View>

//           {/* <TouchableOpacity onPress={this.startCall} style={styles.button}>
//               <Image source={ic_startV} style={styles.endIcon} />
//             </TouchableOpacity> */}
//         </View>

//         {/* {this._renderRemoteVideos()}

//         <TouchableOpacity onPress={endCall} style={styles.buttonEnd}>
//           <Image source={endChat} style={styles.endIcon} />
//         </TouchableOpacity>*/}
//         {showGrace ? (
//           <View style={styles.graceDialerContainer}>
//             <View style={styles.DialerContainer}>
//               <Text style={styles.liveCount}>
//                 Your Grace period will end in the next
//               </Text>
//               <CountdownCircleTimer
//                 isPlaying
//                 duration={60}
//                 size={40}
//                 strokeWidth={5}
//                 trailStrokeWidth={6}
//                 onComplete={() => {
//                   endTheCall();
//                 }}
//                 colors={[
//                   ['#F7B801', 0.4],
//                   ['#db9058', 0.2],
//                   ['#bc0f17', 0.4],
//                 ]}>
//                 {({remainingTime, animatedColor}) => (
//                   <Animated.Text
//                     style={{
//                       color: '#fff',
//                       fontSize: wp(3),
//                     }}>
//                     {parseInt(remainingTime / 60, 10)}:
//                     {parseInt(remainingTime % 60, 10)}
//                   </Animated.Text>
//                 )}
//               </CountdownCircleTimer>
//             </View>
//           </View>
//         ) : null}
//         {isCall ? (
//           <View style={styles.callDialerContainer}>
//             <View style={styles.DialerContainer}>
//               <CountdownCircleTimer
//                 isPlaying
//                 duration={live_call_duration * 60}
//                 size={40}
//                 strokeWidth={5}
//                 trailStrokeWidth={6}
//                 onComplete={() => {
//                   autoGrace();
//                 }}
//                 colors={[
//                   ['#F7B801', 0.4],
//                   ['#db9058', 0.2],
//                   ['#bc0f17', 0.4],
//                 ]}>
//                 {({remainingTime, children, animatedColor}) => (
//                   <Animated.Text
//                     style={{
//                       color: '#fff',
//                       fontSize: wp(3),
//                     }}>
//                     {parseInt(remainingTime / 60, 10) % 60}:
//                     {parseInt(remainingTime % 60, 10)}
//                   </Animated.Text>
//                 )}
//               </CountdownCircleTimer>
//               <View style={styles.DialerContainer}>
//                 <Text style={styles.liveCount}>{userName}</Text>
//               </View>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.callContainer21}></View>
//         )}
//         {isGiftGiven ? (
//           <View style={styles.callContainer22}>
//             <View style={styles.DialerContainer}>
//               <Text style={styles.liveCount}>
//                 Guru Dakshina from {giftUser}
//               </Text>
//             </View>
//             <Image source={{uri: giftImg}} style={styles.callIcn3} />
//           </View>
//         ) : null}
//         <View style={styles.floatIconContainer}>
//           {isFloat ? (
//             <Image
//               source={require('../Livecomponents/floatinHeart2.gif')}
//               style={styles.floatIcon}
//             />
//           ) : (
//             <View />
//           )}
//         </View>

//         <TouchableOpacity style={styles.ofrContainer} onPress={handleGiftBox}>
//           <Image
//             source={require('../Livecomponents/assets/ic_offer_l.gif')}
//             style={styles.ofrIcn}
//           />
//         </TouchableOpacity>
//         {isCall ? (
//           <TouchableOpacity style={styles.callContainer} onPress={endTheCall}>
//             <Image
//               source={require('../Livecomponents/assets/cndcall.png')}
//               style={styles.callIcn}
//             />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={styles.callContainer}
//             onPress={handleCallBalInfo}>
//             <Image
//               source={require('../Livecomponents/assets/LiveCall.png')}
//               style={styles.callIcn}
//             />
//             <View style={styles.priceContainer}>
//               <Text style={styles.callPrice}>₹{live_call_charges}</Text>
//               <Text style={styles.textFormat}>{live_call_duration} Mins</Text>
//             </View>
//           </TouchableOpacity>
//         )}

//         <View style={styles.wrapListMessages}>
//           <FlatList
//             data={messages}
//             renderItem={renderItem}
//             inverted
//             showsVerticalScrollIndicator={false}
//           />
//         </View>
//         <View style={styles.chatContainer}>
//           <View style={styles.chatBox}>
//             <TextInput
//               placeholder="Say Namaskar ..."
//               placeholderTextColor="#fff8"
//               style={styles.input}
//               value={msgValue}
//               onChangeText={onValueChange}
//               // secureTextEntry={Platform.OS === 'ios' ? false : true}
//               keyboardType={Platform.OS === 'ios' ? null : 'default'}
//             />
//             <TouchableOpacity onPress={() => sendMessage()}>
//               <Image
//                 source={require('../Livecomponents/assets/send.png')}
//                 style={styles.sndIcon}
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.extContainer}>
//             <TouchableOpacity
//               style={styles.extraIcn}
//               // activeOpacity={1}
//               onPress={handleFlotinghearts}>
//               <Image
//                 source={require('../Livecomponents/assets/ic_heart_pop.gif')}
//                 style={styles.extIcon}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.extraIcn}
//               onPress={fetchReferralInfo}>
//               <Image
//                 source={require('../Livecomponents/assets/ic_shareL.gif')}
//                 style={styles.extIcon}
//               />
//             </TouchableOpacity>
//             {/* <TouchableOpacity style={styles.extraIcn}>
//                 <Image
//                   source={require('../Livecomponents/assets/ic_marketplace.gif')}
//                   style={styles.extIcon}
//                 />
//               </TouchableOpacity> */}
//             <TouchableOpacity
//               style={styles.extraIcn}
//               onPress={handleReportPopup}>
//               <Image
//                 source={require('../Livecomponents/assets/ic_menuL.gif')}
//                 style={styles.extIcon}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//       {showCallBalPopup && (
//         <CallBalancePopup
//           closePopup={closePopup}
//           nav={props.navigation}
//           call={handleCallCheck}
//           liveCharge={liveCallData}
//           Balance={Balance}
//           miniBalance={miniBalance}
//           // closeForm={closeFormPopup}
//         />
//       )}
//       {showReportPopup && (
//         <ReportLive
//           closePopup={closeReportPopup}
//           nav={props.navigation}
//           expertId={astrologerId}
//           channelId={channelId}
//         />
//       )}
//       {showFormPopup && (
//         <SaveKundli
//           data={giftList}
//           closePopup={closeFormPopup}
//           nav={props.navigation}
//           channelName={channelName}
//           expertId={astrologerId}
//           channelId={channelId}
//           Balance={Balance}
//           uid={uid}
//         />
//       )}
//     </View>
//   );
// };
// const mapStateToProps = state => ({
//   isMiniBalance: transactionSelectors.isMiniBalance(state),
//   isWalletBalance: transactionSelectors.isWalletBalance(state),
//   userInfo: userInfoSelectors.getUserInfo(state),
// });

// const mapDispatchToProps = {
//   getWalletBalance: transactionOperations.getWalletBalance,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Viewer_ag);
