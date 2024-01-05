import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';
//WebView
// import {WebView} from 'react-native-webview';
import ic_notification_bell from 'assets/icons/ic_notification_bell2.gif';
// Components
import HeaderComponents from 'components/HeaderComponent';

import CustomLoader from 'components/CustomLoader';
import {connect} from 'react-redux';

import {homeOperations, homeSelectors} from '../Redux/wiseword/home';
import {userInfoSelectors} from '../Redux/wiseword/userDetails';

class Notification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      output: null,
      message: '',
      isLoading: true,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.getOfficialData();
  }

  getOfficialData = async () => {
    try {
      let params = null;

      await this.props.getNotification(params);
      this.setState({isListRefreshing: false, isLoading: false});
      const {isGetNotification} = this.props;

      if (isGetNotification) {
        this.setState({
          output: isGetNotification,
        });
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
            source={ic_notification_bell}
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

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {output} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponents
          headerTitle="Notification"
          nav={this.props.navigation}
          navAction="back"
        />
        {output ? (
          <FlatList
            data={output}
            renderItem={this.reviewItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            // horizontal={true}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
            refreshing={this.state.isListRefreshing}
            onRefresh={this.handleListRefresh}
          />
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>
              No Notification Available.
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

// const EnhancedComponent = Notification;

const mapStateToProps = state => ({
  isGetNotification: homeSelectors.isGetNotification(state),
  userInfo: userInfoSelectors.getUserInfo(state),
});

const mapDispatchToProps = {
  getNotification: homeOperations.getNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

const styles = StyleSheet.create({
  reviewSeparator: {
    height: hp(1),
  },
  container: {
    padding: wp(2),
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  listContainer: {
    padding: wp(2),
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
  openIconBackground: {
    height: hp(7),
    width: hp(7),
    borderRadius: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  openIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  description: {
    paddingTop: wp(2),
    fontSize: wp(3),
  },
});
