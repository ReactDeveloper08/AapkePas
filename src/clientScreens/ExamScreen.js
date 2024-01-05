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
// import QuestionComponent from 'components/questionComponent';
import ProcessingLoader from 'components/CustomLoader';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import PromoCodeListComponent from 'components/PromoCodeListComponent';
import {connect} from 'react-redux';
import {quesOperations, quesSelectors} from 'Redux/wiseword/ques';
import {ScrollView} from 'react-native-gesture-handler';
import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);
class ExamScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      Questions: '',
      tabActive: '',
      selectedRadioButtonIndex: 0,
      promoCode: '',
      promoCodeId: null,
      newQesData: [],
      success: false,
      isProcessing: true,
      message: '',
    };
    this.exList = [];
  }

  async UNSAFE_componentWillMount() {
    try {
      const info = this.props.navigation.getParam('info', null);
      const params = {
        categoryId: info.id,
      };
      await this.props.getQuestion(params).then(async () => {
        const {success} = await this.props.isGetQuestion;
        if (success) {
          const {Questions} = await this.props.isGetQuestion;
          this.exList = Questions;
          this.setState({isProcessing: false, success});
        } else {
          const {message} = await this.props.isGetQuestion;
          this.props.navigation.navigate('ExpertsList', {info});
          this.setState({isProcessing: false, success: false, message});
        }
      });
    } catch (error) {
      console.warn('error while calling question api');
    }
  }

  renderCouponList = () => {
    const {selectedRadioButtonIndex} = this.state;
    let coupons = [];
    if (this.exList[this.state.count]) {
      coupons = this.exList[this.state.count].options;
    }

    return coupons.map((item, index) => {
      const {id, ans} = item;

      const obj = {label: ans, value: index};
      const radioButton = (
        <RadioButton
          labelHorizontal={true}
          style={{
            alignItems: 'center',
          }}
          key={index}>
          <RadioButtonInput
            obj={obj}
            index={index}
            isSelected={index === selectedRadioButtonIndex}
            buttonSize={8}
            borderWidth={2}
            buttonColor="#ff648a"
            onPress={this.handleRadioButtonPress}
            buttonInnerColor={'#ff648a'}
            selectedRadioButtonIndex="#ff648a"
          />
          <RadioButtonLabel
            obj={obj}
            index={index}
            labelHorizontal={true}
            onPress={this.handleRadioButtonPress}
            labelStyle={styles.radioLabel}
          />
        </RadioButton>
      );

      return (
        <View key={index}>
          <PromoCodeListComponent item={item} radioButton={radioButton} />
          {/* <View style={styles.separator} /> */}
        </View>
      );
    });
  };

  handleRadioButtonPress = selectedRadioButtonIndex => {
    const coupons = this.exList[this.state.count].options;
    const promoCode = coupons[selectedRadioButtonIndex].ans;
    const promoCodeId = coupons[selectedRadioButtonIndex].id;
    this.setState({selectedRadioButtonIndex, promoCode, promoCodeId});
  };

  handleResult = () => {
    const {newQesData} = this.state;
    if (this.state.count < this.exList.length - 1) {
      this.setState({
        count: this.state.count + 1,
        selectedRadioButtonIndex: 0,
      });
    }
    var qid = this.exList[this.state.count].id;
    var aid =
      this.exList[this.state.count].options[this.state.selectedRadioButtonIndex]
        .id;
    newQesData.push({qid: qid, aid: aid});
    console.log('aid', newQesData);
    if (this.state.count === this.exList.length - 1) {
      const info = this.props.navigation.getParam('info', null);
      this.props.navigation.navigate('Result', {info, newQesData});
    }
  };

  render() {
    let data = '';
    if (this.state.isProcessing) {
      return <ProcessingLoader />;
    }
    if (this.exList[this.state.count]) {
      data = this.exList[this.state.count].qes;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          navAction="back"
          headerTitle="Exam"
          // showGradient
          nav={this.props.navigation}
        />
        {this.state.success !== false ? (
          <View style={[basicStyles.mainContainer, basicStyles.padding]}>
            <Text style={styles.questionNumber}>
              Question {this.state.count + 1} of {this.exList.length}
            </Text>
            <Text style={styles.Question}>
              {this.state.count + 1}. {data}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <RadioForm animation={true} style={styles.radioForm}>
                {this.renderCouponList()}
              </RadioForm>
            </ScrollView>

            <Touchable style={styles.submitButton} onPress={this.handleResult}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Submit
              </Text>
            </Touchable>
          </View>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>{this.state.message}</Text>
          </View>
        )}

        <FooterComponent nav={this.props.navigation} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  isGetQuestion: quesSelectors.isGetQuestion(state),
  isGetScore: quesSelectors.isGetScore(state),
});
const mapDispatchToProps = {
  getQuestion: quesOperations.getQuestion,
};
export default connect(mapStateToProps, mapDispatchToProps)(ExamScreen);
const styles = StyleSheet.create({
  questionNumber: {
    fontSize: wp(5),
    textAlign: 'center',
  },

  Question: {
    fontSize: wp(4.5),
    fontWeight: '700',
    marginTop: hp(3),
    marginBottom: hp(3),
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
    margin: wp(10),
    paddingHorizontal: wp(15),
    borderRadius: hp(2.75),
  },
  radioLabel: {
    width: wp(84),
  },
});
