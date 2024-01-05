import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import styles from './styles';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import live from 'assets/images/liveChat.png';

import basicStyles from 'styles/BasicStyles';
// import {widthPercentageToDP} from 'react-native-responsive-screen';
const ShowUsers = ({name, img, onImgTap, onNameTap}, navigation) => {
  return (
    <Card style={styles.cardStyle}>
      <CardItem style={styles.cardItemStyle}>
        <TouchableOpacity style={[styles.logoContainer]} onPress={onNameTap}>
          {/* {img ? (
              <Thumbnail source={{uri: img}} resizeMode="cover" />
            ) : (
              <Thumbnail source={astro_img} resizeMode="cover" />
            )} */}
          {/* <Text style={styles.thumbnailName}>{name.charAt(0)}</Text> */}
          <View style={[basicStyles.justifyCenter]}>
            {/* <Image
              source={astro_img}
              resizeMode="cover"
              style={styles.listImage}
            /> */}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNameTap} style={styles.messageContainer}>
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
        </TouchableOpacity>
        <TouchableOpacity onPress={onNameTap}>
          <Image
            source={live}
            style={{width: wp(10), height: wp(10)}}
            // resizeMode="cover"
          />
        </TouchableOpacity>
      </CardItem>
    </Card>
  );
};

export default ShowUsers;
