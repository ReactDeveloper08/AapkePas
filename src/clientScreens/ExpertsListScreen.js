import React, {Component} from 'react';
import {View, StyleSheet, FlatList, TextInput, Image, Text} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from 'components/HeaderComponent';
import ExpertsListComponent from 'components/ExpertsListComponent';
import ProcessingLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {KEYS, getData} from 'api/UserPreference';

// Icons
import ic_search from 'assets/icons/ic_search.png';

//redux
import {connect} from 'react-redux';
import {
  expertDetailOperations,
  expertDetailSelectors,
} from '../Redux/wiseword/expertDetail';
class ExpertsListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experts: '',
      isLoading: false,
      isListRefreshing: false,
      usersList: '',
      message: '',
      keyword: '',
      currency: '',
    };
  }

  componentDidMount() {
    this.expertListScreen();
  }

  handleDisplayExpertScreen = async () => {};

  expertListScreen = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const currency = await getData(KEYS.NEW_CURRENCY);
      const info = this.props.navigation.getParam('info', null);

      if (info) {
        var {id} = info;
        console.log('infoooo', info);
        this.setState({isLoading: true});
        if (userInfo) {
          const {userId} = userInfo;
          var params = {
            userId,
            categoryId: id,
          };
        } else {
          var params = {
            categoryId: id,
          };
        }
        await this.props.getExpertList(params);
        if (this.props.isExpertList) {
          const {success} = this.props.isExpertList;
          if (success) {
            const {output} = this.props.isExpertList;
            this.experts = output.astrologers;
            this.setState({
              experts: output.astrologers,
              isListRefreshing: false,
              isLoading: false,
              currency,
            });
          } else {
            this.setState({
              experts: '',
              message: 'No Expert Found',
              currency,
              isListRefreshing: false,
              isLoading: false,
            });
          }
        } else {
          this.setState({
            experts: '',
            message: 'No Expert Found',
            currency,
            isListRefreshing: false,
            isLoading: false,
          });
        }
      } else {
        const filData = this.props.navigation.getParam('filData', null);
        this.setState({
          experts: filData,
          isListRefreshing: false,
          isLoading: false,
          currency,
        });
      }
    } catch (error) {
      console.error('error in code');
    }
  };

  handleSearchApi = async changedText => {
    this.setState({keyword: changedText});
    const keywordLength = this.state.keyword.length;
    const info = this.props.navigation.getParam('info', null);
    const {id} = info;
    if (keywordLength === 0) {
      await this.expertListScreen();
    } else if (keywordLength >= 1) {
      try {
        const userInfo = await getData(KEYS.USER_INFO);

        if (userInfo) {
          const params = {
            categoryId: id,
            keyword: changedText,
          };

          const response = await makeRequest(
            BASE_URL + 'api/Customer/searchExpert',
            params,
          );
          if (response) {
            const {success, message} = response;
            this.setState({isLoading: false});

            if (success) {
              const {experts} = response;
              this.setState({experts});
              this.experts = experts;
              //this.setState({message});
            } else {
              this.setState({experts: null, message, keyword: ''});
              await this.expertListScreen();
              this.setState({keyword: ''});
            }
          }
        } else {
          const params = {
            categoryId: id,
            keyword: changedText,
          };

          const response = await makeRequest(
            BASE_URL + 'api/Customer/searchExpert',
            params,
          );
          if (response) {
            const {success, message} = response;
            this.setState({isLoading: false});

            if (success) {
              const {experts} = response;
              this.setState({experts});
              this.experts = experts;
              //this.setState({message});
            } else {
              this.setState({experts: null, message, keyword: ''});
              await this.expertListScreen();
              this.setState({keyword: ''});
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      await this.expertListScreen();
    }
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.expertListScreen();
    } catch (error) {
      console.log(error.message);
    }
  };
  renderItem = ({item}) => (
    <ExpertsListComponent
      item={item}
      nav={this.props.navigation}
      currency={this.state.currency}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {experts, message} = this.state;
    // if (this.state.isLoading) {
    //   return <ProcessingLoader />;
    // }

    const {timesPressed} = this.state;

    let textLog = '';
    if (timesPressed > 1) {
      textLog = timesPressed + 'x onPress';
    } else if (timesPressed > 0) {
      textLog = 'onPress';
    }

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Experts"
          navActionBack="back"
          nav={this.props.navigation}
        />

        {/* <Pressable
          delayLongPress={150}
          onLongPress={() => {
            Alert.alert(
              `Are you sure`,
              `if you press yes user are blocked`,
              [
                {
                  text: 'yes',
                },
              ],
              {cancelable: true},
            );
          }}>
          {({pressed}) => <Text>Test</Text>}
        </Pressable> */}

        <View style={styles.contentContainer}>
          <View style={styles.searchCategory}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              //onChangeText={this.handlekeyword}
              onChangeText={this.handleSearchApi}
              value={this.state.keyword}
              style={styles.input}
            />
            <Image
              source={ic_search}
              resizeMode="center"
              style={styles.searchIcon}
            />
          </View>
          {experts ? (
            <FlatList
              data={experts}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          ) : (
            <View style={styles.noDataStyle}>
              <Text style={styles.noDataTextStyle}>{message} </Text>
            </View>
          )}
        </View>
        {this.state.isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isExpertList: expertDetailSelectors.isExpertList(state),
});

const mapDispatchToProps = {
  getExpertList: expertDetailOperations.getExpertList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpertsListScreen);
const styles = StyleSheet.create({
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchCategory: {
    backgroundColor: '#5477f710',
    flexDirection: 'row',
    borderRadius: wp(10),
    paddingHorizontal: wp(3),
    margin: wp(3),
    marginTop: hp(1),
    alignItems: 'center',
    height: hp(6),
    // elevation: 8,
  },
  input: {
    height: hp(5.5),
    fontSize: wp(2.8),
    flex: 1,
    color: '#333',
    fontWeight: '700',
  },
  searchIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  separator: {
    // height: 4,
    // backgroundColor: '#f2f1f1',
    marginBottom: wp(3),
  },
  // listContainer: {
  //   padding: wp(3),
  // },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
