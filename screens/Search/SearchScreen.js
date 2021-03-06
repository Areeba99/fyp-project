import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View, Platform} from 'react-native'
import firebase from "firebase";

import UserContext from "../../connection/userContext";
import {Firebase} from "../../connection/comms";
import ServicesList from "../../components/ServicesList";
import {SearchBar} from "react-native-elements";

export default function Search({navigation, route}) {

    const [searchTxt, setSearch] = useState("")
    const [Loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const {loggedIn} = useContext(UserContext)
    const [details, setDetails] = useState(null)


    const loadDataInView = () => {
        firebase.firestore()
            .collection("services")
            // .where("seller", "!=", loggedIn.uid)
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    dataArray.push(data)
                });
                setDetails(dataArray)
                return dataArray
            });
    }

    useEffect(() => {
        if (Loading === true) {
            loadDataInView()
        }

    })

    const onRefresh = () => {
        setRefreshing(false)
        setLoading(false)

    }

    return (
        <View style={styles.container}>
            <SearchBar
                platform={Platform.OS}
                placeholder={"Search here..."}
                onChangeText={t => setSearch(t)}
                value={searchTxt}
                onBlur={() => {
                    let results = [];
                    if (searchTxt.length > 2){
                        details.forEach(function (r) {
                            if (r.title.toLowerCase().search(searchTxt.toLowerCase()) !== -1 || r.details.toLowerCase().search(searchTxt.toLowerCase()) !== -1) {
                                results.push(r)
                            }
                        })
                    }
                    setData(results)
                }}
                onCancel={()=>setData(null)}
                onClear={()=>setData(null)}
            />
            <ScrollView style={styles.container}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                {data && data.length === 0 ? <Text style={{textAlign: "center", color: "grey", marginTop: 50}}>Your search didn't return anything</Text> :
                    <ServicesList services={data} navigation={navigation}/>}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
    },
    smallText: {
        fontSize: 15,
        fontStyle: "italic",
        fontWeight: "200",
        color: "grey"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold"
    }
});
