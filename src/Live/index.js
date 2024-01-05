import React from 'react';

import {
  Text,
  View,
  Alert,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
// Hoc
import Flatlist_Hoc from '../ViewUtils/Flatlist_Hoc';
import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import LiveListComponent from 'components/LiveListComponent';
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
//share
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

// Styles
import basicStyles from 'styles/BasicStyles';
//API
import {BASE_URL, makeRequest} from 'api/ApiInfo';
import ProcessingLoader from 'components/ProcessingLoader';
import {getData, KEYS} from 'api/UserPreference';
//Redux
import {connect} from 'react-redux';
import {
  liveStreamOperations,
  liveStreamSelectors,
} from 'Redux/wiseword/liveStream';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isListRefreshing: false,
      listLiveStream: [],
      tabActive: 'Service',
      astrologers: [],
      message: '',
      live: '',
      scheduled: '',
      upcommingSchedule: '',
      isLoading: true,
    };
    this.fetchReferralInfo = this.fetchReferralInfo.bind(this);
    this.handleLiveShow = this.handleLiveShow.bind(this);
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
            message: `${title}\nDoctor Name:${astoName}\nSchedule Time:${astoSecheduleTime}\nExperience:${astoExperience}\nCategories:${astoCategories}\nRating:${astoRating}\n${message}\n${androidUrl}\n`,
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
    // this.setState({isLoading: true});
    const params = null;
    await this.props.liveStart(params);
    const response = this.props.isLiveStart;
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
          live: '',
          scheduled: '',
          upcommingSchedule: '',
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
    const id = item.channelId;
    const userName = this.props.navigation.getParam('payloadId');
    return (
      <LiveListComponent
        item={item}
        nav={this.props.navigation}
        handleShare={() => this.fetchReferralInfo(id)}
        handleShowLive={liveData => this.handleLiveShow(liveData)}
        data={userName}
        live={this.state.live}
      />
    );
  };
  //* sends to live show
  handleLiveShow = async liveData => {
    try {
      const userName = this.props.navigation.getParam('payloadId');
      const initialData = userName;
      const refreshCallBack = this.handleLiveData.bind(this);
      const tabActive = () => {
        this.setState({tabActive: 'Completed'});
      };
      await this.props.saveLiveData(liveData).then(() => {
        this.props.navigation.navigate('Customer_Viewer', {
          initialData,
          refreshCallBack,
          tabActive,
        });
      });
    } catch (e) {
      console.log('Live Show Problem');
    }
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Service') {
      return (
        <View style={[basicStyles.mainContainer]}>
          {/* <Text style={styles.title}>Live Doctors</Text> */}
          {this.state.live ? (
            <Flatlist_Hoc
              data={this.state.live}
              renderItem={this.listItem}
              keyExtractor={(item, index) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          ) : (
            <ScrollView
              contentContainerStyle={[
                basicStyles.padding,
                basicStyles.alignCenter,
                basicStyles.flexOne,
                basicStyles.justifyCenter,
                basicStyles.marginTop,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              <Text style={{textAlign: 'center', color: '#333'}}>
                No Live Available
              </Text>
            </ScrollView>
          )}
        </View>
      );
    } else if (tabActive === 'Live') {
      return (
        <View style={[basicStyles.mainContainer]}>
          {/* <Text style={styles.title}>Upcoming Live </Text> */}
          {this.state.upcommingSchedule ? (
            <Flatlist_Hoc
              data={this.state.upcommingSchedule}
              renderItem={this.listItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          ) : (
            <ScrollView
              contentContainerStyle={[
                basicStyles.padding,
                basicStyles.alignCenter,
                basicStyles.flexOne,
                basicStyles.justifyCenter,
                basicStyles.marginTop,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              <Text style={{textAlign: 'center', color: '#333'}}>
                No UpComing Live Available
              </Text>
            </ScrollView>
          )}
        </View>
      );
    } else if (tabActive === 'Completed') {
      return (
        <View style={[basicStyles.mainContainer]}>
          {/* <Text style={styles.title}>Completed Live </Text> */}
          {this.state.scheduled ? (
            <Flatlist_Hoc
              data={this.state.scheduled}
              renderItem={this.listItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          ) : (
            <ScrollView
              contentContainerStyle={[
                basicStyles.padding,
                basicStyles.alignCenter,
                basicStyles.flexOne,
                basicStyles.justifyCenter,
                basicStyles.marginTop,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              <Text style={{textAlign: 'center', color: '#333'}}>
                No Completed Live Available
              </Text>
            </ScrollView>
          )}
        </View>
      );
    }
  };

  handleAllService = () => {
    this.setState({tabActive: 'Service'});
  };
  handleLive = () => {
    this.setState({tabActive: 'Live'});
  };
  handleCompleted = () => {
    this.setState({tabActive: 'Completed'});
  };

  render() {
    const userName = this.props.navigation.getParam('payloadId');
    const {isLoading, tabActive} = this.state;
    const activeStyle = [
      styles.tabStyle,
      {
        backgroundColor: '#4cade2',
        height: hp(5),
        borderRadius: 8,
        marginRight: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(4),
      },
    ];
    const activeTextStyle = [
      styles.tabStyle,
      {
        color: '#fff',
        fontSize: wp(3.5),
        fontWeight: '700',
        textAlign: 'center',
      },
    ];
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          nav={this.props.navigation}
          headerTitle="Live"
          navActionBack="back"
        />

        <View
          style={[
            basicStyles.padding,
            basicStyles.directionRow,
            styles.userNameContainer,
          ]}>
          <Text style={styles.welcomeText}>
            Welcome
            <Text style={styles.welcomeText2}> {userName}</Text>
          </Text>
        </View>

        <View style={styles.tabMainContainer}>
          <TouchableOpacity
            onPress={this.handleAllService}
            underlayColor="transparent"
            style={tabActive === 'Service' ? activeStyle : styles.tabButton}>
            <View>
              <Text
                style={
                  tabActive === 'Service'
                    ? activeTextStyle
                    : styles.headingLarge
                }>
                Live Now
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleLive}
            underlayColor="transparent"
            style={tabActive === 'Live' ? activeStyle : styles.tabButton}>
            <View>
              <Text
                style={
                  tabActive === 'Live' ? activeTextStyle : styles.headingLarge
                }>
                Upcoming Live
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleCompleted}
            underlayColor="transparent"
            style={tabActive === 'Completed' ? activeStyle : styles.tabButton}>
            <View>
              <Text
                style={
                  tabActive === 'Completed'
                    ? activeTextStyle
                    : styles.headingLarge
                }>
                Completed Live
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[basicStyles.mainContainer, styles.tabCon]}>
          {this.renderSlots()}
        </View>

        <FooterComponent nav={this.props.navigation} />
        {isLoading && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isLiveStart: liveStreamSelectors.isLiveStart(state),
  getSaveLiveData: liveStreamSelectors.getSaveLiveData(state),
});
const mapDispatchToProps = {
  saveLiveData: liveStreamOperations.saveLiveData,
  liveStart: liveStreamOperations.liveStart,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
