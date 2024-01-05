import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import {Card, CardItem, Left, Right, Body, Thumbnail} from 'native-base';
import styles from './styles';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import live from 'assets/images/liveChat.png';

import basicStyles from 'styles/BasicStyles';
import {widthPercentageToDP} from 'react-native-responsive-screen';
// debounce keys
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const ShowUsers = ({name, img, onImgTap, onNameTap}) => {
  return (
    <Card style={styles.cardStyle}>
      <CardItem style={styles.cardItemStyle}>
        <Touchable style={[styles.logoContainer]} onPress={onNameTap}>
          {/* {img ? (
              <Thumbnail source={{uri: img}} resizeMode="cover" />
            ) : (
              <Thumbnail source={astro_img} resizeMode="cover" />
            )} */}
          {/* <Text style={styles.thumbnailName}>{name.charAt(0)}</Text> */}
          <View style={[basicStyles.justifyCenter]}></View>
        </Touchable>

        <Touchable onPress={onNameTap} style={styles.messageContainer}>
          <Text
            style={[
              basicStyles.heading,
              basicStyles.blackColor,
              basicStyles.textCenter,
              basicStyles.paddingHalfTop,
            ]}
            onPress={onNameTap}>
            {name}
          </Text>
          <Text style={styles.profileName} onPress={onNameTap}>
            Live Chat Session
          </Text>
        </Touchable>
        <Touchable onPress={onNameTap}>
          <Image
            source={live}
            style={{width: wp(10), height: wp(10)}}
            // resizeMode="cover"
          />
        </Touchable>
      </CardItem>
    </Card>
  );
};

export default ShowUsers;
