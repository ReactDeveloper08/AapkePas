import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  // heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import video_bg_1 from 'assets/images/video_bg_1.png';
import ic_play from 'assets/icons/ic_play.png';

export default class LiveTileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleVideo = () => {
    this.props.nav.navigate('VideoCall');
  };

  render() {
    const {
      EndTime,

      expertImage,
      expertName,
      secheduleName,
      startTime,
    } = this.props.item;
    return (
      <TouchableOpacity
        style={styles.tileContainer}
        underlayColor="transparent"
        onPress={this.handleVideo}>
        <ImageBackground
          source={video_bg_1}
          resizeMode="cover"
          style={styles.videoBg}>
          <Text style={styles.title}>{secheduleName}</Text>
          <View style={styles.dataContainer}>
            <Image
              source={{uri: expertImage}}
              resizeMode="cover"
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{expertName}</Text>
              <Text style={styles.Duration}>Start: {startTime}</Text>
              <Text style={styles.Duration}>End: {EndTime}</Text>
              <Image source={ic_play} resizeMode="cover" style={styles.icon} />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tileContainer: {
    width: wp(60),
    minHeight: wp(30),
    borderRadius: 10,
  },
  videoBg: {
    // width:"100%",
    // aspectRatio: 3 / 1.9,
    borderRadius: 10,
    padding: wp(3),
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    marginBottom: wp(2),
  },
  icon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  imgContainer: {
    // width:wp(30),
    flexDirection: 'column',
  },
  image: {
    width: wp(20),
    marginRight: wp(2),
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
  name: {
    fontSize: wp(3),
    color: '#fff',
    marginBottom: wp(1),
  },
  Duration: {
    fontSize: wp(3),
    color: '#fff',
    marginBottom: wp(1),
  },
});
