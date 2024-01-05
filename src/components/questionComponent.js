import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import PromoCodeListComponent from './PromoCodeListComponent';

export default class questionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: '',
      selectedRadioButtonIndex: -1,
      promoCode: '',
      promoCodeId: null,
      coupons: [
        {id: 'a', ans: 'Radiation resistance'},
        {id: 'b', ans: 'Turning tiny'},
        {id: 'c', ans: 'Radiation blast'},
      ],
    };
  }
  selectAns = value => {
    this.setState({tabActive: value});
    console.log(this.state.tabActive, this.props.item.label);
  };
  onUpdateAns = value => {
    this.setState({tabActive: value});
    console.log(this.state.tabActive, this.props.item.label);
  };
  renderCouponList = () => {
    const {coupons, selectedRadioButtonIndex} = this.state;

    return coupons.map((item, index) => {
      const {id, ans} = item;

      const obj = {label: ans, value: index};

      const radioButton = (
        <RadioButton labelHorizontal={true}>
          <RadioButtonInput
            obj={obj}
            index={index}
            isSelected={index === selectedRadioButtonIndex}
            buttonSize={8}
            borderWidth={2}
            buttonColor="#333"
            onPress={this.handleRadioButtonPress}
          />
          <RadioButtonLabel
            obj={obj}
            index={index}
            labelHorizontal={true}
            onPress={this.handleRadioButtonPress}
            labelStyle={styles.radioButtonLabel}
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
    const {coupons} = this.state;
    const promoCode = coupons[selectedRadioButtonIndex].code;
    const promoCodeId = coupons[selectedRadioButtonIndex].id;
    this.setState({selectedRadioButtonIndex, promoCode, promoCodeId});
  };

  render() {
    const {item} = this.props;
    const {tabActive} = this.state;
    console.log('new Component', item);

    //     const activeStyle = {...styles.ans, backgroundColor: '#ff648a10'};
    const activeStyle = [
      styles.tabStyle,
      {
        backgroundColor: '#ff648a10',
        // backgroundColor: '#f5f5f5',
        height: hp(5.5),
        borderRadius: 5,
        marginBottom: wp(4),
        alignItems: 'center',
        paddingHorizontal: wp(3),
        flexDirection: 'row',
      },
    ];
    const activeindicator = [
      styles.tabStyle,
      {
        height: 16,
        wlableth: 16,
        borderRadius: 8,
        borderWidth: 2,
        backgroundColor: '#ff648a',
        borderColor: '#ff648a',
        marginRight: wp(3),
      },
    ];
    console.log(tabActive === item.label, tabActive, item.label);

    return (
      <View>
        <TouchableOpacity
          style={tabActive === item.label ? activeStyle : styles.ans}>
          <RadioForm animation={true} style={styles.radioForm}>
            {this.renderCouponList()}
          </RadioForm>
          <Text style={styles.ansText}>{item.value}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  questionNumber: {
    fontSize: wp(5),
    textAlign: 'center',
  },
  //   subTItle: {
  //     fontSize: wp(3.2),
  //     textAlign: 'center',
  //   },
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
});
