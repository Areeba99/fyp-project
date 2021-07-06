import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfileScreen from "../screens/ProfileScreen";
import LocationScreen from "../screens/LocationScreen";
import Measurements from "../screens/ProfileScreens/Measurements";
import SellerServices from "../screens/ProfileScreens/SellerServices";
import AddNewService from "../screens/ProfileScreens/AddNewService";
import ShowServiceDetails from "../screens/ProfileScreens/ShowServiceDetails";
import BuyingOrderList from "../screens/ProfileScreens/BuyingOrdersList";
import BuyingOrderDetail from "../screens/ProfileScreens/BuyingOrderDetail";
import SellingOrderDetail from "../screens/ProfileScreens/SellingOrderDetail";
import SellingOrdersList from "../screens/ProfileScreens/SellingOrdersList";
import MeasurementsList from "../screens/ProfileScreens/MeasurementsList";
import Earnings from "../screens/ProfileScreens/Earnings";
import HelpCenter from '../screens/ProfileScreens/HelpCenter';
import FAQ from '../screens/ProfileScreens/FAQ';
//import MessageList from '../screens/ChatScreens/MessageList';
//import Messages from '../screens/ChatScreens/Messages';

const Stack = createStackNavigator()

export default function ProfileStack() {
    return (
        <Stack.Navigator headerMode={"screen"}>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Location" component={LocationScreen}/>
            <Stack.Screen name="Measurements" component={Measurements}/>
            <Stack.Screen name="MeasurementsList" component={MeasurementsList} options={{title: "Measurements List"}}/>
            <Stack.Screen name="Services" component={SellerServices}/>
            <Stack.Screen name="NewService" component={AddNewService} />
            <Stack.Screen name="Details" component={ShowServiceDetails}/>
            <Stack.Screen name="Earnings" component={Earnings}/>
            <Stack.Screen name="BuyingOrders" component={BuyingOrderList} options={{ title: 'Buying Orders' }}/>
            <Stack.Screen name="BuyingOrdersDetails" component={BuyingOrderDetail} options={{ title: 'Order Details' }}/>
            <Stack.Screen name="SellingOrder" component={SellingOrdersList} options={{ title: 'Selling Orders' }}/>
            <Stack.Screen name="SellingOrderDetails" component={SellingOrderDetail} options={{ title: 'Order Details' }}/>
            <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ title: 'Help Center' }}/>
            <Stack.Screen name="FAQ" component={FAQ} options={{ title: 'Frequently Asked Questions' }}/>
          {/*}  <Stack.Screen name="MessageList" component={MessageList} options={{ title: 'Chat Room' }}/>
            <Stack.Screen name="Messages" component={Messages} options={{ title: 'Chat' }}/>
    */}
        </Stack.Navigator>
    )

}
