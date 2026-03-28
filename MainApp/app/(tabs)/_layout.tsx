import React, { useState } from "react";
import { Tabs, usePathname } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { TabBar } from "@/components/TabBar";
import AIFab from "@/components/AIFab";
import NotificationBell from "@/components/NotificationBell";
import NotificationModal from "@/components/NotificationModal";

const TabLayout = () => {
    const pathname = usePathname();
    const [showNotif, setShowNotif] = useState(false);

    const showBell = pathname !== "/profile";

    return (
        <View style={{ flex: 1 }}>
            <Tabs screenOptions={{ headerShown: false }} tabBar={props => <TabBar {...props} />}>
                <Tabs.Screen name="index" options={{ title: "Home" }} />
                <Tabs.Screen name="recipes" options={{ title: "Recipes" }} />
                <Tabs.Screen name="community" options={{ title: "Community" }} />
                <Tabs.Screen name="profile" options={{ title: "Profile" }} />
            </Tabs>

            {showBell && (
                <View style={styles.headerBell}>
                    <NotificationBell onPress={() => setShowNotif(true)} />
                </View>
            )}

            <AIFab />

            <NotificationModal visible={showNotif} onClose={() => setShowNotif(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    headerBell: {
        position: 'absolute',
        right: 20,
        top: Platform.OS === 'ios' ? 64 : 48,
        zIndex: 100,
    },
});

export default TabLayout;