import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import ExploreListComponent from 'components/ExploreListComponent';
import HeaderComponents from 'components/HeaderComponents';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class HomeExploreScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = ({item}) => (
    <ExploreListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.exploreContainer}>
          <HeaderComponents nav={this.props.navigation} headerTitle="Post" />
          <FlatList
            data={this.state.listData}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            //   horizontal={true}
            // numColumns="4"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  exploreContainer: {
    backgroundColor: '#fffcd5',
    flex: 1,
  },
  listContainer: {
    padding: wp(3),
  },
});
