import React, {PureComponent} from 'react';
import {View} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class ImageViewPopUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      vendorCode:
        'Thankyou for following hop to see you again. So come and lets solve your problems.',
    };

    this.parentView = null;
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

  render() {
    const {image} = this.props;

    if (image != null) {
      var obj = image.map(key => ({url: key.image}));
    }

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ImageViewer
            imageUrls={obj}
            onSwipeDown={() => {
              console.log('onSwipeDown');
            }}
            onMove={data => console.log(data)}
            enableSwipeDown
          />
        </View>
      </View>
    );
  }
}

export default ImageViewPopUp;

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
  popupContainer: {
    width: wp(100),
    height: hp(75),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // backgroundColor: 'white',
    // padding: wp(5),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: wp(2),
  },
  applyButton: {
    backgroundColor: '#fd6c33',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    borderRadius: wp(1),
    alignItems: 'center',
    // marginTop: 'auto',
    // marginBottom: hp(2),
    // alignSelf: 'center',
    marginTop: wp(3),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: wp(3.2),
  },
  input: {
    height: hp(10),
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    // borderWidth: 1,
    // borderColor: '#ccc',
    textAlignVertical: 'top',
  },
  textareaInput: {
    height: hp(20),
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: wp(3.2),
    padding: wp(2),
  },
  uploadImage: {
    height: wp(35),
    aspectRatio: 1 / 1.152,
    borderWidth: 1,
    borderColor: '#eae7bb',
  },
  button: {
    backgroundColor: '#fd6c33',
    // paddingVertical: wp(2),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    // alignSelf: 'flex-start',
    margin: wp(2),
    // borderRadius: hp(2.75),
    marginTop: 'auto',
  },
});
