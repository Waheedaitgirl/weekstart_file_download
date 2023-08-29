import React, {useState, useEffect, useCallback} from 'react';
import {
  Pressable,
  Image,
  ActivityIndicator,
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {commonStyles, textStyles} from '../../styles';
import CustomHeader from '../../components/CustomHeader';
import {scale, verticalScale} from 'react-native-size-matters';
import TimeSheetItem from './TimeSheetItem';
import CommentsBox from './CommentsBox';
import {AppScreenWidth} from '../../constants/sacling';
import Spacer from '../../components/Spacer';
import DrawLine from '../../components/DrawLine';
import WeeklySummary from './Summary';
import {colors} from '../../constants/theme';
import {useSelector} from 'react-redux';
import {timeSheetDetailsById} from '../../api';
import moment from 'moment';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const DetailsSheetScreen = ({navigation, route}) => {
  const {user} = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(true);
  const [time_sheet_details, setTimeSheetDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [time_types, setTimeTypes] = useState([]);
  const [error, setError] = useState(false);
  const [filepath, setFilePath] = useState({
    path: null,
    ext: null,
    name: null,
  });

  let item = route.params.item;
  const status = item.module_status_name;

  // console.log('item',item);
  useEffect(() => {
    timeSheetDetailsById(item.time_sheet_id, user.account_id)
      .then(response => {
        console.log('pagal', response.data);
        if (response.status === 200) {
          console.log(response);
          if (response.data.data.document_file !== null) {
            setFilePath({
              ...filepath,
              path: response.data?.data?.document_file,
              name: response.data?.data?.document_title,
            });
          }
          let data = groupBy(response.data.logs, 'type');
          setTimeSheetDetails(response.data.data);
          setTimeTypes(response.data.time_types);
          setLogs(Object.entries(data));
          setLoading(false);
        } else {
          console.log('error', response.status);
          setError(true);
        }
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });
  }, []);

  function groupBy(arr, property) {
    return arr?.reduce(function (memo, x) {
      if (!memo[x[property]]) {
        memo[x[property]] = [];
      }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }

  let getMonday = d => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toDateString();
  };
  const onStatusHandler = useCallback((time_sheet_id, statusCode) => {
    Alert.alert(
      'Attention!',
      `Are you Sure want to ${statusCode === 0 ? 'Reject' : 'Approve'}?`,
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            //uri ? copy kro

            statusCode === 1
              ? route.params?.onAccept(time_sheet_id)
              : route.params?.OnRejected(time_sheet_id);

            navigation?.goBack();
          },
          style: 'cancel',
        },
      ],
    );
  }, []);

  if (loading || time_sheet_details === null) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            onPress={() => navigation.goBack()}
            title={'TimeSheet Detail'}
          />
          <Spacer height={AppScreenWidth} />
          <ActivityIndicator size={'large'} color={colors.dark_primary_color} />
        </View>
      </SafeAreaProvider>
    );
  }
  if (error) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            onPress={() => navigation.goBack()}
            title={'TimeSheet Detail'}
          />
          <Spacer height={AppScreenWidth / 2} />
          <Image
            source={require('../../assets/images/error.gif')}
            style={{
              width: verticalScale(150),
              height: verticalScale(150),
              resizeMode: 'contain',
            }}
          />
        </View>
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider>
      <CustomStatusBar />
      <SafeAreaView style={commonStyles.container}>
        <CustomHeader
          show_backButton={true}
          isdrawer={false}
          onPress={() => navigation.goBack()}
          title={'TimeSheet Detail'}
        />

        {item && (
          <TimeSheetItem
            time={
              item.time_sheet_view == 'Week'
                ? 'Week Starts at ' + getMonday(item.log_date)
                : 'Day ' + new Date(item.log_date).toDateString()
            }
            name={`${item.job_title} - ${time_sheet_details?.company_name}`}
            // submittedto={`Time Approver Manager - ${item?.approver_name}`}
            contactname={`Contact Manager - ${time_sheet_details?.contact_name}`}
            status={item.module_status_name}
            status_style={item.status_colour_code}
            onPress={() => {}}
          />
        )}

        <WeeklySummary
          editable={status === 'Draft' ? true : false}
          logs={logs}
          time_types={time_types}
        />

        <View style={{width: AppScreenWidth}}>
          <Text style={{...textStyles.smallheading, color: '#0090FF'}}>
            Comments
          </Text>
          {/* <TouchableOpacity style = {{width : 50, height: 50}} onPress = {()=> {
            navigation.navigate('ImageView',{
              image: comment 
            });
            
          }} >

          <Image
            style={styles.imageStyle}
            source={{
              uri: comment
            }}
          
          />
          
          </TouchableOpacity> */}
          <DrawLine marginTop={scale(5)} />
          <DrawLine marginTop={scale(1)} />
          {/* <CommentsBox
            title={'Approver Comment'}
            // name={'Approver'}
            name={time_sheet_details.approver_comments}
            // comment={
            //   time_sheet_details.approver_comments === ''
            //     ? null
            //     : time_sheet_details.approver_comments
            // }
            editable={true}
          /> */}
          <CommentsBox
            title={'Submitter Comment'}
            name={time_sheet_details.comments}
            comment={time_sheet_details.comments}
          />

          <TouchableOpacity
          style={{width: 50, height: 50}}
          onPress={() => {
            navigation.navigate('ImageView', {
              image: 'https://storage.googleapis.com/recruitbpm-document/' +
              'production' +
              '/' +
              time_sheet_details.document_file,
            });
          }}


          
          >
            <Image
              style={styles.imageStyle}
              source={{
                uri:
                  'https://storage.googleapis.com/recruitbpm-document/' +
                  'production' +
                  '/' +
                  time_sheet_details.document_file,
              }}
            />
          </TouchableOpacity>

          {/* <CommentsBox
            title={'Receipt'}
            comment={
              'https://storage.googleapis.com/recruitbpm-document/' +
              'production' + 
              '/' +
              time_sheet_details.document_file
            }
            // time_sheet_details.document_title
            // filename={"https://storage.googleapis.com/recruitbpm-document/" + time_sheet_details.subdomain + "/" + time_sheet_details.document_file}
          /> */}
          {/* <Image
            style={styles.imageStyle}
            source={{
              uri: filename
            }}
          /> */}
        </View>

        <View style={styles.HiddenBtnView}>
          {item.module_status_name === 'Submitted' ? (
            <>
              <Pressable
                style={styles.Acceptbtn}
                onPress={() => onStatusHandler(item.time_sheet_id, 1)}>
                <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
                <Text style={{...textStyles.Label, color: '#fff'}}>
                  Approve
                </Text>
              </Pressable>
              <View style={{height: 1}} />
              <Pressable
                style={styles.RejectBtn}
                onPress={() => onStatusHandler(item.time_sheet_id, 0)}>
                <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
                <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
              </Pressable>
            </>
          ) : item.module_status_name === 'Rejected' ? (
            <Pressable
              style={styles.Acceptbtn}
              onPress={() => onStatusHandler(item.time_sheet_id, 1)}>
              <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
              <Text style={{...textStyles.Label, color: '#fff'}}>Approve</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.RejectBtn}
              onPress={() => onStatusHandler(item.time_sheet_id, 0)}>
              <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
              <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DetailsSheetScreen;

const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
  },
  Acceptbtn: {
    paddingVertical: 5,
    backgroundColor: 'green',
    flex: 1,
    borderRadius: 5,
    // marginBottom: 10,
    borderWidth: 0,
    marginHorizontal: 24,
    // width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  RejectBtn: {
    paddingVertical: 5,
    marginHorizontal: 24,
    flex: 1,
    backgroundColor: colors.delete_icon,
    borderRadius: 5,
    borderWidth: 0,
    justifyContent: 'center',
    //width: scale(100),
    alignItems: 'center',
  },

  HiddenBtnView: {
    marginTop: 24,
    flexDirection: 'row',
    backgroundColor: '#fff',
    //  alignItems: 'flex-end',
    // height: '100%',
    justifyContent: 'center',
    // paddingHorizontal: scale(20),
    // paddingVertical: scale(20),
  },
});
