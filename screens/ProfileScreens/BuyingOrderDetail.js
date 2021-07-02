import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {deleteUserData, getData, saveData} from "../../connection/AsyncStorage";
import {Firebase} from "../../connection/comms";
import {Orders} from "../../connection/OrderHandler";
import {Ionicons} from "@expo/vector-icons";
// import firebase from "firebase";


export default function BuyingOrderDetail({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [orders, setOrders] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);


    const loadDataInView = () => {
        console.log(route.params)
    }

    useEffect(() => {
        if (route.params?.reload){
            loadDataInView()
        }

        console.log("Effect Seller Services")
        if (Loading === true) {
            loadDataInView()
        }

    },[navigation, route])

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        <ListItem title={"Service: "+route.params.order.title} bottomDivider/>
                        <ListItem title={"Order Place Date: "+(new Date(route.params.order.start).toLocaleDateString())} bottomDivider/>
                        <ListItem title={"Expected Time: "+route.params.order.time} bottomDivider/>
                        <ListItem title={"Order ID: "+route.params.order.id} bottomDivider/>
                        <ListItem title={"Price: Rs."+route.params.order.price}/>
                        <Divider style={{height: 20, backgroundColor: "#fff"}}/>

                        {route.params.order.accepted?<Text style={{color: "grey", paddingLeft: 10}}>Orders once accepted, can not be deleted.</Text>:null}
                        <Button title={"Delete Order"} disabled={route.params.order.accepted} onPress={()=>{
                            Orders.deleteOrder(route.params.order.id).then(r =>{navigation.navigate("BuyingOrders", {reload: true})})
                        }}/>
                    </ScrollView>
                </KeyboardAvoidingView>

            )}
        </UserContext.Consumer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1 ,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingTop: 30,
        paddingBottom: 20
    },

});