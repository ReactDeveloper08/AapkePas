import React, {useState} from 'react';
import {View, Text, Image, Pressable, Alert} from 'react-native';
import {CardItem} from 'native-base';
import {deviceWidth} from '../../utility/styleHelper/appStyle';
// import {uuid} from '../../utility/constants';
import styles from './styles';
// import {color} from '../../utility';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ChatBox = ({userId, msg, img, onImgTap, uuid, block, typing, timer}) => {
  let theDate = new Date(timer);
  var data = theDate.toDateString();
  var hours = theDate.getHours();
  var minutes = theDate.getMinutes();
  var ampm = hours >= 12 ? 'Pm' : 'Am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = data + ' ' + hours + ':' + minutes + ' ' + ampm;
  let isCurrentUser = userId === uuid ? true : false;
  const [timesPressed, setTimesPressed] = useState(0);
  return (
    <View
      transparent
      style={{
        maxWidth: deviceWidth / 1.2 + 10,
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={[
          styles.chatContainer,
          isCurrentUser && {
            borderRadius: 10,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 10,
            backgroundColor: '#9cdbfe',
            // elevation: 8,
          },
        ]}>
        {isCurrentUser ? (
          <View style={[styles.arrowLeft]} />
        ) : (
          <View style={[styles.arrowRight]} />
        )}

        {img ? (
          // <CardItem
          //   style={{
          //     height: 200,
          //     width: 200,
          //     borderRadius: 15,
          //     justifyContent: 'center',
          //   }}>
          <TouchableOpacity onPress={onImgTap}>
            <Image
              source={{uri: img}}
              resizeMode="cover"
              style={{
                height: 200,
                width: 200,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        ) : (
          // </CardItem>
          <View>
            {isCurrentUser ? (
              <View>
                <Text
                  style={[styles.chatTxt, isCurrentUser && {color: '#fff'}]}>
                  {msg}
                </Text>
              </View>
            ) : (
              <Pressable
                delayLongPress={150}
                onLongPress={() => {
                  Alert.alert(
                    `Are you sure`,
                    `if you press yes user are blocked`,
                    [
                      {
                        text: 'yes',
                        onPress: () => block(),
                      },
                    ],
                    {cancelable: true},
                  );
                }}>
                {({pressed}) => (
                  <Text
                    style={[styles.chatTxt, isCurrentUser && {color: '#333'}]}>
                    {msg}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        )}
      </View>
      <Text
        style={[
          styles.dateTxt,
          isCurrentUser && {color: '#333', textAlign: 'right'},
        ]}>
        {strTime}
      </Text>
    </View>
  );
};

export default ChatBox;
