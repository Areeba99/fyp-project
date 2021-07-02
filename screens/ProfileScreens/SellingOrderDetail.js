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


export default function SellingOrderDetail({navigation, route}) {
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [time, setTime] = useState("")


    const loadDataInView = () => {
        countDown(route.params.order.start, route.params.order.time)

    }

    useEffect(() => {
        if (route.params?.reload) {
            loadDataInView()
        }
        if (Loading === true) {
            loadDataInView()
        }

    }, [navigation, route])

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)

    }

    function countDown(start, endtime) {
        let timer;
        let compareDate = new Date(start);
        compareDate.setDate(compareDate.getDate() + parseInt(endtime));
        timer = setInterval(function () {
            timeBetweenDates(compareDate);
        }, 1000);
        function timeBetweenDates(toDate) {
            let dateEntered = toDate;
            let now = new Date();
            let difference = dateEntered.getTime() - now.getTime();
            if (difference <= 0) {
                setTime("Time Completed.")
                clearInterval(timer);
            } else {
                let seconds = Math.floor(difference / 1000);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);
                hours %= 24;
                minutes %= 60;
                seconds %= 60;
                setTime(days + ":" + hours + ":" + minutes + ":" + seconds)
            }
        }

    }
    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        <ListItem title={"Service: " + route.params.order.title} bottomDivider/>
                        <ListItem title={"Order Place Date: " + (new Date(route.params.order.start).toLocaleDateString())} bottomDivider/>

                        <ListItem title={"Order ID: " + route.params.order.id} bottomDivider/>
                        <ListItem title={"Price: Rs." + route.params.order.price} bottomDivider/>
                        {route.params.order.completed ? <ListItem title={"Order has been completed."} titleStyle={{fontWeight: "bold"}}/> : <ListItem title={"Timer: " + time} titleStyle={{fontWeight: "bold"}}/>}



                        <Divider style={{height: 20, backgroundColor: "#fff"}}/>
                        <Text style={{color: "grey", paddingLeft: 10}}>Customer's Measurements</Text>
                        {Object.keys(route.params.order.measurements).map((k, v) => (
                            <View style={{flexDirection: "row", paddingHorizontal: 20, paddingVertical: 5, justifyContent: "space-between"}}>
                                <Text style={{width: "50%", color: "#565656"}}>{k.toLocaleUpperCase() + ":  "}</Text>
                                <Text style={{color: "#565656"}}>{route.params.order.measurements[k]}</Text>
                            </View>
                        ))}

                        {route.params.order.accepted ?
                            <Text style={{color: "grey", padding: 20, textAlign: "center"}}>Orders once accepted, can not be
                                removed.</Text> : null}
                        <Button title={"Accept Order"} disabled={route.params.order.accepted} containerStyle={{paddingHorizontal: 50}} onPress={() => {
                            Orders.acceptOrder(route.params.order.id).then(r => {
                                navigation.navigate("SellingOrder", {reload: true})
                            })
                        }}/>
                    </ScrollView>
                </KeyboardAvoidingView>

            )}
        </UserContext.Consumer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingTop: 30,
        paddingBottom: 20
    },

});