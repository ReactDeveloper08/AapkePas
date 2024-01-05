import React, {
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  Alert,
  Text,
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//api calling
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
import CustomLoader from 'components/CustomLoader';
// Styles
import basicStyles from 'styles/BasicStyles';

//chatList PureComponent
import ChatListComponent from '../AstrologerDetailScreen/ChatListComponent';
import get from 'lodash/get';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ImagePicker from 'react-native-image-picker';
import {Profile, ShowUsers, StickyHeader} from '../../component';
// import firebase from '../../firebase/config';
import {color} from '../../utility';
import {Store} from '../../context/store';
// import {LOADING_STOP, LOADING_START} from '../../context/actions/type';
import {smallDeviceHeight} from '../../utility/constants';
import {setAsyncStorage, keys} from '../../asyncStorage';
import {clearAsyncStorage} from '../../asyncStorage';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {
  UpdateUser,
  LogOutUser,
  LoginRequest,
  SignUpRequest,
  AddUser,
} from '../../../../Chat_WiseWord/src/network';
import {setUniqueValue, keyboardVerticalOffset} from '../../utility/constants';

//main code for chat and AutoLogin and signup
export default ({route, navigation}) => {
  // const globalState = useContext(Store);
  // const {dispatchLoaderAction} = globalState;

  //api dataCalling
  const [isLoading, setLoading] = useState(false);
  const [isListRefreshing, setIsListRefreshing] = useState(false);
  const [InfoUsr, setInfoUsr] = useState('');
  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });
  const [getScrollPosition, setScrollPosition] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineAstro, setOnlineAstro] = useState([]);
  const [uuid, setuuid] = useState('');
  // const {profileImg, name} = userDetail;

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <SimpleLineIcons
      //     name="logout"
      //     size={26}
      //     color={color.WHITE}
      //     style={{right: 10}}
      //     onPress={() =>
      //       Alert.alert(
      //         'Logout',
      //         'Are you sure to log out',
      //         [
      //           {
      //             text: 'Yes',
      //             onPress: () => logout(),
      //           },
      //           {
      //             text: 'No',
      //           },
      //         ],
      //         {cancelable: false},
      //       )
      //     }
      //   />
      // ),
    });
  }, [navigation]);

  useEffect(() => {
    // Info();
    showLiveForChat();
  }, [navigation]);

  //chaeck user Info
  const Info = async () => {
    const userInfo = await getData(KEYS.USER_DATA, null);
    const {mobile} = userInfo;
    setuuid(mobile);
    setInfoUsr(userInfo);
    if (uuid !== null) {
      // showUser();
      onLoginPress();
    }
  };

  //after login or Signup user can check active user for chat
  // const showUser = async () => {
  //   const userInfo = await getData(KEYS.USER_DATA, null);
  //   const {mobile, payloadId} = userInfo;
  //   const uuid = mobile;

  //   dispatchLoaderAction({
  //     type: LOADING_START,
  //   });
  //   try {
  //     firebase
  //       .database()
  //       .ref('users')
  //       .on('value', dataSnapshot => {
  //         let users = [];
  //         let currentUser = {
  //           id: '',
  //           name: '',
  //           profileImg: '',
  //         };

  //         dataSnapshot.forEach(child => {
  //           if (uuid === child.val().uuid) {
  //             currentUser.id = uuid;
  //             currentUser.name = child.val().name;
  //             currentUser.profileImg = child.val().profileImg;
  //           } else {
  //             users.push({
  //               id: child.val().uuid,
  //               name: child.val().name,
  //               profileImg: child.val().profileImg,
  //             });
  //           }
  //         });
  //         setUserDetail(currentUser);
  //         setAllUsers(users);

  //         setIsListRefreshing(false);
  //         dispatchLoaderAction({
  //           type: LOADING_STOP,
  //         });
  //       });
  //   } catch (error) {
  //     alert(error);
  //     dispatchLoaderAction({
  //       type: LOADING_STOP,
  //     });
  //   }
  // };

  //Auto Login User For Chat
  const onLoginPress = async () => {
    const userData = get(route, 'params.userData', '');

    const {name, dob, birthTime, birthPlace} = userData;
    const userInfo = await getData(KEYS.USER_DATA, null);
    const {mobile} = userInfo;
    setuuid(mobile);

    const email = mobile + '@pranamguruji.com';
    const password = mobile;

    if (!email) {
      Alert.alert('Email is required');
    } else if (!password) {
      Alert.alert('Password is required');
    } else {
      // dispatchLoaderAction({
      //   type: LOADING_START,
      // });

      LoginRequest(email, password)
        .then(res => {
          const {user, code, message} = res;
          if (user) {
            if (!res.additionalUserInfo) {
              // dispatchLoaderAction({
              //   type: LOADING_STOP,
              // });
              Alert.alert(res);

              return;
            }
            setAsyncStorage(keys.uuid, res.user.uid);
            setUniqueValue(res.user.uid);

            navigation.navigate('Live Chat');
            // dispatchLoaderAction({
            //   type: LOADING_STOP,
            // });
            // setInitialState();
          } else {
            // Alert.alert(message, code);

            // dispatchLoaderAction({
            //   type: LOADING_START,
            // });
            SignUpRequest(email, password).then(res => {
              if (!res.additionalUserInfo) {
                // dispatchLoaderAction({
                //   type: LOADING_STOP,
                // });
                alert(res);
                return;
              }
              let uid = mobile;
              // let uid = firebase.auth().currentUser.uid;
              let profileImg = '';
              AddUser(name, email, uid, profileImg, dob, birthTime, birthPlace)
                .then(() => {
                  setAsyncStorage(keys.uuid, uid);
                  setUniqueValue(uid);
                  // dispatchLoaderAction({
                  //   type: LOADING_STOP,
                  // });
                  navigation.replace('Live Chat');
                })
                .catch(err => {
                  // dispatchLoaderAction({
                  //   type: LOADING_STOP,
                  // });
                  alert(err);
                });
            });
          }
        })
        .catch(res => {
          // dispatchLoaderAction({
          //   type: LOADING_STOP,
          // });

          Alert.alert(res);
        });
    }
  };

  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // Base 64 image:
        let source = 'data:image/jpeg;base64,' + response.data;
        // dispatchLoaderAction({
        //   type: LOADING_START,
        // });
        UpdateUser(uuid, source)
          .then(() => {
            setUserDetail({
              ...userDetail,
              profileImg: source,
            });
            // dispatchLoaderAction({
            //   type: LOADING_STOP,
            // });
          })
          .catch(() => {
            alert(err);
            // dispatchLoaderAction({
            //   type: LOADING_STOP,
            // });
          });
      }
    });
  };
  // * LOG OUT
  const logout = () => {
    LogOutUser()
      .then(() => {
        clearAsyncStorage()
          .then(() => {
            navigation.replace('Login');
          })
          .catch(err => console.log(err));
      })
      .catch(err => alert(err));
  };

  // * ON IMAGE TAP
  const imgTap = (profileImg, name) => {
    if (!profileImg) {
      navigation.navigate('ShowFullImg', {
        name,
        imgText: name.charAt(0),
      });
    } else {
      navigation.navigate('ShowFullImg', {name, img: profileImg});
    }
  };

  // * ON NAME TAP
  const nameTap = (profileImg, name, guestUserId) => {
    if (!profileImg) {
      navigation.navigate('Chat', {
        name,
        imgText: name.charAt(0),
        guestUserId,
        currentUserId: uuid,
      });
    } else {
      navigation.navigate('Chat', {
        name,
        img: profileImg,
        guestUserId,
        currentUserId: uuid,
      });
    }
  };
  // * GET OPACITY

  const getOpacity = () => {
    if (deviceHeight < smallDeviceHeight) {
      return deviceHeight / 4;
    } else {
      return deviceHeight / 6;
    }
  };

  const showLiveForChat = async () => {
    setLoading(true);
    const response = await makeRequest(
      BASE_URL + 'api/Customer/onlineAstrologers',
      null,
    );
    if (response) {
      const {success, message} = response;
      setLoading(false);
      if (success) {
        const {astrologers} = response;
        setOnlineAstro(astrologers);
        setIsListRefreshing(false);
      } else {
        setOnlineAstro(null);
        setLoading(false);
        setIsListRefreshing(false);
      }
    }
  };

  const listItem = ({item}) => (
    <ChatListComponent
      item={item}
      nav={navigation}
      onNameTap={() => nameTap(item.image, item.name, item.mobile)}
      currentUserId={uuid}
    />
  );

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => <View style={styles.separator} />;
  const handleLogin = () => {
    nsNavigate('Login');
  };
  const handleListRefresh = async () => {
    try {
      // pull-to-refresh
      setIsListRefreshing(true);

      // updating list
      showLiveForChat();
    } catch (error) {
      console.log(error.message);
    }
  };

  let majorView = false;
  if (isLoading) {
    return <CustomLoader />;
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fffcd5'}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isListRefreshing}
            onRefresh={handleListRefresh}
          />
        }>
        {/* {getScrollPosition > getOpacity() && (
          <StickyHeader
            name={name}
            img={profileImg}
            onImgTap={() => imgTap(profileImg, name)}
          />
        )} */}

        {/* ALL USERS */}
        {InfoUsr ? (
          <View>
            {majorView ? (
              <FlatList
                alwaysBounceVertical={false}
                data={allUsers}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{padding: wp(3)}}
                onScroll={event =>
                  setScrollPosition(event.nativeEvent.contentOffset.y)
                }
                ListHeaderComponent={
                  <View
                    style={{
                      opacity:
                        getScrollPosition < getOpacity()
                          ? (getOpacity() - getScrollPosition) / 100
                          : 0,
                    }}></View>
                }
                renderItem={({item}) => (
                  <ShowUsers
                    name={item.name}
                    img={item.profileImg}
                    onImgTap={() => imgTap(item.profileImg, item.name)}
                    onNameTap={() =>
                      nameTap(item.profileImg, item.name, item.id)
                    }
                  />
                )}
              />
            ) : (
              <View></View>
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: wp(2),
              margin: wp(2),
              elevation: 8,
            }}>
            <Text style={{fontSize: wp(3.5), fontWeight: '700'}}>
              Please SignIn For Full Profile
            </Text>
            <Text
              style={{fontSize: wp(3.5), fontWeight: '700', color: 'green'}}
              onPress={handleLogin}>
              Login
            </Text>
          </View>
        )}
        <View style={[basicStyles.mainContainer, basicStyles.padding]}>
          <Text style={styles.listHeading}>Recommended</Text>

          <FlatList
            data={onlineAstro}
            renderItem={listItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={itemSeparator}
            contentContainerStyle={styles.listContainer}
            // refreshing={state.isListRefreshing}
            // onRefresh={handleListRefresh}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  separator: {
    height: wp(2),
  },
  listHeading: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(2),
  },
});
