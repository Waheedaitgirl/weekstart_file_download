import React, {useEffect, useState,useCallback} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import moment from 'moment';
import {scale, verticalScale} from 'react-native-size-matters';
import {commonStyles, textStyles} from '../../styles';
import TimeSheetFlatListItem from './TimeSheetFlatListItem';
import CustomHeader from '../../components/SearchHeader';
import {MainRoutes} from '../../constants/routes';
import {colors} from '../../constants/theme';
import {useSelector} from 'react-redux';
import {
  getUnApprovedTimeSheetExpensesListByApprooverID,
  AcceptOrRejectTimeSheetOrExpenses,
} from '../../api';
import Spacer from '../../components/Spacer';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const MODULE_ID = '52';
const UnApprovedTimeSheetListScreen = ({navigation,route}) => {


  // let isShowSearchBox = route?.params?.isAddSearchBox !=undefined ? route.params.isAddSearchBox :true;
   let isShowFilter = route?.params?.isShowFilter !=undefined ? route.params.isShowFilter :true;
  const {user} = useSelector(state => state.LoginReducer);
  const {status} = useSelector(state => state.StatusReducer);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [local_status] = useState(
    status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Submitted',
      )
      .map(o => o.module_status_id)[0],
  );
  const [error_message, setErrorMessage] = useState('');
  useEffect(() => {
    getList();
 return () => {
      setFilterData(data);
    };
  }, []);



  const FilterByTitle = title => {
    let lowerTitle = title.toLowerCase();
     let draft_data = data?.filter(item => {
    console.log('item?.created_date',
    moment(item?.created_date).format("DD-MMM-YYYY").toLowerCase())
    return (
      item?.job_title?.toLowerCase()?.includes(lowerTitle)
      ||item?.candidate_id?.toLowerCase()?.includes(lowerTitle)
       || item?.module_status_id?.toLowerCase()?.includes(lowerTitle) ||
      item?.candidate_name?.toLowerCase()?.includes(lowerTitle)
      || item?.time_sheet_view?.toLowerCase()?.includes(lowerTitle)
      || item?.time_sheet_id?.toLowerCase()?.includes(lowerTitle)
      || item?.module_status_name?.toLowerCase()?.includes(lowerTitle)
      || ((item.time_sheet_view == 'Week') ? 'Week Starts at ' + getMonday(item.log_date) : 'Day ' + new Date(item.log_date).toDateString())?.toLowerCase()?.includes(lowerTitle)
      // || item?.log_date?.toLowerCase()?.includes(lowerTitle)
      || item?.hours?.toLowerCase()?.includes(lowerTitle)
      || item?.company_name?.toLowerCase()?.includes(lowerTitle)
      || item?.time_sheet_id?.toLowerCase()?.includes(lowerTitle)
    );
  });
    // let draft_data = data?.filter(
    //   item =>
    //   item?.job_title?.toLowerCase()?.includes(lowerTitle)
    //   ||item?.candidate_id?.toLowerCase()?.includes(lowerTitle)
    //    || item?.module_status_id?.toLowerCase()?.includes(lowerTitle) ||
    //   item?.candidate_name?.toLowerCase()?.includes(lowerTitle)
    //   || item?.time_sheet_view?.toLowerCase()?.includes(lowerTitle)
    //   || item?.time_sheet_id?.toLowerCase()?.includes(lowerTitle)
    //   || item?.module_status_name?.toLowerCase()?.includes(lowerTitle)
    //   || item?.log_date?.toLowerCase()?.includes(lowerTitle)
    //   || item?.hours?.toLowerCase()?.includes(lowerTitle)
    //   || item?.company_name?.toLowerCase()?.includes(lowerTitle)
    //   || item?.time_sheet_id?.toLowerCase()?.includes(lowerTitle),
    // );

    // console.log(draft_data);
    setFilterData(draft_data);

    // return
    // let se = title.toLowerCase()
    // const regex = new RegExp(`${se}`);
    // let draft_data = data.filter(function(item){
    //     return item.module_status_name?.toLowerCase().match(regex) ||  item.comments?.toLowerCase().match(regex)
    //  })
    //  setFilterData(draft_data)
  };


  const getList = () => {
    setLoading(true);
    getUnApprovedTimeSheetExpensesListByApprooverID(
      user.id,
      '1',
      user.account_id,
      local_status,
    )
      .then(response => {
        if (response.status == 200) {
          let organizeData = response?.data?.result?.sort(
            (a, b) => {

              return new Date(b.log_date

                ) - new Date(a.log_date

                  )
            }
          );
         console.log('WAHEEDA', response?.data?.result);
          setData(organizeData);
          setFilterData(organizeData)

          //paste the function here
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
          setErrorMessage(
            'Some Error Ocured with status code' + response.status,
          );
        }
      })
      .catch(error => {
        setError(true);
        setLoading(false);
        setErrorMessage('Some Error Ocured with status code 200');
      });
  };

  let getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toDateString();
  }

  const renderItem = ({item}) => (
    <TimeSheetFlatListItem
      time={(item.time_sheet_view == 'Week') ? 'Week Starts at ' + getMonday(item.log_date) : 'Day ' + new Date(item.log_date).toDateString()}
      name={item.job_title}
      item={item}
      submittedto={`${item?.candidate_name} - ${item.company_name}`}
      status={item.module_status_name}
      status_style={item.status_colour_code}
      hours={`${item.hours} Hours`}
      onPress={() => navigation.navigate(MainRoutes.DetailsSheetScreen, {item,
        onAccept: (id)=> AccpetTimeSheet(id),
        OnRejected:(id)=>RejectTimeSheet(id)})}
      onEdit={() => navigation.navigate(MainRoutes.EditTimeSheetScreen, {item})}
      onDelete={() => getList()}
    />
  );

  const onStatusHandler = useCallback((time_sheet_id, statusCode) => {

  
    Alert.alert(
      'Attention!',
      `Are you Sure want to ${statusCode === 0 ? 'Reject' : 'Approve'}?`,
      [
        {
          text: 'No',
          onPress: () => {
            
          },
        },
        {
          text: 'Yes',
          onPress: () => {statusCode === 1
            ?AccpetTimeSheet(time_sheet_id)
            :RejectTimeSheet(time_sheet_id)
             
           ;},
          style: 'cancel',
        },
       
      ],
    );
  }, []);

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.HiddenBtnView}>
        <Pressable
          style={styles.Acceptbtn}
          onPress={() => onStatusHandler(data.item.time_sheet_id, 1)}>
          <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
          <Text style={{...textStyles.Label, color: '#fff'}}>Approve</Text>
        </Pressable>
        <Pressable
          style={styles.RejectBtn}
          onPress={() => onStatusHandler(data.item.time_sheet_id, 0)}>
          <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
          <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
        </Pressable>
      </View>
    );
  };

  const onRowDidOpen = rowKey => {};

  const AccpetTimeSheet = id => {
    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Approved',
      )
      .map(o => o.module_status_id)[0];
    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '1',
      id,
      module_status_id,
    )
      .then(response => {
        if (response.status) {
          getList();
          alert('TimeSheet request accepted successfully');
        } else {
          alert('Error While Accepting');
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const RejectTimeSheet = id => {
    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Rejected',
      )
      .map(o => o.module_status_id)[0];
    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '1',
      id,
      module_status_id,
    )
      .then(response => {
        if (response.status) {
          getList();
          alert('TimeSheet request rejected successfully');
        } else {
          alert('Error While Rejeecting');
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };
  if (loading) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            SearchPress={text => FilterByTitle(text)}
            NotificationPress={() => alert('NotificationPress')}
            // FilterPress={data => alert(data)}
            onPress={() => navigation.goBack()}
            title={'UnApproved TimeSheet'}
            // isShowSearch={isShowSearchBox}
             isShowFilter={isShowFilter}
          />
          <Spacer height={verticalScale(100)} />
          <ActivityIndicator size={'large'} color={colors.dark_primary_color} />
        </View>
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <CustomStatusBar />
      <SafeAreaView style={commonStyles.container}>
        <CustomHeader
          show_backButton={true}
          isdrawer={false}
          SearchPress={text => FilterByTitle(text)}
          // SearchPress={() => alert('Search Press')}
          NotificationPress={() => alert('NotificationPress')}
          // FilterPress={data => alert(data)}
          onPress={() => navigation.goBack()}
          title={'UnApproved TimeSheet'}
          // isShowSearch={true}
           isShowFilter={isShowFilter}
        />

        <SwipeListView
          showsVerticalScrollIndicator={false}
          data={filterData}
          bounces={false}
          renderItem={renderItem}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={80}
          initialNumToRender={20}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-180}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: verticalScale(150),
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {error ? (
                  <Image
                    source={require('../../assets/images/error.gif')}
                    style={{
                      width: verticalScale(150),
                      height: verticalScale(150),
                      resizeMode: 'contain',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/norecord.gif')}
                    style={{
                      width: verticalScale(150),
                      height: verticalScale(150),
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </View>
            );
          }}
          windowSize={35}
          getItemLayout={(data, index) => {
            return {
              length: verticalScale(100),
              offset: verticalScale(100) * data.length,
              index,
            };
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default UnApprovedTimeSheetListScreen;

const styles = StyleSheet.create({
  HiddenBtnView: {
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  Acceptbtn: {
    paddingVertical: 5,
    backgroundColor: 'green',
    flex: 1,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 0,
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  RejectBtn: {
    paddingVertical: 5,
    flex: 1,
    backgroundColor: colors.delete_icon,
    borderRadius: 5,
    borderWidth: 0,
    justifyContent: 'center',
    width: scale(100),
    alignItems: 'center',
  },
});
