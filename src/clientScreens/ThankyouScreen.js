import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Images
import thankyou from 'assets/images/thankyou.png';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleBack = () => {
    this.props.navigation.navigate('MyExperts');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image source={thankyou} resizeMode="cover" style={styles.thankyou} />
          <Text style={styles.msg}>You will get a call from our Expert</Text>
          <Text style={styles.name} />
          <Text style={styles.note}>
            Note- In case you don't Receive a call, Please select another expert
            and try again
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={this.handleBack}
            underlayColor="#fa4e7a80">
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    paddingHorizontal: wp(3),
    paddingTop: wp(2),
    fontSize: wp(5),
    color: '#fa4e7a',
    fontWeight: '700',
  },

  thankyou: {
    height: wp(20),
    aspectRatio: 1 / 1,
    paddingTop: wp(2),
  },
  msg: {
    fontSize: wp(4),
  },
  note: {
    textAlign: 'center',
    marginTop: hp(5),
  },
  backButton: {
    backgroundColor: '#fa4e7a',
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    marginTop: hp(3),
    borderRadius: 5,
  },
  backText: {
    color: '#fff',
    fontSize: wp(3.5),
  },
});
