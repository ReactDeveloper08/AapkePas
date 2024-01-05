import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

// // Icons
// import ic_add_post from 'assets/icons/ic_add_post.png';

// Components
import HeaderComponents from 'components/HeaderComponents';
import BlockListComponent from 'components/BlockListComponent';

//Api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import CustomLoader from 'components/ProcessingLoader';
// import {showToast} from 'components/CustomToast';

class BlockList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      blockedUsers: '',
      isLoading: false,
      message: '',
    };
  }

  componentDidMount() {
    this.showBlockData();
  }

  showBlockData = async () => {
    this.setState({isLoading: true});
    const params = null;
    await new Promise((resolve, reject) => {
      resolve(
        makeRequest(
          BASE_URL + 'api/Astrologers/blockedUserList',
          params,
          true,
          false,
        ),
      );
      reject(response);
    })
      .then(response => {
        const {blockedUsers, message} = response;
        this.setState({blockedUsers, message, isLoading: false});
      })
      .catch(message => {
        this.setState({message, blockedUsers: null, isLoading: false});
      });
  };
  // componentWillUnmount() {
  //   this.showBlockData();
  // }
  renderItem = ({item}) => (
    <BlockListComponent
      item={item}
      nav={this.props.navigation}
      refresh={this.showBlockData}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={{height: wp(2)}} />;

  render() {
    const {isLoading, blockedUsers} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponents
          headerTitle="Block Users"
          nav={this.props.navigation}
        />
        <View
          style={[basicStyles.mainContainer, basicStyles.lightBackgroundColor]}>
          {blockedUsers ? (
            <FlatList
              data={this.state.blockedUsers}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text style={{fontSize: 20, fontStyle: 'italic'}}>
                {this.state.message}
              </Text>
            </View>
          )}
        </View>
        {isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(3),
  },
});

export default BlockList;
