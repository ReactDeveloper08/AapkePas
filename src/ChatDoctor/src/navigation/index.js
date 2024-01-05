import * as React from 'react';
import {View, Button, Image, TouchableOpacity, Pressable} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {nsPop, nsNavigate} from 'routes/NavigationService';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import left from "assets/icons/left-arrow.png";
import {
  Login,
  SignUp,
  Dashboard,
  Splash,
  ShowFullImg,
  Chat,
  CallConfirmScreen,
  chatHistory,
  callHistory,
  MissedChat,
} from '../container';
// import AstrologerDetailScreen from '../container/AstrologerDetailChat/AstrologerDetailChat';
import {color} from '../utility';

const Stack = createStackNavigator();

function NavContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            flexDirection: 'row',
            backgroundColor: '#9ddaff',
            height: hp(10),
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: wp(2),
            position: 'relative',
            zIndex: 9999999,
          },
          headerTitleStyle: {
            fontSize: wp(3.2),
            fontWeight: '700',
            color: '#fff',
            flex: 1,
            marginLeft: wp(-5),
          },
          headerTintColor: color.WHITE,
        }}>
        {/* <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        /> */}
        {/* <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerBackTitle: null }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerBackTitle: null }}
        /> */}
        <Stack.Screen
          name="Chats"
          component={Dashboard}
          options={{
            headerLeft: () => (
              <Pressable onPress={() => nsPop()} style={{paddingLeft: wp(3)}}>
                <Ionicons name="arrow-back-sharp" color="#fff" size={26} />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="ShowFullImg"
          component={ShowFullImg}
          options={{
            headerBackTitle: null,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerBackTitle: null,
          }}
        />
        <Stack.Screen
          name="CallConfirm"
          component={CallConfirmScreen}
          options={{
            headerBackTitle: null,
          }}
        />
        <Stack.Screen
          name="chatHistory"
          component={chatHistory}
          options={{
            headerBackTitle: null,
          }}
        />
        <Stack.Screen
          name="callHistory"
          component={callHistory}
          options={{
            headerBackTitle: null,
          }}
        />
        <Stack.Screen
          name="Missed Chat"
          component={MissedChat}
          options={{
            headerBackTitle: null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavContainer;
