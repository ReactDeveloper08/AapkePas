import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
// import astrologerImage2 from 'assets/images/astrologerImage2.jpg';
import ic_star from 'assets/icons/ic_star.png';

import basicStyles from 'styles/BasicStyles';

const liveSessionList = props => {
  const handleLiveSessions = () => {};
  return (
    <TouchableOpacity onPress={handleLiveSessions} style={styles.tileContainer}>
      <ImageBackground
        // source={astrologerImage2}
        resizeMode="cover"
        style={styles.tileImage}>
        <View style={styles.tileContent}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyEnd,
              styles.reviewText,
            ]}>
            <Image
              source={ic_star}
              resizeMode="cover"
              style={styles.reviewIcon}
            />
            <Text style={styles.title}>4.5</Text>
          </View>
          <Text style={styles.charge}>₹ 99 / 7 Mins</Text>
          <Text style={styles.title}>Mahabhagya yog by Anil ji</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default liveSessionList;

const styles = StyleSheet.create({
  tileContainer: {
    width: wp(49),
    // flexDirection: 'row',
    paddingHorizontal: wp(1.5),
    borderRadius: 5,
  },

  tileImage: {
    width: '100%',
    aspectRatio: 1 / 1.1,
    borderRadius: 5,
  },
  tileContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.3)',
    // borderWidth: 1,
    // borderColor: 'red',
    padding: wp(2),
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // flexDirection: 'column',
  },
  charge: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#fd6c33',
    alignSelf: 'flex-start',
    paddingVertical: wp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
  },
  title: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  reviewIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(1.5),
  },
  reviewText: {
    marginBottom: 'auto',
  },
});
