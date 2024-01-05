import React, {Fragment, useEffect} from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {globalStyle, color} from '../../utility';
import {nsPop} from 'routes/NavigationService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import get from 'lodash/get';
export default ({route, navigation}) => {
  if (route) {
    var {params} = route;
  } else {
    var params = get(navigation, 'state.params', '');
  }
  const {name, img, imgText} = params;
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: <Text>{name}</Text>,
  //   });
  // }, [navigation]);
  return (
    <Fragment>
      <View style={styles.headerContainer}>
        <TouchableOpacity underlayColor="transparent" onPress={() => nsPop()}>
          <Ionicons
            name="arrow-back-sharp"
            color="#333"
            size={26}
            style={styles.iconRow}
          />
        </TouchableOpacity>
        <Text style={styles.headerSubTitle}> {name} </Text>
      </View>
      {img ? (
        <Image
          source={{uri: img}}
          style={[globalStyle.flex1]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            globalStyle.containerCentered,
            {backgroundColor: color.BLACK},
          ]}>
          <Text style={styles.text}>{imgText}</Text>
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  text: {color: color.WHITE, fontSize: 200, fontWeight: 'bold'},
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f1f1',
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    position: 'relative',
    zIndex: 9999999,
  },
  headerSubTitle: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginLeft: wp(2),
  },
  headerSub: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#333',
  },
});
