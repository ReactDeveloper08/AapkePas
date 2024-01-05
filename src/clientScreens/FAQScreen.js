import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
// Components

import HeaderComponent from 'components/HeaderComponent';
import FaqTileComponent from 'components/FaqTileComponent';
import ProcessingLoader from 'components/ProcessingLoader';

// Styles
import basicStyles from 'styles/BasicStyles';
//api calling
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {showToast} from 'components/CustomToast';

export default class FAQScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categories: '',
      isLoading: true,
    };
  }
  componentDidMount() {
    this.showFAQ();
  }
  showFAQ = async () => {
    const params = null;
    const response = await makeRequest(
      BASE_URL + 'api/Customer/faqCategories',
      params,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {categories} = response;
        this.setState({categories, isLoading: false});
      } else {
        this.setState({categories: null, message, isLoading: false});
        showToast(message);
      }
    }
  };

  listItem = ({item}) => (
    <FaqTileComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="FAQ"
          navAction="back"
        />

        <View style={basicStyles.mainContainer}>
          <FlatList
            data={this.state.categories}
            renderItem={this.listItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </View>
        {this.state.isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(1),
  },
});
