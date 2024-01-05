import React from 'react';
import {FlatList} from 'react-native';

const Flatlist_Hoc = Children => {
  return <FlatList {...Children} />;
};

export default Flatlist_Hoc;
