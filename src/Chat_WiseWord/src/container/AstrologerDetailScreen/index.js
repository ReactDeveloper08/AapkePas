// import React, {Component} from 'react';
// import {
//   Alert,
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// //Responsive Screen
// import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
// import styles from './styles';
// // Components
// import HeaderComponent from 'pages/components/CustomerSideComponents/HeaderComponent';
// import AstroDetailPhotoListComponent from 'pages/components/CustomerSideComponents/AstroDetailPhotoListComponent';
// import AstroSkillListComponent from 'pages/components/CustomerSideComponents/AstroSkillListComponent';
// import AstroExpertiseListComponent from 'pages/components/CustomerSideComponents/AstroExpertiseListComponent';
// import AstroReviewListComponent from 'pages/components/CustomerSideComponents/AstroReviewListComponent';
// import {showToast} from 'pages/components/CustomToast';
// import CustomLoader from 'pages/components/CustomLoader';

// // Styles
// import basicStyles from 'pages/styles/BasicStyles';

// // Material Icons
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// //insta facebook loader
// // import {
// //   FacebookLoader,
// //   InstagramLoader,
// // } from 'react-native-easy-content-loader';

// // Icons
// import ic_star from 'assets/icons/ic_star.png';
// import volume from 'assets/icons/volume.png';
// import ic_live_button from 'assets/icons/ic_live_button.png';

// //popup
// import ChatBalancePopup from './ChatBalancePopup';
// import CallBalancePopup from './CallBalancePopup';
// import ImageViewPopUp from 'pages/screens/CustomerSideScreens/ImageViewPopUp';

// //api
// import {BASE_URL, makeRequest} from 'api/ApiInfo';
// import {KEYS, getData, clearData} from 'api/UserPreference';

// //redux sextion
// import {connect} from 'react-redux';
// import {profileSelectors, profileOperations} from 'reduxPranam/ducks/profile';
// import {
//   astroProfileOperations,
//   astroProfileSelectors,
// } from 'reduxPranam/ducks/astroProfile';
// import {ChatOperations, ChatSelectors} from 'reduxPranam/ducks/chat';
// import {userInfoSelectors} from 'reduxPranam/ducks/userInfo';
// import {nsNavigate} from 'routes/NavigationService';
// //play sound from astrologer Profile
// import SoundPlayer from 'react-native-sound-player';

// class AstrologerDetailScreen extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       astrologerInfo: '',
//       isPlayAudio: false,
//       isSelected: false,
//       contentLoading: true,
//       modalVisible: true,
//       isLoading: true,
//       userDetail: null,
//       follow: '',
//       isListRefreshing: false,
//     };
//   }
//   componentDidMount() {
//     this.showAstrologerDetails();
//     // this.checkChatEnd();
//   }
//   // Remove all the subscriptions when component will unmount
//   componentWillUnmount() {}

//   showAstrologerDetails = async () => {
//     const item = this.props.navigation.getParam('item', null);

//     var {id} = item;

//     // console.log('astro ID', id);
//     const userInfo = await getData(KEYS.USER_DATA);

//     // console.log('}}}====>', userInfo);
//     // const {userInfo} = await this.props;

//     if (userInfo != null) {
//       const {payloadId} = userInfo;
//       const params = {
//         astrologerId: id,
//         payloadId,
//       };

//       await this.props.getAstroProfile(params);
//       if (this.props.isAstroProfileGet) {
//         this.setState({
//           astrologerInfo: this.props.isAstroProfileGet,
//           contentLoading: false,
//           isLoading: false,
//           isListRefreshing: false,
//         });
//       }
//     } else {
//       const params = {
//         astrologerId: id,
//       };

//       await this.props.getAstroProfile(params);
//       if (this.props.isAstroProfileGet) {
//         // console.log('astrologer Info', this.props.isAstroProfileGe);
//         // const {audio} = this.props.isAstroProfileGe;
//         this.setState({
//           astrologerInfo: this.props.isAstroProfileGet,
//           contentLoading: false,
//           isLoading: false,
//           isListRefreshing: false,
//         });
//       }
//     }
//   };
//   handleLogin = () => {
//     this.props.navigation.navigate('Login');
//   };
//   updateTitleStatus = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: this.handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }
//     const item = this.props.navigation.getParam('item', null);
//     const {id} = item;
//     let {follow} = this.state;
//     if (follow == false) {
//       follow = true;
//       this.setState({follow});
//     } else {
//       follow = false;
//       this.setState({follow});
//     }

//     const params = {
//       expertId: id,
//       follow,
//     };
//     await this.props.getFollowAstro(params);
//     if (this.props.isAstroFollow) {
//       this.showAstrologerDetails();
//       showToast(this.props.isAstroFollow);
//     }
//   };

//   handleTokenExpire = async () => {
//     await clearData();
//     nsNavigate('Login');
//   };

//   handleProceedCall = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: this.handleLogin,
//           },
//         ],
//         {
//           cancelable: false,
//         },
//       );
//       return;
//     }
//     const item = this.props.navigation.getParam('item', null);
//     const {id} = item;
//     const params = {
//       expertId: id,
//     };
//     const response = await makeRequest(
//       BASE_URL + 'api/Customer/callToExpert',
//       params,
//       true,
//       false,
//     );
//     //Alert.alert('', BASE_URL + 'api/Customer/callToExpert');
//     if (response) {
//       const {success} = response;
//       if (success) {
//         const {message} = response;
//         showToast(message);
//       } else {
//         const {isAuthTokenExpired} = response;
//         if (isAuthTokenExpired === true) {
//           Alert.alert(
//             'Wise Word',
//             'Your Session Has Been Expired \n Login Again to Continue!',
//             [
//               {
//                 text: 'OK',
//               },
//             ],
//             {
//               cancelable: false,
//             },
//           );
//           this.handleTokenExpire();
//           return;
//         }

//         this.setState({follow: false});
//       }
//     }
//   };

//   handlePost = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: this.handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }

//     const item = this.props.navigation.getParam('item', null);
//     const {id} = item;

//     this.props.navigation.navigate('AstroPost', {id});
//   };

//   badgesImg = ({item}) => {
//     const {badgeImage, title} = item;

//     return (
//       <View style={styles.VerifiedContainer}>
//         <Image
//           source={{uri: badgeImage}}
//           resizeMode="cover"
//           style={styles.verifiedIcon}
//         />
//         <Text style={{fontSize: wp(2.5)}}>{title}</Text>
//       </View>
//     );
//   };

//   listItem = ({item}) => (
//     <AstroDetailPhotoListComponent
//       item={item}
//       nav={this.props.navigation}
//       onPhoto={this.handlePhotosInfo}
//     />
//   );
//   skillItem = ({item}) => (
//     <AstroSkillListComponent item={item} nav={this.props.navigation} />
//   );
//   expertiseItem = ({item}) => (
//     <AstroExpertiseListComponent item={item} nav={this.props.navigation} />
//   );
//   reviewItem = ({item}) => (
//     <AstroReviewListComponent item={item} nav={this.props.navigation} />
//   );

//   keyExtractor = (item, index) => index.toString();

//   itemSeparator = () => <View style={styles.separator} />;
//   reviewSeparator = () => <View style={styles.reviewSeparator} />;

//   handlePhotosInfo = () => {
//     this.setState({showWalletPopup: true});
//   };

//   closeImagePopup = () => {
//     this.setState({showWalletPopup: false});
//   };

//   handleChatBalInfo = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     // const {name} = this.state.userDetail;

//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: this.handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }
//     // if (name === 'Name') {
//     //   Alert.alert(
//     //     'Wise Word!',
//     //     'Please update your profile first',
//     //     [
//     //       {text: 'No', style: 'cancel'},
//     //       {text: 'Update', onPress: this.navigateToProfile},
//     //     ],
//     //     {
//     //       cancelable: false,
//     //     },
//     //   );
//     //   return;
//     // }
//     this.setState({showChatBalPopup: true});
//   };

//   navigateToProfile = () => {
//     this.props.navigation.navigate('Me');
//   };

//   closeChatPopup = () => {
//     this.setState({showChatBalPopup: false});
//   };
//   handleCallBalInfo = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     if (!userInfo) {
//       Alert.alert(
//         'Alert!',
//         'You need to Login first.\nPress LOGIN to continue. !',
//         [
//           {text: 'NO', style: 'cancel'},
//           {
//             text: 'LOGIN',
//             onPress: this.handleLogin,
//           },
//         ],
//         {
//           cancelable: true,
//         },
//       );
//       return;
//     }

//     this.setState({showCallBalPopup: true});
//   };
//   closePopup = () => {
//     this.setState({showCallBalPopup: false});
//   };
//   handleListRefresh = async () => {
//     try {
//       // pull-to-refresh
//       this.setState({isListRefreshing: true});

//       // updating list
//       await this.componentDidMount();
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   handleWatchNow = async () => {
//     const userInfo = await getData(KEYS.USER_DATA);
//     // let userInfo = null;
//     if (userInfo) {
//       var {name} = userInfo;
//       var payloadId = name;
//     } else {
//       var payloadId = 'Visitor';
//     }
//     // this.props.nav.navigate('Live');
//     this.props.navigation.navigate('LiveStream', {payloadId});
//   };

//   playAudioFile = () => {
//     try {
//       // console.log('play audio File');
//       this.setState({isPlayAudio: true});
//       setTimeout(this.stopSound, 10000);
//     } catch (e) {
//       console.log(`cannot play the sound file`, e);
//     }
//   };
//   stopSound = () => {
//     const {audio} = this.state.astrologerInfo;
//     // SoundPlayer.playUrl(audio);
//     // SoundPlayer.play();
//     SoundPlayer.resume(audio);
//     setTimeout(this.PauseAudio, 10000);
//   };
//   PauseAudio = () => {
//     try {
//       // const {audio} = this.state.astrologerInfo;
//       // console.log('stop audio File');
//       SoundPlayer.stop();
//       this.setState({isPlayAudio: false});
//     } catch (e) {
//       console.log(`cannot play the sound file`, e);
//     }
//   };

//   render() {
//     if (this.state.isLoading) {
//       return <CustomLoader />;
//     }
//     const {
//       name,
//       mobile,
//       experience,
//       skills,
//       expertises,
//       languages,
//       charges,
//       rating,
//       followers,
//       served,
//       description,
//       reviews,
//       location,
//       follow,
//       badges,
//       profileImage,
//       image,
//       audio,
//       isBusy,
//       liveCallCharges,
//       isChatButtonDisabled,
//       isCallButtonDisabled,
//       actualCallCharges,
//       discountCallCharges,
//       actualChatCharges,
//       discountChatCharges,
//       isLive,
//       isCallAvailable,
//       isChatAvailable,
//       totalRatings,
//     } = this.state.astrologerInfo;

//     const item = this.props.navigation.getParam('item', null);
//     const {id} = item;
//     const chatRequest = this.props.isChatRequest;
//     return (
//       <SafeAreaView style={[basicStyles.container]}>
//         <View style={[basicStyles.mainContainer, basicStyles.offWhiteBgColor]}>
//           <HeaderComponent
//             nav={this.props.navigation}
//             headerTitle="Astrologer Detail"
//           />
//           {/* {this.state.contentLoading === true ? (
//             <View>
//               <FacebookLoader active loading={this.state.contentLoading} />
//               <FacebookLoader active loading={this.state.contentLoading} />
//               <FacebookLoader active loading={this.state.contentLoading} />
//               <FacebookLoader active loading={this.state.contentLoading} />
//               <FacebookLoader active loading={this.state.contentLoading} />
//             </View>
//           ) : ( */}
//           <ScrollView
//             style={basicStyles.mainContainer} // refreshControl={
//             refreshControl={
//               <RefreshControl
//                 refreshing={this.state.isListRefreshing}
//                 onRefresh={this.handleListRefresh}
//               />
//             }>
//             <LinearGradient
//               colors={['#ff9933', '#fd6c33', '#fd6c33']}
//               style={styles.linearGradient}>
//               <View style={styles.astroInfoContainer}>
//                 <Image
//                   source={{uri: profileImage}}
//                   resizeMode="cover"
//                   style={styles.astroPhoto}
//                 />
//                 <View style={basicStyles.flexOne}>
//                   <Text style={styles.astroName}>{name}</Text>
//                   <View
//                     style={[
//                       basicStyles.directionRow,
//                       basicStyles.justifyBetween,
//                     ]}>
//                     <View style={basicStyles.flexOne}>
//                       <Text
//                         style={[
//                           basicStyles.text,
//                           basicStyles.whiteColor,
//                           basicStyles.flexOne,
//                         ]}>
//                         {languages}
//                       </Text>
//                       {this.state.isPlayAudio === true ? (
//                         <TouchableOpacity onPress={this.PauseAudio}>
//                           <View
//                             style={{
//                               backgroundColor: '#bc0f1780',
//                               paddingVertical: wp(0.5),
//                               paddingHorizontal: wp(2),
//                               width: wp(20),
//                               borderRadius: wp(4),
//                               alignItems: 'center',
//                               flexDirection: 'row',
//                             }}>
//                             <Image
//                               source={require('assets/icons/stopAudio.png')}
//                               resizeMode="cover"
//                               style={{
//                                 width: wp(3.5),
//                                 height: wp(3.5),
//                                 marginRight: wp(1),
//                               }}
//                             />
//                             <MaterialIcons
//                               name="graphic-eq"
//                               color="#fff"
//                               size={14}
//                               style={styles.iconRow}
//                             />
//                             <MaterialIcons
//                               name="graphic-eq"
//                               color="#fff"
//                               size={14}
//                               style={styles.iconRow}
//                             />
//                           </View>
//                         </TouchableOpacity>
//                       ) : (
//                         <TouchableOpacity onPress={this.playAudioFile}>
//                           <View
//                             style={{
//                               backgroundColor: '#bc0f1780',
//                               paddingVertical: wp(0.5),
//                               paddingHorizontal: wp(2),
//                               width: wp(20),
//                               borderRadius: wp(4),
//                               alignItems: 'center',
//                               flexDirection: 'row',
//                             }}>
//                             <Image
//                               source={volume}
//                               resizeMode="cover"
//                               style={{
//                                 width: wp(3.5),
//                                 height: wp(3.5),
//                                 marginRight: wp(1),
//                               }}
//                             />
//                             <MaterialIcons
//                               name="graphic-eq"
//                               color="#fff"
//                               size={14}
//                               style={styles.iconRow}
//                             />
//                             <MaterialIcons
//                               name="graphic-eq"
//                               color="#fff"
//                               size={14}
//                               style={styles.iconRow}
//                             />
//                           </View>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                     <View
//                       style={[basicStyles.directionRow, basicStyles.marginTop]}>
//                       <TouchableOpacity
//                         underlayColor="#DFE1E3"
//                         onPress={this.updateTitleStatus}>
//                         {follow === true ? (
//                           <View style={styles.followouter}>
//                             <Text style={{color: '#fd6c33', fontSize: 12}}>
//                               Following
//                             </Text>
//                           </View>
//                         ) : (
//                           <View style={styles.unfollowouter}>
//                             <Text style={{color: '#fff', fontSize: 12}}>
//                               Follow
//                             </Text>
//                           </View>
//                         )}
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.postButton}
//                         onPress={this.handlePost}
//                         underlayColor="#ffffff80">
//                         <Text
//                           style={[basicStyles.heading, basicStyles.whiteColor]}>
//                           Posts
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </LinearGradient>

//             <View style={styles.infoContainer}>
//               <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
//                 <Text style={styles.value}>{rating}</Text>
//                 <Text style={basicStyles.text}>Ratings</Text>
//               </View>
//               <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
//                 <Text style={styles.value}>{followers}</Text>
//                 <Text style={basicStyles.text}>Followers</Text>
//               </View>
//               <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
//                 <Text style={styles.value}>{experience}</Text>
//                 <Text style={basicStyles.text}>Exp. (Years)</Text>
//               </View>
//               <View style={[basicStyles.flexOne, basicStyles.alignCenter]}>
//                 <Text style={styles.value}>{served}</Text>
//                 <Text style={basicStyles.text}>Served</Text>
//               </View>
//             </View>

//             <View
//               style={[
//                 basicStyles.directionRow,
//                 basicStyles.justifyBetween,
//                 basicStyles.alignCenter,
//                 basicStyles.paddingHorizontal,
//               ]}>
//               <View style={basicStyles.flexOne}>
//                 <Text style={styles.headings}>Pricing</Text>
//                 <View
//                   style={[basicStyles.directionRow, basicStyles.alignCenter]}>
//                   <View
//                     style={[
//                       basicStyles.directionRow,
//                       basicStyles.alignCenter,
//                       basicStyles.marginRight,
//                     ]}>
//                     <Image
//                       style={[basicStyles.iconRow]}
//                       source={require('assets/icons/telephone.png')}
//                     />
//                     {discountCallCharges ? (
//                       <Text style={styles.ChatPrice}>
//                         : ₹ {discountCallCharges}
//                       </Text>
//                     ) : (
//                       <Text style={styles.ChatPrice}>
//                         : ₹ {actualCallCharges}
//                       </Text>
//                     )}
//                   </View>
//                   <View
//                     style={[
//                       basicStyles.directionRow,
//                       basicStyles.alignCenter,
//                       basicStyles.marginRight,
//                     ]}>
//                     <Image
//                       style={[basicStyles.iconRow]}
//                       source={require('assets/icons/chat.png')}
//                     />
//                     {discountChatCharges ? (
//                       <Text style={styles.ChatPrice}>
//                         : ₹ {discountChatCharges}
//                       </Text>
//                     ) : (
//                       <Text style={styles.ChatPrice}>
//                         : ₹ {actualChatCharges}
//                       </Text>
//                     )}
//                   </View>
//                   <View
//                     style={[
//                       basicStyles.directionRow,
//                       basicStyles.alignCenter,
//                       basicStyles.marginRight,
//                     ]}>
//                     <Image
//                       style={[basicStyles.iconRow]}
//                       source={require('assets/icons/live.png')}
//                     />
//                     {liveCallCharges ? (
//                       <Text style={styles.ChatPrice}>
//                         : ₹ {liveCallCharges}
//                       </Text>
//                     ) : null}
//                   </View>
//                 </View>
//               </View>
//               <View style={{alignSelf: 'flex-end'}}>
//                 <FlatList
//                   data={badges}
//                   renderItem={this.badgesImg}
//                   keyExtractor={this.keyExtractor}
//                   showsHorizontalScrollIndicator={false}
//                   horizontal={true}
//                   ItemSeparatorComponent={this.itemSeparator}
//                   contentContainerStyle={styles.listContainer}
//                 />
//               </View>
//             </View>

//             <View style={basicStyles.separatorHorizontal} />

//             <View style={[basicStyles.padding]}>
//               <Text style={[styles.headings]}>Skills</Text>
//               <FlatList
//                 data={skills}
//                 renderItem={this.skillItem}
//                 keyExtractor={this.keyExtractor}
//                 showsHorizontalScrollIndicator={false}
//                 horizontal={true}
//                 ItemSeparatorComponent={this.itemSeparator}
//                 contentContainerStyle={styles.listContainer}
//               />
//             </View>

//             {expertises ? (
//               <View style={[basicStyles.padding]}>
//                 <View style={basicStyles.separatorHorizontal} />
//                 <Text style={[styles.headings]}>Expertise</Text>
//                 <FlatList
//                   data={expertises}
//                   renderItem={this.expertiseItem}
//                   keyExtractor={this.keyExtractor}
//                   showsHorizontalScrollIndicator={false}
//                   horizontal={true}
//                   ItemSeparatorComponent={this.itemSeparator}
//                   contentContainerStyle={styles.listContainer}
//                 />
//               </View>
//             ) : (
//               <View />
//             )}
//             {image ? (
//               <View style={[basicStyles.paddingHorizontal]}>
//                 <View style={basicStyles.separatorHorizontal} />
//                 <TouchableOpacity onPress={this.handlePhotosInfo}>
//                   <Text style={[styles.headings]}>Photos</Text>
//                 </TouchableOpacity>
//                 <FlatList
//                   data={image}
//                   renderItem={this.listItem}
//                   keyExtractor={this.keyExtractor}
//                   showsHorizontalScrollIndicator={false}
//                   horizontal={true}
//                   ItemSeparatorComponent={this.itemSeparator}
//                   contentContainerStyle={styles.listContainer}
//                 />
//               </View>
//             ) : (
//               <View />
//             )}
//             <View style={basicStyles.separatorHorizontal} />
//             {description ? (
//               <View style={[basicStyles.paddingHorizontal]}>
//                 <Text style={[styles.headings]}>Description</Text>
//                 <Text style={basicStyles.text}>{description}</Text>
//               </View>
//             ) : null}

//             <View style={basicStyles.separatorHorizontal} />
//             {reviews ? (
//               <View style={[basicStyles.paddingHorizontal]}>
//                 <Text style={[styles.headings]}>Reviews</Text>
//                 <View
//                   style={[
//                     basicStyles.directionRow,
//                     basicStyles.alignCenter,
//                     basicStyles.marginBottom,
//                   ]}>
//                   <Image
//                     source={ic_star}
//                     resizeMode="cover"
//                     style={basicStyles.iconRow}
//                   />
//                   <Text style={basicStyles.heading}>{rating} </Text>
//                   <Text style={basicStyles.text}>({totalRatings} Ratings)</Text>
//                 </View>

//                 <FlatList
//                   data={reviews}
//                   renderItem={this.reviewItem}
//                   keyExtractor={this.keyExtractor}
//                   showsVerticalScrollIndicator={false}
//                   ItemSeparatorComponent={this.reviewSeparator}
//                   contentContainerStyle={{padding: wp(2)}}
//                 />
//               </View>
//             ) : (
//               <View />
//             )}
//           </ScrollView>
//           {!isBusy ? (
//             <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
//               {isChatButtonDisabled == false ? (
//                 isLive ? (
//                   <TouchableOpacity
//                     style={[
//                       basicStyles.flexOne,
//                       styles.liveButton,
//                       basicStyles.justifyCenter,
//                     ]}
//                     onPress={this.handleWatchNow}
//                     // onPress={() => {
//                     //   this.props.navigation.navigate('StartChat');
//                     // }}
//                   >
//                     <View
//                       style={[
//                         basicStyles.directionRow,
//                         basicStyles.alignCenter,
//                         basicStyles.justifyCenter,
//                       ]}>
//                       <Fontisto
//                         name="livestream"
//                         color="#fff"
//                         size={18}
//                         style={styles.iconRow}
//                       />
//                       <Text
//                         style={[basicStyles.heading, basicStyles.whiteColor]}>
//                         Astrologer is Live Watch Now
//                       </Text>
//                     </View>
//                   </TouchableOpacity>
//                 ) : isChatAvailable ? (
//                   <TouchableOpacity
//                     style={[
//                       basicStyles.flexOne,
//                       styles.chatButton,
//                       basicStyles.justifyCenter,
//                     ]}
//                     onPress={this.handleChatBalInfo}
//                     // onPress={() => {
//                     //   this.props.navigation.navigate('StartChat');
//                     // }}
//                   >
//                     <View
//                       style={[
//                         basicStyles.directionRow,
//                         basicStyles.alignCenter,
//                         basicStyles.justifyCenter,
//                       ]}>
//                       <MaterialCommunityIcons
//                         name="chat-processing-outline"
//                         color="#fff"
//                         size={18}
//                         style={styles.iconRow}
//                       />
//                       <Text
//                         style={[basicStyles.heading, basicStyles.whiteColor]}>
//                         Chat
//                       </Text>
//                     </View>
//                     {discountChatCharges ? (
//                       <View
//                         style={[
//                           basicStyles.directionRow,
//                           basicStyles.justifyCenter,
//                         ]}>
//                         <Text style={styles.oldPrice}>
//                           ₹ {actualChatCharges}
//                         </Text>
//                         <Text style={styles.newPrice}>
//                           ₹ {discountChatCharges}
//                         </Text>
//                       </View>
//                     ) : (
//                       <View
//                         style={[
//                           basicStyles.directionRow,
//                           basicStyles.justifyCenter,
//                         ]}>
//                         {/* <Text style={styles.oldPrice}>₹ {actualChatCharges}</Text> */}
//                         <Text style={styles.newPrice}>
//                           ₹ {actualChatCharges}
//                         </Text>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 ) : (
//                   <View />
//                 )
//               ) : (
//                 <View />
//               )}
//               {isCallButtonDisabled == false ? (
//                 isLive ? null : isCallAvailable ? (
//                   <TouchableOpacity
//                     style={[
//                       basicStyles.flexOne,
//                       styles.callButton,
//                       basicStyles.justifyCenter,
//                     ]}
//                     onPress={this.handleCallBalInfo}
//                     // onPress={this.handleProceedCall}
//                   >
//                     <View
//                       style={[
//                         basicStyles.directionRow,
//                         basicStyles.alignCenter,
//                         basicStyles.justifyCenter,
//                       ]}>
//                       <Feather
//                         name="phone-call"
//                         color="#fff"
//                         size={18}
//                         style={styles.iconRow}
//                       />
//                       <Text
//                         style={[basicStyles.heading, basicStyles.whiteColor]}>
//                         Call
//                       </Text>
//                     </View>
//                     {discountCallCharges ? (
//                       <View
//                         style={[
//                           basicStyles.directionRow,
//                           basicStyles.justifyCenter,
//                         ]}>
//                         <Text style={styles.oldPrice}>
//                           ₹ {actualCallCharges}
//                         </Text>
//                         <Text style={styles.newPrice}>
//                           ₹ {discountCallCharges}
//                         </Text>
//                       </View>
//                     ) : (
//                       <View
//                         style={[
//                           basicStyles.directionRow,
//                           basicStyles.justifyCenter,
//                         ]}>
//                         {/* <Text style={styles.oldPrice}>₹ {actualCallCharges}</Text> */}
//                         <Text style={styles.newPrice}>
//                           ₹ {actualCallCharges}
//                         </Text>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 ) : (
//                   <View />
//                 )
//               ) : null}
//             </View>
//           ) : (
//             <View style={styles.busyButton}>
//               <Image
//                 source={ic_live_button}
//                 resizeMode="cover"
//                 style={basicStyles.iconRow}
//               />
//               <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
//                 Busy
//               </Text>
//             </View>
//           )}
//         </View>

//         {this.state.showWalletPopup && (
//           <ImageViewPopUp
//             closePopup={this.closeImagePopup}
//             nav={this.props.navigation}
//             image={image}
//           />
//         )}

//         {this.state.showChatBalPopup && (
//           <ChatBalancePopup
//             closePopup={this.closeChatPopup}
//             nav={this.props.navigation}
//             image={image}
//             chat={chatRequest}
//             id={id}
//             guestUserId={mobile}
//             guestName={name}
//             guestImg={profileImage}
//             actualChatCharges={actualChatCharges}
//             discountChatCharges={discountChatCharges}
//           />
//         )}
//         {this.state.showCallBalPopup && (
//           <CallBalancePopup
//             closePopup={this.closePopup}
//             nav={this.props.navigation}
//             image={image}
//             guestImg={profileImage}
//             id={id}
//             actualCallCharges={actualCallCharges}
//             discountCallCharges={discountCallCharges}
//           />
//         )}
//       </SafeAreaView>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   isAstroProfileGet: astroProfileSelectors.isAstroProfileGet(state),
//   isAstroFollow: astroProfileSelectors.isAstroFollow(state),
//   isChatRequest: ChatSelectors.isChatRequest(state),
//   isProfile: profileSelectors.isProfile(state),
//   userInfo: userInfoSelectors.getUserInfo(state),
// });

// const mapDispatchToProps = {
//   getAstroProfile: astroProfileOperations.getAstroProfile,
//   getFollowAstro: astroProfileOperations.getFollowAstro,
//   chatRequest: ChatOperations.chatRequest,
//   profile: profileOperations.profile,
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(AstrologerDetailScreen);
