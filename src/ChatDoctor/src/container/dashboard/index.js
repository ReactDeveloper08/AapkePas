import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
//Responsive Screen
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
//api calling
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';
import {nsNavigate} from 'routes/NavigationService';
// Styles
import basicStyles from 'styles/BasicStyles';
//loader
import ProcessingLoader from 'components/ProcessingLoader';
//chatList PureComponent
import ChatListComponent from '../AstrologerDetailChat/ChatListComponent';

import ImagePicker from 'react-native-image-picker';

import {smallDeviceHeight} from '../../utility/constants';

import {clearAsyncStorage} from '../../asyncStorage';
import {deviceHeight} from '../../utility/styleHelper/appStyle';
import {UpdateUser, LogOutUser} from '../../network';

//main code for chat and autologin and signup
export default ({navigation}) => {
  // const globalState = useContext(Store);
  // const {dispatchLoaderAction} = globalState;

  //api data calling
  const [isLoading, setLoading] = useState(false);
  const [isListRefreshing, setIsListRefreshing] = useState(false);
  const [InfoUsr, setInfoUsr] = useState('');
  const [pendingChats, setpendingChats] = useState([]);
  const [userDetail, setUserDetail] = useState({
    id: '',
    name: '',
    profileImg: '',
  });
  const [apiMessage, setMessage] = useState('');
  const [uuid, setuuid] = useState('');
  // const [getScrollPosition, setScrollPosition] = useState(0);
  // const [allUsers, setAllUsers] = useState([]);
  // const [astrologers, setastrologers] = useState([]);
  // const {profileImg, name} = userDetail;

  useEffect(() => {
    Info();
    showUser();
  }, []);

  //chaeck user Info
  const Info = async () => {
    const userInfo = await getData(KEYS.USER_INFO, null);
    const {userId} = userInfo;

    setInfoUsr(userInfo);
    setuuid(userId);
    if (uuid !== null) {
      // showAstrologerDetails();
      // onLoginPress();
      showUser();
    }
  };

  //after login or Signup user can check active user for chat
  const showUser = async () => {
    setLoading(true);
    const userInfo = await getData(KEYS.USER_INFO, null);
    const {mobile} = userInfo;
    const uuid = mobile;

    // dispatchLoaderAction({
    //   type: LOADING_START,
    // });
    try {
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/chatRequest',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message} = response;
        if (success) {
          const {pendingChats} = response;
          setpendingChats(pendingChats);
          setIsListRefreshing(false);
          setLoading(false);
          // dispatchLoaderAction({
          //   type: LOADING_STOP,
          // });
        } else {
          setMessage(message);
          setpendingChats(null);
          setIsListRefreshing(false);
          setLoading(false);
        }
      }
    } catch (error) {
      alert(error);
      // dispatchLoaderAction({
      //   type: LOADING_STOP,
      // });
    }
  };

  //camera
  const selectPhotoTapped = () => {
    const options = {
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
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
          .catch(err => {
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
  const nameTap = (
    profileImg,
    name,
    guestUserId,
    dob,
    time,
    date,
    userId,
    consultationId,
    email,
  ) => {
    var now = new Date();
    if (!profileImg) {
      navigation.navigate('Missed Chat', {
        name,
        imgText: name.charAt(0),
        guestUserId: userId,
        currentUserId: uuid,
        dob,
        time,
        date,
        userId,
        consultationId,
        now,
        email,
      });
    } else {
      navigation.navigate('Missed Chat', {
        name,
        img: profileImg,
        guestUserId: userId,
        currentUserId: uuid,
        dob,
        time,
        date,
        userId,
        now,
        consultationId,
        email,
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

  const listItem = ({item}) => (
    <ChatListComponent
      item={item}
      nav={navigation}
      onNameTap={() =>
        nameTap(
          item.image,
          item.userName,
          item.userMobile,
          item.dob,
          item.birthTime,
          item.birthPlace,
          item.userId,
          item.consultationId,
          item.userMobile,
        )
      }
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
      showUser();
    } catch (error) {
      console.log(error.message);
    }
  };
  let majorView = false;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={isListRefreshing}
            onRefresh={handleListRefresh}
          />
        }>
        {pendingChats ? (
          <View style={[basicStyles.mainContainer]}>
            <FlatList
              data={pendingChats}
              renderItem={listItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={itemSeparator}
              contentContainerStyle={styles.listContainer}
              // refreshing={state.isListRefreshing}
              // onRefresh={handleListRefresh}
            />
          </View>
        ) : (
          <View style={[styles.textContainer]}>
            <Text style={styles.textMessage}>{apiMessage}</Text>
          </View>
        )}
      </ScrollView>
      {isLoading && <ProcessingLoader />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  separator: {
    height: wp(3),
  },
  listHeading: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  textMessage: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
});
