import React, {useContext, useEffect, useState} from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import UserContext from "../../connection/userContext";
import {Chats} from "../../connection/ChatHandler";
import firebase from "firebase";

export default function MessagesScreen({navigation, route}) {
    const {thread} = route.params;
    let {loggedIn, setLoggedin} = useContext(UserContext)
    const user = loggedIn;

    const [messages, setMessages] = useState([
      // example of system message  
      {
            _id: 0,
            text: 'Say Hello',
            createdAt: new Date().getTime(),
            system: true,
        }
    
    ])

    useEffect(() => {
  const unsubscribeListener = firebase.firestore()
    .collection('MESSAGE_THREADS')
    .doc(thread._id) 
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        }

        if (!firebaseData.system) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          }
        }

        return data
      })

      setMessages(messages)
    })

  return () => unsubscribeListener()
}, []) //end useEffect hook

  /*  useEffect(()=>{
        Chats.getThread(loggedIn.uid, contact)
    })*/

    function handleSend(newMessage = []) {
      //  const text = messages[0].text
        setMessages(GiftedChat.append(messages, newMessage))
        
    }
    async function handleSend(messages){
        const text = messages[0].text
        firebase.firestore()
  .collection('MESSAGE_THREADS')
  .doc(thread._id)
  .collection('MESSAGES')
  .add({
    text,
    createdAt: new Date().getTime(),
    user: {
      _id: user.uid,
      displayName: user.name
    }
  })
  await firebase.firestore()
  .collection('MESSAGE_THREADS')
  .doc(thread._id)
  .set(
    {
      latestMessage: {
        text,
        createdAt: new Date().getTime()
      }
    },
    { merge: true }
  )
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
                //newMessage => handleSend(newMessage)}
            user={{
                _id: user.uid,
                name: user.name
            }}
        />
    )
}
