import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MessagesList from "../screens/ChatScreens/MessageList";
import MessagesScreen from "../screens/ChatScreens/Messages";

const Stack = createStackNavigator()

export default function ChatStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={MessagesList}/>
            <Stack.Screen name="Chat" component={MessagesScreen} options={({ route }) => ({ title: route.params.title })}/>
        </Stack.Navigator>
    )

}
