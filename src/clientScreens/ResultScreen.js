import React, {Component} from 'react';
import {
  View,
  Alert,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import {StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from 'styles/BasicStyles';

import FooterComponent from 'components/FooterComponent';
// Components
import HeaderComponent from 'components/HeaderComponent';
import ProcessingLoader from 'components/ProcessingLoader';
import ic_smile from 'assets/icons/ic_smile.png';
import happy from 'assets/icons/happy.png';
import sad from 'assets/icons/sad.png';

// redux
import {connect} from 'react-redux';
import {quesOperations, quesSelectors} from 'Redux/wiseword/ques';
import {KEYS, getData} from 'api/UserPreference';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class ResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {isProcessing: true, score: 0, message: ''};
  }

  async UNSAFE_componentWillMount() {
    try {
      const deviceId = await getData(KEYS.DEVICE_UNIQUE_ID);
      const newQesData = this.props.navigation.getParam('newQesData', null);
      let score = JSON.stringify(newQesData);
      const params = {
        score,
        deviceId: deviceId.deviceId,
      };
      console.log(params);
      await this.props.getScore(params).then(async () => {
        console.log(this.props.isGetScore);
        const {success} = this.props.isGetScore;
        if (success) {
          const {score, message} = this.props.isGetScore;
          this.setState({score, message, isProcessing: false});
        } else {
          this.setState({score: 0, message: '', isProcessing: false});
        }
      });
    } catch (error) {
      console.warn('error while calling result api');
    }
  }

  //   const {id} = props.item;
  handleDetail = () => {
    const info = this.props.navigation.getParam('info', null);
    if (info === 'explore') {
      this.props.navigation.navigate('ExploreScreen');
    } else {
      this.props.navigation.navigate('ExpertsList', {info});
    }
  };
  randerEmojies = () => {
    if (this.state.score < 4) {
      return (
        <View style={[basicStyles.alignCenter]}>
          <Image source={happy} resizeMode="cover" style={styles.smileIcon} />
        </View>
      );
    } else if (this.state.score >= 5 && this.state.score <= 9) {
      return (
        <View
          style={[
            basicStyles.alignCenter,
            basicStyles.directionRow,
            basicStyles.justifyCenter,
          ]}>
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
        </View>
      );
    } else if (this.state.score >= 10 && this.state.score <= 14) {
      return (
        <View
          style={[
            basicStyles.alignCenter,
            basicStyles.directionRow,
            basicStyles.justifyCenter,
          ]}>
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
        </View>
      );
    } else if (this.state.score >= 20 && this.state.score <= 27) {
      return (
        <View
          style={[
            basicStyles.alignCenter,
            basicStyles.directionRow,
            basicStyles.justifyCenter,
          ]}>
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
          <Image source={sad} resizeMode="cover" style={styles.smileIcon} />
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          navActionBack="back"
          headerTitle="Result"
          // showGradient
          nav={this.props.navigation}
        />
        {this.state.score !== 0 ? (
          <View style={[basicStyles.mainContainer, basicStyles.padding]}>
            {this.randerEmojies()}
            <Text style={styles.questionNumber}>Score: {this.state.score}</Text>

            <Text style={styles.msg}>{this.state.message}</Text>

            <Touchable style={styles.submitButton} onPress={this.handleDetail}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Discuss with Experts
              </Text>
            </Touchable>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}

        {this.state.isProcessing && <ProcessingLoader />}
        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isGetScore: quesSelectors.isGetScore(state),
});
const mapDispatchToProps = {
  getScore: quesOperations.getScore,
};
export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen);
const styles = StyleSheet.create({
  questionNumber: {
    fontSize: wp(5),
    textAlign: 'center',
    fontWeight: '700',
  },
  //   subTItle: {
  //     fontSize: wp(3.2),
  //     textAlign: 'center',
  //   },
  msg: {
    fontSize: wp(4.5),
    fontWeight: '400',
    marginTop: hp(3),
    marginBottom: hp(3),
    textAlign: 'center',
    color: '#777',
    marginHorizontal: wp(3),
  },
  ans: {
    // backgroundColor: '#ff648a10',
    backgroundColor: '#f5f5f5',
    height: hp(5.5),
    borderRadius: 5,
    marginBottom: wp(4),
    alignItems: 'center',
    paddingHorizontal: wp(3),
    flexDirection: 'row',
  },
  ansText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#333',
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: wp(3),
  },
  submitButton: {
    backgroundColor: '#ff648a',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: wp(3),
    paddingHorizontal: wp(15),
    borderRadius: hp(2.75),
    marginBottom: hp(2),
  },
  smileIcon: {
    height: hp(6),
    width: hp(6),
    // aspectRatio: 1 / 1,
    marginVertical: wp(4),
    marginHorizontal: wp(2),
    borderWidth: 1,
  },
});
