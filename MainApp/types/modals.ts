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
