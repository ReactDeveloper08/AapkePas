// import React, {PureComponent} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ImageBackground,
// } from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import allset from 'assets/icons/allset.png';

// import popupBg from 'assets/images/popupBg.png';

// import styles from './styles';

// import CountDown from 'react-native-countdown-component';

// class EditTemplatePopup extends PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       time: '',
//       timer: null,
//       counter: 3.0,
//       vendorCode:
//         'Thankyou for following hop to see you again. So come and lets solve your problems.',
//     };
//     this.parentView = null;
//   }
//   // backAction = () => {
//   //   Alert.alert('Wise Word!', 'Are you sure you want to go back?', [
//   //     {
//   //       text: 'Cancel',
//   //       onPress: () => null,
//   //       style: 'cancel',
//   //     },
//   //     {text: 'YES', onPress: () => BackHandler.exitApp()},
//   //   ]);
//   //   return true;
//   // };

//   // componentDidMount() {
//   //   this.backHandler = BackHandler.addEventListener(
//   //     'hardwareBackPress',
//   //     this.backAction,
//   //   );
//   // }

//   componentWillUnmount() {
//     // this.backHandler.remove();
//     clearInterval(this.state.timer);
//   }
//   startTimer = () => {
//     let timer = setInterval(this.manageTimer, 1000);
//     this.setState({timer});
//   };
//   manageTimer = () => {
//     var states = this.state;

//     if (states.counter === 0) {
//       alert('Times Up !\nTimer  is reset');
//       clearInterval(this.state.timer);
//       this.setState({
//         counter: 3.0,
//       });
//     } else {
//       this.setState({
//         counter: this.state.counter - 0.01,
//       });
//     }
//   };

//   setViewRef = ref => {
//     this.parentView = ref;
//   };

//   handleStartShouldSetResponder = event => {
//     if (this.parentView._nativeTag === event.target._nativeTag) {
//       this.props.quitPopup();
//     }
//   };

//   handleApply = () => {
//     this.props.quitPopup();
//   };

//   handleCodeChange = vendorCode => {
//     this.setState({vendorCode});
//   };

//   //   handleShortcut = () => {
//   //     this.props.nav.navigate('ShortCut');
//   //   };

//   //   handleBlockList = () => {
//   //     this.props.nav.navigate('BlockList');
//   //   };

//   handleBack = () => {
//     this.props.navigation.popToTop();
//   };

//   render() {
//     const {image} = this.props;
//     const accept = this.props.navigation.getParam('accept');
//     const guestImg = this.props.navigation.getParam('guestImg', null);
//     if (image != null) {
//       var obj = image.map(key => ({url: key.image}));
//     }

//     return (
//       <ImageBackground
//         source={popupBg}
//         resizeMode="cover"
//         style={styles.screenContainer2}>
//         <View style={styles.popupContainer2}>
//           {/* <TouchableOpacity onPress={this.handleBack} style={styles.close}>
//             <AntDesign
//               name="closecircle"
//               color="#fff"
//               size={22}
//               style={styles.iconRow}
//             />
//           </TouchableOpacity> */}
//           <View style={styles.mainContent}>
//             <Image
//               source={allset}
//               resizeMode="cover"
//               style={styles.allSetIcon}
//             />
//             <Text
//               style={{
//                 fontWeight: '700',
//                 marginTop: wp(3),
//                 textAlign: 'center',
//               }}>
//               All Set
//             </Text>
//             <View style={styles.listContainerMain2}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   marginBottom: wp(2),
//                 }}>
//                 {/* <Image
//                   source={astrologerImage}
//                   resizeMode="center"
//                   style={styles.astroImage}
//                 />
//                 <Image source={line} resizeMode="center" style={styles.line} /> */}
//                 <Image
//                   source={{uri: guestImg}}
//                   resizeMode="center"
//                   style={styles.astroImage}
//                 />
//               </View>
//               {accept !== 1 ? (
//                 <Text style={{textAlign: 'center', marginBottom: wp(2)}}>
//                   You will received a call from the astrologer Astro
//                 </Text>
//               ) : (
//                 <Text style={{textAlign: 'center', marginBottom: wp(2)}}>
//                   You will received a chat from the astrologer Astro
//                 </Text>
//               )}

//               <Text style={{fontSize: wp(4), marginTop: wp(2)}}>Within</Text>
//               {/* <Text
//                 style={{fontSize: wp(5), marginTop: wp(0), fontWeight: '700'}}>
//                 {this.state.counter}
//               </Text> */}
//               <CountDown
//                 until={60 * 3}
//                 size={15}
//                 onChange={time => this.setState({time})}
//                 onFinish={() => this.props.navigation.pop()}
//                 digitStyle={{backgroundColor: '#FFF'}}
//                 digitTxtStyle={{color: '#c0c0c0'}}
//                 timeToShow={['M', 'S']}
//                 timeLabels={{m: null, s: null}}
//               />
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: '#fd6c33',
//                   paddingHorizontal: wp(4),
//                   paddingVertical: wp(1.5),
//                   marginVertical: wp(3),
//                 }}>
//                 <Text style={{color: '#fff'}}>Don't be away!</Text>
//               </TouchableOpacity>
//             </View>
//             {accept !== 1 ? (
//               <Text
//                 style={{
//                   textAlign: 'center',
//                   fontSize: wp(3.5),
//                   marginBottom: wp(3),
//                   marginTop: wp(3),
//                 }}>
//                 You won't be charged if you're not connected. Please place a new
//                 order if either if you missed the call. Enjoy!
//               </Text>
//             ) : (
//               <Text
//                 style={{
//                   textAlign: 'center',
//                   fontSize: wp(3.5),
//                   marginBottom: wp(3),
//                   marginTop: wp(3),
//                 }}>
//                 You won't be charged if you're not connected. Please place a new
//                 order if either if you missed the chat. Enjoy!
//               </Text>
//             )}

//             <TouchableOpacity
//               style={styles.popupButton}
//               onPress={this.handleBack}>
//               {/* <MaterialCommunityIcons
//                 name="chat-processing-outline"
//                 color="#fffdc5"
//                 size={18}
//                 style={styles.iconRow}
//               /> */}
//               <Text style={styles.popupButtonText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     );
//   }
// }

// export default EditTemplatePopup;
