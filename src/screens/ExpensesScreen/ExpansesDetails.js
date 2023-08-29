import React, {useEffect, useState,useCallback} from 'react';
import {
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {SwipeListView} from 'react-native-swipe-list-view';
import {AcceptOrRejectTimeSheetOrExpenses} from '../../api';
import {commonStyles, textStyles} from '../../styles';
import CustomHeader from '../../components/CustomHeader';
import ExpansesItem from './ExpansesCard';
// import {scale} from 'react-native-size-matters';
import {colors} from '../../constants/theme';
import {AppScreenWidth, height} from '../../constants/sacling';
import Spacer from '../../components/Spacer';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {getExpensesDetails} from '../../api';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import RNFetchBlob from 'rn-fetch-blob';


const Item = ({
  date,
  expense_type,
  bill_type,
  category,
  amount,
  filename,
  approver_comments,
  expense_comments,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.CardView}>
      <View style={styles.row}>
        <View>
          <Text style={styles.buleText}> Expense Date:</Text>
          <Text style={styles.title}>{date}</Text>
        </View>
        <View>
          <Text style={styles.buleText}>Expense Type:</Text>
          <Text style={styles.title}>{expense_type}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.buleText}>Bill Type:</Text>
          <Text style={styles.title}>{bill_type}</Text>
        </View>
        <View>
          <Text style={styles.buleText}>Category:</Text>
          <Text style={styles.title}>{category}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.buleText}>Amount:</Text>
          <Text includeFontPadding={false} style={styles.ButtonText}>
            ${amount}
          </Text>
        </View>
        <View>
          <Text style={styles.buleText}>Receipt:</Text>
          <TouchableOpacity
            style={{width: 50, height: 50}}
            onPress={() => {
              navigation.navigate('ImageView', {
                image: filename,
              });
            }}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: filename,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* {approver_comments !== null && approver_comments !== '' && (
        <View style={styles.row}>
          <Text style={styles.buleText}>Approver Comment:</Text>
          <Text style={styles.title}>{approver_comments}</Text>
        </View>
      )}
      {expense_comments !== null && expense_comments !== '' && (
        <View style={styles.row}>
          <View>
            <Text style={styles.buleText}>Comments:</Text>
            <Text style={styles.title}>{expense_comments}</Text>
          </View>
        </View>
      )} */}
     
    </View>
  );
};
{/* <View Style = {{height :50, width : 50, marginTop: 70}}> */}

<TouchableOpacity style ={{width: '90%',height: 40,borderRadius: 10,justifyContent:"center",alignItems:"center",backgroundColor: 'blue',alignSelf:'center'}}>

</TouchableOpacity>
// </View>
const ExpenseDetailsScreen = ({navigation, route}) => {
  let item = route.params.item;
  const [logs, setLogs] = useState([]);
  const {user} = useSelector(state => state.LoginReducer);
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    getExpensesDetails(user.account_id, item.expense_id)
      .then(response => {
        if (response.status === 200) {
          console.log(response.data.logs);
          setLoading(false);
          setLogs(response.data.logs);
        } else {
          setLoading(false);
          setError(true);
        }
      })
      .catch(err => {
        setLoading(false);
        setError(true);
        console.log(err, 'Error');
      });
  }, []);
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
  const renderHiddenItem = (data, rowMap) => {
    return (
      // <View style={styles.HiddenBtnView}>
      <>
        <Pressable
          style={styles.Acceptbtn}
          onPress={() => onStatusHandler(data.item.expense_id, 1)}>
          <Ionicons name="checkmark" color={'#fff'} size={scale(22)} />
          <Text style={{...textStyles.Label, color: '#fff'}}>Approve</Text>
        </Pressable>
        <Pressable
          style={styles.RejectBtn}
          onPress={() => onStatusHandler(data.item.expense_id, 0)}>
          <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
          <Text style={{...textStyles.Label, color: '#fff'}}>Reject</Text>
        </Pressable>
        </>
     // </View>
    );
  };

  const AccpetExpense = id => {
    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Approved',
      )
      .map(o => o.module_status_id)[0];
    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '2',
      id,
      module_status_id,
    )
      .then(response => {
        if (response.status) {
          getExpensesList();
          alert('Expense request accepted successfully');
        } else {
          alert('Error While Accepting');
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const RejectExpense = id => {
    let module_status_id = status
      .filter(
        obj =>
          obj.module_id === MODULE_ID && obj.module_status_name === 'Rejected',
      )
      .map(o => o.module_status_id)[0];
    AcceptOrRejectTimeSheetOrExpenses(
      user.account_id,
      user.id,
      '2',
      id,
      module_status_id,
    )
      .then(response => {
        if (response.status) {
          getExpensesList();
          alert('Expense request rejected successfully');
        } else {
          alert('Error While Rejecting');
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };

  // const onRowDidOpen = rowKey => {
  //   console.log('This row opened', rowKey);
  // };
  if (loading) {
    return (
      <SafeAreaProvider>
        <CustomStatusBar />
       
        <SafeAreaView style={commonStyles.container}></SafeAreaView>
        <View style={commonStyles.container}>
          <CustomHeader
            show_backButton={true}
            isdrawer={false}
            onPress={() => navigation.goBack()}
            title={'Expenses Details'}
          />
          <Spacer height={AppScreenWidth} />
          <ActivityIndicator size={'large'} color={colors.dark_primary_color} />
        </View>
        <SwipeListView
          showsVerticalScrollIndicator={false}
          data={data}
          // renderItem={renderItem}
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
          // onRowDidOpen={onRowDidOpen}
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
            title={'Expenses Detail'}
          />
          <Spacer height={AppScreenWidth / 2} />
          <Image
            source={require('../../assets/images/error.gif')}
            style={{
              width: verticalScale(150),
              height: verticalScale(150),
              resizeMode: 'contain',
            }}
          />\        </View>
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
          title={'Expense Detail'}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <ExpansesItem
            item={item}
            billtype={item.expense_report_title}
            type={
              item.type === 'employee' ? item.candidate_name : item.username
            }
            status={item.module_status_name}
            date={moment(item.created_date).format('DD-MMM-YYYY')}
            job={item.job_title}
            status_colour_code={item.status_colour_code}
            price={`$ ${parseFloat(item.total_amount).toFixed(2)}`}
            onPress={() => {
              navigation.navigate(MainRoutes.ExpenseDetailsScreen, {
                item: item,
              });
            }}
          />
          {logs.map((item, index) => {
            console.log('item->>',item);

            return (
              <View key={`${index}`}>
                <Item
                  date={item.expense_date}
                  expense_type={item.expense_type_name}
                  bill_type={item.expense_bill_type_name}
                  category={item.category_name}
                  amount={item.expense_amount}
                  // approver_comments={item.approver_comments}
                  expense_comments={item.expense_comments}
                  filename={
                    'https://storage.googleapis.com/recruitbpm-document/' +
                    item.subdomain + 
                    '/' +
                    item.expense_receipt
                  }
                />
              </View>
            );
          })}
          <Spacer />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ExpenseDetailsScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  CardView: {
    elevation: 2,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: scale(10),
    width: AppScreenWidth,
    padding: scale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  buleText: {
    ...textStyles.smallheading,
    fontSize: scale(10),
    backgroundColor: 'rgba(0,0,0,.1)',
    paddingLeft: 5,
    paddingTop: 0,
    paddingBottom: 0,
    width: AppScreenWidth / 2.1,
    color: colors.blue,
  },
  ButtonText: {
    ...textStyles.title,
    paddingHorizontal: 0,
    includeFontPadding: false,
    borderRadius: scale(5),
  },
  title: {
    ...textStyles.title,
    paddingLeft: 5,
    marginBottom: scale(3),
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
  // HiddenBtnView: {
  //   backgroundColor: '#fff',
  //   alignItems: 'flex-end',
  //   height: '100%',
  //   justifyContent: 'center',
  //   paddingHorizontal: scale(20),
  //   paddingVertical: scale(20),
  // },
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
