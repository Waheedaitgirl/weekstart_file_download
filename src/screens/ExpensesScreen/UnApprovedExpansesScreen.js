import React,{useEffect, useState} from 'react';
import {SafeAreaView,Image,Pressable,Text,StyleSheet, View,ActivityIndicator} from 'react-native';
import { commonStyles, textStyles } from '../../styles';
import CustomHeader from '../../components/SearchHeader';
import ExpansesItem from './ExpansesCard';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '../../constants/theme';
import { MainRoutes } from '../../constants/routes';
import { useSelector } from 'react-redux';
import Spacer from '../../components/Spacer';
import {AcceptOrRejectTimeSheetOrExpenses,getUnApprovedTimeSheetExpensesListByApprooverID } from '../../api';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import moment from 'moment';
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
const MODULE_ID = '54'
    const UnApprovedExpansesScreen = ({navigation}) => {
        const {user} = useSelector(state => state.LoginReducer)
        
        
        const {status} = useSelector(state => state.StatusReducer)
        const [local_status] = useState(status.filter(obj => obj.module_id === MODULE_ID && obj.module_status_name === 'Submitted').map(o => o.module_status_id)[0])
       
        const [data, setData] = useState([])
        const [loading, setLoading ] = useState(true)
        const [error, setError] = useState(false)
        const [error_message , setErrorMessage] = useState("")
        useEffect(() => {
            getExpensesList()
        },[])

        getExpensesList = () => {
          
            setLoading(true)
           
            getUnApprovedTimeSheetExpensesListByApprooverID(user.id,"2", user.account_id,local_status)
            .then((response) => {
              console.log(response.data);
                if(response.status == 200){
                    setData(response.data.result);
                    setLoading(false)
                }else{
                    console.log("Some Error",response.status);
                    setError(true)
                    setLoading(false)
                    setErrorMessage('Some Error Ocured with status code'+ response.status)
                }
            }).catch((error) => {
                console.log(error ,"error");
              
                setLoading(false)
                setError(true)
                setLoading(false)
                setErrorMessage('Some Error Ocured with status code 200')
            })
        }

        const renderItem = ({ item }) => (
            <ExpansesItem 
                item={item}
                billtype={item.expense_report_title} 
                company={item.type} 
                status={item.module_status_name}
                date={moment(item.created_date).format('DD-MMM-YYYY')}
                job={item.job_title}
                status_colour_code={item.status_colour_code}
                price={`$ ${parseFloat(item.total_amount).toFixed(2)}`}
                List={() => {navigation.navigate(MainRoutes.ExpenseDetailsScreen,{item:item})}}
            />
        );

        const renderHiddenItem = (data, rowMap) => {
            return(
                <View style ={styles.HiddenBtnView} >
                    <Pressable  
                        style={styles.Acceptbtn} 
                        onPress={() => AccpetExpense(data.item.expense_id)} > 
                        <Ionicons name="checkmark" color={"#fff"} size={scale(22)} />
                            <Text style={{...textStyles.Label, color:"#fff"}}>
                                Approve
                            </Text>
                        </Pressable>
                    <Pressable
                        style={styles.RejectBtn} 
                        onPress={() => RejectExpense(data.item.expense_id)} >
                        <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
                        <Text style={{...textStyles.Label, color:"#fff"}}>
                            Reject
                        </Text>
                    </Pressable>
                </View>
            )
        }


        const AccpetExpense = (id) => {
            let module_status_id = status.filter(obj => obj.module_id === MODULE_ID && obj.module_status_name === 'Approved').map(o => o.module_status_id)[0]
             AcceptOrRejectTimeSheetOrExpenses(user.account_id,user.id,"2", id, module_status_id)
             .then((response) => {
                 if(response.status){
                    getExpensesList();
                 }else{
                     alert("Error While Accepting")
                 }
             }).catch((err) => {
                 alert(err.message)
             })
           
        }

        const RejectExpense = (id) => {
            let module_status_id = status.filter(obj => obj.module_id === MODULE_ID && obj.module_status_name === 'Rejected').map(o => o.module_status_id)[0]
            AcceptOrRejectTimeSheetOrExpenses(user.account_id,user.id,"2", id, module_status_id)
            .then((response) => {
                if(response.status){
                    getExpensesList();
                }else{
                    alert("Error While Rejecting")
                }
            }).catch((err) => {
                alert(err.message)
            })
        }
    
        const onRowDidOpen = rowKey => {
            console.log("This row opened", rowKey);
        };

        if(loading){
        return(  
            <SafeAreaProvider>
            <CustomStatusBar />
            <SafeAreaView style={commonStyles.container} >
                <CustomHeader 
                    show_backButton={true}
                    isdrawer={false}
                    SearchPress={() => alert("Search Press")}
                    NotificationPress={() => alert("NotificationPress")}
                    FilterPress={(data) => alert(data)}
                    onPress={() => navigation.goBack()}
                    title={"Un-Approved Expenses"}
                />
                <Spacer height={verticalScale(100)} />
                <ActivityIndicator size={"large"} color={colors.dark_primary_color} />
            </SafeAreaView>
            </SafeAreaProvider>
        )
        }
        return (
            <SafeAreaProvider>
                <CustomStatusBar />
                <SafeAreaView style={commonStyles.container} >
                    <CustomHeader 
                        show_backButton={true}
                        isdrawer={false}
                        SearchPress={() => alert("Search Press")}
                        NotificationPress={() => alert("NotificationPress")}
                        FilterPress={(data) => alert(data)}
                        onPress={() => navigation.goBack()}
                        title={"Un-Approved Expenses"}
                        />
                 
                    <SwipeListView 
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={renderItem}
                        maxToRenderPerBatch={20}
                        updateCellsBatchingPeriod={80}
                        initialNumToRender={20}
                        windowSize={35}
                        bounces={false}
                        renderHiddenItem={renderHiddenItem} 
                        rightOpenValue={-130} 
                        previewRowKey={"0"} 
                        previewOpenValue={-40} 
                        previewOpenDelay={3000} 
                        onRowDidOpen={onRowDidOpen}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() => {

                            return(
                                <View 
                                    style={{
                                        alignSelf:"center",
                                        marginTop:verticalScale(150), 
                                        flex:1, 
                                        justifyContent:"center", 
                                        alignItems:"center"
                                    }} >
                                    {
                                        error
                                    ?
                                    <Image 
                                        source={require("../../assets/images/error.gif")}
                                        style={{
                                            width:verticalScale(150), 
                                            height:verticalScale(150),
                                            resizeMode:"contain"
                                        }} 
                                    />
                                    :
                                    <Image 
                                        source={require("../../assets/images/norecord.gif")}
                                        style={{
                                            width:verticalScale(150), 
                                            height:verticalScale(150),
                                            resizeMode:"contain"
                                        }} 
                                    />
                        }
                                </View>
                            )
                        }}
                    />
               
                </SafeAreaView>
            </SafeAreaProvider>
        );
    };


export default UnApprovedExpansesScreen;

const styles = StyleSheet.create({
    HiddenBtnView:{
        backgroundColor:"#fff", 
        alignItems:"flex-end", 
        height:"100%", 
        justifyContent:"center", 
        paddingHorizontal:scale(20), 
        paddingVertical:scale(20)
    },
    Acceptbtn:{
        paddingVertical:5,
        backgroundColor:"green",
        flex:1, 
        borderRadius:5,
        marginBottom:10, 
        borderWidth:0, 
        width:scale(100), 
        justifyContent:"center", 
        alignItems:"center"
    },
    RejectBtn:{
        paddingVertical:5,
        flex:1, 
        backgroundColor:colors.delete_icon,borderRadius:5, 
        borderWidth:0, 
        justifyContent:"center",
        width:scale(100), 
        alignItems:"center"
    }
})
