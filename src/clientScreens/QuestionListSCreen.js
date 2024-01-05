import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderComponent from 'components/HeaderComponent';
import QuestionListComponent from 'components/QuestionListComponent';
import ProcessingLoader from 'components/ProcessingLoader';
import {showToast} from 'components/CustomToast';

//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';

// Styles
import basicStyles from 'styles/BasicStyles';

export default class FAQScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      questions: '',
      isLoading: true,
    };
  }
  componentDidMount() {
    this.showFaq();
  }
  showFaq = async () => {
    const id = this.props.navigation.getParam('id', null);

    const params = {categoryId: id};
    const response = await makeRequest(
      BASE_URL + 'api/Customer/faqQuestion',
      params,
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {questions} = response;
        this.setState({questions, message, isLoading: false});
      } else {
        this.setState({questions: null, message, isLoading: false});
        showToast(message);
      }
    }
  };
  listItem = ({item}) => (
    <QuestionListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="FAQ"
          nav={this.props.navigation}
          navAction="back"
        />
        <View style={basicStyles.mainContainer}>
          <FlatList
            data={this.state.questions}
            renderItem={this.listItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            // numColumns={2}
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
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(3),
  },
});
