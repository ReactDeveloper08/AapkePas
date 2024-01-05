import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Image} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
import officials from 'assets/images/officials.gif';

// Components
import HeaderComponents from 'components/HeaderComponents';
import CustomLoader from 'components/ProcessingLoader';
//api
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {FlatList} from 'react-native-gesture-handler';

class FollowingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {output: '', message: '', isLoading: true};
  }
  componentDidMount() {
    this.getOfficialData();
  }
  getOfficialData = async () => {
    try {
      let params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/official',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        if (success) {
          const {output} = response;
          this.setState({output, message, isLoading: false});
        } else {
          this.setState({output: null, message, isLoading: false});
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };
  reviewItem = ({item}) => {
    const {message, title, date} = item;
    return (
      <View style={styles.container}>
        <View style={styles.notificationHeader}>
          <Image
            source={officials}
            resizeMode="cover"
            style={styles.bellIcon}
          />

          <View style={styles.dateTitle}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{message}</Text>
          </View>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();
  itemSeparator = () => <View style={styles.reviewSeparator} />;
  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents
          headerTitle="Aapke Pass Official Notification"
          nav={this.props.navigation}
        />
        {this.state.output ? (
          <FlatList
            data={this.state.output}
            renderItem={this.reviewItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{this.state.message}</Text>
          </View>
        )}
        {this.state.isLoading && <CustomLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: wp(2),
    backgroundColor: '#9cdaff',
    borderRadius: 5,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 1,
    paddingVertical: hp(1),
  },
  dateTitle: {
    flex: 1,
    paddingLeft: wp(2),
  },
  title: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#333',
    // marginBottom: hp(1),
  },
  date: {
    fontSize: wp(3),
    marginTop: wp(1),
    color: '#666',
  },
  bellIcon: {
    width: hp(7),
    aspectRatio: 1 / 1,
    // marginBottom: hp(2),
  },
  description: {
    paddingTop: wp(2),
    fontSize: wp(3),
  },
  reviewSeparator: {
    height: 4,
    backgroundColor: '#f2f1f1',
  },
  // listContainer: {
  //   padding: wp(2),
  // },
  messageText: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowingScreen;
