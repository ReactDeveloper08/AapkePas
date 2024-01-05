import React from 'react';

import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';

import styles from './styles';

import LiveListComponent from 'components/LiveListComponent';
import HeaderComponent from 'components/HeaderComponent';
//share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

// Styles
import basicStyles from 'styles/BasicStyles';
//API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import CustomLoader from 'components/CustomLoader';
import {getData, KEYS} from 'api/UserPreference';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isListRefreshing: false,
      listLiveStream: [],
      astrologers: [],
      message: '',
      live: '',
      scheduled: '',
      upcommingSchedule: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    this.handleLiveData();
  }

  //*share the astroinfo
  fetchReferralInfo = async id => {
    try {
      const userInfo = await getData(KEYS.USER_DATA);
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
    const response = await makeRequest(
      BASE_URL + 'api/Customer/liveAstologers',
    );
    //Alert.alert('', BASE_URL + 'api/Customer/liveAstologers');
    if (response) {
      const {success, message} = response;
      if (success) {
        const {
          astrologers,
          liveSchedule,
          upcommingSchedule,
          completedSchedule,
        } = response;
        this.setState({
          astrologers,
          live: liveSchedule,
          scheduled: completedSchedule,
          upcommingSchedule,
          message,
          isLoading: false,
          isListRefreshing: false,
        });
      } else {
        this.setState({
          astrologers: null,
          message,
          isLoading: false,
          isListRefreshing: false,
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
  listItem = ({item}) => {
    const id = item.id;
    const userName = this.props.navigation.getParam('payloadId');
    return (
      <LiveListComponent
        item={item}
        nav={this.props.navigation}
        handleShare={() => this.fetchReferralInfo(id)}
        data={userName}
        live={this.state.live}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  render() {
    const userName = this.props.navigation.getParam('payloadId');
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Live"
          navActionBack="back"
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <View style={[basicStyles.padding, basicStyles.directionRow]}>
            <Text style={styles.welcomeText}>
              Welcome <Text style={styles.welcomeText2}>{userName}</Text>
            </Text>
          </View>
          <Text style={styles.title}>Live Doctors</Text>
          {this.state.live ? (
            <FlatList
              data={this.state.live}
              renderItem={this.listItem}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View
              style={[
                basicStyles.padding,
                basicStyles.alignCenter,
                basicStyles.justifyCenter,
                //basicStyles.whiteBackgroundColor,
                basicStyles.marginTop,
              ]}>
              <Text style={{textAlign: 'center', color: '#333'}}>
                No Live Available
              </Text>
            </View>
          )}
          <View style={[basicStyles.mainContainer, basicStyles.padding]}>
            <Text style={styles.listHeading}>Upcoming Live </Text>
            {this.state.upcommingSchedule ? (
              <FlatList
                data={this.state.upcommingSchedule}
                renderItem={this.listItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View
                style={[
                  basicStyles.padding,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                  basicStyles.marginTop,
                ]}>
                <Text style={{textAlign: 'center'}}>
                  No UpComing Live Available
                </Text>
              </View>
            )}
          </View>
          <View style={[basicStyles.mainContainer, basicStyles.padding]}>
            <Text style={styles.listHeading}>Completed Live </Text>
            {this.state.scheduled ? (
              <FlatList
                data={this.state.scheduled}
                renderItem={this.listItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View
                style={[
                  basicStyles.padding,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                  basicStyles.marginTop,
                ]}>
                <Text style={{textAlign: 'center'}}>
                  No Completed Live Available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Home;
