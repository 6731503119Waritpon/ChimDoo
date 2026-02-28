import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast, { ToastConfig } from './Toast';

interface ToastContextType {
    showToast: (config: ToastConfig) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<ToastConfig | null>(null);
    const [visible, setVisible] = useState(false);

    const showToast = useCallback((config: ToastConfig) => {
        setVisible(false);
        setTimeout(() => {
            setToast(config);
            setVisible(true);
        }, 50);
    }, []);

    const hideToast = useCallback(() => {
        setVisible(false);
        setToast(null);
    }, []);

    const success = useCallback(
        (title: string, message?: string) =>
            showToast({ type: 'success', title, message }),
        [showToast]
    );

    const error = useCallback(
        (title: string, message?: string) =>
            showToast({ type: 'error', title, message }),
        [showToast]
    );

    const warning = useCallback(
        (title: string, message?: string) =>
            showToast({ type: 'warning', title, message }),
        [showToast]
    );

    const info = useCallback(
        (title: string, message?: string) =>
            showToast({ type: 'info', title, message }),
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            <View style={styles.wrapper}>
                {children}
                {toast && (
                    <Toast
                        {...toast}
                        visible={visible}
                        onHide={hideToast}
                    />
                )}
            </View>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
});
