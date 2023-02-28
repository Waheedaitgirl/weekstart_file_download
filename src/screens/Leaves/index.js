import React,{useEffect, useState} from 'react';
import {SafeAreaView,Image,Pressable,Text,StyleSheet, View,ActivityIndicator} from 'react-native';
import { commonStyles, textStyles } from '../../styles';
import CustomHeader from '../../components/SearchHeader';
import LeavesCard from './LeavesCard';
import { scale, verticalScale } from 'react-native-size-matters';
import { colors } from '../../constants/theme';
import { useSelector } from 'react-redux';
import Spacer from '../../components/Spacer';
        
import {getLeavesList, AcceptorRejectLeaves } from '../../api';
import CustomStatusBar from '../../components/StatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
    const AllLeavesScreen = ({navigation}) => {
        const {user, user_type, placement_approver_module_id,placement_approver_module_pk_id} = useSelector(state => state.LoginReducer)
        const [data, setData] = useState([])
        const [loading, setLoading ] = useState(true)
        const [error, setError] = useState(false)
        const [error_message , setErrorMessage] = useState("")
        const [accept_loading, setAcceptLoading] = useState(false)
        const [reject_loading, setRejectLoading] = useState(false)
        useEffect(() => {
         
            getLeavesListLocal()
        },[])

        getLeavesListLocal = () => {
            setLoading(true)
           
            getLeavesList(user.id,user.account_id,"1",user_type,placement_approver_module_id, placement_approver_module_pk_id)
            .then((response) => {
                
                if(response.status == 200){

                    setData(response.data.data);
                    setLoading(false)
                }else{
                   
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
            <LeavesCard 
                item={item} 
            />
        );

        
        const renderHiddenItem = (data, rowMap) => {
           
            return(
                <View style ={styles.HiddenBtnView} >
                    {
                        accept_loading 
                        ? 
                            <Pressable
                                disabled={true}  
                                style={styles.Acceptbtn} 
                                onPress={() => AccpetExpense(data.item.leave_request_id)} > 
                                     <ActivityIndicator size={"large"} color={colors.white} />
                            </Pressable>
                        :
                            <Pressable  
                                style={styles.Acceptbtn} 
                                onPress={() => AccpetExpense(data.item.leave_request_id)} > 
                                    <Ionicons name="checkmark" color={"#fff"} size={scale(22)} />
                                    <Text style={{...textStyles.Label, color:"#fff"}}>
                                        Approve
                                    </Text>
                            </Pressable>
                    }
                    {
                        reject_loading 
                        
                        ? 
                        <Pressable
                            disabled={true}  
                            style={styles.RejectBtn} 
                            > 
                             <ActivityIndicator size={"large"} color={colors.white} />
                        </Pressable>
                        :
                            <Pressable
                                style={styles.RejectBtn} 
                                onPress={() => RejectExpense(data.item.leave_request_id)} >
                                <MaterialIcons name="cancel" color={'#fff'} size={scale(22)} />
                                <Text style={{...textStyles.Label, color:"#fff"}}>
                                    Reject
                                </Text>
                            </Pressable>
                    }
                </View>
            )
        }


        const AccpetExpense = (id) => {
            setAcceptLoading(true)
            AcceptorRejectLeaves(user.id, user.account_id,"1", id)
            .then((response) => {
                setAcceptLoading(false)
                if(response.status === 200){
                    getLeavesListLocal()
                    alert("Leave request accepted successfully")
                }else{
                    alert("Some error in accepting leave request")
                }
            }).catch((err) => {
                setAcceptLoading(false)
                alert("Some error in accepting leave request")
            })
           
        }

        const RejectExpense = (id) => {
            setRejectLoading(true)
            AcceptorRejectLeaves(user.id, user.account_id,"2", id)
            .then((response) => {
                setRejectLoading(false)
                if(response.status === 200){
                    getLeavesListLocal()
                    alert("Leave request rejected successfully")
                }else{
                    alert("Some error in rejecting leave request")
                }
            }).catch((err) => {
                setRejectLoading(false)
                alert("Some error in rejecting leave request")
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
                        title={"Un-approved Leaves"}
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
                            title={"Un-approved Leaves"}
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


export default AllLeavesScreen;

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