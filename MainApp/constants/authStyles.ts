import { StyleSheet, Platform } from 'react-native';
import { AppColors } from './colors';
import { AppFonts, AppLayout } from './theme';

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.white,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: Platform.select(AppLayout.headerPaddingTop),
        left: 24,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AppColors.backgroundMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
        marginTop: 20,
    },
    title: {
        fontFamily: AppFonts.bold,
        fontSize: 32,
        color: AppColors.navy,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: AppFonts.regular,
        fontSize: 16,
        color: AppColors.textMuted,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontFamily: AppFonts.semiBold,
        fontSize: 14,
        color: AppColors.navy,
        marginBottom: 8,
    },
    input: {
        fontFamily: AppFonts.regular,
        borderRadius: AppLayout.radius.md,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: AppColors.inputBorder,
        color: AppColors.textDark,
        backgroundColor: AppColors.white,
    },
    button: {
        backgroundColor: AppColors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        fontFamily: AppFonts.bold,
        color: AppColors.white,
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
    },
    footerText: {
        fontFamily: AppFonts.regular,
        color: AppColors.textMuted,
        fontSize: 14,
    },
    linkText: {
        fontFamily: AppFonts.bold,
        color: AppColors.primary,
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: AppColors.divider,
    },
    dividerText: {
        fontFamily: AppFonts.medium,
        marginHorizontal: 12,
        color: AppColors.textMuted,
        fontSize: 14,
    },
    googleButton: {
        backgroundColor: AppColors.white,
        borderWidth: 1,
        borderColor: AppColors.divider,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    googleButtonText: {
        fontFamily: AppFonts.bold,
        color: AppColors.textDark,
        fontSize: 16,
        marginLeft: 12,
    },
});
