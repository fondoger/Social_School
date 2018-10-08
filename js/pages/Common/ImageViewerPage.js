'use strict';
import React from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Gallery from 'react-native-image-gallery';
import Theme from '../../utils/Theme';
import FastImage from 'react-native-fast-image';

/*
* Note:
* 1.`react-native-image-gallery` will call Image.getSize() method to get the
* dimensions of pictures. So, we need to provide thumbnail image url to `images`
* property of `react-native-image-gallery`, instead of the large image url, in 
* order to avoid loading twice or loading failed. 
*/

class PlaceholderImage extends React.Component {
  state = { loading: false, }
  render() {
    return (
      <View {...this.props}>
        <Image {...this.props} 
               style={StyleSheet.absoluteFill} 
               source={{uri:this.props.source.uri}}/>
        <FastImage
            style={{flex:1}} 
            source={this.props.source.load?
              {uri:this.props.source.uri.replace('!mini5', '!large')}:null
            } 
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={()=>this.setState({loading:true})}
            onLoadEnd={()=>this.setState({loading:false})}
        />
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]} >
          <View style={{opacity:this.state.loading?0.5:0}}>
            <ActivityIndicator size='large' color='#fff'/>
          </View>
        </View>
      </View>
    )
  }
}

export default class ImageViewerPage extends React.Component {
  static navigationOptions ={
    header: null
  }
  
  constructor(props) {
    super(props);
    const { images, initialImage }  = this.props.navigation.state.params;
    this.state = {
      index: initialImage,
      images: images,
    }
  }

  componentDidMount() {
    const images = this.state.images;
    for (let i in images) {
      fetch(images[i].source.uri.replace('!mini5', '!info'))
      .then(response => response.json())
      .then(responseJson => {
        const {width, height} = responseJson;
        // 策略: 短边限制为1280, 长边自适应
        const ratio = height / width;
        let actualWidth = 0;
        let actualHeight = 0;
        if (height < width && height > 1280) {
          actualHeight = 1280;
          actualWidth = actualHeight / ratio;
        } else if (width <= height && width > 1280) {
          actualWidth = 1280;
          actualHeight = actualWidth * ratio;
        } else {
          actualWidth = width;
          actualHeight = height;
        }
        /* must create another object to force update */
        let newImage = {
          dimensions: { width: actualWidth, height: actualHeight },
          source: {uri: images[i].source.uri, load: images[i].source.load},
        }
        images[i] = newImage;
        //if (Debug.log)
        this.setState({images:images});
      });
    }
  }

  onPageSelected = (index) => {
    const images = this.state.images;
    images[index].source.load = true;
    this.setState({index: index, images});
  }

  render() {
    return (
      <View style={styles.container}>
        <Gallery
          imageComponent={(image, dimension) => <PlaceholderImage {...image}/>}
          style={styles.gallery}
          initialPage={this.props.navigation.state.params.initialImage}
          onSingleTapConfirmed={()=>{
            this.props.navigation.goBack();
          }}
          images={this.state.images}
          onPageSelected={this.onPageSelected}
          flatListProps={{showsHorizontalScrollIndicator:false}}
        />
        {this.state.images.length!=1?this.renderIndicateDots():null}
      </View>
    );
  }

  renderIndicateDots() {
    return (
      <View style={styles.dotContainerOuter}>
        <View style={styles.dotContainer}>
        {
          this.state.images.map((item, index)=>(
            <View key={index.toString()} 
                  style={[styles.dots, {backgroundColor:
                  this.state.index==index?'#bbb':'#444'}]} 
            />
          ))
        }
        </View>
      </View>
    )
  }

  componentWillMount() {
    StatusBar.setHidden(true, 'slide');
  }
  componentWillUnmount() {
    StatusBar.setHidden(false, 'slide');
  }
}


const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent:'center', 
    alignItems:'center',
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
    position:'absolute', 
    bottom: 16, 
    flexDirection:'row'
  },
  dotContainer: {
    flex:1, 
    flexDirection:'row', 
    justifyContent:'center', 
    alignItems:'center'
  },
  dots: {
    borderRadius: 3,
    width: 6,
    margin: 7,
    height: 6,
  },
})