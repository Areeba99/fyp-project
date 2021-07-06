import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessagesList from "../screens/ChatScreens/MessageList";
import MessagesScreen from "../screens/ChatScreens/Messages";
import { Alert } from "react-native";
import { Button } from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
//import {Dropdown } from 'react-native-dropdown';

const Stack = createStackNavigator()

export default function ChatStack() {

    /*function blockAlert() {
        Alert.alert("Block User",'Are you sure you want to block this user?',
        [{
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: (itemx) => {
            console.log(itemx);
            if (loggedIn == user1){
                itemx.isBlocked = true;
                itemx.blockedBy = 1;
                console.log("block donee");
            }
            else {
                itemx.isBlocked = true;
                itemx.blockedBy = 2;
                console.log("block undonee");
            }
            
        }}
      ]);
    }*/
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={MessagesList}/>
            <Stack.Screen name="Chat" component={MessagesScreen} options={({ route }) => ({ title: route.params.title,
         //   user1: route.params.thread.user1,
         //   user2: route.params.thread.user2,
         //   loggedIn: route.params.loggedIn,
         /*   headerRight: () => (
            <Button icon={<Ionicons name={"ios-menu"} size={28} color={"black"}/>}
            buttonStyle={{
                                                backgroundColor: 'rgba(0, 0, 0, 0)' ,
                                              //type: clear,
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50,
                                            }}  
            onPress={blockAlert(route.params.thread)}
            />)*/
          })}/>
        </Stack.Navigator>
    )

}
