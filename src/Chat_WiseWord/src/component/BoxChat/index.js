import React from 'react';
import {View, Text, Image} from 'react-native';
import {CardItem} from 'native-base';
import {deviceWidth} from '../../utility/styleHelper/appStyle';
// import {uuid} from '../../utility/constants';
import styles from './styles';
import {color} from '../../utility';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const BoxChat = ({userId, msg, img, onImgTap, uuid, timer}) => {
  console.log('🚀 ~ file: index.js:14 ~ BoxChat ~ img:', img);

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
  return (
    <View
      transparent
      style={{
        maxWidth: deviceWidth / 1.5 + 10,
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      }}>
      <View
        style={[
          styles.chatContainer,
          isCurrentUser && {
            borderRadius: 20,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 20,
            backgroundColor: '#ff417b20',
          },
        ]}>
        {/* {isCurrentUser ? (
          <View style={[styles.arrowLeft]} />
        ) : (
          <View style={[styles.arrowRight]} />
        )} */}
        {img ? (
          // <CardItem
          //   style={{
          //     height: 200,
          //     width: 200,
          //     borderRadius: 15,
          //     justifyContent: 'center',
          //     // elevation: '0',
          //   }}>
          <TouchableOpacity onPress={onImgTap}>
            <Image
              source={{uri: img}}
              resizeMode="cover"
              style={{
                height: 200,
                width: 200,
                borderRadius: 15,
              }}
            />
          </TouchableOpacity>
        ) : (
          // </CardItem>
          <Text style={[styles.chatTxt, isCurrentUser && {color: '#333'}]}>
            {msg}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.dateTxt,
          {fontSize: wp(2.2)},
          isCurrentUser && {
            color: color.BLACK,
            textAlign: 'right',
            fontSize: wp(2.2),
            marginTop: wp(1),
          },
        ]}>
        {strTime}
      </Text>
    </View>
  );
};

export default BoxChat;

// import React from 'react';
// import {View, Text, Image} from 'react-native';
// import {Card, CardItem} from 'native-base';
// import {deviceWidth} from '../../utility/styleHelper/appStyle';
// // import {uuid} from '../../utility/constants';
// import styles from './styles';
// import {color} from '../../utility';
// import {TouchableOpacity} from 'react-native-gesture-handler';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// const BoxChat = ({userId, msg, img, onImgTap, uuid, timer}) => {
//   let theDate = new Date(timer);
//   var data = theDate.toDateString();
//   var hours = theDate.getHours();
//   var minutes = theDate.getMinutes();
//   var ampm = hours >= 12 ? 'Pm' : 'Am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0' + minutes : minutes;
//   var strTime = data + ' ' + hours + ':' + minutes + ' ' + ampm;
//   let isCurrentUser = userId === uuid ? true : false;
//   return (
//     <Card
//       transparent
//       style={{
//         maxWidth: deviceWidth / 1.5 + 10,
//         alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
//       }}>
//       <View
//         style={[
//           styles.chatContainer,
//           isCurrentUser && {
//             borderRadius: 10,
//             borderTopRightRadius: 0,
//             borderTopLeftRadius: 10,
//             backgroundColor: '#bc0f17',
//             elevation: 8,
//           },
//         ]}>
//         {isCurrentUser ? (
//           <View style={[styles.arrowLeft]} />
//         ) : (
//           <View style={[styles.arrowRight]} />
//         )}
//         {img ? (
//           <CardItem
//             style={{
//               height: 200,
//               width: 200,
//               borderRadius: 15,
//               justifyContent: 'center',
//             }}>
//             <TouchableOpacity onPress={onImgTap}>
//               <Image
//                 source={{uri: img}}
//                 resizeMode="cover"
//                 style={{
//                   height: 200,
//                   width: 200,
//                   borderRadius: 15,
//                 }}
//               />
//             </TouchableOpacity>
//           </CardItem>
//         ) : (
//           <Text style={[styles.chatTxt, isCurrentUser && {color: color.WHITE}]}>
//             {msg}
//           </Text>
//         )}
//       </View>
//       <Text
//         style={[
//           styles.dateTxt,
//           {fontSize: wp(2.2)},
//           isCurrentUser && {
//             color: color.BLACK,
//             textAlign: 'right',
//             fontSize: wp(2.2),
//           },
//         ]}>
//         {strTime}
//       </Text>
//     </Card>
//   );
// };

// export default BoxChat;
