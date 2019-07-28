'use strict';
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, alert } from 'react-native';
import Theme from '../utils/Theme';
import Upyun from '../utils/Upyun';
import ImagePicker from 'react-native-image-crop-picker';
import MyToast from './MyToast';
import ModalMenu from './ModalMenu';

export default class ImageSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  render() {
    const { images } = this.state;
    return (
      <View {...this.props}>
        <View  style={{flexDirection: 'row', margin: -2, flexWrap: 'wrap'}}>
        {
          images.map((image, index)=>{
            return this._renderImage(image, index);
          })
        }
        { images.length<9 ? this._renderSelectMore() : null}
        </View>
      </View>
    )
  }

  _renderSelectMore() {
    const { images, count } = this.state;
    if (count != 9)
      return (
        <TouchableOpacity activeOpacity={0.8} onPress={this._onSelectMorePress}>
          <Image style={{width: 100, height: 100, margin: 2}} source={require('../../img/compose_pic_add.png')} />
        </TouchableOpacity>
      )
    return null;
  }

  _renderImage(image, index) {
    return (
      <TouchableWithoutFeedback key={index} onPress={()=>{console.log('image press');}}>
        <View>
          <Image style={{width: 100, height: 100, margin: 2}} source={image} />
          <TouchableWithoutFeedback onPress={()=>{this._onImageDeletePress(index);}}>
            <Image style={{width: 16, height: 16, position: 'absolute', right: 2, top: 2}} source={require('../../img/compose_delete.png')}/>
          </TouchableWithoutFeedback>    
        </View>
      </TouchableWithoutFeedback>
    )
  }

  _onImageDeletePress = (index)=> {
    this.state.images.splice(index, 1);
    this.setState({
      images: this.state.images,
    });    
  };

  onImageSelected = (response) => {
    const images = this.state.images;
    images.push({uri: response.path});
    this.setState({images: images, count:this.state})
  }

  onImagesSelected = (response) => {
    const images = this.state.images;
    for (let i in response) {
      if (images.length == 9) {
        MyToast.show('最多9张图片, 多余的已被忽略');
        return
      }
      let image = { uri: response[i].path, uploaded_url: null };
      images.push(image);
      this.setState({ images: images, });
    }
  };

  _onSelectMorePress = ()=> {

    const cameraConfig = {
      compressImageQuality: 0.95,
      mediaType: 'photo',
      cropping: false,
    }

    const pickerConfig = {
      multiple: true,
      mediaType: 'photo',
      compressImageQuality: 0.95,
    }

    ModalMenu.showMenu([
      {name:'拍照', callback:()=>{ImagePicker.openCamera(cameraConfig).then(this.onImageSelected)}},
      {name:'相册', callback:()=>{ImagePicker.openPicker(pickerConfig).then(this.onImagesSelected)}},
    ]);

  };

  _isImagesUploaded = () => {
    const images = this.state.images;
    let uploaded_count = 0;
    for (let i = 0; i < images.length; i++) {
      if (images[i].uploaded_url)
        uploaded_count++;
    }
    return (uploaded_count == images.length);
  };

  uploadImages = (prefix, successCallback, errorCallback) => {
    const images = this.state.images;
    console.log('uploadImages', images);
    if (this._isImagesUploaded()) {
      successCallback(images); 
    }
    else {
      let failed = false;
      for (let i = 0; i < images.length; i++) {
        MyToast.show(`正在上传第${i+1}张图片`, {length:'long'});
        (function(image) {
          if (!image.uploaded_url) {
            Upyun.upload({fileUri:image.uri, prefix: prefix}, (uploaded_url)=>{
              image.uploaded_url = uploaded_url;
              if (this._isImagesUploaded()) {
                successCallback(images); 
              }
            }, (error)=>{
              if (!failed) {
                failed = true;
                errorCallback(error);
              }
            }) 
          }
        }).bind(this)(images[i]);
      }     
    }
  }
}
