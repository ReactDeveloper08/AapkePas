import React, {Component} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import ExpertsQuestionComponent from 'components/ExpertsQuestionComponent';

//api
import {KEYS, getData} from 'api/UserPreference';
import CustomLoader from 'components/ProcessingLoader';
//redux
import {connect} from 'react-redux';
import {
  expertDetailOperations,
  expertDetailSelectors,
} from '../Redux/wiseword/expertDetail';

class ExpertsQuestionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: '',
      isLoading: true,
      name: '',
      id: '',
    };
  }

  componentDidMount() {
    this.viewExpertQuestion();
  }

  viewExpertQuestion = async () => {
    try {
      const data_info = await getData(KEYS.USER_INFO);
      // this.setState({isLoading: true});

      if (data_info) {
        const {userId} = data_info;
        var params = {
          userId,
        };
      } else {
        var params = null;
      }
      await this.props.getExpertCategories(params);
      if (this.props.isExpertCategories) {
        this.setState({
          listItems: this.props.isExpertCategories,
          isLoading: false,
        });
      } else {
        this.setState({
          listItems: null,
          message: 'No Data Found',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Issue in Get Categories in Redux ');
    }
  };

  renderItem = ({item}) => (
    <ExpertsQuestionComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          showGradient
          headerTitle="Experts"
          nav={this.props.navigation}
        />
        {this.state.listItems ? (
          <View style={styles.contentContainer}>
            <FlatList
              data={this.state.listItems}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <View style={styles.contentContainer} />
        )}

        <FooterComponent nav={this.props.navigation} />
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isExpertCategories: expertDetailSelectors.isExpertCategories(state),
});

const mapDispatchToProps = {
  getExpertCategories: expertDetailOperations.getExpertCategories,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpertsQuestionsScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  contentContainer: {
    flex: 1,
    elevation: 5,
  },
  listContainer: {
    padding: wp(1.5),
  },
});
