import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Image,
  Pressable,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {commonStyles, textStyles} from '../../styles';
import CustomHeader from '../../components/SearchHeader';
import ExpansesItem from './ExpansesCard';
import {scale, verticalScale} from 'react-native-size-matters';
import {colors} from '../../constants/theme';
import {MainRoutes} from '../../constants/routes';
import {useSelector} from 'react-redux';
import Spacer from '../../components/Spacer';

import {
  AcceptOrRejectTimeSheetOrExpenses,
  getTimeSheetExpensesListByApprooverID,
} from '../../api';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import moment from 'moment';
import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const MODULE_ID = '54';

// console.log({MODULE_ID});
const AllExpenseScreen = ({navigation}) => {
  const {user} = useSelector(state => state.LoginReducer);
  const [endDate, setEndDate] = useState('');
  const {status} = useSelector(state => state.StatusReducer);
  const [accept_loading, setAcceptLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [reject_loading, setRejectLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // const[accepted,rejected] = useState(true);
  const [error_message, setErrorMessage] = useState('');
  useEffect(() => {
    getExpensesList();

    return () => {
      setFilterData(data);
    };
  }, []);

  const FilterByTitle = title => {
    //  let item = data[0].job_title?.toLowerCase();
    // console.log('title',title,item);
    let lowerTitle = title.toLowerCase();

    // console.log('item?.created_date',item?.created_date,lowerTitle)
    // let draft_data = data?.filter(
    //   item =>
    //     item?.job_title?.toLowerCase()?.includes(lowerTitle)
    //     ||item?.candidate_id?.toLowerCase()?.includes(lowerTitle)
    //      || item?.module_status_id?.toLowerCase()?.includes(lowerTitle) ||
    //     item?.candidate_name?.toLowerCase()?.includes(lowerTitle)
    //     || item?.created_date?.toLowerCase()?.includes(lowerTitle)
    //     || item?.expense_report_title?.toLowerCase()?.includes(lowerTitle)
    //     || item?.module_status_name?.toLowerCase()?.includes(lowerTitle)
    //     || item?.total_amount?.toLowerCase()?.includes(lowerTitle)
    //     || item?.type?.toLowerCase()?.includes(lowerTitle),
    // );

    let draft_data = data?.filter(item => {
      console.log('item?.created_date',
      moment(item?.created_date).format("DD-MMM-YYYY").toLowerCase())
      return (
        item?.job_title?.toLowerCase()?.includes(lowerTitle) ||
        item?.candidate_id?.toLowerCase()?.includes(lowerTitle) ||
        item?.module_status_id?.toLowerCase()?.includes(lowerTitle) ||
        item?.candidate_name?.toLowerCase()?.includes(lowerTitle) ||
        moment(item?.created_date).format("DD-MMM-YYYY").toLowerCase()?.includes(lowerTitle) ||
        item?.expense_report_title?.toLowerCase()?.includes(lowerTitle) ||
        item?.module_status_name?.toLowerCase()?.includes(lowerTitle) ||
        item?.total_amount?.toLowerCase()?.includes(lowerTitle) ||
        item?.type?.toLowerCase()?.includes(lowerTitle)
      );
    });

  //  console.log(draft_data);
    setFilterData(draft_data);
    return;
    // let se = title.toLowerCase()
    // const regex = new RegExp(`${se}`);
    // let draft_data = data.filter(function(item){
    //     return item?.job_title?.toLowerCase().match(regex) || item.expense_report_title.toLowerCase().match(regex) ||  item.module_status_name.toLowerCase().match(regex)
    //  })
    //  setFilterData(draft_data)
  };

  const onFilterList = type => {
    // alert(type)
    switch (type) {
      case 'All':
        setFilterData(data);
        break;
      case 'Approved':
        // setData(
        //   filterData.filter(obj => obj.module_status_name === 'Approved'),
        // );
        setFilterData(
          data.filter(obj => obj.module_status_name === 'Approved'),
        );
        break;
      case 'Rejected':
        let filterDataTwo = [...data];
        // setData(
        //   filterData.filter(obj => obj.module_status_name === 'Rejected'),
        // );
        setFilterData(
          data.filter(obj => obj.module_status_name === 'Rejected'),
        );

        break;
      case 'Submitted':
        // console.log('filterData', data);
        let filterDataThree = [...data];
        // setData(
        //   filterData.filter(obj => obj.module_status_name === 'Submitted'),
        // );
        setFilterData(
          data.filter(obj => obj.module_status_name === 'Submitted'),
        );

        break;
      default:
        return;
    }
  };
  getExpensesList = () => {
    setLoading(true);
    // console.log(user?.id, '2', user?.account_id);
    getTimeSheetExpensesListByApprooverID(user?.id, '2', user?.account_id)
      .then(response => {
        if (response.status == 200) {
          // console.log('WAHEEDA', response.data.data);
          let organizeData = response?.data?.data?.sort((a, b) => {
            return new Date(b.created_date) - new Date(a.created_date);
          });
          setData(organizeData);
          setFilterData(organizeData);
          setLoading(false);
        } else {
          // console.log('Some Error', response.status);
          setError(true);
          setLoading(false);
          setErrorMessage(
            'Some Error Ocured with status code' + response.status,
          );
        }
      })
      .catch(error => {
        // console.log(error, 'error');

        setLoading(false);
        setError(true);
        setLoading(false);
        setErrorMessage('Some Error Ocured with status code 200');
      });
  };

  const renderItem = ({item}) => (
    <ExpansesItem
      item={item}
      billtype={item.expense_report_title}
      type={item.type === 'employee' ? item.candidate_name : item.username}
      status={item.module_status_name}
      date={moment(item.created_date).format('DD-MMM-YYYY')}
      job={item.job_title}
      status_colour_code={item.status_colour_code}
      price={`$ ${parseFloat(item.total_amount).toFixed(2)}`}
      List={() => {
        navigation.navigate(MainRoutes.ExpenseDetailsScreen, {item: item});
      }}
    />
  );

  const onStatusHandler = useCallback((expense_id, statusCode) => {
    Alert.alert(
      'Attention!',
      `Are you sure want to ${statusCode === 0 ? 'Reject' : 'Approve'}?`,
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            statusCode === 1
              ? AccpetExpense(expense_id)
              : RejectExpense(expense_id);
          },
          style: 'cancel',
        },
      ],
    );
  }, []);
  const renderHiddenItem = (data, rowMap, item) => {
    // console.log('[data]', data);

    return (
      <View style={styles.HiddenBtnView}>
        {data?.item.module_status_name === 'Submitted' ? (
          <>
            <Pressable
              style={styles.Acceptbtn}
              onPress={() => onStatusHandler(data.item.expense_id, 1)}>
              <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
              <Text style={{...textStyles.Label, color: '#fff'}}>Approve</Text>
            </Pressable>
            <View style={{height: 1}} />
            <Pressable
              style={styles.RejectBtn}
              onPress={() => onStatusHandler(data?.item?.expense_id, 0)}>
              <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
              <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
            </Pressable>
          </>
        ) : data?.item.module_status_name === 'Rejected' ? (
          <Pressable
            style={styles.Acceptbtn}
            onPress={() => onStatusHandler(data.item.expense_id, 1)}>
            <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
            <Text style={{...textStyles.Label, color: '#fff'}}>Approve</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.RejectBtn}
            onPress={() => onStatusHandler(data?.item?.expense_id, 0)}>
            <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
            <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const AccpetExpense = id => {
    // console.log('[expense_id]', id);
    setAcceptLoading(true);

    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Approved',
      )
      .map(o => o.module_status_id);
    // console.log('[data to be sent]', {
    //   account_id: user.account_id,
    //   uid: user.id,
    //   module_status_id: module_status_id,
    //   id: id,
    // });
    //  return;

    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '2',
      id,
      module_status_id,
    )
      .then(response => {
        setAcceptLoading(false);
        if (response.status === 200) {
         // console.log(response);
          getExpensesList();
          alert('Expense request accepted successfully');
        } else {
          alert('Error While Accepting');
        }
      })
      .catch(err => {
        setAcceptLoading(false);
        alert(err.message);
      });
  };

  const RejectExpense = id => {
    setRejectLoading(true);
    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Rejected',
      )
      .map(o => o.module_status_id);
    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '2',
      id,
      module_status_id,
    )
      .then(response => {
        setRejectLoading(false);
        if (response.status === 200) {
          //console.log(response);
          getExpensesList();
          alert('Expense request rejected successfully');
        } else {
          alert('Error While Rejecting');
        }
      })
      .catch(err => {
        setRejectLoading(false);
        alert(err.message);
      });
  };

  const onRowDidOpen = rowKey => {
    // console.log('This row opened', rowKey);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
        <SafeAreaView style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            SearchPress={text => FilterByTitle(text)}
            // SearchPress={() => alert("Search Press")}
            NotificationPress={() => alert('NotificationPress')}
            FilterPress={data => alert(data)}
            onPress={() => navigation.goBack()}
            title={'All Expenses'}
          />
          <Spacer height={verticalScale(100)} />
          <ActivityIndicator size={'large'} color={colors.dark_primary_color} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  // console.log({data, filterData});
  return (
    <SafeAreaProvider>
      <CustomStatusBar />
      <SafeAreaView style={commonStyles.container}>
        <CustomHeader
          show_backButton={true}
          isdrawer={false}
          SearchPress={text => FilterByTitle(text)}
          // SearchPress={() => alert("Search Press")}
          NotificationPress={() => alert('NotificationPress')}
          FilterPress={data => onFilterList(data)}
          onPress={() => navigation.goBack()}
          title={'All Expenses'}
          filterOptionOne="Approved"
          filterOptionTwo="Rejected"
          filterOptionThree="Submitted"
        />

        <SwipeListView
          showsVerticalScrollIndicator={false}
          data={filterData}
          renderItem={renderItem}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={80}
          initialNumToRender={20}
          windowSize={35}
          bounces={false}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-130}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
          keyExtractor={(item, index) => index.toString()}
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
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AllExpenseScreen;

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
