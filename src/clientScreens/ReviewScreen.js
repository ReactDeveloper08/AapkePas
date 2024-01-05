import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Shadow} from 'react-native-neomorph-shadows';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

//api
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import {KEYS, getData, clearData} from 'api/UserPreference';

//rating Api
import {AirbnbRating} from 'react-native-ratings';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
// Components
import HeaderComponent from 'components/HeaderComponent';
import FooterComponent from 'components/FooterComponent';
import basicStyles from 'styles/BasicStyles';
import {nsNavigate} from 'routes/NavigationService';
//const WATER_IMAGE = require('./water.png');
export default class ReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      //rating: 0,
      review: '',
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  //* Back handler
  backAction = () => {
    return true;
  };

  handelReviewChange = changedText => {
    this.setState({review: changedText});
  };

  ratingCompleted = rating => {
    this.setState({
      starCount: rating,
    });
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('Login');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  handleReviewScreen = async () => {
    try {
      const {review, rating, starCount} = this.state;

      if (review.trim() === '') {
        Alert.alert('', 'Please enter your review !', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      const consultationId = this.props.navigation.getParam(
        'consultationId',
        null,
      );
      const expertId = this.props.navigation.getParam('expertId', null);
      if (!(consultationId === null)) {
        const params = {
          consultationId,
          rating: starCount,
          review,
        };

        const response = await makeRequest(
          BASE_URL + 'api/Customer/userReview',
          params,
          true,
          false,
        );
        if (response) {
          const {success, message, isAuthTokenExpired} = response;
          if (success) {
            Alert.alert('', message);
            const id = expertId;
            nsNavigate('ExpertDetail', {info: {id}});
          } else {
            if (isAuthTokenExpired === true) {
              Alert.alert(
                'Session Expired',
                'Login Again to Continue!',
                [
                  {
                    text: 'OK',
                  },
                ],
                {
                  cancelable: false,
                },
              );
              this.handleTokenExpire();
            }
          }
        }
      } else {
        Alert.alert('Expert not Choosen by User');
        return;
      }
    } catch (error) {}
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Review & Rating"
          navAction="back"
          nav={this.props.navigation}
        />
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={basicStyles.flexOne}>
          <View style={styles.contentContainer}>
            <Shadow
              // inner // <- enable inner shadow
              // useArt // <- set this prop to use non-native shadow on ios
              style={styles.mainHeader}>
              <View style={styles.starContainer}>
                <Text style={styles.RatingTitle}>
                  How was your experience with us?
                </Text>
                <AirbnbRating
                  type="star"
                  startingValue={this.state.starCount}
                  ratingCount={5}
                  imageSize={10}
                  size={20}
                  fractions={1}
                  showRating
                  onFinishRating={this.ratingCompleted}
                  reviewColor="#4faee4"
                />
              </View>
            </Shadow>
            <TextInput
              placeholder="Type your Review..."
              placeholderTextColor="#666"
              style={styles.input}
              value={this.state.review}
              multiline={true}
              onChangeText={this.handelReviewChange}
              numberOfLines={5}
              underlineColorAndroid="transparent"
            />
            <Touchable
              onPress={this.handleReviewScreen}
              underlayColor="#ff638b80"
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Touchable>
          </View>
        </KeyboardAwareScrollView>
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  iosContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },
  contentTile: {
    paddingHorizontal: wp(3),
    paddingTop: wp(4),
    fontSize: wp(4),
  },
  starContainer: {
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RatingTitle: {
    fontSize: wp(4),
    textAlign: 'center',
  },

  mainHeader: {
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowColor: '#00000015',
    shadowRadius: 8,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: '#fff',
    width: wp(94),
    height: hp(16),
    // marginRight: wp(3),
    // borderBottomRightRadius: wp(20),
    // borderBottomLeftRadius: wp(20),
    // ...include most of View/Layout styles
  },

  stars: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  reviewStar: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(1),
  },
  input: {
    backgroundColor: '#fff',
    padding: wp(3),
    color: '#000',
    height: hp(20),
    marginTop: hp(3),
    textAlignVertical: 'top',
    fontSize: wp(3.5),
    borderWidth: 1,
    borderColor: '#ccc4',
  },
  submitButton: {
    backgroundColor: '#4faee4',
    height: hp(5.5),
    paddingHorizontal: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: wp(3),
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(3.5),
  },
});
