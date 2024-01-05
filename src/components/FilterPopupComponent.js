import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import ic_close from 'assets/icons/ic_close.png';
import {NativeBaseProvider, sl} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
// Vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {makeRequest, BASE_URL} from 'api/ApiInfo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styled from 'styled-components/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from 'styles/BasicStyles';

import {withPreventDoubleClick} from 'ViewUtils/Click';
const Touchable = withPreventDoubleClick(TouchableOpacity);

const SliderWrapper = styled.View`
  width: 80%;
  justify-content: center;
`;

const ViewContainer = styled.View`
  align-self: center;
  justify-content: center;
`;
const LabelWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 0;
`;

const LabelText = styled.Text`
  font-size: 16px;
`;
class FilterPopupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
      activeLanguage: '',
      activeSpecialty: '',
      activeMethod: '',
      languageData: [{name: 'Hindi'}, {name: 'English'}, {name: 'Panjabi'}],
      filterData: [
        {name: 'Anxiety'},
        {name: 'Stress'},
        {name: 'Relationship'},
        {name: 'Dedication'},
        {name: 'Depression'},
        {name: 'Behaviour'},
        {name: 'Phobia'},
      ],
      methodData: [{name: 'Call'}, {name: 'Chat'}, {name: 'Video'}],
      multiSliderValue: [0, 100],
      languageSelect: '',
      specialtySelect: '',
      methodSelect: '',
    };
    this.parentView = null;
  }

  async componentDidMount() {
    this.handleDataSync();
  }

  async handleDataSync() {
    try {
      const languages = await makeRequest(
        BASE_URL + 'api/Customer/language',
        null,
      );
      const skill = await makeRequest(BASE_URL + 'api/Customer/skills', null);
      console.log('language', languages, 'skills', skill);
      if (languages && languages.success === true) {
        this.setState({languageData: languages.Languages});
      }
      if (skill && skill.success === true) {
        this.setState({filterData: skill.Skills});
      }
    } catch (error) {}
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  handleCodeChange = vendorCode => {
    this.setState({vendorCode});
  };

  handleShortcut = () => {
    this.props.nav.navigate('ShortCut');
  };

  handleBlockList = () => {
    this.props.nav.navigate('BlockList');
  };

  languageItem = ({item, index}) => {
    const tabStyle =
      this.state.activeLanguage === index
        ? styles.activeTileStyle
        : styles.tileStyle;
    const tabTextStyle =
      this.state.activeLanguage === index
        ? styles.activeTabText
        : styles.tabText;
    const handleActive = (item, index) => {
      console.log(item, index);
      this.setState({activeLanguage: index, languageSelect: item.id});
    };
    return (
      <Touchable style={tabStyle} onPress={() => handleActive(item, index)}>
        <Text style={tabTextStyle}>{item.name}</Text>
      </Touchable>
    );
  };

  filterItem = ({item, index}) => {
    const tabStyle =
      this.state.activeSpecialty === index
        ? styles.activeTileStyle
        : styles.tileStyle;
    const tabTextStyle =
      this.state.activeSpecialty === index
        ? styles.activeTabText
        : styles.tabText;
    const handleActive = (item, index) => {
      console.log(item, index);
      this.setState({activeSpecialty: index, specialtySelect: item.id});
    };
    return (
      <Touchable style={tabStyle} onPress={() => handleActive(item, index)}>
        <Text style={tabTextStyle}>{item.name}</Text>
      </Touchable>
    );
  };

  methodItem = ({item, index}) => {
    const tabStyle =
      this.state.activeMethod === index
        ? styles.activeTileStyle
        : styles.tileStyle;
    const tabTextStyle =
      this.state.activeMethod === index ? styles.activeTabText : styles.tabText;
    const handleActive = (item, index) => {
      console.log(item, index);
      this.setState({activeMethod: index, methodSelect: item.name});
    };
    return (
      <Touchable style={tabStyle} onPress={() => handleActive(item, index)}>
        <Text style={tabTextStyle}>{item.name}</Text>
      </Touchable>
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  async onApplyPress() {
    try {
      const {languageSelect, specialtySelect, methodSelect, multiSliderValue} =
        this.state;
      const params = {
        catId: specialtySelect,
        languageId: languageSelect,
        consultationMethod: methodSelect,
        minPrice: multiSliderValue[0],
        maxPrice: multiSliderValue[1],
      };
      console.log(params);
      const filterData = await makeRequest(
        BASE_URL + 'api/Customer/filter',
        params,
      );
      if (filterData && filterData.success === true) {
        const filData = filterData.astrologers;
        this.props.nav.navigate('ExpertsList', {filData});
        this.props.closePopup();
      } else if (filterData && filterData.success === false) {
        this.clearData();
        alert(`Data can't filter`);
      }
    } catch (error) {
      console.log('error in apply filter response !');
    }
  }

  clearData = () => {
    try {
      this.setState({
        activeLanguage: '',
        activeSpecialty: '',
        activeMethod: '',
        multiSliderValue: [0, 100],
      });
      this.handleDataSync();
    } catch (error) {
      console.log('error while clear data');
    }
  };

  render() {
    const multiSliderValuesChange = values =>
      this.setState({multiSliderValue: values});
    return (
      <SafeAreaView
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text style={[basicStyles.headingXLarge]}>Filters</Text>

            <Touchable onPress={this.handleApply}>
              <Image
                source={ic_close}
                resizeMode="cover"
                style={styles.closeIcon}
              />
            </Touchable>
          </View>
          <View style={basicStyles.separatorHorizontal} />

          <Text style={[basicStyles.heading, {marginBottom: wp(2)}]}>
            Language
          </Text>
          <FlatList
            data={this.state.languageData}
            renderItem={this.languageItem}
            keyExtractor={this.keyExtractor}
            numColumns="3"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={[styles.listContainer]}
            extraData={this.state}
          />

          <Text style={[basicStyles.heading, {marginBottom: wp(2)}]}>
            Specialty
          </Text>
          <FlatList
            data={this.state.filterData}
            renderItem={this.filterItem}
            keyExtractor={this.keyExtractor}
            numColumns="3"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
            extraData={this.state}
          />

          <Text style={[basicStyles.heading, {marginBottom: wp(2)}]}>
            Consultation Method
          </Text>
          <FlatList
            data={this.state.methodData}
            renderItem={this.methodItem}
            keyExtractor={this.keyExtractor}
            numColumns="3"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
            extraData={this.state}
          />

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.paddingVentricle,
            ]}>
            <Text style={basicStyles.heading}>Price</Text>
            {/* <Text style={basicStyles.heading}>₹ 100.00</Text> */}
          </View>

          <View>
            <ViewContainer>
              <SliderWrapper>
                <LabelWrapper>
                  <LabelText>{this.state.multiSliderValue[0]} </LabelText>
                  <LabelText>{this.state.multiSliderValue[1]}</LabelText>
                </LabelWrapper>
                <MultiSlider
                  markerStyle={{
                    ...Platform.select({
                      ios: {
                        height: 30,
                        width: 30,
                        shadowColor: '#000000',
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                        shadowRadius: 1,
                        shadowOpacity: 0.1,
                      },
                      android: {
                        height: 20,
                        width: 20,
                        borderRadius: 50,
                        backgroundColor: '#1792E8',
                      },
                    }),
                  }}
                  pressedMarkerStyle={{
                    ...Platform.select({
                      android: {
                        height: 20,
                        width: 20,
                        borderRadius: 20,
                        backgroundColor: '#148ADC',
                      },
                    }),
                  }}
                  selectedStyle={{
                    backgroundColor: '#1792E8',
                  }}
                  trackStyle={{
                    backgroundColor: '#CECECE',
                  }}
                  touchDimensions={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    slipDisplacement: 40,
                  }}
                  values={[
                    this.state.multiSliderValue[0],
                    this.state.multiSliderValue[1],
                  ]}
                  sliderLength={280}
                  onValuesChange={multiSliderValuesChange}
                  min={0}
                  max={100}
                  allowOverlap={false}
                  minMarkerOverlapDistance={10}
                />
              </SliderWrapper>
            </ViewContainer>
          </View>

          <View style={basicStyles.separatorHorizontal} />

          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <Touchable style={[styles.clearButton]} onPress={this.clearData}>
              <Text style={[styles.clearText]}>Clear All</Text>
            </Touchable>
            <Touchable
              style={[styles.applyButton]}
              onPress={() => this.onApplyPress()}>
              <Text style={[styles.applyText]}>Apply</Text>
            </Touchable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  closeIcon: {
    height: wp(4),
    aspectRatio: 1 / 1,
  },

  listContainer: {
    marginBottom: wp(3),
  },

  tabText: {
    fontSize: wp(3),
    color: '#333',
  },

  activeTabText: {
    fontSize: wp(3),
    color: '#fff',
  },

  popupContainer: {
    width: wp(100),
    backgroundColor: 'white',
    padding: wp(5),
    minHeight: hp(40),
    borderTopRightRadius: wp(6),
    borderTopLeftRadius: wp(6),
  },
  indicator: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff648a',
    marginRight: wp(3),
  },
  tileStyle: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: wp(26),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
    marginHorizontal: wp(1),
  },
  activeTileStyle: {
    borderColor: '#ff648a',
    borderWidth: 1,
    width: wp(26),
    height: hp(4),
    backgroundColor: '#ff648a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
    marginHorizontal: wp(1),
  },
  separator: {
    height: wp(3),
  },
  clearButton: {
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#ff648a',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
    borderRadius: wp(1),
  },
  clearText: {
    color: '#ff648a',
    fontWeight: '700',
    fontSize: wp(4),
  },
  applyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
  rangeSlider: {
    width: wp('90%'),
    height: hp(5.5),
    alignSelf: 'center',
  },
});

export default FilterPopupComponent;
