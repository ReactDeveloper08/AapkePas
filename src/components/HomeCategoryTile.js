import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
const componentName = props => {
  const {id} = props.item;
  const handleExperts = () => {
    props.nav.push('ExpertsList', {info: {id}});
  };

  return (
    <Touchable
      style={styles.tileContainer}
      onPress={handleExperts}
      underlayColor="#f2f1f1">
      <View style={styles.tileContent}>
        <Text style={styles.title}>{props.item.name}</Text>
        {/* <Text style={styles.title}>{props.item.title}</Text> */}
        <View style={styles.textGroup}>
          <Image
            source={{uri: props.item.icon}}
            resizeMode="cover"
            style={styles.titleIcon}
          />
          <Text style={styles.detail}>
            {props.item.title}8 busters to keep Anxiety and Stress to Bay
          </Text>
          {/* <Text style={styles.detail}>{props.item.name}</Text> */}
        </View>
      </View>
    </Touchable>
  );
};

export default componentName;

const styles = StyleSheet.create({
  tileContainer: {
    width: wp(45.5),
    minHeight: hp(16),
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: wp(2),
    margin: wp(1.5),
    elevation: 8,
  },
  tileContent: {
    flex: 1,
    justifyContent: 'center',
  },
  textGroup: {
    justifyContent: 'center',
    alignContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: wp(3),
    fontWeight: '700',
    //justifyContent: 'space-evenly',
    marginBottom: hp(1),
  },
  detail: {
    fontSize: wp(2.5),
    flex: 1,
    paddingLeft: wp(1.5),
    textAlignVertical: 'center',
    justifyContent: 'space-evenly',
  },
  titleIcon: {
    width: wp(10),
    aspectRatio: 1 / 1,
    alignSelf: 'flex-end',
  },
});
