import React, {useState, useEffect, useContext} from "react";
import firebase from "firebase";
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
  //  console.log(mapArray);

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
  
     // });

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

  return (
      <View style={styles.container}>
        {/*<Text>Chats with seller: {sellerName} and buyer: {buyerName} </Text>*/}
      <FlatList 
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => ( 
          <TouchableOpacity
            onPress={() => {
          navigation.navigate('Chat',{
           // contact: route.params.seller,
            thread: item,
            title: "Chat"})}}
            //{() => navigation.navigate('Room', { thread: item })}
          >
            <List.Item
              title = {getName(item)} //display name
              description={item.latestMessage.text}
              titleNumberOfLines={1} 
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
           //   description={item.latestMessage.text}
            />
          </TouchableOpacity>
        )}
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

