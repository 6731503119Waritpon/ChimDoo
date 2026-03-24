import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { TabBar } from "@/components/TabBar";
import AIFab from "@/components/AIFab"; 

const TabLayout = () => {
    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
                <Tabs.Screen name="index" options={{ title: "Home" }} />
                <Tabs.Screen name="recipes" options={{ title: "Recipes" }} />
                <Tabs.Screen name="community" options={{ title: "Community" }} />
                <Tabs.Screen name="profile" options={{ title: "Profile" }} />
            </Tabs>
            <AIFab />
        </View>
    );
};

export default TabLayout;