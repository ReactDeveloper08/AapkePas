import React, {PureComponent} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

//Responsive Screen
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// Components
import HeaderComponents from 'components/HeaderComponents';
import LiveListComponent from 'components/LiveListComponent';
import LiveSessionListComponent from 'components/LiveSessionListComponent';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class LiveScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          title: 'Item 1',
          text: 'Text 1',
        },
        {
          title: 'Item 2',
          text: 'Text 2',
        },
        {
          title: 'Item 3',
          text: 'Text 3',
        },
        {
          title: 'Item 4',
          text: 'Text 4',
        },
        {
          title: 'Item 5',
          text: 'Text 5',
        },
        {
          title: 'Item 5',
          text: 'Text 5',
        },
      ],
    };
  }

  listItem = ({item}) => (
    <LiveListComponent item={item} nav={this.props.navigation} />
  );

  SessionItem = ({item}) => (
    <LiveSessionListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={basicStyles.container}>
        <HeaderComponents nav={this.props.navigation} headerTitle="Live" />
        <ScrollView style={[basicStyles.mainContainer]}>
          <Text
            style={[
              styles.listHeading,
              basicStyles.paddingHorizontal,
              basicStyles.paddingTop,
            ]}>
            Live Session
          </Text>

          <FlatList
            data={this.state.listData}
            renderItem={this.SessionItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />

          <Text
            style={[
              styles.listHeading,
              basicStyles.paddingHorizontal,
              basicStyles.paddingTop,
            ]}>
            Today
          </Text>

          <FlatList
            data={this.state.listData}
            renderItem={this.listItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={basicStyles.padding}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: wp(3),
  },
  listHeading: {
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: wp(2),
  },
  listContainer: {
    padding: wp(1.5),
  },
});
