import React, {useContext, useEffect, useState} from "react";
import { GiftedChat, Bubble, InputToolbar, Send, Composer } from 'react-native-gifted-chat';
import { View, Button } from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import UserContext from "../../connection/userContext";
import {Chats} from "../../connection/ChatHandler";
import firebase from "firebase";
//import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { CustomImageButton } from "../../components/CustomImageButton"

export default function MessagesScreen({navigation, route}) {
    const {thread} = route.params;
    let {loggedIn, setLoggedin} = useContext(UserContext)
    const user = loggedIn;
    var emergencyText = "You can no longer send messages in this conversation."
   // const [emergencyText, setEmergencyText] = useState
// pick image
   /*const pickImage = async (uid) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        console.log(result);

        if (!result.cancelled) {
            Firebase.userAvatar(result.uri, uid)
                .then(dpLink => {
                    console.log(dpLink)
                    Firebase.updateData("dp", dpLink, uid)
                        .then(s => {
                            if (s === true) {
                                setLoggedin(previousState => ({...previousState, dp: dpLink}))
                                saveData(loggedIn).then(() => alert("Profile Picture Updated."))
                            }
                        })
                })

        }
    };*/

    const [messages, setMessages] = useState([
      // example of system message  
      {
            _id: 0,
            text: 'Say Hello',
            createdAt: new Date().getTime(),
            system: true,
        }
    
    ])

   /* function getEmergencyText(){
      if ((loggedIn == thread.user1 && thread.blockedBy == 1) ||
      (loggedIn == thread.user2 && thread.blockedBy == 2)){
        return "You have Blocked this user.??";
      }
      else {
        return "You cannot send messages in this conversation.";
      }
    }*/

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
            name: firebaseData.user.name,
            avatar: firebaseData.user.avatar
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
  /*  function userBlocked(){
      renderInputToolbar=()=>{
                return <InputToolbar
                render={null}
                text={emergencyText} 
               // onInputTextChanged={setEmergencyText}
                />
            }
    }*/

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
      name: user.name,
      avatar: user.dp
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
                name: user.name,
                avatar: user.dp
            }} 
          /*  renderAvatar={(props)=>{
              console.log(user.dp)
             // const { avatarProps } = props.currentMessage;
           //   if (loggedIn.uid == thread.user1) {
                return(
                <UserAvatar {...props}
                size="40" src={user.dp} />
                );
           /*   }
              else if (loggedIn.uid == thread.user2) {
                return(
                <UserAvatar {...props}
                size="40" src={thread.avatar2} />
                );
              }
              return(null);
            }}*/
            //renderAvatarOnTop={true}
            renderUsernameOnMessage={true}
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
            
            renderInputToolbar={(props)=> {
              if (thread.isBlocked == true){
                return <InputToolbar
              //  render={null}
                disable={true}
                text={emergencyText} 
               // onInputTextChanged={setEmergencyText}
                />
              }
                else {
                  return <InputToolbar
                  {...props}
                  disable={false}
                  />
                }
               // <Button icon={<Ionicons name={"ios-menu"} size={28} color={"black"}/>}></Button></View>
            }}
         /*   renderComposer = {(props) => {
              return <View style={{flexDirection: 'row'}}>
                <Composer {...props} />
                
                <CustomImageButton
                                        buttonType="outline"
                                        onPress={console.log("image button pressed :*")}
                                        title="img"
                                        buttonColor="#ef3caf"
                                        disabled={false}
                                       // loading={isSubmitting}
                                    />
              </View>
              
            }}*/
            renderSend={(props)=>{
              if (thread.isBlocked == true){
              return <Send
              {...props}
              disabled={true}
              textStyle={{ color: "white" }}            
              />
              }
              else{
                return <Send
              {...props}
              disabled={false}
              textStyle={{ color: "pink" }}            
              />
              }
            }}
             /* {...props}
              sendProps = {{
                textStyle:{
                  color: 'rgba(0,0,0,0)'
                }
              }}
              render = {null}
              disabled = {false}
              alwaysShowSend = {false}
              disable = {true}
              color = "red"
              textStyle = {
                color= "red"
              }
              />
            }} */
            renderBubble={(props)=>{
              return <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "pink"
                },
                left:{
                  backgroundColor:"white"
                }
              }}
              textStyle={{
                right:{
                  color: "black"
                }
              }}
              />
            }}
        />
    )
}
