import React, {useEffect, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale} from 'react-native-size-matters';
// import RNFetchBlob from "rn-fetch-blob";
import CameraRoll from '@react-native-community/cameraroll';
import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {HamburgerIcon} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { set } from 'react-native-reanimated';
const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

const ImageViewScreen = ({route}) => {
  const [visible, setIsVisible] = useState(true);
  const [pastedURL, setPastedURL] = useState('');
  const [ext, setExt] = useState(null);
  useEffect(() => {
     setExt(getFileExtention(route?.params?.file));
  Platform.OS==='android' &&  requestStoragePermission();
  }, []);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Download file storage Permission',
          message:
            'Downloader file needs to access storage ' +
            'you can download file.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log('You can use the camera');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadImage = () => {
    let date = new Date();

    // ..............File URl which we want to download ................ ///

    let Url = route?.params?.file;

    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir; // this is the pictures directory. You can check the available directories in the wiki.
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        // path:path,
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.png' +
          '.docx' +
          '.pdf',
        // this is the path where your downloaded file will live in
        description: 'Downloading file...',
      },
    };
    config(options)
      .fetch('GET', Url)
      .then(res => {
        // Alert after successful downloading
        console.log('res ->', JSON.stringify(res)); //'res',
        //  Alert.alert('Downloaded Successfuly.');
      });

    function getFileExtension(Url) {
      return Url.split(/[#?]/)[0].split('.').pop().trim();
    }

    let newImgUri = Url.lastIndexOf('/');
    let imageName = Url?.substring(newImgUri);

    // let dirs = RNFetchBlob.fs.dirs;
    // let path =
    //   Platform.OS === 'ios'
    //     ? dirs['MainBundleDir'] + imageName
    //     : dirs.DocumentDir + imageName;

    // if (Platform.OS == 'android') {
    RNFetchBlob.config({
      fileCache: true,
      // appendExt: 'mp4',
      indicator: true,
      IOSBackgroundTask: true,
      path:
        RootDir +
        '/file_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      // fileDir + 'download_'+ Math.floor(date.getDate()+ date.getSeconds()/2) +
      //  '.mp4',
      //  path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        // path:path,`
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        // fileDir + 'download_'+ Math.floor(date.getDate()+ date.getSeconds()/2) +
        // '.mp4',
        description: 'File',
      },
    })
      .fetch('GET', Url)
      .then(res => {
        console.log(res.path(), 'file saved to');
        // Alert.alert('File downloaded successfully');
      });
    // } else {
    //   CameraRoll.saveToCameraRoll(Url);
    // }
  };

 
  return (
    <View style={{flex: 1}}>
      {/* <ImageView
        images={[{uri: route?.params.image}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      /> */}

      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
        {ext == 'pdf' ? (
          <AntDesign name={'pdffile1'} color={'red'} size={100} />
        ) : ext == 'png' || ext == 'jpg' ? (
          <Image
            style={{width: '100%', height: '80%'}}
            resizeMode="contain"
            source={{uri: route?.params.file}}
          />
        ) : ext == 'doc' || ext == 'docx' ? (
          <AntDesign name={'wordfile1'} color={'blue'} size={100} />
        ) : (
          <Text>No File Found!</Text>
        )}
      </View>
      <View style={{flex: 0.2}}>
        <TouchableOpacity
          onPress={() => {
            if (route?.params.file !== '') {
              console.log('PATH URL', route?.params.file);
              downloadImage();
              Alert.alert('file downloaded successfully');
            } else {
              Alert.alert('Please add file');
            }
          }}
          style={{
            width: '90%',
            height: 60,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
            alignSelf: 'center',
          }}>
          {/* {ext == 'pdf' ? (
            <AntDesign name={'pdffile1'} color={'#fff'} size={20} />
          ) : ext == 'png' || ext == 'jpg' ? (
            <Entypo name={'images'} color={'#fff'} size={20} />
          ) : ext == 'doc' || ext == 'docx' ? (
            <AntDesign name={'wordfile1'} color={'#fff'} size={20} />
          ) : (
            <Entypo />
          )} */}
          <Text style={{color: 'white'}}>Download </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageViewScreen;

const styles = StyleSheet.create({
  btnView: {
    marginBottom: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
