import React,{useState} from 'react';
import { SafeAreaView,View,StyleSheet,Text} from 'react-native';
import CustomTextInput from '../../components/TextInput';
import CustomHeader from '../../components/CustomHeader';
import { commonStyles,textStyles } from '../../styles';
import CustomButton from '../../components/Button';
import { AuthRoutes } from '../../constants/routes';
import { scale } from 'react-native-size-matters';
import Spacer from '../../components/Spacer';
    const ForgotPasswordScreen = ({navigation}) => {
        const [oldpassword, setOldPassword] = useState("")
        const [oldpasswordErrorMessage, setOldPasswordErrorMessaage] = useState("")

        const [currentpassword, setCurrentPassword] = useState('');
        const [currentpasswordErrorMessage, setCurrentPasswordErrorMessage] = useState('');
        const [confrim_currentpassword, confrim_setCurrentPassword] = useState('');
        const [confrim_currentpasswordErrorMessage, confrim_setCurrentPasswordErrorMessage] = useState('');
        return (
            <View style={commonStyles.container} >
                <CustomHeader 
                    show_backButton={true}
                    onPress={() => navigation.navigate(AuthRoutes.SignInScreen)}
                    isdrawer={false}
                    title={"Password Reset"}
                />
                <Spacer />
                <CustomTextInput
                    placeholder={'Old Password'}
                    value={oldpassword}
                    secureTextEntry={true}
                    onChangeText={text => setOldPassword(text)}
                    errorMessage={oldpasswordErrorMessage}
                />
               
                <CustomTextInput
                    placeholder={'Current Password'}
                    value={currentpassword}
                    secureTextEntry={true}
                    onChangeText={text => setCurrentPassword(text)}
                    errorMessage={currentpasswordErrorMessage}
                />
               
                <CustomTextInput
                    placeholder={'Confrim Current Password'}
                    value={confrim_currentpassword}
                    secureTextEntry={true}
                    onChangeText={text => confrim_setCurrentPassword(text)}
                    errorMessage={confrim_currentpasswordErrorMessage}
                />
                <CustomButton 
                    onPress={() => navigation.navigate(AuthRoutes.SignInScreen)}
                    loading={false}
                    text={"Next"}
                    loadingText={"Processing"}
                />
            </View>
        );
    };


export default ForgotPasswordScreen;
