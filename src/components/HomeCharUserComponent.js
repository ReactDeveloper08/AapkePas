import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// Vector Icons
import Entypo from 'react-native-vector-icons/Entypo';

const UserChat = props => {
  const handleChat = () => {
    props.nav.navigate('StartChat', null);
  };
  const {item} = props;
  return (
    <TouchableOpacity
      onPress={handleChat}
      underlayColor="#ffffff80"
      style={[basicStyles.lightBackgroundColor, styles.messageTab]}>
      <View style={basicStyles.directionRow}>
        <Entypo
          name="dot-single"
          color="green"
          size={36}
          style={styles.imgChat}
        />
        <Image
          source={{uri: item.image}}
          resizeMode="cover"
          style={styles.chatImage}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  messageTab: {
    width: wp(13.33),
    borderRadius: wp(6.66),
  },
  chatImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: wp(6.66),
  },
  icon: {
    position: 'absolute',
    zIndex: 9,
    right: -12,
    top: -12,
  },
  imgChat: {
    position: 'absolute',
    zIndex: 9,
    top: -10,
    right: -10,
  },
});

export default UserChat;
