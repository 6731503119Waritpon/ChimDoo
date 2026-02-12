import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import React from "react"
import { useRouter } from "expo-router"

const Page = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Page</Text>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/auth/login')}
                >
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.outlineButton]} 
                    onPress={() => router.push('/auth/signup')}
                >
                    <Text style={[styles.buttonText, styles.outlineButtonText]}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 24,
        gap: 16,
    },
    button: {
        backgroundColor: '#ff6b35',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff6b35',
    },
    outlineButtonText: {
        color: '#ff6b35',
    }
})