import { LucideIcon } from "lucide-react-native";

export interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export interface AIConsentModalProps {
    visible: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export interface ActionOption {
    label: string;
    icon: LucideIcon;
    onPress: () => void;
    destructive?: boolean;
}

export interface ActionOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    options: ActionOption[];
}

export interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    loading?: boolean;
    type: 'review' | 'user';
}

export interface BlockConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    loading?: boolean;
}

export interface UnblockConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    loading?: boolean;
}

export interface DeleteFriendModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    friendName: string;
    loading?: boolean;
}

export interface ConfirmDeleteNotificationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}
