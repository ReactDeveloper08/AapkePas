import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Styles
import basicStyles from 'styles/BasicStyles';

// Components
import HeaderComponents from 'components/HeaderComponents';

class Chat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponents headerTitle="User Name" nav={this.props.navigation} />
        <View style={basicStyles.mainContainer}>
          <View style={basicStyles.flexOne} />
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingHorizontal,
              styles.inputContainer,
            ]}>
            <TextInput
              placeholder="Say something... hello"
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="send"
                color="#333"
                size={16}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f2f1f1',
    backgroundColor: '#fff',
  },

  input: {
    height: hp(6),
    fontSize: wp(3.2),
    flex: 1,
  },
});

export default Chat;
