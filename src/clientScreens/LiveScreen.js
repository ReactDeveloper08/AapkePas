import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import LiveTileComponent from 'components/LiveTileComponent';
import LiveTileComponent2 from 'components/LiveTileComponent2';
import LiveTileComponent3 from 'components/LiveTileComponent3';
import LiveTileComponent4 from 'components/LiveTileComponent4';
import LiveTileComponent5 from 'components/LiveTileComponent5';
import LiveTileComponent6 from 'components/LiveTileComponent6';

import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
//share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
// Icons
import ic_home_white from 'assets/icons/ic_home_white.png';
//API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import {getData, KEYS} from 'api/UserPreference';
export default class LiveScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListRefreshing: false,
      listLiveStream: [],
      astrologers: [],
      message: '',
      live: '',
      scheduled: '',
      completedSchedule: null,
      liveSchedule: null,
      upcommingSchedule: null,
      isLoading: false,
      userInfo: '',
    };
  }
  componentDidMount() {
    this.handleLiveData();
  }
  //*share the astroinfo
  fetchReferralInfo = async id => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You need to Login first for Invite and Earn.\nPress LOGIN to continue. !',
          [
            {text: 'NO', style: 'cancel'},
            {
              text: 'LOGIN',
              onPress: this.handleLogin,
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }
      let params = {scheduledID: id};
      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Astrologers/LiveSecheduleShare',
        params,
        true,
        false,
      );
      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;
          const {shareInfo} = output;
          const {
            title,
            message,
            image,
            astoName,
            astoExperience,
            astoCategories,
            astoRating,
            astoSecheduleTime,
            androidUrl,
          } = shareInfo;
          const {url: url, extension} = image;
          const base64ImageData = await this.encodeImageToBase64(url);
          if (!base64ImageData) {
            return;
          }
          const shareOptions = {
            title,
            subject: title,
            message: `${title}\nAstrologer Name:${astoName}\nSchedule Time:${astoSecheduleTime}\nExperience:${astoExperience}\nCategories:${astoCategories}\nRating:${astoRating}\n${message}\n${androidUrl}\n`,
            url: `data:image/${extension};base64,${base64ImageData}`,
          };
          //* stopping loader
          this.setState({showProcessingLoader: false});
          await Share.open(shareOptions);
        } else {
          const {message} = response;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  encodeImageToBase64 = async url => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});
      const downloadedImage = await rnFetchBlob.fetch('GET', url);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  handleLiveData = async () => {
    this.setState({isLoading: true});
    const userInfo = await getData(KEYS.USER_INFO);

    const response = await makeRequest(
      BASE_URL + 'api/Customer/liveAstologers',
    );
    if (response) {
      const {success, message} = response;
      if (success) {
        const {completedSchedule, liveSchedule, upcommingSchedule} = response;

        this.setState({
          completedSchedule,
          liveSchedule,
          upcommingSchedule,
          message,
          isLoading: false,
          isListRefreshing: false,
          userInfo,
        });
      } else {
        this.setState({
          completedSchedule: null,
          liveSchedule: null,
          upcommingSchedule: null,
          message,
          isLoading: false,
          isListRefreshing: false,
          userInfo,
        });
      }
    }
  };

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});
      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => {
    const id = item.id;
    // const {userId} = userInfo;
    return (
      <LiveTileComponent
        item={item}
        nav={this.props.navigation}
        handleShare={() => this.fetchReferralInfo(id)}
        // data={userId}
      />
    );
  };

  renderItem2 = ({item}) => (
    <LiveTileComponent2 item={item} nav={this.props.navigation} />
  );
  renderItem3 = ({item}) => (
    <LiveTileComponent3 item={item} nav={this.props.navigation} />
  );

  renderItem4 = ({item}) => (
    <LiveTileComponent4 item={item} nav={this.props.navigation} />
  );
  renderItem5 = ({item}) => (
    <LiveTileComponent5 item={item} nav={this.props.navigation} />
  );

  renderItem6 = ({item}) => (
    <LiveTileComponent6 item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerIcon={ic_home_white}
          headerTitle="Live"
          nav={this.props.navigation}
        />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <View>
            <Text style={styles.contentTile}>Live</Text>
            {this.state.liveSchedule ? (
              <FlatList
                data={this.state.liveSchedule}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.messageContainer}>
                <Text>No Data Available</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.contentTile}>UpComing</Text>
            {this.state.upcommingSchedule ? (
              <FlatList
                data={this.state.upcommingSchedule}
                renderItem={this.renderItem2}
                keyExtractor={this.keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.messageContainer}>
                <Text>No Data Available</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.contentTile}>Completed</Text>
            {this.state.completedSchedule ? (
              <FlatList
                data={this.state.completedSchedule}
                renderItem={this.renderItem3}
                keyExtractor={this.keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.messageContainer}>
                <Text>No Data Available</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentTile: {
    padding: wp(4),
    fontWeight: '700',
  },
  listContainer: {
    padding: wp(3),
    paddingTop: wp(0),
  },
  separator: {
    width: wp(3),
  },
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
