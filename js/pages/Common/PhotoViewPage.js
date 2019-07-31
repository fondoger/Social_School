'use strict';
import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Gallery from 'react-native-image-gallery';
import FastImage from 'react-native-fast-image';
import { HeaderLeft } from '../../components';
import { SafeAreaView } from 'react-navigation';
import Theme from '../../utils/Theme';

// const _photos = [
//     "http://asserts.fondoger.cn/status/0cd64564eac3c8e6603791d69eed6ef3.webp",
//     "http://asserts.fondoger.cn/status/437a3bfb695a9be2ed4ecb4608c1253e.webp",
//     "http://asserts.fondoger.cn/status/7ee06cddd006f9aaa704468151fae905.webp",
//     "http://asserts.fondoger.cn/status/3071c3ec222869eb197238207b74a702.webp",
// ];

// const photos = _photos.map((photo, index) => ({ 
//     source: { uri: photo + '!thumbnail', bigUri: photo, loadBig: false, index: index },
//     dimensions: {},
// }));

/*
    params(passed in with navigation props): 

    initialImage: index of the initial image,
    images: [{ source: {uri: <small_image_url>, bigUri <big_image_url> } }, ...]

*/


class PlaceholderImage extends React.Component {
  state = { loading: false, }
  render() {
    const source = this.props.source;
    return (
      <View {...this.props}>
        <FastImage {...this.props}
          style={StyleSheet.absoluteFill}
          source={source} />
        <FastImage
          style={{ flex: 1 }}
          source={source.loadBig ? { uri: source.bigUri } : null}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => this.setState({ loading: true })}
          onLoad={(e) => {
            source.onImageLoad(source.index, e.nativeEvent.width, e.nativeEvent.height);
          }}
          onLoadEnd={() => { this.setState({ loading: false }); }}
        />
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]} >
          <ActivityIndicator size='large' color='#fff' style={{ opacity: this.state.loading ? 0.5 : 0 }} />

        </View>
      </View>
    )
  }
}

export default class PhotoViewPage extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    const params = props.navigation.state.params;
    this.state = {
      initialImage: params.initialImage || 0,
      images: params.images,
      index: 0,
    }
  }

  onImageLoad(index, width, height) {
    const images = this.state.images;
    // Important: must creat a new object to force
    // `TransformableImage` to update dimensions
    const image = { ...images[index] };
    image.dimensions = { width, height };
    images[index] = image;
    this.setState({ index: index, images: images });
  }

  onPageSelected(index) {
    const images = this.state.images;
    if (images[index].source.bigUri) {
      images[index].source.loadBig = true;
      images[index].source.index = index;
      images[index].source.onImageLoad = this.onImageLoad.bind(this);
      this.setState({ index: index, images: images });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Gallery
          style={styles.gallery}
          images={this.state.images}
          initialPage={this.state.initialImage}
          imageComponent={image => { return <PlaceholderImage {...image} />; }}
          onPageSelected={this.onPageSelected.bind(this)}
          onSingleTapConfirmed={this.props.navigation.goBack.bind(this)}
          flatListProps={{ showsHorizontalScrollIndicator: false }}
        />
        <View style={{ position: "absolute" }}>
          <SafeAreaView style={{ paddingTop: Theme.statusBarHeight + 4, paddingLeft: 12 }}>
            <HeaderLeft tintColor="#fff" />
          </SafeAreaView>
        </View>
        {this.state.images.length > 1 ? this.renderIndicateDots() : null}
      </View>
    );
  }

  renderIndicateDots() {
    return (
      <View style={styles.dotContainerOuter}>
        <View style={styles.dotContainer}>
          {
            this.state.images.map((item, index) => (
              <View key={index.toString()}
                style={[styles.dots, {
                  backgroundColor:
                    this.state.index == index ? '#bbb' : '#444'
                }]}
              />
            ))
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  gallery: {
    flex: 1,
    backgroundColor: 'black',
  },
  dotContainerOuter: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row'
  },
  dotContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dots: {
    borderRadius: 3,
    width: 6,
    margin: 7,
    height: 6,
  },
})