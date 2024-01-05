import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import HomeCategoryTile from 'components/HomeCategoryTile';

//api
import {getData, KEYS} from 'api/UserPreference';
import {BASE_URL, makeRequest} from 'api/ApiInfo';

export default class HomeCategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      isLoading: true,
      isProcessing: false,
      userId: null,
      categories: null,
    };
  }

  componentDidMount() {
    this.viewCategoryList();
    //this.selectCategories();
  }

  viewCategoryList = async () => {
    try {
      const data_info = await getData(KEYS.USER_INFO);
      this.setState({isLoading: true});

      if (data_info) {
        const {userId} = data_info;

        const params = {
          userId,
        };

        const response = await makeRequest(
          BASE_URL + 'api/Customer/categories',
          params,
        );
        if (response) {
          const {success} = response;

          this.setState({isLoading: false});
          if (success) {
            const {categories} = response;

            this.setState({listItems: categories});
          }
        }
      } else {
        const response = await makeRequest(
          BASE_URL + 'api/Customer/categories',
        );
        if (response) {
          const {success, message} = response;
          this.setState({isLoading: false});
          if (success) {
            const {categories} = response;
            this.setState({
              listItems: categories,
            });
          } else {
            Alert.alert(message);
          }
        }
      }
    } catch (error) {
      console.error('issue in code in and outline 48');
    }
  };
  /**
  selectCategories = async () => {
    try {
      this.setState({isLoading: true});

      const response = await makeRequest('categories');
      if (response) {
        const {success} = response;
        if (success === true) {
          const {categories} = response;
          //  const {id, name} = response;
          this.setState({listItems: categories});

         // const main = await storeData(response);
 
          // await checkPermission();
        }
      }
      // showToast(message);
    } catch (error) {
      console.log(error.message);
    }
  };
   */
  renderItem = ({item}) => (
    <HomeCategoryTile item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Home"
          nav={this.props.navigation}
          showGradient
        />

        <View style={styles.contentContainer}>
          <FlatList
            data={this.state.listItems}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: wp(1.5),
  },
});
