import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
// import RNFetchBlob from "rn-fetch-blob";
import {CameraRoll, Platform, Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

// import CameraRoll from "@react-native-community/cameraroll";

const ImageViewScreen = ({route}) => {
  const [visible, setIsVisible] = useState(true);
  const [pastedURL, setPastedURL] = useState('');
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
  console.log('[image]', route.params.image);
  const downloadImage = async() => {
    let  date =new Date()
    let imgUrl = route?.params?.image;
    let fileName = "me_"+Math.floor(date.getTime() + date.getSeconds() / 2)
    const { dirs } = RNFetchBlob.fs;
    const downloadPath = `${dirs.DocumentDir}/${fileName}`;
    const picturesPath = `${dirs.PictureDir}/${fileName}`;
  
    await RNFetchBlob.config({
      fileCache: true,
      path: downloadPath,
    }).fetch('GET', imgUrl);
  
    // Copy the downloaded file to the Pictures directory
    try {
      RNFS.exists(downloadPath).then(async(status)=>{
        if(status){
            console.log('Yay! File exists')
            await RNFS.copyFile(downloadPath, downloadPath);
            console.log('File copied to Pictures directory:', picturesPath);
        } else {
            console.log('File not exists')
        }
        })
    
    } catch (error) {
      console.error('Error copying file:', error);
    }
    return
    // const {config ,fs} = RNFetchBlob;
    //         const date = new Date();
    // const fileDir = fs.dirs.DownloadDir;
    //TODO download image task
    // 
    // 
    // const { config, fs } = RNFetchBlob
    // let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads : {
    //     useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
    //     notification : false,
    //     path:  PictureDir + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
    //     description : 'Downloading image.'
    //   }
    // }
    // config(options).fetch('GET', imgUrl).then((res) => {
    //   // do some magic here
    //   console.log('res',res)
    //   Alert.alert(`${JSON.stringify(res)} dowbloade`)
    // })

    // return

    // let newImgUri = imgUrl.lastIndexOf('/');
    // let imageName = imgUrl?.substring(newImgUri);

    // let dirs = RNFetchBlob.fs.dirs;
    // let path =
    //   Platform.OS === 'ios'
    //     ? dirs['MainBundleDir'] + imageName
    //     : dirs.DocumentDir + imageName;

    // if (Platform.OS == 'android') {
    //   RNFetchBlob.config({
    //     fileCache: true,
    //     appendExt: 'mp4',
    //     indicator: true,
    //     IOSBackgroundTask: true,
    //     //   path: fileDir + 'download_'+ Math.floor(date.getDate()+ date.getSeconds()/2) +
    //     //   '.mp4',
    //     path: path,
    //     addAndroidDownloads: {
    //       useDownloadManager: true,
    //       notification: true,
    //       //     path: fileDir + 'download_'+ Math.floor(date.getDate()+ date.getSeconds()/2) +
    //       //     '.mp4',
    //       description: 'Image',
    //     },
    //   })
    //     .fetch('GET', imgUrl)
    //     .then(res => {
    //       console.log(res.path(), 'file saved to');
    //       Alert.alert('File downloaded successfully');
    //     });
    // } else {
    //   CameraRoll.saveToCameraRoll(imgUrl);
    // }
  };

  requestStoragePermission();
  return (
    <View style={{flex: 1}}>
      {/* <ImageView
        images={[{uri: route?.params.image}]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      /> */}

      <Image
        style={{width: '100%', height: '80%'}}
        resizeMode="contain"
        source={{uri: route?.params.image}}
      />
      <TouchableOpacity
        onPress={() => {
          if (route?.params.image !== '') {
            downloadImage();
            Alert.alert('file downloaded successfully');
          } else {
            Alert.alert('Please add file');
          }
        }}
        style={{
          width: '90%',
          height: 40,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'blue',
          alignSelf: 'center',
        }}>
        <Text style={{color: 'white'}}>Download </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageViewScreen;
