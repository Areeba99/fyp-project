import React, {useState, useEffect, useContext} from "react";
import {Button, Avatar} from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import firebase from "firebase";
import { Alert } from "react-native";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import UserContext from "../../connection/userContext";
import { List, Divider } from 'react-native-paper';//install react-native-vector-icons first
import {Chats} from "../../connection/ChatHandler";


export default function MessagesList({navigation, route}) {
   // const {seller, buyer} = route.params;
    let {loggedIn, setLoggedin} = useContext(UserContext)
    
    const buyerName = loggedIn.name;
    const [threads, setThreads] = useState([]);
  /* const [sellerName, setSellerName] = useState([]); 
  // const [refreshPage, setRefreshPage] = useState("");
   useEffect(()=>{
        const sellerName = firebase.firestore()
            .collection('users')
            .where("uid","==",seller)
            .get()
            .then(snapshot => {
                setSellerName(snapshot.docs[0].data().name);
              });
   });*/ //buyer sideee = not needed anymore
        

   /*useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('MESSAGE_THREADS')
      .where("user1","==",loggedIn.uid)
      .where("user2","==",loggedIn.uid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            user1: '',
            user2: '',
            //name: '',
            latestMessage: '',
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);
      });

      return () => {
        unsubscribe();
      }
  }, []);*/ //original unsubscribe

  //the following section of code needs a few changes
  useEffect(() => {
    const dbRef = firebase.firestore().collection('MESSAGE_THREADS');
    let mapArray = [];
    dbRef.onSnapshot((querySnapshot) => {
        querySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.data().user1 == loggedIn.uid || 
            documentSnapshot.data().user2 == loggedIn.uid){
            //  console.log("presentt");
            mapArray.push(documentSnapshot);
            }
          });
    });

    const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
          const threads = 
          //querySnapshot.forEach(documentSnapshot => {
            mapArray.map((documentSnapshot) => {
           //   console.log(documentSnapshot.user1);
          return {
            _id: documentSnapshot.id,
            // give defaults
            user1: '',
            user2: '',
            latestMessage: '',
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);
      });
      return () => {
        unsubscribe();
      }
  }, []);

  function getName(item){  //to get the name for message threads
    if(loggedIn.name == item.nameuser2)
              return item.nameuser1;
    else 
              return item.nameuser2;
  }
  function getAvatar(item){  //to get the name for message threads
    if(loggedIn.name == item.nameuser2)
              return item.avatar1;
    else 
              return item.avatar2;
  }

  return (
      <View style={styles.container}>
        {/*<Text>Chats with seller: {sellerName} and buyer: {buyerName} </Text>*/}
      <FlatList 
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => ( 
          <TouchableOpacity
          style={{
              flex:1,
              flexDirection:"row",
              justifyContent:"center",
              alignItems: "center"
            }}
            onPress={() => {
          navigation.navigate('Chat',{
           // contact: route.params.seller,
            thread: item,
            loggedIn: loggedIn.uid,
            title: getName(item)
          })}}
            //{() => navigation.navigate('Room', { thread: item })}
          >
            <Avatar
                rounded size={50} source={{
                  uri:
                  getAvatar(item)}} />
            <List.Item
            style={{
              width: '60%'
            }}
              title = {getName(item)} //display name
              description={item.latestMessage.text}
              titleNumberOfLines={1} 
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
           //   description={item.latestMessage.text}
            />  
            <Button icon={<Ionicons name={"ios-trash"} size={28} color={"black"}/>}
                                            buttonStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0)' ,
                                                flex:1,
                                                borderRadius: 50,
                                                
                                            }}
                                            onPress={() => (
                                              Alert.alert("Delete Chat",'Are you sure you want to delete this chat?',
        [{
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
                                                firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).delete() 
                                                .then(r => {
                                                    if (r === true) {
                                                        navigation.navigate("Chat", {reload: true})
                                                    } else {
                                                        alert(r)
                                                    }
                                                })
                                              }}
                                            ])
                                            )}
              />
              <Button icon={<Ionicons name={"ios-menu"} size={28} color={"black"}/>}
                                            buttonStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0)' ,
                                                flex: 1,
                                                                                               borderRadius: 50,
                                            }}
                                            onPress={() => {
                                              if((item.isBlocked == false) ||
                                              ((loggedIn.uid == item.user1) && (item.blockedBy2 == true) && (item.blockedBy1 == false)) ||
                                              ((loggedIn.uid == item.user2) && (item.blockedBy1 == true) && (item.blockedBy2 == false))){
                                              Alert.alert("Block User",'Are you sure you want to block this user?',
        [{
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
           // console.log(itemx);
            if (loggedIn.uid == item.user1){
              firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                isBlocked: true,
                blockedBy1:true
              }).then(()=>{
                console.log("update done1");
              }); 
            }
            else {
              firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                isBlocked: true,
                blockedBy2:true
              }).then(()=>{
                console.log("update done2");
              }); 
            }
            
        }}
      ]) //end alert
        //firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).delete() 
                                                
     } //end if
     else if (loggedIn.uid == item.user1 && item.blockedBy1 == true){
       Alert.alert("Unblock User",'Are you sure you want to unblock this user?',
        [{
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
           // console.log(itemx);
            
              firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                blockedBy1:false
              }).then(()=>{
                console.log("update done1");
              }); 
            
           /* else {
              firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                isBlocked: false,
                blockedBy:0
              }).then(()=>{
                console.log("update done2");
              }); 
            }*/
            
        }}
      ])
     } //end else if
     else if (loggedIn.uid == item.user2 && item.blockedBy2 == true){
       Alert.alert("Unblock User",'Are you sure you want to unblock this user?',
        [{
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
           // console.log(itemx);
            
              firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                blockedBy2:false
              }).then(()=>{
                console.log("update done1");
              }); 
                       
        }}
      ])
     } //end else
     if(item.blockedBy1 == false && item.blockedBy2 == false){
       firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                isBlocked:false
              }).then(()=>{
                console.log("youre not blocked anymore");
              }); 
     }
     }}
              />
          </TouchableOpacity>
        )} //render item close
      />
    </View>
  );
    
}
  /*  return (
        <View>
        <Text>Chats with seller: {seller} and buyer: {buyer.uid} </Text>
        <Button title={"messages"} 
        onPress={() => {
          navigation.navigate('Chat',{
            contact: route.params.seller,
            title: "Chat with SELLER"})}}
        />
        </View>
    )
}*/
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});

/*Pending:
sending images,
deleting chat for only the user,
aligning buttons,
doesnt render if there is no avatar,
messagelist bug
*/

