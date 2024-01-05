import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_next_white from 'assets/icons/ic_next_white.png';

const ExpertQuestionList = props => {
  const {id} = props.item;
  const handleExperts = () => {
    props.nav.push('ExpertsList', {info: {id}});
  };

  return (
    <View style={styles.tileContent}>
      <Image source={{uri: props.item.icon}} style={styles.listIcon} />
      <Text style={styles.title}>{props.item.name}</Text>

      <TouchableOpacity
        style={styles.tileButton}
        onPress={handleExperts}
        underlayColor="#ff688680">
        <Image
          source={ic_next_white}
          resizeMode="cover"
          style={styles.titleIcon}
        />
      </TouchableOpacity>
    </View>
  );
};
export default ExpertQuestionList;

const styles = StyleSheet.create({
  tileContent: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    padding: wp(2),
    margin: wp(1.5),
    elevation: 8,
  },
  textGroup: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  listIcon: {
    width: wp(7),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  title_id: {
    flex: 1,
    fontSize: wp(3),
    fontWeight: '700',
    marginBottom: hp(1),
  },
  title: {
    flex: 1,
    fontSize: wp(3),
    fontWeight: '700',
    marginBottom: hp(1),
  },
  tileButton: {
    backgroundColor: '#ff6886',
    paddingVertical: wp(1),
    paddingHorizontal: wp(3),
    borderRadius: 5,
  },
  titleIcon: {
    height: wp(3.5),
    aspectRatio: 1 / 1,
  },
});
