import React, { FC, ReactNode } from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    StyleSheet,
    ViewStyle,
    View,
} from 'react-native';

interface KeyboardAwareViewProps {
    children: ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

const KeyboardAwareView: FC<KeyboardAwareViewProps> = ({
    children,
    style,
    contentContainerStyle,
}) => {
    if (Platform.OS === 'web') {
        return (
            <View style={[styles.container, style]}>
                <ScrollView 
                    contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.container, style]}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});

export default KeyboardAwareView;
